from httpx import AsyncClient
from logger import logger
from datetime import datetime
from .get_block_data import BlockDataGetter
from http_client import http_client


class QuotationChartGetter(BlockDataGetter):

    async def _add_cfc_data(self, formatted_data: list) -> list:
        """
        Добавляет данные о свободном денежном потоке в список.
        """
        if len(formatted_data) == 0:
            return formatted_data

        period = self.params.get("period", "quarter")
        endpoint = f"/stocks/cashflow/{self.params['ticker']}?period={period}"
        try:
            url = f"http://{self.source}:{self.port}{endpoint}"
            data = await http_client.get(url=url)
        except Exception as e:
            logger.error(f"Error getting CFC data: {str(e)}")
            data = None

        cfc_data = [{}]
        if data and len(data) > 0:
            cfc_data = data

        # Добавляем данные в блок
        for formatted_item, cfc_item in zip(formatted_data, cfc_data):
            if formatted_item["date"] == cfc_item["date"]:
                formatted_item["freeCashFlow"] = cfc_item.get("freeCashFlow", 0)
            else:
                formatted_item["freeCashFlow"] = 0

        return formatted_data

    async def _add_liabilities_data(self, formatted_data: list) -> list:
        """
        Добавляет данные о краткосрочных обязательствах в список.
        """
        if len(formatted_data) == 0:
            return formatted_data

        period = self.params.get("period", "quarter")
        endpoint = f"/stocks/balance_sheet_states/{self.params['ticker']}?period={period}"
        try:
            url = f"http://{self.source}:{self.port}{endpoint}"
            data = await http_client.get(url=url)
        except Exception as e:
            logger.error(f"Error getting liabilities data: {str(e)}")
            data = None

        liabilities_data = [{}]
        if data and len(data) > 0:
            liabilities_data = data

        # Добавляем данные в блок
        for formatted_item, liabilities_item in zip(formatted_data, liabilities_data):
            if formatted_item.get("date", "") == liabilities_item.get("date", ""):
                formatted_item["totalLiabilities"] = liabilities_item.get("totalCurrentLiabilities", 0)
            else:
                formatted_item["totalLiabilities"] = 0.0

        return formatted_data


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

            # Фильтруем данные по дате
            today = datetime.now()
            year_ago = today.replace(year=today.year - 1)
            start = datetime.strptime(
                self.params.get("start", year_ago.strftime("%Y-%m-%d")), "%Y-%m-%d"
            )
            end = datetime.strptime(
                self.params.get("end", today.strftime("%Y-%m-%d")), "%Y-%m-%d"
            )
            
            filtered_data = []
            for item in formatted_data:
                if "date" in item:
                    try:
                        item_date = datetime.strptime(item["date"], "%Y-%m-%d")
                        if start <= item_date <= end:
                            filtered_data.append(item)
                    except ValueError:
                        logger.error(f"Invalid date format for item: {item['date']}")
            formatted_data = filtered_data

            # ДОБАВЛЯЕМ ДАННЫЕ ДОП ЗАПРОСАМИ

            # Добавляем FCF (free cache flow)
            formatted_data = await self._add_cfc_data(formatted_data)

            # Добавляем краткосрочные обязательства
            formatted_data = await self._add_liabilities_data(formatted_data)

            await self._save_to_cache(formatted_data)
            return formatted_data
        except Exception as e:
            logger.error(f"Error getting CRC and liabilities data: {str(e)}")
            raise

