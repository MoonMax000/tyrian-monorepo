from __future__ import annotations

from datetime import date
from enum import StrEnum
from typing import Any

from pydantic import BaseModel, Field, field_validator



class RatingGroup(StrEnum):
    INVESTMENT_GRADE = "investment_grade"
    HIGH_YIELD = "high_yield"


class AssetClass(StrEnum):
    BOND = "bond"
    CONVERTIBLE_NOTE = "convertible note"
    BOND_WITH_WARRANTS = "bond with warrants attached"
    MEDIUM_TERM_NOTE = "medium-term note"
    STRUCTURED_PRODUCT = "structured product"
    MORTGAGE_BACKED_SECURITY = "mortgage-backed security"
    ASSET_BACKED_SECURITY = "asset-backed security"
    DEPOSITORY_RECEIPT = "depository receipt on debt instruments"
    MONEY_MARKET = "money market"


class InterestType(StrEnum):
    ZERO_RATE = "zero rate / discount rate"
    FIXED_RATE = "fixed rate"
    VARIABLE_RATE = "variable rate"
    MISC = "misc."
    PAYMENT_IN_KIND = "payment in kind"
    DIVIDEND_PAYMENTS = "dividend payments"
    CASH_PAYMENT = "cash payment"
    AT_MATURITY = "at maturity"


class MaturityType(StrEnum):
    FIXED = "fixed"
    AMORTIZED = "amortized"
    PERPETUAL = "perpetual"
    EXTENDIBLE = "extendible"



class BondFilter(BaseModel):
    """
    Фильтры для поиска облигаций.
    """
    model_config = {"extra": "forbid", "populate_by_name": True}

    countries: list[str] | None = Field(default=None, description="Страны выпуска")
    currencies: list[str] | None = Field(default=None, description="Коды валют ISO 4217")
    coupon_min: float | None = Field(default=None, description="Минимальный купон, %")
    coupon_max: float | None = Field(default=None, description="Максимальный купон, %")

    maturity_date_min: date | None = Field(default=None, description="Мин. дата погашения (включительно)")
    maturity_date_max: date | None = Field(default=None, description="Макс. дата погашения (включительно)")

    issue_rating_group: RatingGroup | None = Field(default=None, description="Группа рейтинга выпуска")
    issuer_rating_group: RatingGroup | None = Field(default=None, description="Группа рейтинга эмитента")

    issuers: list[str] | None = Field(default=None, description="Наименования эмитентов")
    isins: list[str] | None = Field(default=None, description="Список ISIN")
    leis: list[str] | None = Field(default=None, description="Список LEI")
    leis_direct_parent: list[str] | None = Field(default=None, description="LEI прямого родителя")
    leis_ultimate_parent: list[str] | None = Field(default=None, description="LEI конечного родителя")

    asset_classes: list[AssetClass] | None = Field(default=None, description="Классы активов")
    interest_types: list[InterestType] | None = Field(default=None, description="Типы начисления процентов")
    maturity_types: list[MaturityType] | None = Field(default=None, description="Типы погашения")

    handles: list[str] | None = Field(default=None, description="Внутренние идентификаторы/хэндлы")

    include_callable: bool | None = Field(default=None, description="Включать callable выпуски")
    include_non_outstanding: bool = Field(default=None, description="Включать не в обращении (delisted/retired)")
    include_puttable: bool | None = Field(default=None, description="Включать puttable выпуски")

    issued_amount_min: int | None = Field(default=None, ge=0, description="Мин. объем выпуска (номинал)")
    issued_amount_max: int | None = Field(default=None, ge=0, description="Макс. объем выпуска (номинал)")

    yield_to_maturity_min: float | None = Field(default=None, description="Мин. доходность к погашению, %")
    yield_to_maturity_max: float | None = Field(default=None, description="Макс. доходность к погашению, %")

    last_trade_date_min: date | None = Field(default=None, description="Не старше даты последней сделки")

    limit: int = Field(default=100, ge=-1, description="Размер страницы (-1 для вывода всех записей)")
    page: int = Field(default=1, ge=1, description="Номер страницы")
    sort: list[str] | None = Field(
        default=None,
        description="Поля сортировки (массив строк)"
    )
    
    # Дополнительные поля для Terrapin API
    issuer_types: list[str] | None = Field(default=None, description="Типы эмитентов (corporate, government)")
    offset: int | None = Field(default=None, description="Смещение для пагинации")

    @field_validator("coupon_max")
    @classmethod
    def _coupon_range(cls, v: float | None, info: Any) -> float | None:
        if v is not None and (coupon_min := info.data.get("coupon_min")) is not None and v < coupon_min:
            raise ValueError("coupon_max must be >= coupon_min")
        return v

    @field_validator("maturity_date_max")
    @classmethod
    def _maturity_date_range(cls, v: date | None, info: Any) -> date | None:
        if v is not None and (dmin := info.data.get("maturity_date_min")) is not None and v < dmin:
            raise ValueError("maturity_date_max must be >= maturity_date_min")
        return v

    @field_validator("issued_amount_max")
    @classmethod
    def _issued_amount_range(cls, v: int | None, info: Any) -> int | None:
        if v is not None and (amin := info.data.get("issued_amount_min")) is not None and v < amin:
            raise ValueError("issued_amount_max must be >= issued_amount_min")
        return v

    @field_validator("yield_to_maturity_max")
    @classmethod
    def _ytm_range(cls, v: float | None, info: Any) -> float | None:
        if v is not None and (ymin := info.data.get("yield_to_maturity_min")) is not None and v < ymin:
            raise ValueError("yield_to_maturity_max must be >= yield_to_maturity_min")
        return v
    

class BondPricingFilter(BaseModel):
    """
    Фильтры для поиска облигаций.
    """
    isins: list[str] = Field(default=None, description="Список ISIN")
    as_of_date: str | None = Field(default=None, description="Дата в формате YYYY-MM-DD")
