import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MoreHorizontal } from "lucide-react";
import PersistentNav from "../components/PersistentNav";
import AssetsView from "../components/AssetsView";
import AnalyticsView from "../components/AnalyticsView";
import DividendsView from "../components/DividendsView";
import GrowthView from "../components/GrowthView";
import TransactionsView from "../components/TransactionsView";
import AccrualsView from "../components/AccrualsView";
import Breadcrumbs from "../components/Breadcrumbs";
import { usePortfolioContext } from "../contexts/PortfolioContext";
import { useUser } from "../hooks/use-user";
import { usePortfolio } from "../hooks/use-portfolio";
import { useAssets } from "../hooks/use-assets";
import { useTrades } from "../hooks/use-trades";

const PortfolioDetail: React.FC = () => {
  const navigate = useNavigate();
  const { portfolioId } = useParams();
  const [activeTab, setActiveTab] = useState("Overview");
  const { currentPortfolioId, setCurrentPortfolioId } = usePortfolioContext();
  const { userId } = useUser();
  const { data: portfolio, isLoading } = usePortfolio(
    userId,
    portfolioId || null,
  );
  const { data: assetsData } = useAssets(userId, currentPortfolioId);
  const { data: tradesData } = useTrades(userId, {
    portfolioId: currentPortfolioId,
  });

  // Calculate portfolio metrics
  const metrics = React.useMemo(() => {
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

    const totalInvested = trades
      .filter((t) => t.operation === "Buy" || t.operation === "Deposit")
      .reduce((sum, t) => {
        const amount = Number(t.totalAmount) || 0;
        return sum + amount;
      }, 0);

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

  // Sync URL with context on mount and when portfolioId changes
  useEffect(() => {
    if (portfolioId && portfolioId !== currentPortfolioId) {
      setCurrentPortfolioId(portfolioId);
    }
  }, [portfolioId, currentPortfolioId, setCurrentPortfolioId]);

  return (
    <div className="relative w-full overflow-x-hidden">
      <div className="relative z-10 w-full max-w-[1293px] mx-auto px-3 sm:px-4 lg:px-0 py-4 sm:py-6 lg:py-8">
        {/* Breadcrumb */}
        <Breadcrumbs />

        {/* Persistent Navigation */}
        <PersistentNav />

        {/* Back to Portfolio Button */}
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-tyrian-gradient backdrop-blur-58 mb-4 sm:mb-6 lg:mb-8 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          <span className="text-white text-sm font-bold font-nunito">
            Back to Portfolio
          </span>
        </button>

        {/* Active Portfolio Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 lg:gap-16 p-4 sm:p-6 rounded-xl border border-tyrian-gray-darker glass-card mb-4 sm:mb-6 lg:mb-8 w-full sm:max-w-md lg:max-w-lg">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#EEB00E] shadow-lg flex items-center justify-center flex-shrink-0">
              <BinanceIcon />
            </div>
            <div className="min-w-0">
              <h3 className="text-white text-base sm:text-lg font-bold font-nunito">
                {portfolio?.name || "Loading..."}
              </h3>
              <p className="text-tyrian-gray-medium text-sm font-medium font-nunito">
                Active portfolio {portfolio && `(${portfolio.currency})`}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <span className="text-purple-400 text-xs font-bold font-nunito uppercase">
              Net Worth Portfolio Score
            </span>
            <div className="flex items-center">
              <span className="text-green-400 text-base sm:text-lg font-bold font-nunito">
                1 000
              </span>
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 ml-2"
                viewBox="0 0 26 26"
                fill="none"
              >
                <path
                  d="M11.6328 16.8241L15.4461 12.9999L11.6328 9.17578"
                  stroke="#A06AFF"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="w-full mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 p-1 rounded-[36px] border border-tyrian-gray-darker glass-card overflow-x-auto scrollbar-hide">
            <TabButton
              active={activeTab === "Overview"}
              onClick={() => setActiveTab("Overview")}
            >
              Overview
            </TabButton>
            <TabButton
              active={activeTab === "Assets"}
              onClick={() => setActiveTab("Assets")}
            >
              Assets
            </TabButton>
            <TabButton
              active={activeTab === "Analytics"}
              onClick={() => setActiveTab("Analytics")}
            >
              Analytics
            </TabButton>
            <TabButton
              active={activeTab === "Dividends"}
              onClick={() => setActiveTab("Dividends")}
            >
              Dividends
            </TabButton>
            <TabButton
              active={activeTab === "Growth"}
              onClick={() => setActiveTab("Growth")}
            >
              Growth
            </TabButton>
            <TabButton
              active={activeTab === "Transactions"}
              onClick={() => setActiveTab("Transactions")}
            >
              Transactions
            </TabButton>
            <TabButton
              active={activeTab === "Accruals"}
              onClick={() => setActiveTab("Accruals")}
            >
              Accruals
            </TabButton>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "Overview" && (
          <>
            {/* No data message */}
            {!assetsData?.items?.length && !tradesData?.items?.length && (
              <div className="mb-6 p-4 border border-tyrian-purple-primary/50 rounded-xl bg-tyrian-purple-dark/20">
                <p className="text-white text-sm font-nunito text-center">
                  📊 Нет данных для отображения. Нажмите кнопку "Add Trade" или
                  "Create Asset" и используйте кнопку "Demo" для загрузки
                  тестовых д��нных.
                </p>
              </div>
            )}

            {/* Portfolio Statistics Widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <StatCard
                title="Portfolio Value"
                mainValue={formatCurrency(metrics.portfolioValue)}
                subValue={formatCurrency(metrics.totalInvested)}
                subLabel="Invested"
              />
              <StatCard
                title="Profit"
                mainValue={formatCurrency(metrics.profit)}
                subValue={formatPercent(metrics.profitPercent)}
                subLabel="Return"
                isPositive={metrics.profit >= 0}
              />
              <AccrualsCard
                accruals={metrics.accruals}
                formatCurrency={formatCurrency}
              />
              <ReturnCard
                returnPercent={metrics.returnPercent}
                formatPercent={formatPercent}
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Portfolio Composition */}
              <div className="lg:col-span-2 order-2 lg:order-1">
                <h2 className="text-white text-lg sm:text-xl font-bold font-nunito mb-4 sm:mb-6">
                  Portfolio Composition
                </h2>
                <PortfolioCompositionTable
                  assetsData={assetsData}
                  tradesData={tradesData}
                  totalPortfolioValue={metrics.portfolioValue}
                />

                {/* Filters */}
                <div className="w-full mt-4 sm:mt-6">
                  <div className="flex items-center gap-2 sm:gap-3 p-1 rounded-[36px] border border-tyrian-gray-darker glass-card overflow-x-auto scrollbar-hide">
                    <FilterButton>By Country</FilterButton>
                    <FilterButton>By Sector</FilterButton>
                    <FilterButton>By Asset Classes</FilterButton>
                    <FilterButton active>By Holdings</FilterButton>
                  </div>
                </div>
              </div>

              {/* Portfolio Chart */}
              <div className="border border-tyrian-gray-darker glass-card rounded-xl p-4 sm:p-6 order-1 lg:order-2">
                <h3 className="text-white text-lg sm:text-xl font-bold font-nunito mb-4 sm:mb-6">
                  Portfolio
                </h3>
                <div className="flex items-center justify-center h-48 sm:h-64">
                  <PortfolioChart />
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
              <HoldingsTable title="Top Portfolio Holdings" />
              <MoversTable title="Top Movers of the Day" />
            </div>
          </>
        )}

        {activeTab === "Assets" && <AssetsView />}

        {activeTab === "Analytics" && <AnalyticsView />}

        {activeTab === "Dividends" && <DividendsView />}

        {activeTab === "Growth" && <GrowthView />}

        {activeTab === "Transactions" && <TransactionsView />}

        {activeTab === "Accruals" && <AccrualsView />}
      </div>
    </div>
  );
};

// Component helpers
const StatCard: React.FC<{
  title: string;
  mainValue: string;
  subValue?: string;
  subLabel?: string;
  isPositive?: boolean;
}> = ({ title, mainValue, subValue, subLabel, isPositive = false }) => (
  <div className="flex flex-col items-start gap-3 sm:gap-4 p-3 sm:p-4 border border-tyrian-gray-darker glass-card rounded-xl">
    <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase text-left">
      {title}
    </span>
    <div className="flex flex-col gap-1 text-left">
      <span
        className={`text-lg sm:text-2xl font-bold font-nunito ${isPositive ? "text-green-400" : "text-white"}`}
      >
        {mainValue}
      </span>
      {subValue && subLabel && (
        <div className="flex flex-col sm:flex-row items-start sm:items-baseline gap-1 sm:gap-2">
          <span
            className={`text-lg sm:text-2xl font-bold font-nunito ${isPositive ? "text-green-400" : "text-white"}`}
          >
            {subValue}
          </span>
          <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
            {subLabel}
          </span>
        </div>
      )}
    </div>
  </div>
);

const AccrualsCard: React.FC<{
  accruals: number;
  formatCurrency: (n: number) => string;
}> = ({ accruals, formatCurrency }) => {
  const accrualValue = typeof accruals === "number" ? accruals : 0;
  const accrualPercent = accrualValue.toFixed(2);

  return (
    <div className="flex flex-col gap-2 p-3 sm:p-4 border border-tyrian-gray-darker glass-card rounded-xl">
      <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase text-left">
        Accruals
      </span>
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-1 sm:gap-2 justify-start">
          <span className="text-white text-xs font-bold">
            {formatCurrency(accrualValue)}
          </span>
          <span className="text-tyrian-gray-medium text-xs font-bold uppercase">
            All time
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1 sm:gap-2 justify-start">
          <span className="text-white text-xs font-bold">
            {formatCurrency(accrualValue * 12)}
          </span>
          <span className="text-tyrian-gray-medium text-xs font-bold uppercase">
            Per year
          </span>
          <span className="px-1 py-0.5 text-xs font-bold text-purple-400 bg-purple-900/30 rounded">
            Forecast
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1 sm:gap-2 justify-start">
          <span className="text-white text-xs font-bold">
            {formatCurrency(accrualValue)}
          </span>
          <span className="text-tyrian-gray-medium text-xs font-bold uppercase">
            per month
          </span>
          <span className="px-1 py-0.5 text-xs font-bold text-purple-400 bg-purple-900/30 rounded">
            Forecast
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1 sm:gap-2 justify-start">
          <span
            className={`text-xs font-bold ${accrualValue >= 0 ? "text-green-400" : "text-red-400"}`}
          >
            {formatCurrency(accrualValue)}
          </span>
          <span
            className={`px-1 py-0.5 text-xs font-bold ${accrualValue >= 0 ? "text-green-400 bg-green-900/30" : "text-red-400 bg-red-900/30"} rounded`}
          >
            {accrualValue >= 0 ? "+" : ""}
            {accrualPercent}%
          </span>
          <span className="text-tyrian-gray-medium text-xs font-bold uppercase">
            received
          </span>
        </div>
      </div>
    </div>
  );
};

const ReturnCard: React.FC<{
  returnPercent: number;
  formatPercent: (n: number) => string;
}> = ({ returnPercent, formatPercent }) => {
  const isPositive = returnPercent >= 0;
  const colorClass = isPositive ? "text-green-400" : "text-red-400";

  return (
    <div className="flex flex-col items-start gap-2 p-3 sm:p-4 border border-tyrian-gray-darker glass-card rounded-xl">
      <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase text-left">
        Return
      </span>
      <div className="space-y-1 text-left">
        <span
          className={`text-base sm:text-lg font-bold font-nunito ${colorClass}`}
        >
          {formatPercent(returnPercent)}
        </span>
        <div className="flex flex-col sm:flex-row items-start sm:items-baseline gap-1 sm:gap-2">
          <span
            className={`text-base sm:text-lg font-bold font-nunito ${colorClass}`}
          >
            {formatPercent(returnPercent)}
          </span>
          <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
            over 12 months
          </span>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-baseline gap-1 sm:gap-2">
          <span
            className={`text-base sm:text-lg font-bold font-nunito ${colorClass}`}
          >
            {formatPercent(returnPercent)}
          </span>
          <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
            year to date
          </span>
        </div>
      </div>
    </div>
  );
};

const TabButton: React.FC<{
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}> = ({ children, active = false, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-[32px] text-xs sm:text-sm font-bold font-nunito transition-all whitespace-nowrap flex-shrink-0 min-h-[40px] sm:min-h-[44px] ${
      active
        ? "bg-tyrian-gradient text-white"
        : "border border-tyrian-gray-darker glass-card text-tyrian-gray-medium hover:text-white"
    }`}
  >
    {children}
  </button>
);

const FilterButton: React.FC<{
  children: React.ReactNode;
  active?: boolean;
}> = ({ children, active = false }) => (
  <button
    className={`px-3 sm:px-4 py-2 sm:py-3 rounded-[32px] text-xs sm:text-sm font-bold font-nunito whitespace-nowrap flex-shrink-0 min-h-[40px] sm:min-h-[44px] ${
      active
        ? "bg-tyrian-gradient text-white"
        : "border border-tyrian-gray-darker glass-card text-tyrian-gray-medium"
    }`}
  >
    {children}
  </button>
);

const PortfolioCompositionTable: React.FC = () => (
  <div className="border border-tyrian-gray-darker glass-card rounded-xl overflow-hidden">
    {/* Header */}
    <div className="flex items-center px-4 py-3 border-b border-tyrian-gray-darker">
      <div className="flex-1 text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
        Asset
      </div>
      <div className="flex-1 text-right text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
        Current Value, $
      </div>
      <div className="flex-1 text-right text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
        Total Profit, $
      </div>
      <div className="flex-1 text-right text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
        P/L for the Day, $
      </div>
      <div className="flex-1 text-right text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
        P/L for the Day, %
      </div>
      <div className="flex-1 text-right text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
        Current Share, %
      </div>
    </div>

    {/* Rows */}
    <AssetRow
      icon={<EuroIcon />}
      name="Euro"
      currentValue="21,111.00"
      totalProfit="-5,932.19"
      dayPL="-5,932.19"
      dayPercent="-0.31"
      share="43"
      isNegative
    />
    <AssetRow
      icon={<RubleIcon />}
      name="Ruble"
      currentValue="2,000.00"
      totalProfit="0.00"
      dayPL="0.00"
      dayPercent="0.00"
      share="0.05"
    />
    <AssetRow
      icon={<DollarIcon />}
      name="Dollar"
      currentValue="5,000.00"
      totalProfit="448.50"
      dayPL="448.50"
      dayPercent="0.11"
      share="9.08"
      isPositive
    />
    <AssetRow
      icon={<div className="w-7 h-7 rounded-full bg-tyrian-gradient" />}
      name="ETF"
      currentValue="1,234,278.82"
      totalProfit="22,853.58"
      dayPL="15,731.79"
      dayPercent="1.27"
      share="27.9"
      isPositive
    />
    <AssetRow
      icon={<div className="w-7 h-7 rounded-full bg-tyrian-gradient" />}
      name="Stocks"
      currentValue="883,447.40"
      totalProfit="-13,956.82"
      dayPL="883,447.40"
      dayPercent="100"
      share="19.97"
      isPartialPositive
    />
  </div>
);

const AssetRow: React.FC<{
  icon: React.ReactNode;
  name: string;
  currentValue: string;
  totalProfit: string;
  dayPL: string;
  dayPercent: string;
  share: string;
  isPositive?: boolean;
  isNegative?: boolean;
  isPartialPositive?: boolean;
}> = ({
  icon,
  name,
  currentValue,
  totalProfit,
  dayPL,
  dayPercent,
  share,
  isPositive,
  isNegative,
  isPartialPositive,
}) => (
  <div className="flex items-center px-4 py-4 border-b border-tyrian-gray-darker last:border-b-0 hover:bg-tyrian-purple-dark/30 transition-colors hover-lift">
    <div className="flex-1 flex items-center gap-2">
      {icon}
      <span className="text-white text-sm font-bold font-nunito">{name}</span>
    </div>
    <div className="flex-1 text-right text-white text-xs font-bold font-nunito">
      {currentValue}
    </div>
    <div
      className={`flex-1 text-right text-xs font-bold font-nunito ${
        isPositive
          ? "text-green-400"
          : isNegative
            ? "text-red-400"
            : "text-white"
      }`}
    >
      {totalProfit}
    </div>
    <div
      className={`flex-1 text-right text-xs font-bold font-nunito ${
        isPositive || isPartialPositive
          ? "text-green-400"
          : isNegative
            ? "text-red-400"
            : "text-white"
      }`}
    >
      {dayPL}
    </div>
    <div
      className={`flex-1 text-right text-xs font-bold font-nunito ${
        isPositive || isPartialPositive
          ? "text-green-400"
          : isNegative
            ? "text-red-400"
            : "text-white"
      }`}
    >
      {dayPercent}
    </div>
    <div className="flex-1 text-right text-white text-xs font-bold font-nunito">
      {share}
    </div>
  </div>
);

const PortfolioChart: React.FC = () => (
  <svg
    width="296"
    height="296"
    viewBox="0 0 296 296"
    fill="none"
    className="animate-pulse-subtle"
  >
    <path
      d="M296 148C296 127.322 291.667 106.874 283.28 87.9728C274.893 69.0721 262.639 52.1385 247.307 38.2637C231.975 24.3889 213.906 13.8808 194.265 7.41696C174.623 0.953074 153.845 -1.32319 133.269 0.734896C112.694 2.79299 92.7785 9.13976 74.8064 19.3661C56.8342 29.5924 41.2043 43.4712 28.9244 60.108C16.6445 76.7447 7.98712 95.77 3.51028 115.958C-0.966559 136.145 -1.16345 157.047 2.93229 177.315L53.706 167.055C51.0438 153.88 51.1717 140.294 54.0817 127.172C56.9916 114.051 62.619 101.684 70.6009 90.8702C78.5828 80.0563 88.7422 71.035 100.424 64.3879C112.106 57.7408 125.051 53.6154 138.425 52.2777C151.799 50.9399 165.305 52.4195 178.072 56.621C190.839 60.8226 202.584 67.6528 212.55 76.6714C222.515 85.69 230.481 96.6968 235.932 108.982C241.384 121.268 244.2 134.559 244.2 148H296Z"
      fill="url(#paint0_linear)"
    />
    <path
      d="M296 148C296 184.702 282.363 220.094 257.737 247.307C233.11 274.52 199.251 291.612 162.732 295.265C126.212 298.918 89.6384 288.872 60.1094 267.077C30.5803 245.281 10.2029 213.291 2.93275 177.317L53.7063 167.056C58.4319 190.439 71.6772 211.233 90.8711 225.4C110.065 239.567 133.838 246.097 157.576 243.722C181.313 241.348 203.322 230.238 219.329 212.549C235.336 194.861 244.2 171.856 244.2 148H296Z"
      fill="url(#paint1_linear)"
    />
    <path
      d="M296 148C296 175.381 288.404 202.224 274.058 225.546C259.712 248.867 239.178 267.751 214.739 280.098L191.38 233.864C207.266 225.838 220.613 213.563 229.938 198.405C239.263 183.246 244.2 165.797 244.2 148H296Z"
      fill="url(#paint2_linear)"
    />
    <defs>
      <linearGradient
        id="paint0_linear"
        x1="271"
        y1="148"
        x2="27.5"
        y2="172"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#A06AFF" />
        <stop offset="1" stopColor="#482090" />
      </linearGradient>
      <linearGradient
        id="paint1_linear"
        x1="28"
        y1="172"
        x2="203"
        y2="258.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF6A79" />
        <stop offset="1" stopColor="#8F242E" />
      </linearGradient>
      <linearGradient
        id="paint2_linear"
        x1="273"
        y1="148"
        x2="203.5"
        y2="258.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#1F4886" />
        <stop offset="1" stopColor="#6AA5FF" />
      </linearGradient>
    </defs>
  </svg>
);

const HoldingsTable: React.FC<{ title: string }> = ({ title }) => (
  <div className="border border-tyrian-gray-darker glass-card rounded-xl p-6">
    <h3 className="text-white text-xl font-bold font-nunito mb-6">{title}</h3>
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/936edd6f2de1fe9283980eec9a462504118283a7?width=88"
              alt=""
              className="w-11 h-11 rounded-full"
            />
            <span className="text-tyrian-gray-medium text-sm">BAC</span>
            <span className="text-white text-sm font-bold">
              Bank of America Corp.
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-white text-sm font-bold">$48.09</span>
            <span className="px-1 py-0.5 text-xs font-bold text-green-400 bg-green-900/30 rounded">
              +0.72%
            </span>
            <span className="text-green-400 text-sm font-bold">+$0.35</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const MoversTable: React.FC<{ title: string }> = ({ title }) => (
  <div className="border border-tyrian-gray-darker glass-card rounded-xl p-6">
    <h3 className="text-white text-xl font-bold font-nunito mb-6">{title}</h3>
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/0554d3731c7f0a6b6ec8d59f42328cf27f73133f?width=88"
              alt=""
              className="w-11 h-11 rounded-full"
            />
            <span className="text-tyrian-gray-medium text-sm">BAC</span>
            <span className="text-white text-sm font-bold">
              Bank of America Corp.
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-white text-sm font-bold">$48.09</span>
            <span className="px-1 py-0.5 text-xs font-bold text-red-400 bg-red-900/30 rounded">
              -0.72%
            </span>
            <span className="text-red-400 text-sm font-bold">-$0.35</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Icon components
const BinanceIcon = () => (
  <svg width="31" height="31" viewBox="0 0 32 32" fill="none">
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
);

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
    className="w-7 h-7"
    alt="US Dollar"
  />
);

export default PortfolioDetail;
