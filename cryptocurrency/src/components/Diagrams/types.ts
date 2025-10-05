export type TimeRange = "1D" | "1M" | "3M" | "1Y" | "5Y" | "ALL";

export const timeRangeParams: Record<TimeRange, { count: number; interval: string; range: string }> = {
    "1D": { count: 144, interval: "10m", range: "1d" },
    "1M": { count: 30, interval: "1d", range: "30d" },
    "3M": { count: 90, interval: "1d", range: "90d" },
    "1Y": { count: 180, interval: "2d", range: "1y" },
    "5Y": { count: 60, interval: "30d", range: "5y" },
    "ALL": { count: 80, interval: "30d", range: "all" },
};