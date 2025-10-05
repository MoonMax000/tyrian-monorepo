import { api } from "..";

export interface ShortStockData {
  symbol: string;
  name: string;
  price: number;
  changesPercentage: number;
  icon: string;
}
export default (country = "us", limit = 100) => {
  return api.get<ShortStockData[]>(
    `/stocks/parsed/market-leaders-growth/${country}/?limit=${limit}`
  );
};
