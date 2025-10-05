import time
import logging
from celery import shared_task

from ..models import Stock
from ..api import MoexApi


logger = logging.getLogger(__name__)


@shared_task
def update_stock_current_info_task():
    api_client = MoexApi()
    stocks = api_client.get_stocks()
    logger.info(f"Got {len(stocks)} stocks")

    for i, stock in enumerate(stocks):
        ticker = stock["SECID"]
        stock_info = api_client.get_stock_current_info(ticker=ticker)
        defaults = {
            "last_price": stock_info.get("last_price", 0),
        }
        try:
            Stock.objects.update_or_create(ticker=ticker, defaults=defaults)
        except Exception as e:
            logger.error(f"Error updating stock {stock['SECID']}: {e}")
            continue
        logger.info(f"Updated stock {stock['SECID']} {i+1}/{len(stocks)}")
        time.sleep(3)
