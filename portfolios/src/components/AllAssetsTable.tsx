import React, { useState, useMemo } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

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

interface AssetWithMetrics {
  asset: Asset;
  currentValue: number;
  totalProfit: number;
  dayPL: number;
  dayPLPercent: number;
  currentShare: number;
  quantity: number;
  avgPrice: number;
  invested: number;
}

interface AllAssetsTableProps {
  assets: Asset[];
  trades: Trade[];
  totalPortfolioValue: number;
  getAssetIcon: (category: string, code: string) => React.ReactNode;
}

const AllAssetsTable: React.FC<AllAssetsTableProps> = ({
  assets,
  trades,
  totalPortfolioValue,
  getAssetIcon,
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleRow = (assetId: number) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(assetId)) {
        newSet.delete(assetId);
      } else {
        newSet.add(assetId);
      }
      return newSet;
    });
  };

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
    const sign = safeValue >= 0 ? "+" : "";
    return `${sign}${safeValue.toFixed(2)}%`;
  };

  // Process all assets with their metrics
  const assetsWithMetrics = useMemo(() => {
    if (!assets || !trades || assets.length === 0) return [];

    return assets.map((asset) => {
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
      const currentValue = quantity * price;

      // Profit
      const totalProfit = currentValue - invested;
      const avgPrice = quantity > 0 ? invested / quantity : 0;

      return {
        asset,
        currentValue,
        totalProfit,
        dayPL: totalProfit * 0.1, // Mock
        dayPLPercent:
          currentValue > 0 ? ((totalProfit * 0.1) / currentValue) * 100 : 0,
        currentShare:
          totalPortfolioValue > 0
            ? (currentValue / totalPortfolioValue) * 100
            : 0,
        quantity,
        avgPrice,
        invested,
      };
    });
  }, [assets, trades, totalPortfolioValue]);

  if (assetsWithMetrics.length === 0) {
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

      {/* Asset Rows */}
      <div className="flex flex-col items-start self-stretch">
        {assetsWithMetrics.map((assetData) => {
          const isExpanded = expandedRows.has(assetData.asset.id);
          const profitColor =
            assetData.totalProfit >= 0
              ? "text-tyrian-green"
              : "text-tyrian-red";

          return (
            <React.Fragment key={assetData.asset.id}>
              {/* Main Asset Row */}
              <div className="flex h-14 px-4 items-center self-stretch border-b border-tyrian-gray-darker hover:bg-tyrian-purple-dark/30 transition-colors">
                {/* Asset column with expand button */}
                <div className="flex items-center gap-2 flex-1">
                  <button
                    onClick={() => toggleRow(assetData.asset.id)}
                    className="text-tyrian-gray-medium hover:text-white transition-colors flex-shrink-0"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </button>
                  {getAssetIcon(assetData.asset.category, assetData.asset.code)}
                  <div className="flex flex-col justify-center">
                    <div className="text-white text-[15px] font-medium font-nunito">
                      {assetData.asset.name}
                    </div>
                    <div className="text-tyrian-purple text-xs font-bold font-nunito uppercase">
                      {assetData.asset.code}
                    </div>
                  </div>
                </div>

                {/* Current Value */}
                <div className="flex flex-col items-end flex-1">
                  <div className="text-white text-xs font-bold font-nunito">
                    {formatCurrency(assetData.currentValue)}
                  </div>
                </div>

                {/* Total Profit */}
                <div className="flex flex-col items-end flex-1">
                  <div
                    className={`text-xs font-bold font-nunito ${profitColor}`}
                  >
                    {formatCurrency(assetData.totalProfit)}
                  </div>
                </div>

                {/* Day P/L $ */}
                <div className="flex flex-col items-end flex-1">
                  <div
                    className={`text-xs font-bold font-nunito ${profitColor}`}
                  >
                    {formatCurrency(assetData.dayPL)}
                  </div>
                </div>

                {/* Day P/L % */}
                <div className="flex flex-col items-end flex-1">
                  <div
                    className={`text-xs font-bold font-nunito ${profitColor}`}
                  >
                    {formatPercent(assetData.dayPLPercent)}
                  </div>
                </div>

                {/* Current Share */}
                <div className="flex flex-col items-end flex-1">
                  <div className="text-white text-xs font-bold font-nunito">
                    {assetData.currentShare.toFixed(2)}%
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="w-full border-b border-tyrian-gray-darker bg-tyrian-purple-dark/10">
                  <div className="flex p-4 gap-4 flex-wrap">
                    <div className="flex w-48 flex-col gap-1">
                      <div className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
                        Ticker
                      </div>
                      <div className="text-tyrian-purple text-[15px] font-medium font-nunito">
                        {assetData.asset.code}
                      </div>
                    </div>

                    <div className="flex w-48 flex-col gap-1">
                      <div className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
                        Name
                      </div>
                      <div className="text-white text-[15px] font-medium font-nunito">
                        {assetData.asset.name}
                      </div>
                    </div>

                    <div className="flex w-48 flex-col gap-1">
                      <div className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
                        Quantity
                      </div>
                      <div className="text-white text-[15px] font-medium font-nunito">
                        {assetData.quantity.toFixed(2)}
                      </div>
                    </div>

                    <div className="flex w-48 flex-col gap-1">
                      <div className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
                        Avg Price
                      </div>
                      <div className="text-white text-[15px] font-medium font-nunito">
                        {formatCurrency(assetData.avgPrice)}
                      </div>
                    </div>

                    <div className="flex w-48 flex-col gap-1">
                      <div className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
                        Current Price
                      </div>
                      <div className="text-white text-[15px] font-medium font-nunito">
                        {formatCurrency(assetData.asset.currentPrice)}
                      </div>
                    </div>

                    <div className="flex w-48 flex-col gap-1">
                      <div className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
                        Total Value
                      </div>
                      <div className="text-white text-[15px] font-medium font-nunito">
                        {formatCurrency(assetData.currentValue)}
                      </div>
                    </div>

                    <div className="flex w-48 flex-col gap-1">
                      <div className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
                        Invested
                      </div>
                      <div className="text-white text-[15px] font-medium font-nunito">
                        {formatCurrency(assetData.invested)}
                      </div>
                    </div>

                    <div className="flex w-48 flex-col gap-1">
                      <div className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
                        Profit/Loss
                      </div>
                      <div
                        className={`text-[15px] font-medium font-nunito ${profitColor}`}
                      >
                        {formatCurrency(assetData.totalProfit)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default AllAssetsTable;
