"""Research service registry (lives in the services layer).

Owns the lazily-initialized research service / report generator singletons
and their configuration reload. The API layer imports these helpers for its
routes; `services.service_instances` reloads them on config changes — no
services→api back-edge required.
"""

from __future__ import annotations

import logging

logger = logging.getLogger(__name__)

# Research services (lazy initialization)
_research_service = None
_report_generator = None
_enhanced_research_service = None
_enhanced_report_generator = None


def get_research_service():
    """Get research service instance (lazy initialization)."""
    global _research_service
    if _research_service is None:
        try:
            from .deep_research_service import DEEPResearchService

            _research_service = DEEPResearchService()
            logger.info("Research service initialized successfully")
        except Exception as e:
            logger.warning(f"Failed to initialize research service: {e}")
    return _research_service


def reload_research_service():
    """Reload research service to pick up new configuration."""
    global _research_service
    logger.info("Reloading research service...")

    if _research_service is not None:
        try:
            _research_service.reload_config()
            logger.info("Research service configuration reloaded successfully")

            # Verify the service is still available after reload
            if not _research_service.is_available():
                logger.warning("Research service is not available after reload, will recreate on next access")
                _research_service = None

        except Exception as e:
            logger.warning(f"Failed to reload research service config: {e}")
            # If reload fails, recreate the service
            _research_service = None
    else:
        # If service doesn't exist, force recreation on next access
        logger.info("Research service will be recreated on next access with new configuration")


def get_report_generator():
    """Get report generator instance (lazy initialization)."""
    global _report_generator
    if _report_generator is None:
        try:
            from .research_report_generator import ResearchReportGenerator

            _report_generator = ResearchReportGenerator()
            logger.info("Report generator initialized successfully")
        except Exception as e:
            logger.warning(f"Failed to initialize report generator: {e}")
    return _report_generator
