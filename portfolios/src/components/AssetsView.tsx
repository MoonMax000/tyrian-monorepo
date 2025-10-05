import React, { useState, useMemo } from "react";
import { useUser } from "../hooks/use-user";
import { usePortfolioContext } from "../contexts/PortfolioContext";
import { useAssets } from "../hooks/use-assets";
import { useTrades } from "../hooks/use-trades";
import { usePortfolio } from "../hooks/use-portfolio";
import SummaryReportTable from "./SummaryReportTable";
import AllAssetsTable from "./AllAssetsTable";
import PortfolioCompositionTable from "./PortfolioCompositionTable";

interface StatCardProps {
  title: string;
  value: string;
  badge?: {
    text: string;
    type: "positive" | "negative";
  };
  details?: {
    ytd?: string;
    ttm?: string;
  };
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  badge,
  details,
}) => (
  <div
    className={`flex-1 h-[129px] p-4 flex flex-col items-start rounded-xl border border-tyrian-gray-darker bg-tyrian-black/50 backdrop-blur-[50px] ${details ? "gap-1" : "gap-2"}`}
  >
    <div className="self-stretch text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
      {title}
    </div>
    <div
      className={`flex items-center gap-1 self-stretch ${details ? "py-1" : "py-5"}`}
    >
      <div className="text-white text-2xl font-bold font-nunito">{value}</div>
      {badge && (
        <div
          className={`flex px-1 py-0.5 justify-center items-center rounded ${
            badge.type === "positive"
              ? "bg-tyrian-green-background"
              : "bg-red-900/30"
          }`}
        >
          <div
            className={`text-xs font-bold font-nunito ${
              badge.type === "positive" ? "text-tyrian-green" : "text-red-400"
            }`}
          >
            {badge.text}
          </div>
        </div>
      )}
    </div>
    {details && (
      <div className="flex flex-col items-start gap-0.5 self-stretch">
        <div className="flex items-center gap-2 self-stretch">
          <div className="text-white text-xs font-bold font-nunito uppercase">
            {details.ytd}
          </div>
          <div className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
            YTD
          </div>
        </div>
        <div className="flex items-center gap-2 self-stretch">
          <div className="text-white text-xs font-bold font-nunito uppercase">
            {details.ttm}
          </div>
          <div className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
            TTM
          </div>
        </div>
      </div>
    )}
  </div>
);

interface AssetRowProps {
  icon: React.ReactNode;
  name: string;
  code: string;
  currentValue: string;
  totalProfit: string;
  dayPL: string;
  dayPLPercent: string;
  currentShare: string;
  profitType: "positive" | "negative" | "neutral";
}

const AssetRow: React.FC<AssetRowProps> = ({
  icon,
  name,
  code,
  currentValue,
  totalProfit,
  dayPL,
  dayPLPercent,
  currentShare,
  profitType,
}) => (
  <div className="flex h-14 px-4 items-center self-stretch border-b border-tyrian-gray-darker last:border-b-0 hover:bg-tyrian-purple-dark/30 transition-colors">
    <div className="flex items-center gap-2 flex-1">
      <div className="flex items-center gap-2">
        {icon}
        <div className="flex flex-col">
          <div className="text-white text-[15px] font-bold font-nunito">
            {name}
          </div>
          <div className="text-tyrian-gray-medium text-xs font-nunito">
            {code}
          </div>
        </div>
      </div>
    </div>
    <div className="flex flex-col items-end flex-1">
      <div className="text-white text-xs font-bold font-nunito">
        {currentValue}
      </div>
    </div>
    <div className="flex flex-col items-end flex-1">
      <div
        className={`text-xs font-bold font-nunito ${
          profitType === "positive"
            ? "text-tyrian-green"
            : profitType === "negative"
              ? "text-tyrian-red"
              : "text-white"
        }`}
      >
        {totalProfit}
      </div>
    </div>
    <div className="flex flex-col items-end flex-1">
      <div
        className={`text-xs font-bold font-nunito ${
          profitType === "positive"
            ? "text-tyrian-green"
            : profitType === "negative"
              ? "text-tyrian-red"
              : "text-white"
        }`}
      >
        {dayPL}
      </div>
    </div>
    <div className="flex flex-col items-end flex-1">
      <div
        className={`text-xs font-bold font-nunito ${
          profitType === "positive"
            ? "text-tyrian-green"
            : profitType === "negative"
              ? "text-tyrian-red"
              : "text-white"
        }`}
      >
        {dayPLPercent}
      </div>
    </div>
    <div className="flex flex-col items-end flex-1">
      <div className="text-white text-xs font-bold font-nunito">
        {currentShare}
      </div>
    </div>
  </div>
);

const AssetsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState("All Assets");
  const { userId } = useUser();
  const { currentPortfolioId } = usePortfolioContext();
  const { data: assetsData, isLoading: assetsLoading } = useAssets(
    userId,
    currentPortfolioId,
  );
  const { data: tradesData, isLoading: tradesLoading } = useTrades(userId, {
    portfolioId: currentPortfolioId,
  });
  const { data: portfolio } = usePortfolio(userId, currentPortfolioId);

  const tabs = [
    "Portfolio Composition",
    "Summary Report",
    "All Assets",
    "Stocks",
    "ETF",
    "Cash",
  ];

  // Calculate portfolio metrics from real data
  const metrics = useMemo(() => {
    if (
      !assetsData?.items ||
      !tradesData?.items ||
      assetsData.items.length === 0 ||
      tradesData.items.length === 0
    ) {
      return {
        portfolioValue: 0,
        totalInvested: 0,
        profit: 0,
        profitPercent: 0,
        accruals: 0,
        returnPercent: 0,
      };
    }

    const assets = assetsData.items;
    const trades = tradesData.items;

    // Calculate total invested from buy trades
    const totalInvested = trades
      .filter((t) => t.operation === "Buy" || t.operation === "Deposit")
      .reduce((sum, t) => {
        const amount = Number(t.totalAmount) || 0;
        return sum + amount;
      }, 0);

    // Calculate current portfolio value
    const portfolioValue = assets.reduce((sum, asset) => {
      const quantity = trades
        .filter((t) => t.assetCode === asset.code)
        .reduce((q, t) => {
          const qty = Number(t.quantity) || 0;
          if (t.operation === "Buy" || t.operation === "Deposit")
            return q + qty;
          if (t.operation === "Sell" || t.operation === "Withdrawal")
            return q - qty;
          return q;
        }, 0);

      const price = Number(asset.currentPrice) || 0;
      return sum + quantity * price;
    }, 0);

    // Calculate dividends/accruals
    const accruals = trades
      .filter((t) => t.operation === "Dividend" || t.operation === "Coupon")
      .reduce((sum, t) => {
        const amount = Number(t.totalAmount) || 0;
        return sum + amount;
      }, 0);

    const profit = portfolioValue - totalInvested + accruals;
    const profitPercent =
      totalInvested > 0 ? (profit / totalInvested) * 100 : 0;
    const returnPercent =
      totalInvested > 0
        ? ((portfolioValue - totalInvested) / totalInvested) * 100
        : 0;

    return {
      portfolioValue: isNaN(portfolioValue) ? 0 : portfolioValue,
      totalInvested: isNaN(totalInvested) ? 0 : totalInvested,
      profit: isNaN(profit) ? 0 : profit,
      profitPercent: isNaN(profitPercent) ? 0 : profitPercent,
      accruals: isNaN(accruals) ? 0 : accruals,
      returnPercent: isNaN(returnPercent) ? 0 : returnPercent,
    };
  }, [assetsData, tradesData]);

  // Filter assets by category
  const filteredAssets = useMemo(() => {
    if (!assetsData?.items) return [];

    const assets = assetsData.items;

    if (
      activeTab === "All Assets" ||
      activeTab === "Portfolio Composition" ||
      activeTab === "Summary Report"
    ) {
      return assets;
    }

    if (activeTab === "Stocks") {
      return assets.filter((a) => a.category === "Stocks");
    }

    if (activeTab === "ETF") {
      return assets.filter((a) => a.category === "ETF/Mutual Fund");
    }

    if (activeTab === "Cash") {
      return assets.filter((a) => a.category === "Cash");
    }

    return assets;
  }, [assetsData, activeTab]);

  // Calculate asset metrics
  const assetMetrics = useMemo(() => {
    if (!filteredAssets || !tradesData?.items) return [];

    return filteredAssets.map((asset) => {
      const assetTrades = tradesData.items.filter(
        (t) => t.assetCode === asset.code,
      );

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
        .reduce((sum, t) => {
          const amount = Number(t.totalAmount) || 0;
          return sum + amount;
        }, 0);

      // Current value
      const price = Number(asset.currentPrice) || 0;
      const currentValue = quantity * price;

      // Profit
      const profit = currentValue - invested;
      const profitPercent = invested > 0 ? (profit / invested) * 100 : 0;

      // Share in portfolio
      const share =
        metrics.portfolioValue > 0
          ? (currentValue / metrics.portfolioValue) * 100
          : 0;

      return {
        ...asset,
        quantity: isNaN(quantity) ? 0 : quantity,
        currentValue: isNaN(currentValue) ? 0 : currentValue,
        profit: isNaN(profit) ? 0 : profit,
        profitPercent: isNaN(profitPercent) ? 0 : profitPercent,
        share: isNaN(share) ? 0 : share,
      };
    });
  }, [filteredAssets, tradesData, metrics.portfolioValue]);

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

  const getAssetIcon = (category: string, code: string) => {
    if (code === "EUR") return <EuroIcon />;
    if (code === "RUB") return <RubleIcon />;
    if (code === "USD") return <DollarIcon />;
    if (category === "ETF/Mutual Fund") return <ETFIcon />;
    if (category === "Stocks") return <StocksIcon />;
    if (category === "Cryptocurrencies") return <CryptoIcon />;
    return <DefaultIcon />;
  };

  if (assetsLoading || tradesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Stats Cards */}
      <div className="flex items-center gap-6 w-full">
        <StatCard
          title="Portfolio Value"
          value={formatCurrency(metrics.portfolioValue)}
        />
        <StatCard
          title="Profit"
          value={formatCurrency(metrics.profit)}
          badge={{
            text: formatPercent(metrics.profitPercent),
            type: metrics.profit >= 0 ? "positive" : "negative",
          }}
        />
        <StatCard
          title="Accruals"
          value={formatCurrency(metrics.accruals)}
          details={{
            ytd: formatCurrency(metrics.accruals),
            ttm: formatCurrency(metrics.accruals),
          }}
        />
        <StatCard
          title="Return"
          value={formatPercent(metrics.returnPercent)}
          badge={{
            text: formatPercent(metrics.returnPercent),
            type: metrics.returnPercent >= 0 ? "positive" : "negative",
          }}
        />
      </div>

      {/* Tabs */}
      <div className="inline-flex p-1 items-center gap-2 sm:gap-3 rounded-[36px] border border-tyrian-gray-darker bg-tyrian-black/50 backdrop-blur-[50px] overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-[32px] text-xs sm:text-sm font-bold font-nunito transition-all whitespace-nowrap flex-shrink-0 min-h-[40px] sm:min-h-[44px] ${
              activeTab === tab
                ? "bg-tyrian-gradient text-white"
                : "border border-tyrian-gray-darker glass-card text-tyrian-gray-medium hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Assets Table */}
      {activeTab === "Portfolio Composition" ? (
        <PortfolioCompositionTable
          assets={assetsData?.items || []}
          trades={tradesData?.items || []}
          totalPortfolioValue={metrics.portfolioValue}
          getAssetIcon={getAssetIcon}
        />
      ) : activeTab === "Summary Report" ? (
        <SummaryReportTable
          assets={assetsData?.items || []}
          trades={tradesData?.items || []}
          totalPortfolioValue={metrics.portfolioValue}
          portfolioName={portfolio?.name || "All assets"}
          portfolioIcon={
            <div className="w-7 h-7 rounded-full bg-[#EEB00E] shadow-lg flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                <g clipPath="url(#clip0_binance)">
                  <path
                    d="M9.90375 13.4911L16.0078 7.38954L22.1143 13.496L25.664 9.94384L16.0078 0.285156L6.35156 9.94135L9.90375 13.4911Z"
                    fill="white"
                  />
                  <path
                    d="M0.289062 16.0014L3.83877 12.4492L7.39096 16.0014L3.83877 19.5511L0.289062 16.0014Z"
                    fill="white"
                  />
                  <path
                    d="M9.90375 18.5064L16.0078 24.6104L22.1143 18.5039L25.6664 22.0511L16.0102 31.7098L6.35156 22.0586L9.90375 18.5064Z"
                    fill="white"
                  />
                  <path
                    d="M24.6172 16.0014L28.1669 12.4492L31.7191 15.9989L28.1669 19.5536L24.6172 16.0014Z"
                    fill="white"
                  />
                  <path
                    d="M19.6099 15.9988L16.0081 12.3945L13.3446 15.0581L13.0368 15.3634L12.4062 15.9939L16.0081 19.5932L19.6099 16.0013V15.9988Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_binance">
                    <rect
                      width="31.4286"
                      height="31.4286"
                      fill="white"
                      transform="translate(0.289062 0.285156)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </div>
          }
          getAssetIcon={getAssetIcon}
        />
      ) : activeTab === "All Assets" ? (
        <AllAssetsTable
          assets={assetsData?.items || []}
          trades={tradesData?.items || []}
          totalPortfolioValue={metrics.portfolioValue}
          getAssetIcon={getAssetIcon}
        />
      ) : (
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
            {assetMetrics.length === 0 ? (
              <div className="flex items-center justify-center w-full py-8">
                <div className="text-tyrian-gray-medium text-sm">
                  No assets found. Add assets or use the Demo button.
                </div>
              </div>
            ) : (
              assetMetrics.map((asset) => (
                <AssetRow
                  key={asset.id}
                  icon={getAssetIcon(asset.category, asset.code)}
                  name={asset.name}
                  code={asset.code}
                  currentValue={formatCurrency(asset.currentValue)}
                  totalProfit={formatCurrency(asset.profit)}
                  dayPL={formatCurrency(asset.profit)}
                  dayPLPercent={formatPercent(asset.profitPercent)}
                  currentShare={asset.share.toFixed(2)}
                  profitType={
                    asset.profit > 0
                      ? "positive"
                      : asset.profit < 0
                        ? "negative"
                        : "neutral"
                  }
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Icon Components
const EuroIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <g clipPath="url(#clip0_euro)">
      <path d="M0 0H28V28H0V0Z" fill="#1565C0" />
      <path
        d="M13.9205 3.10938L14.496 4.88271H16.3627L14.8538 5.9716L15.4294 7.74493L13.9205 6.65604L12.4272 7.74493L12.9872 5.98715L11.4938 4.89826H13.3605L13.9049 3.10938H13.9205ZM6.28271 6.28271L7.94715 7.12271L9.25382 5.81604L8.97382 7.6516L10.6227 8.4916L8.78715 8.78715L8.4916 10.6227L7.6516 8.97382L5.81604 9.25382L7.12271 7.94715L6.28271 6.28271ZM3.10938 13.9205L4.88271 13.3449V11.4783L5.9716 12.9872L7.76049 12.4427L6.6716 13.936L7.76049 15.4449L6.00271 14.8694L4.91382 16.3783V14.5116L3.10938 13.9205ZM6.28271 21.5583L7.12271 19.9094L5.81604 18.5872L7.6516 18.8827L8.4916 17.2183L8.78715 19.0694L10.6227 19.3494L8.97382 20.2049L9.25382 22.0405L7.94715 20.7183L6.28271 21.5583ZM13.9205 24.7316L13.3449 22.9583H11.4783L12.9872 21.8694L12.4427 20.096L13.936 21.1849L15.4449 20.096L14.8694 21.8694L16.3783 22.9583H14.5116L13.936 24.7316H13.9205ZM21.5583 21.5583L19.9094 20.7183L18.5872 22.0405L18.8827 20.2049L17.2183 19.3494L19.0694 19.0694L19.3494 17.2183L20.2049 18.8827L22.0405 18.5872L20.7183 19.9094L21.5583 21.5583ZM24.7316 13.9205L22.9583 14.496V16.3627L21.8694 14.8538L20.096 15.4294L21.1849 13.9205L20.096 12.4272L21.8694 12.9872L22.9583 11.4938V13.3605L24.7316 13.9205ZM21.5583 6.28271L20.7183 7.94715L22.0405 9.25382L20.2049 8.97382L19.3494 10.6227L19.0694 8.78715L17.2183 8.4916L18.8827 7.6516L18.5872 5.81604L19.9094 7.12271L21.5583 6.28271Z"
        fill="#FDD835"
      />
    </g>
    <defs>
      <clipPath id="clip0_euro">
        <rect width="28" height="28" rx="14" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const RubleIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <g clipPath="url(#clip0_ruble)">
      <path d="M0 0H28V9.33333H0V0Z" fill="#F8F9FD" />
      <path d="M0 9.33203H28V18.6654H0V9.33203Z" fill="#1E88E5" />
      <path d="M0 18.668H28V28.0013H0V18.668Z" fill="#EF5350" />
    </g>
    <defs>
      <clipPath id="clip0_ruble">
        <rect width="28" height="28" rx="14" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const DollarIcon = () => (
  <img
    src="https://api.builder.io/api/v1/image/assets/TEMP/44b73adc5918f28374c5d70f89c3d2518e7896c4?width=56"
    alt="US Flag"
    className="w-7 h-7 aspect-square"
  />
);

const ETFIcon = () => (
  <div className="w-7 h-7 aspect-square rounded-full bg-gradient-to-br from-purple-500 to-blue-500"></div>
);

const StocksIcon = () => (
  <div className="w-7 h-7 aspect-square rounded-full bg-gradient-to-br from-purple-600 to-pink-500"></div>
);

const CryptoIcon = () => (
  <div className="w-7 h-7 aspect-square rounded-full bg-gradient-to-br from-orange-500 to-yellow-500"></div>
);

const DefaultIcon = () => (
  <div className="w-7 h-7 aspect-square rounded-full bg-gradient-to-br from-gray-500 to-gray-700"></div>
);

export default AssetsView;
