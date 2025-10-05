from asyncio.log import logger
from fastapi import APIRouter, Query
from typing import List, Optional
from app.api_client import cbonds_api_client


router = APIRouter(prefix="/market_leaders", tags=["stocks"])


@router.get("/base_info_stocks")
async def base_info_stocks():
    res = await cbonds_api_client.get_base_info_stocks()
    return res


@router.get("/base_info_kapitalization")
async def base_info_kapitalization():
    res = await cbonds_api_client.get_base_info_kapitalization()
    return res


@router.get("/emitents")
async def emitents():
    res = await cbonds_api_client.get_emitents()
    return res

@router.get("/emissions")
async def emissions(
    filters: Optional[List[str]] = Query(None, description="Список фильтров в формате 'field:operator:value' или 'field:value' (по умолчанию operator=eq)")
):
    # Преобразуем строки вида "field:value" или "field:operator:value" в структуру фильтров
    formatted_filters = []
    if filters:
        for filter_str in filters:
            if ":" in filter_str:
                parts = filter_str.split(":")
                if len(parts) == 2:
                    # Формат "field:value" - используем оператор eq по умолчанию
                    field, value = parts
                    formatted_filters.append({
                        "field": field.strip(),
                        "operator": "eq",
                        "value": value.strip()
                    })
                elif len(parts) == 3:
                    # Формат "field:operator:value"
                    field, operator, value = parts
                    formatted_filters.append({
                        "field": field.strip(),
                        "operator": operator.strip(),
                        "value": value.strip()
                    })
    
    res = await cbonds_api_client.get_emissions(filters=formatted_filters)
    logger.info(f"🏢 emissions data length: {len(res.get('items', []))}")
    return res


@router.get("/tradings")
async def tradings(
    filters: Optional[List[str]] = Query(None, description="Список фильтров в формате 'field:operator:value' или 'field:value' (по умолчанию operator=eq)"),
    limit: Optional[int] = Query(40, description="Количество записей"),
    offset: Optional[int] = Query(0, description="Смещение"),
    fields: Optional[List[str]] = Query(None, description="Список полей для получения")
):
    # Преобразуем строки вида "field:value" или "field:operator:value" в структуру фильтров
    formatted_filters = []
    if filters:
        for filter_str in filters:
            if ":" in filter_str:
                parts = filter_str.split(":")
                if len(parts) == 2:
                    # Формат "field:value" - используем оператор eq по умолчанию
                    field, value = parts
                    formatted_filters.append({
                        "field": field.strip(),
                        "operator": "eq",
                        "value": value.strip()
                    })
                elif len(parts) == 3:
                    # Формат "field:operator:value"
                    field, operator, value = parts
                    formatted_filters.append({
                        "field": field.strip(),
                        "operator": operator.strip(),
                        "value": value.strip()
                    })
    
    quantity = {"limit": limit, "offset": offset}
    
    res = await cbonds_api_client.get_tradings(
        filters=formatted_filters,
        quantity=quantity,
        fields=fields
    )
    return res


@router.get("/report_msfo_finance")
async def report_msfo_finance():
    res = await cbonds_api_client.get_report_msfo_finance()
    return res


@router.get("/report_nomenclature")
async def report_nomenclature():
    res = await cbonds_api_client.get_report_nomenclature()
    return res
