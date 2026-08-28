"""
Main FastAPI application entry point
"""

import asyncio
import sys
from contextlib import asynccontextmanager

# Windows: Playwright (and other subprocess-based features) require a Proactor loop.
# Uvicorn workers import this module directly, so this must run before the event loop is created.
if sys.platform == "win32":
    _proactor = getattr(asyncio, "WindowsProactorEventLoopPolicy", None)
    if _proactor is not None:
        try:
            asyncio.set_event_loop_policy(_proactor())
        except Exception:
            # Best-effort; Playwright launcher will re-check and log if needed.
            pass

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse
import uvicorn
import logging
import os
from .api.openai_compat import router as openai_router
from .api.wisedeck_api import router as wisedeck_api_router
from .api.database_api import router as database_router
from .api.global_master_template_api import router as template_api_router
from .api.config_api import router as config_router
from .api.image_api import router as image_router

from .web import router as web_router
from .web.community_routes import router as community_router
from .database.startup_initialization import run_startup_initialization
from .core.config import app_config
from .auth.app_api_key_middleware import AppApiKeyMiddleware

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Disable SQLAlchemy verbose logging completely
logging.getLogger('sqlalchemy').setLevel(logging.WARNING)
logging.getLogger('sqlalchemy.engine').setLevel(logging.WARNING)
logging.getLogger('sqlalchemy.engine.Engine').setLevel(logging.WARNING)
logging.getLogger('sqlalchemy.pool').setLevel(logging.WARNING)
logging.getLogger('sqlalchemy.dialects').setLevel(logging.WARNING)


async def startup_application():
    """Compatibility wrapper — also used by lifespan tests."""
    await run_startup_initialization()


async def shutdown_application():
    """Compatibility wrapper — also used by lifespan tests."""
    try:
        logger.info("Shutting down application...")
        try:
            from .utils.http_client import close_http_clients

            await close_http_clients()
        except Exception:
            pass
        try:
            from .services.cache_service import close_cache_service

            await close_cache_service()
        except Exception:
            pass
        logger.info("Application shutdown complete")
    except Exception as e:
        logger.error(f"Error during shutdown: {e}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database on startup, clean up on shutdown."""
    try:
        await startup_application()
    except Exception as e:
        logger.error(f"Failed to initialize application: {e}")
        raise

    logger.info("Application startup complete")
    try:
        yield
    except asyncio.CancelledError:
        logger.info("Lifespan cancelled — shutting down and suppressing CancelledError")
        # Swallow CancelledError but still run shutdown via finally.
        # The asynccontextmanager will translate this into __aexit__ returning True.
        pass
    finally:
        await shutdown_application()


# Create FastAPI app
app = FastAPI(
    title="WiseDeck API",
    description="WiseDeck — AI-powered PPT generation platform with OpenAI-compatible API",
    version="0.1.0",
    docs_url="/docs" if app_config.enable_api_docs else None,
    redoc_url="/redoc" if app_config.enable_api_docs else None,
    openapi_url="/openapi.json" if app_config.enable_api_docs else None,
    lifespan=lifespan,
)

# Add CORS middleware only when an explicit allow-list is configured.
# Same-origin requests are not subject to CORS, so the server-rendered UI,
# the embedded PPTist iframe and same-origin API calls work without it.
_cors_origins = app_config.get_cors_origins()
if _cors_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=_cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    logger.info("CORS middleware disabled (no WISEDECK_CORS_ALLOW_ORIGINS configured; same-origin only)")

app.add_middleware(AppApiKeyMiddleware)

# Authentication middleware/router are disabled in local anonymous mode.

# Include routers
app.include_router(config_router, prefix="", tags=["Configuration Management"])
app.include_router(image_router, prefix="", tags=["Image Service"])

# Web router must come before wisedeck_api_router so specific web routes take precedence
app.include_router(web_router, prefix="", tags=["Web Interface"])
app.include_router(community_router, tags=["Community Pages"])
app.include_router(openai_router, prefix="/v1", tags=["OpenAI Compatible"])
app.include_router(wisedeck_api_router, prefix="/api", tags=["WiseDeck API"])
app.include_router(template_api_router, tags=["Global Master Templates"])
app.include_router(database_router, tags=["Database Management"])


# Mount static files
static_dir = os.path.join(os.path.dirname(__file__), "web", "static")
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Redirect /assets/ font requests to fontsource CDN
# AI-generated slide HTML may reference fonts like /assets/inter-latin-400-normal-C38fXH4l.woff2
# (Vite/@fontsource bundled paths). This route parses the naming pattern and redirects to CDN.
import re
_FONTSOURCE_RE = re.compile(
    r'^(?P<family>[a-z0-9-]+?)-(?P<subset>[a-z]+)-(?P<weight>\d+)-(?P<style>[a-z]+)-[A-Za-z0-9_-]+\.woff2$'
)

@app.get("/assets/{filename:path}")
async def serve_font_asset(filename: str):
    """Redirect fontsource-style font requests to jsDelivr CDN"""
    from fastapi.responses import RedirectResponse
    m = _FONTSOURCE_RE.match(filename)
    if m:
        family = m.group('family')
        subset = m.group('subset')
        weight = m.group('weight')
        style = m.group('style')
        cdn_url = f"https://cdn.jsdelivr.net/fontsource/fonts/{family}@latest/{subset}-{weight}-{style}.woff2"
        return RedirectResponse(url=cdn_url, status_code=301)
    raise HTTPException(status_code=404, detail="Asset not found")

# Mount temp directory for image cache
temp_dir = os.path.join(os.getcwd(), "temp")
if os.path.exists(temp_dir):
    app.mount("/temp", StaticFiles(directory=temp_dir), name="temp")
    logger.info(f"Mounted temp directory: {temp_dir}")
else:
    logger.warning(f"Temp directory not found: {temp_dir}")

@app.get("/", response_class=HTMLResponse)
async def root():
    """Root endpoint - redirect to dashboard"""
    from fastapi.responses import RedirectResponse
    return RedirectResponse(url="/dashboard", status_code=302)

@app.get("/favicon.ico")
async def favicon():
    """Serve favicon"""
    favicon_path = os.path.join(os.path.dirname(__file__), "web", "static", "images", "favicon.svg")
    if os.path.exists(favicon_path):
        return FileResponse(favicon_path, media_type="image/svg+xml")
    else:
        raise HTTPException(status_code=404, detail="Favicon not found")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "WiseDeck API"}


def main() -> None:
    """Console script entrypoint (`wisedeck` / `landppt` via pyproject.scripts)."""
    uvicorn.run(
        "wisedeck.main:app",
        host=app_config.host,
        port=app_config.port,
        reload=app_config.reload,
        log_level="info",
    )


if __name__ == "__main__":
    main()
