from enum import StrEnum, auto

from pydantic import BaseModel


class Period(StrEnum):
    annual = auto()
    quarter = auto()


class Params(BaseModel):
    limit: int | None = None
    period: Period = Period.quarter
