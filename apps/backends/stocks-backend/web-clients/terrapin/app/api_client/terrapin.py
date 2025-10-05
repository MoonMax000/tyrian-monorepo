from typing import Literal
import logging

from app.api_client.base import BaseAsyncApiClient
from app.models.bonds import BondFilter

logger = logging.getLogger(__name__)


class TerrapinApiClient(BaseAsyncApiClient):
    async def bond_search(self, payload: dict) -> dict:
        """
        Search for government and corporate bonds with filtering options.
        """
        endpoint = f"bond_search/"
        
        logger.info(f"🔍 [BOND_SEARCH] Starting bond search")
        logger.info(f"🔍 [BOND_SEARCH] Endpoint: {endpoint}")
        logger.info(f"🔍 [BOND_SEARCH] Payload: {payload}")
        logger.info(f"🔍 [BOND_SEARCH] Base URL: {self.base_url}")
        logger.info(f"🔍 [BOND_SEARCH] Full URL: {self.base_url}/{endpoint}")
        
        try:
            result = await self.post(endpoint=endpoint, json=payload)
            logger.info(f"✅ [BOND_SEARCH] Success - Response type: {type(result)}")
            if isinstance(result, dict):
                logger.info(f"✅ [BOND_SEARCH] Response keys: {list(result.keys())}")
            return result
        except Exception as e:
            logger.error(f"❌ [BOND_SEARCH] Error: {str(e)}", exc_info=True)
            raise

    async def bond_reference(self, payload: dict) -> dict:
        """
        Search for government and corporate bonds with filtering options.
        """
        # Пробуем разные варианты endpoint для Reference resources
        endpoint = f"bond_reference/"  # Возвращаемся к оригинальному
        isins = payload.get('isins', [])
        
        logger.info(f"📋 [BOND_REFERENCE] Starting bond reference lookup")
        logger.info(f"📋 [BOND_REFERENCE] Endpoint: {endpoint}")
        logger.info(f"📋 [BOND_REFERENCE] ISINs count: {len(isins)}")
        logger.info(f"📋 [BOND_REFERENCE] First 5 ISINs: {isins[:5] if isins else 'None'}")
        logger.info(f"📋 [BOND_REFERENCE] Base URL: {self.base_url}")
        logger.info(f"📋 [BOND_REFERENCE] Full URL: {self.base_url}/{endpoint}")
        
        # Проверяем лимит ISINs (3,000 в месяц для Startup Tier)
        if len(isins) > 3000:
            logger.warning(f"⚠️ [BOND_REFERENCE] WARNING: ISINs count ({len(isins)}) exceeds monthly limit (3,000)")
        
        try:
            result = await self.post(endpoint=endpoint, json=payload)
            logger.info(f"✅ [BOND_REFERENCE] Success - Response type: {type(result)}")
            if isinstance(result, dict):
                logger.info(f"✅ [BOND_REFERENCE] Response keys: {list(result.keys())}")
            return result
        except Exception as e:
            error_msg = str(e)
            if "402" in error_msg or "Payment Required" in error_msg:
                logger.warning(f"⚠️ [BOND_REFERENCE] 402 Payment Required - API quota exceeded or insufficient permissions")
                logger.warning(f"⚠️ [BOND_REFERENCE] Returning empty reference data as fallback")
                # Возвращаем пустые данные вместо ошибки
                return {"data": [], "total": 0}
            elif "404" in error_msg or "Not Found" in error_msg:
                logger.warning(f"⚠️ [BOND_REFERENCE] 404 Not Found - endpoint may not exist or be accessible")
                logger.warning(f"⚠️ [BOND_REFERENCE] Returning empty reference data as fallback")
                # Возвращаем пустые данные вместо ошибки
                return {"data": [], "total": 0}
            else:
                logger.error(f"❌ [BOND_REFERENCE] Error: {error_msg}", exc_info=True)
                raise

    async def bond_pricing_latest(self, payload: dict) -> dict:
        """
        Search for government and corporate bonds with filtering options.
        """
        endpoint = f"bond_pricing_latest/"
        
        logger.info(f"💰 [BOND_PRICING] Starting bond pricing lookup")
        logger.info(f"💰 [BOND_PRICING] Endpoint: {endpoint}")
        logger.info(f"💰 [BOND_PRICING] Payload: {payload}")
        logger.info(f"💰 [BOND_PRICING] Base URL: {self.base_url}")
        logger.info(f"💰 [BOND_PRICING] Full URL: {self.base_url}/{endpoint}")
        
        try:
            result = await self.post(endpoint=endpoint, json=payload)
            logger.info(f"✅ [BOND_PRICING] Success - Response type: {type(result)}")
            if isinstance(result, dict):
                logger.info(f"✅ [BOND_PRICING] Response keys: {list(result.keys())}")
            return result
        except Exception as e:
            logger.error(f"❌ [BOND_PRICING] Error: {str(e)}", exc_info=True)
            raise
