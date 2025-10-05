from asyncio.log import logger
from fastapi import APIRouter, Query
from typing import List, Optional
from app.api_client import cbonds_api_client


router = APIRouter(prefix="/etf", tags=["etf"])


@router.get("/etf_funds")
async def etf_funds(
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
    
    res = await cbonds_api_client.get_etf_funds(filters=formatted_filters)
    logger.info(f"🏢 etf data length: {len(res.get('items', []))}")
    return res


@router.get("/etf_share_classes_quotes")
async def etf_share_classes_quotes(
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
    
    res = await cbonds_api_client.get_etf_share_classes_quotes(
        filters=formatted_filters,
        quantity=quantity,
        fields=fields
    )
    return res

@router.get("/etf_share_classes_dividends")
async def etf_share_classes_dividends(
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
    
    res = await cbonds_api_client.get_etf_share_classes_dividends(
        filters=formatted_filters,
        quantity=quantity,
        fields=fields
    )
    return res
