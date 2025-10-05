from fastapi import APIRouter, Depends
from app.api_client import fmp_api_client
from app.models.params import Params


router = APIRouter(prefix="/stocks", tags=["stocks"])


@router.get("/financial_statements/{symbol}")
async def financial_statements_info(symbol: str, params: Params = Depends()):
    return await fmp_api_client.get_financial_statements_info(
        stock_symbol=symbol, params=params.model_dump(exclude_none=True)
    )


@router.get("/balance_sheet_states/{symbol}")
async def balance_sheet_states_info(symbol: str, params: Params = Depends()):
    return await fmp_api_client.get_balance_sheet_states_info(
        stock_symbol=symbol, params=params.model_dump(exclude_none=True)
    )


@router.get("/cashflow_growth/{symbol}")
async def сashflow_growth_info(symbol: str, params: Params = Depends()):
    return await fmp_api_client.get_сashflow_growth_info(
        stock_symbol=symbol, params=params.model_dump(exclude_none=True)
    )


@router.get("/cashflow/{symbol}")
async def cashflow_info(symbol: str, params: Params = Depends()):
    return await fmp_api_client.get_cashflow_info(
        stock_symbol=symbol, params=params.model_dump(exclude_none=True)
    )


@router.get("/high_low_price/{symbol}")
async def high_low_price_info(symbol: str):
    return await fmp_api_client.get_high_low_price_info(stock_symbol=symbol)


@router.get("/dividends/{symbol}")
async def dividends_info(symbol: str):
    return await fmp_api_client.get_dividends_info(stock=symbol)


@router.get("/company-screener")
async def company_screener(sector: str = None, limit: int = 25):
    """
    Получает данные о компаниях с возможностью фильтрации по сектору.
    
    Args:
        sector: Сектор для фильтрации (например, "Technology", "Healthcare")
        limit: Количество записей (по умолчанию 25)
    """
    print(f"🔍 [ROUTE] company-screener called with sector={sector}, limit={limit}")
    
    try:
        result = await fmp_api_client.get_company_screener(sector=sector, limit=limit)
        print(f"✅ [ROUTE] company-screener result: {len(result) if isinstance(result, list) else 'not a list'} items")
        print(f"📊 [ROUTE] company-screener data sample: {result[:2] if isinstance(result, list) and len(result) > 0 else result}")
        return result
    except Exception as e:
        print(f"❌ [ROUTE] company-screener error: {str(e)}")
        raise


@router.get("/historical-chart/1hour")
async def historical_chart_1hour(symbol: str, from_date: str = None, to_date: str = None, nonadjusted: bool = False):
    """
    1 Hour Interval Stock Chart API - получает часовые данные по акции.
    
    Args:
        symbol: Символ акции (например, "AAPL")
        from_date: Дата начала в формате YYYY-MM-DD
        to_date: Дата окончания в формате YYYY-MM-DD
        nonadjusted: Нескорректированные данные (по умолчанию False)
    """
    return await fmp_api_client.get_historical_chart_1hour(
        symbol=symbol, 
        from_date=from_date, 
        to_date=to_date, 
        nonadjusted=nonadjusted
    )


@router.get("/historical-price-eod/full")
async def historical_price_eod_full(symbol: str, from_date: str = None, to_date: str = None):
    """
    Historical Price EOD Full API - получает дневные данные по акции.
    
    Args:
        symbol: Символ акции (например, "AAPL")
        from_date: Дата начала в формате YYYY-MM-DD
        to_date: Дата окончания в формате YYYY-MM-DD
    """
    return await fmp_api_client.get_historical_price_eod_full(symbol=symbol, from_date=from_date, to_date=to_date)


@router.get("/{symbol}")
async def stocks_info(symbol: str):
    res = await fmp_api_client.get_stock_info(stock_symbol=symbol)
    return res
