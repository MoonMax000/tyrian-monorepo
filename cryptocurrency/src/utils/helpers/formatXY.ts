import { TimeRange } from "@/components/Diagrams/types";

export const formatXAxis = (tickItem: string, timeRange: TimeRange) => {
  const date = new Date(tickItem);
  switch (timeRange) {
    case "1D":
      return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    case "1M":
    case "3M":
      return `${date.getDate()} ${date.toLocaleString("en-US", { month: "short" }).toUpperCase()}`;
    case "1Y":
      return `${date.toLocaleString("en-US", { month: "short" }).toUpperCase()} '${date.getFullYear().toString().slice(-2)}`;
    case "5Y":
    case "ALL":
      return `${date.getFullYear()}`;
    default:
      return tickItem;
  }
};
export const formatYAxis = (tick: number) => (tick === 0 ? '0' : `${tick / 1000000000000}T`);
export const formatYAxisFG = (tick: number) => (tick === 0 ? 'C&G' : `${tick}`);
export const formatYAxisRUB = (tick: number) => (tick === 0 ? 'USD' : `$${tick / 1000000}M`);