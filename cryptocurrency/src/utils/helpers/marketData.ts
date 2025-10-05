export const getLastTwoValues = <T, K extends keyof T>(data: T[], key: K) => {
    const lastRaw = data.length > 0 ? data[data.length - 1][key] ?? 0 : 0;
    const prevRaw = data.length > 1 ? data[data.length - 2][key] ?? 0 : 0;
    return { last: Number(lastRaw), prev: Number(prevRaw) };
};

export const calculateChange = (last: number, prev: number) => {
    if (!last || !prev) return 0;
    const change = ((last - prev) / prev) * 100;
    return change.toFixed(2);
};