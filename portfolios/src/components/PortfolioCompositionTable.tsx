import React, { useMemo } from "react";

interface Asset {
  id: number;
  code: string;
  name: string;
  category: string;
  currentPrice: number;
}

interface Trade {
  id: number;
  assetCode: string;
  operation: string;
  quantity: number;
  totalAmount: number;
}

interface CategoryData {
  category: string;
  currentValue: number;
  totalProfit: number;
  dayPL: number;
  dayPLPercent: number;
  currentShare: number;
}

interface PortfolioCompositionTableProps {
  assets: Asset[];
  trades: Trade[];
  totalPortfolioValue: number;
  getAssetIcon: (category: string, code: string) => React.ReactNode;
}

const PortfolioCompositionTable: React.FC<PortfolioCompositionTableProps> = ({
  assets,
  trades,
  totalPortfolioValue,
  getAssetIcon,
}) => {
  const formatCurrency = (value: number) => {
    const safeValue = isNaN(value) || !isFinite(value) ? 0 : value;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(safeValue);
  };

  const formatPercent = (value: number) => {
    const safeValue = isNaN(value) || !isFinite(value) ? 0 : value;
    return `${safeValue.toFixed(2)}`;
  };

  const getCategoryDisplayName = (category: string) => {
    const categoryNames: { [key: string]: string } = {
      Stocks: "Stocks",
      "ETF/Mutual Fund": "ETF",
      Cash: "Cash",
      Cryptocurrencies: "Crypto",
      Other: "Other",
    };
    return categoryNames[category] || category;
  };

  // Group assets by category
  const categorizedData = useMemo(() => {
    if (!assets || !trades || assets.length === 0) return [];

    const categoryMap: { [key: string]: CategoryData } = {};

    assets.forEach((asset) => {
      const assetTrades = trades.filter((t) => t.assetCode === asset.code);

      // Calculate quantity
      const quantity = assetTrades.reduce((q, t) => {
        const qty = Number(t.quantity) || 0;
        if (t.operation === "Buy" || t.operation === "Deposit") return q + qty;
        if (t.operation === "Sell" || t.operation === "Withdrawal")
          return q - qty;
        return q;
      }, 0);

      // Calculate invested amount
      const invested = assetTrades
        .filter((t) => t.operation === "Buy" || t.operation === "Deposit")
        .reduce((sum, t) => sum + (Number(t.totalAmount) || 0), 0);

      // Current value
      const price = Number(asset.currentPrice) || 0;
      const value = quantity * price;

      // Profit
      const profit = value - invested;

      const category = asset.category || "Other";
      if (!categoryMap[category]) {
        categoryMap[category] = {
          category,
          currentValue: 0,
          totalProfit: 0,
          dayPL: 0,
          dayPLPercent: 0,
          currentShare: 0,
        };
      }

      categoryMap[category].currentValue += value;
      categoryMap[category].totalProfit += profit;
      categoryMap[category].dayPL += profit * 0.1; // Mock data
    });

    // Calculate shares and percentages
    return Object.values(categoryMap).map((cat) => ({
      ...cat,
      currentShare:
        totalPortfolioValue > 0
          ? (cat.currentValue / totalPortfolioValue) * 100
          : 0,
      dayPLPercent:
        cat.currentValue > 0 ? (cat.dayPL / cat.currentValue) * 100 : 0,
    }));
  }, [assets, trades, totalPortfolioValue]);

  const getCategoryIcon = (category: string) => {
    // Return first asset icon from category
    const firstAsset = assets.find((a) => a.category === category);
    if (firstAsset) {
      return getAssetIcon(category, firstAsset.code);
    }
    return (
      <div className="w-7 h-7 rounded-full bg-gradient-to-r from-tyrian-purple to-tyrian-purple-dark flex-shrink-0" />
    );
  };

  if (categorizedData.length === 0) {
    return (
      <div className="flex items-center justify-center w-full py-8">
        <div className="text-tyrian-gray-medium text-sm">No assets found</div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-start rounded-xl border border-tyrian-gray-darker bg-tyrian-black/50 backdrop-blur-[50px]">
      {/* Header */}
      <div className="flex px-4 py-3 items-center self-stretch border-b border-tyrian-gray-darker">
        <div className="flex flex-col items-start flex-1">
          <div className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
            Asset
          </div>
        </div>
        <div className="flex flex-col items-end flex-1">
          <div className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
            Current Value, $
          </div>
        </div>
        <div className="flex flex-col items-end flex-1">
          <div className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
            Total Profit, $
          </div>
        </div>
        <div className="flex flex-col items-end flex-1">
          <div className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
            P/L for the Day, $
          </div>
        </div>
        <div className="flex flex-col items-end flex-1">
          <div className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
            P/L for the Day, %
          </div>
        </div>
        <div className="flex flex-col items-end flex-1">
          <div className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
            Current Share, %
          </div>
        </div>
      </div>

      {/* Category Rows - No expansion */}
      <div className="flex flex-col items-start self-stretch">
        {categorizedData.map((categoryData, index) => {
          const profitColor =
            categoryData.totalProfit >= 0
              ? "text-tyrian-green"
              : "text-tyrian-red";
          const isLast = index === categorizedData.length - 1;

          return (
            <React.Fragment key={categoryData.category}>
              <div className="flex h-14 px-4 items-center self-stretch border-b border-tyrian-gray-darker hover:bg-tyrian-purple-dark/30 transition-colors">
                {/* Asset column */}
                <div className="flex items-center gap-2 flex-1">
                  {getCategoryIcon(categoryData.category)}
                  <div className="text-white text-[15px] font-bold font-nunito">
                    {getCategoryDisplayName(categoryData.category)}
                  </div>
                </div>

                {/* Current Value */}
                <div className="flex flex-col items-end flex-1">
                  <div className="text-white text-xs font-bold font-nunito">
                    {formatCurrency(categoryData.currentValue)}
                  </div>
                </div>

                {/* Total Profit */}
                <div className="flex flex-col items-end flex-1">
                  <div
                    className={`text-xs font-bold font-nunito ${profitColor}`}
                  >
                    {formatCurrency(categoryData.totalProfit)}
                  </div>
                </div>

                {/* Day P/L $ */}
                <div className="flex flex-col items-end flex-1">
                  <div
                    className={`text-xs font-bold font-nunito ${profitColor}`}
                  >
                    {formatCurrency(categoryData.dayPL)}
                  </div>
                </div>

                {/* Day P/L % */}
                <div className="flex flex-col items-end flex-1">
                  <div
                    className={`text-xs font-bold font-nunito ${profitColor}`}
                  >
                    {formatPercent(categoryData.dayPLPercent)}
                  </div>
                </div>

                {/* Current Share */}
                <div className="flex flex-col items-end flex-1">
                  <div className="text-white text-xs font-bold font-nunito">
                    {categoryData.currentShare.toFixed(2)}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default PortfolioCompositionTable;
