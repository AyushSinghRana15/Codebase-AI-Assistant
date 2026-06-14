import logging
from typing import Optional
from fastapi import Header

logger = logging.getLogger(__name__)


async def get_optional_user(authorization: Optional[str] = Header(None)):
    return None
