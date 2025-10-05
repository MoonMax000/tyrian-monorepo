from pydantic import BaseModel
from datetime import date
from typing import Optional


class Industry(BaseModel):
    start: Optional[date]
    exchange: Optional[str] = "NASDAQ"
