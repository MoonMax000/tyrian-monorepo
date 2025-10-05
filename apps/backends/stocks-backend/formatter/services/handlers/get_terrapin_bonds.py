from datetime import datetime, timedelta

from logger import logger
from .get_block_data import BlockDataGetter
from http_client import http_client
from services.data_converters.stocks import sort_bonds_data
# from ..get_block import get_block  # Убираем для избежания циклических импортов
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
from settings import settings


class TerrapinCorporateBondsGetter(BlockDataGetter):
    """
    Обработчик для получения данных корпоративных облигаций через Terrapin API.
    """

    async def _map_corporate_filters(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Маппинг параметров для корпоративных облигаций из CBONDS формата в Terrapin BondFilter.
        """
        terrapin_filters = {}

        # Маппинг параметра kind
        kind = params.get("kind", "All Bonds")
        
        # Фильтры, которые можно применить на уровне Terrapin API
        if kind == "fixed rate":
            terrapin_filters["interest_types"] = ["fixed rate"]
            
        elif kind == "floating rate":
            terrapin_filters["interest_types"] = ["variable rate"]
            
        elif kind == "zero coupon":
            terrapin_filters["interest_types"] = ["zero rate / discount rate"]
            
        elif kind == "All Bonds":
            # Все облигации - без дополнительных фильтров
            pass

        # Добавляем сортировку если указана (только поддерживаемые поля)
        if "sort_by" in params:
            sort_by = params["sort_by"]
            sort_direction = params.get("sort_direction", "desc")
            
            # Маппинг поддерживаемых полей для Terrapin API
            terrapin_sort_fields = {
                "name": "issuer_name",
                "ticker": "ticker", 
                "isin": "isin",
                "currency": "currency",
                "coupon": "coupon",
                "maturity_date": "maturity_date",
                "country": "country",
                "issue_rating_group": "issue_rating_group",
                "issuer_rating_group": "issuer_rating_group"
            }
            
            if sort_by in terrapin_sort_fields:
                sort_field = terrapin_sort_fields[sort_by]
                # Добавляем префикс "-" для убывающей сортировки
                if sort_direction == "desc":
                    sort_field = f"-{sort_field}"
                
                terrapin_filters["sort"] = [sort_field]
            # Для неподдерживаемых полей (например, ytm) сортировка будет в постобработке

        # Сохраняем параметры для постобработки
        self._postprocess_filters = {
            "kind": kind,
            "limit": params.get("limit", 100),
            "sort_by": params.get("sort_by"),
            "sort_direction": params.get("sort_direction", "desc")
        }

        logger.debug(f"Mapped corporate filters: {terrapin_filters}")
        return terrapin_filters


    async def _get_terrapin_bonds_data(self, filters: Dict[str, Any], bond_type: str) -> List[Dict[str, Any]]:
        """
        Получает данные облигаций через Terrapin API.
        
        Args:
            filters: Фильтры для поиска облигаций
            bond_type: Тип облигаций ("corporate" или "government")
            
        Returns:
            Список облигаций с данными
        """
        try:
            # Определяем URL на основе источника
            logger.info(f"🔍 Source: {self.source}, Port: {self.port}")
            base_url = f"http://{self.source}:{self.port}" if self.source and self.port else settings.TERRAPIN_API_URL
            logger.info(f"🔗 Using Terrapin base URL: {base_url}")
            
            # 1. Поиск облигаций
            search_url = f"{base_url}/bonds/"
            logger.info(f"🚀 Requesting bonds from Terrapin: {search_url} with filters: {filters}")
            
            # Добавляем issuer_types для корпоративных облигаций
            filters["issuer_types"] = ["corporate"]
            
            search_response = await http_client.post(url=search_url, json=filters)
            
            if not search_response or "data" not in search_response:
                logger.warning("No bonds data received from Terrapin")
                return []

            bonds_data = search_response.get("data", [])
            logger.info(f"Received {len(bonds_data)} bonds from Terrapin search")

            if not bonds_data:
                return []

            # 2. Получаем ISIN для запроса данных о ценах
            isins = [bond.get("isin") for bond in bonds_data if bond.get("isin")]
            
            if not isins:
                logger.warning("No ISINs found in bonds data")
                return bonds_data

            # 3. Получаем актуальные цены и YTM данные за текущую дату
            today = datetime.now().strftime("%Y-%m-%d")
            yesterday = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")
            
            pricing_url = f"{base_url}/bonds/latest_prices"
            pricing_payload = {"isins": isins, "as_of_date": today}
            
            pricing_response = await http_client.post(url=pricing_url, json=pricing_payload)
            
            if pricing_response and "data" in pricing_response:
                pricing_data = pricing_response.get("data", [])
                logger.info(f"Received {len(pricing_data)} pricing records from Terrapin for {today}")
                
                # Создаем словарь {isin: pricing_data} для быстрого поиска
                pricing_dict = {item.get("isin"): item for item in pricing_data if item.get("isin")}
                
                # 4. Получаем цены за вчерашний день для расчета изменения
                yesterday_payload = {"isins": isins, "as_of_date": yesterday}
                yesterday_response = await http_client.post(url=pricing_url, json=yesterday_payload)
                
                yesterday_pricing_dict = {}
                if yesterday_response and "data" in yesterday_response:
                    yesterday_pricing_data = yesterday_response.get("data", [])
                    logger.info(f"Received {len(yesterday_pricing_data)} pricing records from Terrapin for {yesterday}")
                    yesterday_pricing_dict = {item.get("isin"): item for item in yesterday_pricing_data if item.get("isin")}
                
                # Объединяем данные облигаций с ценами
                for bond in bonds_data:
                    isin = bond.get("isin")
                    if isin in pricing_dict:
                        pricing_info = pricing_dict[isin]
                        current_price = pricing_info.get("price")
                        
                        # Рассчитываем изменение цены в процентах
                        price_change = None
                        if isin in yesterday_pricing_dict:
                            yesterday_price = yesterday_pricing_dict[isin].get("price")
                            if current_price and yesterday_price and yesterday_price != 0:
                                price_change = ((current_price - yesterday_price) / yesterday_price) * 100
                            else:
                                price_change = "undefined"
                        
                        # Добавляем YTM и другие данные о ценах
                        bond.update({
                            "ytm": pricing_info.get("yield_to_maturity", 0),
                            "price": current_price,
                            "last_trade_date": pricing_info.get("last_trade_date"),
                            "volume": pricing_info.get("estimated_volume", 0),
                            "price_change": price_change,
                        })

            logger.info(f"Successfully processed {len(bonds_data)} bonds with pricing data")
            return bonds_data

        except Exception as e:
            logger.error(f"Error getting bonds data from Terrapin: {str(e)}")
            return []

    async def _convert_terrapin_to_cbonds_format(self, terrapin_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Конвертирует данные из формата Terrapin в формат, совместимый с CBONDS.
        """
        converted_data = []
        
        for bond in terrapin_data:
            # Маппинг полей из Terrapin в CBONDS формат
            converted_bond = {
                "id": bond.get("handle") or bond.get("isin"),
                "isin": bond.get("isin"),
                "emitent_name_eng": bond.get("issuer_name", ""),
                "emitent_type_name_eng": bond.get("issuer_type", ""),
                "emitent_country_name_eng": bond.get("issuer_country", ""),
                "maturity_date": bond.get("maturity_date"),
                "coupon_rate": bond.get("coupon_rate"),
                "floating_rate": "1" if bond.get("interest_type") == "variable rate" else "0",
                "coupon_type_id": "1" if bond.get("interest_type") == "zero rate / discount rate" else "0",
                "cupon_eng": f"{bond.get('coupon_rate', 0)}%",
                "kind_id": 1 if "corporate" in bond.get("issuer_type", "").lower() else 0,
                "kind_name_eng": bond.get("asset_class", "bond"),
                "ytm": bond.get("ytm"),
                "price": bond.get("price"),
                "volume": bond.get("volume"),
                "price_change": bond.get("price_change"),
                "last_trade_date": bond.get("last_trade_date"),
                # Дополнительные поля для совместимости
                "emitent_type_id": 1 if "corporate" in bond.get("issuer_type", "").lower() else 0,
            }
            
            converted_data.append(converted_bond)
        
        logger.debug(f"Converted {len(converted_data)} bonds from Terrapin to CBONDS format")
        return converted_data

    async def _postprocess_data(self, data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Постобработка данных для фильтров, не поддерживаемых Terrapin API.
        """
        if not hasattr(self, '_postprocess_filters') or not self._postprocess_filters:
            return data
            
        filters = self._postprocess_filters
        kind = filters.get("kind", "All Bonds")
        
        # Фильтры, которые нужно применить после получения данных
        if kind == "long-term":
            # Облигации со сроком погашения > 4 лет
            current_date = datetime.now()
            four_years_later = current_date + timedelta(days=4*365)
            
            filtered_data = []
            for bond in data:
                maturity_date_str = bond.get("maturity_date")
                if maturity_date_str:
                    try:
                        maturity_date = datetime.strptime(maturity_date_str, "%Y-%m-%d")
                        if maturity_date > four_years_later:
                            filtered_data.append(bond)
                    except ValueError:
                        continue
            data = filtered_data
            
        elif kind == "short-term":
            # Облигации со сроком погашения <= 4 лет
            current_date = datetime.now()
            four_years_later = current_date + timedelta(days=4*365)
            
            filtered_data = []
            for bond in data:
                maturity_date_str = bond.get("maturity_date")
                if maturity_date_str:
                    try:
                        maturity_date = datetime.strptime(maturity_date_str, "%Y-%m-%d")
                        if maturity_date <= four_years_later:
                            filtered_data.append(bond)
                    except ValueError:
                        continue
            data = filtered_data
        
        # Применяем лимит
        limit = filters.get("limit")
        if limit and limit > 0:
            data = data[:limit]
            
        logger.debug(f"Postprocessed data: {len(data)} bonds after filtering by {kind}")
        return data

    async def _get_block_data(self) -> dict:
        """
        Переопределяем для работы с Terrapin API.
        """
        from shared import data_blocks
        block = data_blocks.get(self.block_slug, {}).get(self.country_slug)
        
        logger.info(f"🔍 Block config: {block}")
        
        self.source = block.get("source")
        self.port = block.get("port")
        self.endpoint = block.get("endpoint")
        self.expiration_time = block.get("expiration_time", 3600)
        
        logger.info(f"🔧 Set source: {self.source}, port: {self.port}")

        await self._replace_params_in_endpoint()

        # Определяем тип облигаций
        bond_type = "corporate"
        
        # Маппим параметры для корпоративных облигаций
        terrapin_filters = await self._map_corporate_filters(self.params or {})

        # Получаем данные через Terrapin API
        terrapin_data = await self._get_terrapin_bonds_data(terrapin_filters, bond_type)
        
        # Конвертируем в формат CBONDS для совместимости
        converted_data = await self._convert_terrapin_to_cbonds_format(terrapin_data)
        
        # Применяем постобработку для фильтров, не поддерживаемых Terrapin API
        converted_data = await self._postprocess_data(converted_data)
        
        # Применяем сортировку если указана
        if self.params and "sort_by" in self.params:
            converted_data = await sort_bonds_data(converted_data, self.limit, self.params)
        
        return converted_data

    async def get_block_data(self) -> dict:
        """
        Получает данные для указанного блока из кэша или источника.
        """
        if cached_data := await self._get_cached_data():
            return cached_data

        try:
            formatted_data = await self._get_block_data()
            if len(formatted_data) == 0:
                return formatted_data

            await self._save_to_cache(formatted_data)
            return formatted_data
        except Exception as e:
            logger.error(f"Error getting Terrapin bonds data: {str(e)}")
            raise


class TerrapinGovernmentBondsGetter(BlockDataGetter):
    """
    Обработчик для получения данных государственных облигаций через Terrapin API.
    """

    async def _map_government_filters(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Маппинг параметров для государственных облигаций из CBONDS формата в Terrapin BondFilter.
        """
        from shared.countries import COUNTRIES_BY_REGION
        
        terrapin_filters = {}

        # Маппинг параметра kind для географических регионов
        kind = params.get("kind", "All Bonds")
        
        countries = COUNTRIES_BY_REGION.get(kind, [])
        if countries:
            terrapin_filters["countries"] = countries
        else: 
            # Все облигации - без географических ограничений
            pass

        # Добавляем сортировку если указана (только поддерживаемые поля)
        if "sort_by" in params:
            sort_by = params["sort_by"]
            sort_direction = params.get("sort_direction", "desc")
            
            # Маппинг поддерживаемых полей для Terrapin API
            terrapin_sort_fields = {
                "name": "issuer_name",
                "ticker": "ticker", 
                "isin": "isin",
                "currency": "currency",
                "coupon": "coupon",
                "maturity_date": "maturity_date",
                "country": "country",
                "issue_rating_group": "issue_rating_group",
                "issuer_rating_group": "issuer_rating_group"
            }
            
            if sort_by in terrapin_sort_fields:
                sort_field = terrapin_sort_fields[sort_by]
                # Добавляем префикс "-" для убывающей сортировки
                if sort_direction == "desc":
                    sort_field = f"-{sort_field}"
                
                terrapin_filters["sort"] = [sort_field]
            # Для неподдерживаемых полей (например, ytm) сортировка будет в постобработке

        # Сохраняем параметры для постобработки
        self._postprocess_filters = {
            "kind": kind,
            "limit": params.get("limit", 100),
            "sort_by": params.get("sort_by"),
            "sort_direction": params.get("sort_direction", "desc")
        }

        logger.debug(f"Mapped government filters: {terrapin_filters}")
        return terrapin_filters

    async def _get_terrapin_bonds_data(self, filters: Dict[str, Any], bond_type: str) -> List[Dict[str, Any]]:
        """
        Получает данные облигаций через Terrapin API.
        
        Args:
            filters: Фильтры для поиска облигаций
            bond_type: Тип облигаций ("corporate" или "government")
            
        Returns:
            Список облигаций с данными
        """
        try:
            # Определяем URL на основе источника
            logger.info(f"🔍 Source: {self.source}, Port: {self.port}")
            base_url = f"http://{self.source}:{self.port}" if self.source and self.port else settings.TERRAPIN_API_URL
            logger.info(f"🔗 Using Terrapin base URL: {base_url}")
            
            # 1. Поиск облигаций
            search_url = f"{base_url}/bonds/"
            logger.info(f"🚀 Requesting bonds from Terrapin: {search_url} with filters: {filters}")
            
            # Добавляем issuer_types для государственных облигаций
            filters["issuer_types"] = ["government"]
            
            search_response = await http_client.post(url=search_url, json=filters)
            logger.info(f"📊 Search response: {len(search_response.get('data', []))} bonds found")
            
            if not search_response.get("data"):
                logger.warning("No bonds found in search response")
                return []
            
            bonds_data = search_response["data"]
            
            # 2. Получение данных о ценах за текущую дату и вчерашний день
            isins = [bond.get("isin") for bond in bonds_data if bond.get("isin")]
            if not isins:
                logger.warning("No ISINs found in bonds data")
                return []
            
            today = datetime.now().strftime("%Y-%m-%d")
            yesterday = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")
            
            pricing_url = f"{base_url}/bonds/latest_prices"
            pricing_payload = {"isins": isins, "as_of_date": today}
            logger.info(f"💰 Requesting pricing data for {len(isins)} bonds for {today}")
            
            pricing_response = await http_client.post(url=pricing_url, json=pricing_payload)
            logger.info(f"💰 Pricing response: {len(pricing_response.get('data', []))} pricing records for {today}")
            
            # Получаем цены за вчерашний день для расчета изменения
            yesterday_payload = {"isins": isins, "as_of_date": yesterday}
            yesterday_response = await http_client.post(url=pricing_url, json=yesterday_payload)
            logger.info(f"💰 Yesterday pricing response: {len(yesterday_response.get('data', []))} pricing records for {yesterday}")
            
            # 3. Объединяем данные
            combined_data = []
            pricing_dict = {price.get("isin"): price for price in pricing_response.get("data", [])}
            yesterday_pricing_dict = {price.get("isin"): price for price in yesterday_response.get("data", [])}
            
            for bond in bonds_data:
                isin = bond.get("isin")
                if not isin:
                    continue
                    
                combined_bond = bond.copy()
                
                # Добавляем данные о ценах за текущую дату
                if isin in pricing_dict:
                    pricing_info = pricing_dict[isin]
                    current_price = pricing_info.get("price")
                    
                    # Рассчитываем изменение цены в процентах
                    price_change = None
                    if isin in yesterday_pricing_dict:
                        yesterday_price = yesterday_pricing_dict[isin].get("price")
                        if current_price and yesterday_price and yesterday_price != 0:
                            price_change = ((current_price - yesterday_price) / yesterday_price) * 100
                    
                    combined_bond.update({
                        "ytm": pricing_info.get("yield_to_maturity"),
                        "price": current_price,
                        "last_trade_date": pricing_info.get("last_trade_date"),
                        "volume": pricing_info.get("estimated_volume"),
                        "price_change": price_change,
                    })
                
                combined_data.append(combined_bond)
            
            logger.info(f"✅ Combined {len(combined_data)} bonds with pricing data")
            return combined_data
            
        except Exception as e:
            logger.error(f"Error getting bonds data from Terrapin: {str(e)}")
            raise

    async def _convert_terrapin_to_cbonds_format(self, terrapin_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Конвертирует данные из формата Terrapin в формат CBONDS для совместимости.
        """
        converted_data = []
        
        for bond in terrapin_data:
            converted_bond = {
                "id": bond.get("isin", ""),
                "isin": bond.get("isin", ""),
                "ticker": bond.get("ticker", ""),
                "name": bond.get("name", ""),
                "emitent_name_eng": bond.get("issuer_name", ""),
                "emitent_type_name_eng": "government",
                "emitent_type_id": 0,
                "issuer_type": bond.get("issuer_type", ""),
                "emitent_country_name_eng": bond.get("country", ""),
                "maturity_date": bond.get("maturity_date", ""),
                "coupon_rate": bond.get("coupon", 0.0),
                "coupon_frequency": bond.get("coupon_frequency", 1),
                "interest_type": bond.get("interest_type", ""),
                "floating_rate": "1" if bond.get("interest_type") == "variable rate" else "0",
                "coupon_type_id": "1" if bond.get("interest_type") == "zero rate / discount rate" else "0",
                "cupon_eng": f"{bond.get('coupon', 0)}%" if bond.get("interest_type") != "zero rate / discount rate" else "0%",
                "ytm": bond.get("yield_to_maturity"),
                "price": bond.get("price"),
                "price_change": bond.get("price_change"),
                "currency": bond.get("currency", ""),
                "issue_date": bond.get("issue_date", ""),
                "amount_issued": bond.get("issued_amount", 0),
                "rating": bond.get("issue_rating_group", bond.get("issuer_rating_group", "")),
                "composite_issue_rating": bond.get("composite_issue_rating", ""),
                "composite_issuer_rating": bond.get("composite_issuer_rating", ""),
                "sector": bond.get("sector", ""),
                "industry_group": bond.get("industry_group", ""),
                "rank": bond.get("rank", ""),
                "is_callable": bond.get("is_callable", False),
                "is_puttable": bond.get("is_puttable", False),
                "is_green": bond.get("is_green", False),
                "is_inflation_linked": bond.get("is_inflation_linked", False),
                "is_outstanding": bond.get("is_outstanding", True),
                "minimum_denomination": bond.get("minimum_denomination", 0),
                "integral_multiple": bond.get("integral_multiple", 0),
                "lei": bond.get("lei", ""),
                "figi": bond.get("figi", ""),
                "cfi_code": bond.get("cfi_code", ""),
                "first_coupon_date": bond.get("first_coupon_date", ""),
                "interest_accrual_date": bond.get("interest_accrual_date", ""),
                "interest_accrual_convention": bond.get("interest_accrual_convention", ""),
                "registration_type": bond.get("registration_type", ""),
                "is_144a": bond.get("is_144a", False),
                "is_regs": bond.get("is_regs", False),
                "is_covered": bond.get("is_covered", False),
                "handle": bond.get("handle", ""),
                "lei_direct_parent": bond.get("lei_direct_parent", ""),
                "lei_ultimate_parent": bond.get("lei_ultimate_parent", ""),
                "duration": bond.get("duration"),
                "modified_duration": bond.get("modified_duration"),
                "convexity": bond.get("convexity"),
                "volume": bond.get("estimated_volume"),
                "pricing_date": bond.get("date"),
            }
            
            converted_data.append(converted_bond)
        
        logger.debug(f"Converted {len(converted_data)} bonds from Terrapin to CBONDS format")
        return converted_data

    async def _postprocess_data(self, data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Постобработка данных для фильтров, не поддерживаемых Terrapin API.
        """
        if not hasattr(self, '_postprocess_filters') or not self._postprocess_filters:
            return data
            
        filters = self._postprocess_filters
        kind = filters.get("kind", "All Bonds")
        
        # Фильтры, которые нужно применить после получения данных
        if kind == "long-term":
            # Облигации со сроком погашения > 4 лет
            current_date = datetime.now()
            four_years_later = current_date + timedelta(days=4*365)
            
            filtered_data = []
            for bond in data:
                maturity_date_str = bond.get("maturity_date")
                if maturity_date_str:
                    try:
                        maturity_date = datetime.strptime(maturity_date_str, "%Y-%m-%d")
                        if maturity_date > four_years_later:
                            filtered_data.append(bond)
                    except ValueError:
                        continue
            data = filtered_data
            
        elif kind == "short-term":
            # Облигации со сроком погашения <= 4 лет
            current_date = datetime.now()
            four_years_later = current_date + timedelta(days=4*365)
            
            filtered_data = []
            for bond in data:
                maturity_date_str = bond.get("maturity_date")
                if maturity_date_str:
                    try:
                        maturity_date = datetime.strptime(maturity_date_str, "%Y-%m-%d")
                        if maturity_date <= four_years_later:
                            filtered_data.append(bond)
                    except ValueError:
                        continue
            data = filtered_data
        
        # Применяем лимит
        limit = filters.get("limit")
        if limit and limit > 0:
            data = data[:limit]
            
        logger.debug(f"Postprocessed data: {len(data)} bonds after filtering by {kind}")
        return data

    async def _get_block_data(self) -> dict:
        """
        Переопределяем для работы с Terrapin API.
        """
        from shared import data_blocks
        block = data_blocks.get(self.block_slug, {}).get(self.country_slug)
        
        logger.info(f"🔍 Block config: {block}")
        
        self.source = block.get("source")
        self.port = block.get("port")
        self.endpoint = block.get("endpoint")
        self.expiration_time = block.get("expiration_time", 3600)
        
        logger.info(f"🔧 Set source: {self.source}, port: {self.port}")

        await self._replace_params_in_endpoint()

        # Маппим параметры для государственных облигаций
        terrapin_filters = await self._map_government_filters(self.params or {})

        # Получаем данные через Terrapin API
        terrapin_data = await self._get_terrapin_bonds_data(terrapin_filters, "government")
        
        # Конвертируем в формат CBONDS для совместимости
        converted_data = await self._convert_terrapin_to_cbonds_format(terrapin_data)
        
        # Применяем постобработку для фильтров, не поддерживаемых Terrapin API
        converted_data = await self._postprocess_data(converted_data)
        
        # Применяем сортировку если указана
        if self.params and "sort_by" in self.params:
            converted_data = await sort_bonds_data(converted_data, self.limit, self.params)
        
        return converted_data

    async def get_block_data(self) -> dict:
        """
        Получает данные для указанного блока из кэша или источника.
        """
        if cached_data := await self._get_cached_data():
            return cached_data

        try:
            formatted_data = await self._get_block_data()
            if len(formatted_data) == 0:
                return formatted_data

            await self._save_to_cache(formatted_data)
            return formatted_data
        except Exception as e:
            logger.error(f"Error getting Terrapin bonds data: {str(e)}")
            raise
