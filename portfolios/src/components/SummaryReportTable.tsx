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

interface AssetMetric {
  id: string;
  name: string;
  code?: string;
  icon?: React.ReactNode;
  value: number;
  invested: number;
  profit: number;
  profitPercent: number;
  dailyChange: number;
  dailyChangePercent: number;
  yield: number;
  share: number;
  deposited: number;
  available: number;
  isCategory?: boolean;
  level: number;
  children?: AssetMetric[];
}

interface SummaryReportTableProps {
  assets: Asset[];
  trades: Trade[];
  totalPortfolioValue: number;
  portfolioName?: string;
  portfolioIcon?: React.ReactNode;
  getAssetIcon: (category: string, code: string) => React.ReactNode;
}

const SummaryReportTable: React.FC<SummaryReportTableProps> = ({
  assets,
  trades,
  totalPortfolioValue,
  portfolioName = "All assets",
  portfolioIcon,
  getAssetIcon,
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(
    new Set(["all-assets"]),
  );

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
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

  // Build hierarchical data structure
  const hierarchicalData = useMemo(() => {
    if (!assets || !trades || assets.length === 0) return null;

    const categoryMap: { [key: string]: AssetMetric[] } = {};
    let totalValue = 0;
    let totalInvested = 0;
    let totalProfit = 0;

    // Process each asset
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
      const profitPercent = invested > 0 ? (profit / invested) * 100 : 0;
      const share =
        totalPortfolioValue > 0 ? (value / totalPortfolioValue) * 100 : 0;

      totalValue += value;
      totalInvested += invested;
      totalProfit += profit;

      const assetMetric: AssetMetric = {
        id: `asset-${asset.id}`,
        name: asset.name,
        code: asset.code,
        icon: getAssetIcon(asset.category, asset.code),
        value,
        invested,
        profit,
        profitPercent,
        dailyChange: profit * 0.1, // Mock data
        dailyChangePercent: profitPercent * 0.1, // Mock data
        yield: profitPercent * 0.5, // Mock data
        share,
        deposited: 100, // Mock data
        available: value,
        level: 2,
      };

      const category = asset.category || "Other";
      if (!categoryMap[category]) {
        categoryMap[category] = [];
      }
      categoryMap[category].push(assetMetric);
    });

    // Build category rows
    const categories: AssetMetric[] = Object.entries(categoryMap).map(
      ([categoryName, assets]) => {
        const categoryValue = assets.reduce((sum, a) => sum + a.value, 0);
        const categoryInvested = assets.reduce((sum, a) => sum + a.invested, 0);
        const categoryProfit = assets.reduce((sum, a) => sum + a.profit, 0);
        const categoryProfitPercent =
          categoryInvested > 0 ? (categoryProfit / categoryInvested) * 100 : 0;
        const categoryShare =
          totalPortfolioValue > 0
            ? (categoryValue / totalPortfolioValue) * 100
            : 0;

        return {
          id: `category-${categoryName}`,
          name: getCategoryDisplayName(categoryName),
          value: categoryValue,
          invested: categoryInvested,
          profit: categoryProfit,
          profitPercent: categoryProfitPercent,
          dailyChange: categoryProfit * 0.1,
          dailyChangePercent: categoryProfitPercent * 0.1,
          yield: categoryProfitPercent * 0.5,
          share: categoryShare,
          deposited: 100,
          available: categoryValue,
          isCategory: true,
          level: 1,
          children: assets,
        };
      },
    );

    // Root row with portfolio name
    const root: AssetMetric = {
      id: "all-assets",
      name: portfolioName,
      icon: portfolioIcon,
      value: totalValue,
      invested: totalInvested,
      profit: totalProfit,
      profitPercent:
        totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0,
      dailyChange: totalProfit * 0.1,
      dailyChangePercent:
        totalInvested > 0 ? ((totalProfit * 0.1) / totalInvested) * 100 : 0,
      yield:
        totalInvested > 0 ? ((totalProfit * 0.5) / totalInvested) * 100 : 0,
      share: 100,
      deposited: 100,
      available: totalValue,
      isCategory: true,
      level: 0,
      children: categories,
    };

    return root;
  }, [
    assets,
    trades,
    totalPortfolioValue,
    portfolioName,
    portfolioIcon,
    getAssetIcon,
    getCategoryDisplayName,
  ]);

  const renderRow = (
    metric: AssetMetric,
    isLast: boolean = false,
  ): React.ReactNode => {
    const isExpanded = expandedRows.has(metric.id);
    const hasChildren = metric.children && metric.children.length > 0;
    const profitColor =
      metric.profit >= 0 ? "text-tyrian-green" : "text-tyrian-red";

    return (
      <React.Fragment key={metric.id}>
        <div className="flex h-14 px-4 items-center border-b border-tyrian-gray-darker hover:bg-tyrian-purple-dark/30 transition-colors min-w-fit">
          {/* Asset column with hierarchy - flexible width */}
          <div
            className="flex items-center min-w-[200px] flex-shrink-0 flex-grow"
            style={{ paddingLeft: `${metric.level * 24}px` }}
          >
            {hasChildren && (
              <button
                onClick={() => toggleRow(metric.id)}
                className="mr-2 text-tyrian-gray-medium hover:text-white transition-colors flex-shrink-0"
              >
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </button>
            )}
            {!hasChildren && metric.level > 0 && (
              <div className="w-5 mr-2 flex-shrink-0" />
            )}
            {metric.icon && (
              <div className="mr-2 flex-shrink-0">{metric.icon}</div>
            )}
            <div className="text-white text-[15px] font-bold font-nunito whitespace-nowrap">
              {metric.name}
            </div>
          </div>

          {/* Value - fixed width */}
          <div className="flex flex-col items-end w-[120px] flex-shrink-0">
            <div className="text-white text-xs font-bold font-nunito whitespace-nowrap">
              {formatCurrency(metric.value)}
            </div>
          </div>

          {/* Invested - fixed width */}
          <div className="flex flex-col items-end w-[120px] flex-shrink-0">
            <div className="text-white text-xs font-bold font-nunito whitespace-nowrap">
              {formatCurrency(metric.invested)}
            </div>
          </div>

          {/* Profit - fixed width */}
          <div className="flex flex-col items-end w-[110px] flex-shrink-0">
            <div
              className={`text-xs font-bold font-nunito whitespace-nowrap ${profitColor}`}
            >
              {formatCurrency(metric.profit)}
            </div>
          </div>

          {/* Profit % - fixed width */}
          <div className="flex flex-col items-end w-[90px] flex-shrink-0">
            <div
              className={`text-xs font-bold font-nunito whitespace-nowrap ${profitColor}`}
            >
              {formatPercent(metric.profitPercent)}
            </div>
          </div>

          {/* Daily Change $ - fixed width */}
          <div className="flex flex-col items-end w-[130px] flex-shrink-0">
            <div
              className={`text-xs font-bold font-nunito whitespace-nowrap ${profitColor}`}
            >
              {formatCurrency(metric.dailyChange)}
            </div>
          </div>

          {/* Daily Change % - fixed width */}
          <div className="flex flex-col items-end w-[130px] flex-shrink-0">
            <div
              className={`text-xs font-bold font-nunito whitespace-nowrap ${profitColor}`}
            >
              {formatPercent(metric.dailyChangePercent)}
            </div>
          </div>

          {/* Yield % - fixed width */}
          <div className="flex flex-col items-end w-[90px] flex-shrink-0">
            <div className="text-white text-xs font-bold font-nunito whitespace-nowrap">
              {formatPercent(metric.yield)}
            </div>
          </div>

          {/* Share % - fixed width */}
          <div className="flex flex-col items-end w-[90px] flex-shrink-0">
            <div className="text-white text-xs font-bold font-nunito whitespace-nowrap">
              {metric.share.toFixed(2)}%
            </div>
          </div>

          {/* Deposited % - fixed width */}
          <div className="flex flex-col items-end w-[110px] flex-shrink-0">
            <div className="text-white text-xs font-bold font-nunito whitespace-nowrap">
              {metric.deposited.toFixed(2)}%
            </div>
          </div>

          {/* Available $ - fixed width */}
          <div className="flex flex-col items-end w-[120px] flex-shrink-0">
            <div className="text-white text-xs font-bold font-nunito whitespace-nowrap">
              {formatCurrency(metric.available)}
            </div>
          </div>
        </div>

        {/* Render children if expanded */}
        {isExpanded &&
          hasChildren &&
          metric.children!.map((child, index) =>
            renderRow(child, index === metric.children!.length - 1),
          )}
      </React.Fragment>
    );
  };

  if (!hierarchicalData) {
    return (
      <div className="flex items-center justify-center w-full py-8">
        <div className="text-tyrian-gray-medium text-sm">No data available</div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl border border-tyrian-gray-darker bg-tyrian-black/50 backdrop-blur-[50px] overflow-x-auto">
      <div className="flex flex-col items-start min-w-fit">
        {/* Header */}
        <div className="flex px-4 py-3 items-center border-b border-tyrian-gray-darker min-w-fit w-full">
          <div className="flex flex-col items-start min-w-[200px] flex-shrink-0 flex-grow">
            <div className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase whitespace-nowrap">
              Asset
            </div>
          </div>
          <div className="flex flex-col items-end w-[120px] flex-shrink-0">
            <div className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase whitespace-nowrap">
              Value, $
            </div>
          </div>
          <div className="flex flex-col items-end w-[120px] flex-shrink-0">
            <div className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase whitespace-nowrap">
              Invested, $
            </div>
          </div>
          <div className="flex flex-col items-end w-[110px] flex-shrink-0">
            <div className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase whitespace-nowrap">
              Profit, $
            </div>
          </div>
          <div className="flex flex-col items-end w-[90px] flex-shrink-0">
            <div className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase whitespace-nowrap">
              Profit, %
            </div>
          </div>
          <div className="flex flex-col items-end w-[130px] flex-shrink-0">
            <div className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase whitespace-nowrap">
              Daily Change, $
            </div>
          </div>
          <div className="flex flex-col items-end w-[130px] flex-shrink-0">
            <div className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase whitespace-nowrap">
              Daily Change, %
            </div>
          </div>
          <div className="flex flex-col items-end w-[90px] flex-shrink-0">
            <div className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase whitespace-nowrap">
              Yield, %
            </div>
          </div>
          <div className="flex flex-col items-end w-[90px] flex-shrink-0">
            <div className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase whitespace-nowrap">
              Share, %
            </div>
          </div>
          <div className="flex flex-col items-end w-[110px] flex-shrink-0">
            <div className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase whitespace-nowrap">
              Deposited, %
            </div>
          </div>
          <div className="flex flex-col items-end w-[120px] flex-shrink-0">
            <div className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase whitespace-nowrap">
              Available, $
            </div>
          </div>
        </div>

        {/* Rows */}
        <div className="flex flex-col items-start w-full">
          {renderRow(hierarchicalData)}
        </div>
      </div>
    </div>
  );
};

export default SummaryReportTable;
