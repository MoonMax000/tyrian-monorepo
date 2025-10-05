from pydantic import BaseModel
from datetime import date
from typing import Optional


class Interval(BaseModel):
    start: Optional[date] = None
    finish: Optional[date] = None
