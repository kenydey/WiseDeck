"""PPTist template packs for WiseDeck AIPPT emitter (aligned with TrainPPTAgent /tools/data/{template})."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException

from ...auth.middleware import get_current_user_optional
from ...database.models import User

router = APIRouter()


@router.get("/api/pptist/templates")
async def api_list_pptist_templates(_user: User | None = Depends(get_current_user_optional)):
    from ...services.slide.render.aippt_emitter import list_installed_template_packs

    return {"data": list_installed_template_packs()}


@router.get("/api/pptist/templates/{template_id}")
async def api_get_pptist_template_pack(template_id: str, _user: User | None = Depends(get_current_user_optional)):
    from ...services.slide.render.aippt_emitter import load_template_pack_strict

    try:
        return load_template_pack_strict(template_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid template id") from None
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Unknown template_id") from None
