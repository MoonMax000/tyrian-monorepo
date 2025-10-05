import { ApiFunction, withMockOnError } from "@/utils/withMockOnError";
import { api } from "..";

export interface StockData {
  icon: string
  price: number;
  changesPercentage: number;
  symbol: string;
  name: string;
  exchange: string;
  previousClose: number;
}

export default (stockName: string, country = "us") => api.get<StockData>(`/stocks/parsed/stock-info/${country}/${stockName}`);
