export const formatShortCurrency = (
    price: number,
    options?: { currency?: string; decimals?: number }
): string => {
    const { currency = "$", decimals = 2 } = options || {};

    if (price >= 1e12) return currency + (price / 1e12).toFixed(decimals) + "T";
    if (price >= 1e9) return currency + (price / 1e9).toFixed(decimals) + "B";
    if (price >= 1e6) return currency + new Intl.NumberFormat("en-US").format(price);

    return currency + price.toFixed(decimals);
};