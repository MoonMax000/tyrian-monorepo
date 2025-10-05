import React, { useState } from "react";
import { Search, Calendar, ChevronDown, MoreHorizontal } from "lucide-react";
import PersistentNav from "../components/PersistentNav";
import Breadcrumbs from "../components/Breadcrumbs";

interface PortfolioData {
  id: number;
  name: string;
  trader: string;
  assets: string;
  risk: "Low" | "Medium" | "High";
  roi30d: string;
  rpi1y: string;
  signalsPerDay: string;
  subscription: string;
  unreadCount?: number;
  isPositive30d: boolean;
  isPositive1y: boolean;
}

const portfoliosData: PortfolioData[] = [
  {
    id: 1,
    name: "Crypto Momentum",
    trader: "Sarah Lee",
    assets: "BTC ETH SOL",
    risk: "Medium",
    roi30d: "+14.2%",
    rpi1y: "+120%",
    signalsPerDay: "3.5",
    subscription: "$29 / month",
    unreadCount: 2,
    isPositive30d: true,
    isPositive1y: true,
  },
  {
    id: 2,
    name: "Value Stocks",
    trader: "John Nguyen",
    assets: "AAPL MSFT",
    risk: "Low",
    roi30d: "+2.1%",
    rpi1y: "+14%",
    signalsPerDay: "0.7",
    subscription: "rev-share 10%",
    isPositive30d: true,
    isPositive1y: true,
  },
  {
    id: 3,
    name: "Hedge Fund Marco",
    trader: "Anya K.",
    assets: "GLD TLT EUR",
    risk: "High",
    roi30d: "-7.8%",
    rpi1y: "+3%",
    signalsPerDay: "5.2",
    subscription: "$49 / month",
    isPositive30d: false,
    isPositive1y: true,
  },
];

const FollowingPortfolios: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState("Active");
  const [searchQuery, setSearchQuery] = useState("");

  const FilterButton: React.FC<{
    children: React.ReactNode;
    active?: boolean;
    onClick?: () => void;
  }> = ({ children, active = false, onClick }) => (
    <button
      onClick={onClick}
      className={`flex h-10 sm:h-11 px-2 sm:px-3 items-center rounded-lg border border-tyrian-gray-darker backdrop-blur-[50px] transition-all flex-shrink-0 ${
        active
          ? "bg-tyrian-gradient text-white"
          : "bg-tyrian-black/50 text-tyrian-gray-medium hover:text-white"
      }`}
    >
      <span className="text-sm sm:text-[15px] font-bold font-nunito whitespace-nowrap">
        {children}
      </span>
      {typeof children === "string" && children.startsWith("All") && (
        <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 ml-1 text-white flex-shrink-0" />
      )}
    </button>
  );

  const RiskBadge: React.FC<{ risk: "Low" | "Medium" | "High" }> = ({
    risk,
  }) => {
    const colors = {
      Low: "bg-tyrian-green-background text-tyrian-green",
      Medium: "bg-yellow-900/30 text-tyrian-yellow",
      High: "bg-red-900/30 text-red-400",
    };

    return (
      <div
        className={`flex px-1 py-0.5 justify-center items-center rounded ${colors[risk]}`}
      >
        <span className="text-xs font-bold font-nunito">{risk}</span>
      </div>
    );
  };

  return (
    <div className="relative w-full">
      <div className="relative z-10 w-full max-w-[1293px] mx-auto px-3 sm:px-4 lg:px-0 py-4 sm:py-6 lg:py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs />
        {/* Persistent Navigation */}
        <PersistentNav />

        {/* Top Row: Premium Portfolio Card + Investment Management Card */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 mb-4 sm:mb-6">
          {/* Premium Portfolios Card */}
          <div className="flex w-full lg:w-[351px] min-h-[180px] sm:min-h-[214px] p-4 sm:p-6 flex-col justify-between items-start flex-shrink-0 rounded-xl border border-tyrian-gray-darker bg-purple-800 backdrop-blur-[50px]">
            <div className="flex flex-col items-start gap-2 self-stretch">
              <span className="text-white text-xs font-bold font-nunito uppercase">
                Smart Investments
              </span>
              <h2 className="text-white text-xl sm:text-2xl font-bold font-nunito">
                Premium Portfolios
              </h2>
            </div>
            <div className="flex flex-col items-start gap-3 sm:gap-4 self-stretch">
              <p className="text-white text-sm sm:text-[15px] font-medium font-nunito">
                Selected portfolios are available with a paid subscription.
              </p>
              <button className="flex h-10 sm:h-11 px-4 py-2 sm:py-3 justify-center items-center gap-2 rounded-[32px] bg-tyrian-gradient-animated backdrop-blur-[58px] hover-lift">
                <span className="text-white text-sm sm:text-[15px] font-bold font-nunito">
                  Go to section
                </span>
              </button>
            </div>
          </div>

          {/* Investment Management Card */}
          <div className="w-full lg:flex-1 min-h-[180px] sm:min-h-[214px] relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-900"></div>
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/5d06f743eda7e5014750c6e381abf31bbe4c2f58?width=1309"
              alt="Background ribbon"
              className="absolute right-0 top-0 w-full h-full object-cover opacity-30"
            />
            <div className="relative z-10 flex flex-col sm:flex-row h-full">
              <div className="flex w-full sm:w-[459px] h-full p-4 sm:p-6 flex-col justify-between items-start">
                <div className="flex flex-col items-start gap-2">
                  <span className="text-white text-xs font-bold font-nunito uppercase">
                    For busy people with no time to spare
                  </span>
                  <h2 className="text-white text-lg sm:text-2xl font-bold font-nunito">
                    Investment Management with an Advisor
                  </h2>
                </div>
                <div className="flex flex-col items-start gap-3 sm:gap-4">
                  <p className="text-white text-sm sm:text-[15px] font-medium font-nunito">
                    Get expert help managing your investments.
                  </p>
                  <button className="flex h-10 sm:h-11 px-4 py-2 sm:py-3 justify-center items-center gap-2 rounded-[32px] bg-tyrian-gradient-animated backdrop-blur-[58px] hover-lift">
                    <span className="text-white text-sm sm:text-[15px] font-bold font-nunito">
                      Go to section
                    </span>
                  </button>
                </div>
              </div>
              <div className="relative w-full sm:w-[342px] h-[140px] sm:h-[182px] mt-2 sm:mt-4 mr-0 sm:mr-4">
                <div className="w-full h-full rounded-xl border border-tyrian-gray-darker bg-tyrian-black/50 backdrop-blur-[50px] overflow-hidden">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/b1de8431dc299f3cf8cae7e25f7f7806dd346ede?width=680"
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover mix-blend-lighten"
                  />
                  <div className="relative z-10 p-3 sm:p-4">
                    <img
                      src="https://api.builder.io/api/v1/image/assets/TEMP/64b5d233225213e22540de69fade0f652e7ce036?width=128"
                      alt="Sarah Lee"
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded aspect-square shadow-xl mb-2"
                    />
                    <div className="mt-2 sm:mt-4">
                      <h3 className="text-white text-sm sm:text-[19px] font-bold font-nunito">
                        Sarah Lee, CFP®
                      </h3>
                      <p className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
                        SONMORE FINANCIAL
                      </p>
                      <p className="text-white text-xs font-bold font-nunito mt-1 line-clamp-2">
                        Helping Retirees and Professionals in Aerospace and Tech
                        Minimize Taxes
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 mb-4">
          {/* Active/History Toggle */}
          <div className="flex h-10 sm:h-11 p-1 items-center gap-1 sm:gap-2 rounded-lg border border-tyrian-gray-darker bg-tyrian-black/50 backdrop-blur-[50px] flex-shrink-0">
            <button
              onClick={() => setActiveFilter("Active")}
              className={`flex flex-1 sm:w-20 h-8 sm:h-9 px-2 justify-center items-center rounded ${
                activeFilter === "Active"
                  ? "bg-tyrian-gradient text-white"
                  : "text-tyrian-gray-medium"
              }`}
            >
              <span className="text-sm sm:text-[15px] font-bold font-nunito">
                Active
              </span>
            </button>
            <button
              onClick={() => setActiveFilter("History")}
              className={`flex flex-1 sm:w-20 h-8 sm:h-9 px-2 justify-center items-center rounded ${
                activeFilter === "History"
                  ? "bg-tyrian-gradient text-white"
                  : "text-tyrian-gray-medium"
              }`}
            >
              <span className="text-sm sm:text-[15px] font-bold font-nunito">
                History
              </span>
            </button>
          </div>

          {/* Filter buttons row */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <FilterButton>All portfolios</FilterButton>
            <FilterButton>All traders</FilterButton>
            <FilterButton>All risks</FilterButton>
            <FilterButton>All statuses</FilterButton>

            <div className="flex h-10 sm:h-11 px-2 sm:px-3 items-center gap-2 rounded-lg border border-tyrian-gray-darker bg-tyrian-black/50 backdrop-blur-[50px] flex-shrink-0">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" />
              <span className="text-white text-sm sm:text-[15px] font-bold font-nunito whitespace-nowrap">
                15.05.2025
              </span>
            </div>
          </div>

          {/* Search bar - full width on mobile */}
          <div className="flex h-10 sm:h-11 px-3 items-center gap-2 flex-1 rounded-lg border border-tyrian-gray-darker bg-tyrian-black/50 backdrop-blur-[50px] min-w-0">
            <Search className="w-5 h-5 sm:w-6 sm:h-6 text-tyrian-gray-medium flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by portfolio name, investor or ticker"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-tyrian-gray-medium text-sm sm:text-[15px] font-medium font-nunito placeholder-tyrian-gray-medium outline-none min-w-0"
            />
          </div>
        </div>

        {/* Subscription Info */}
        <div className="flex flex-col sm:flex-row h-auto sm:h-10 sm:h-11 p-3 sm:px-4 sm:py-2 items-start sm:items-center gap-2 sm:gap-3 rounded-lg border border-tyrian-gray-darker bg-tyrian-black/50 backdrop-blur-[50px] mb-4 sm:mb-6">
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            <span className="text-tyrian-purple-primary text-sm sm:text-[15px] font-medium font-nunito">
              Subscribed to:
            </span>
            <span className="text-white text-sm sm:text-[15px] font-bold font-nunito">
              5 portfolios
            </span>
          </div>
          <span className="hidden sm:inline text-tyrian-gray-medium text-[15px] font-bold font-nunito">
            •
          </span>
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            <span className="text-tyrian-purple-primary text-sm sm:text-[15px] font-medium font-nunito">
              Avg. ROI 30d:
            </span>
            <span className="text-tyrian-green text-sm sm:text-[15px] font-bold font-nunito">
              +8.4%
            </span>
          </div>
          <span className="hidden sm:inline text-tyrian-gray-medium text-[15px] font-bold font-nunito">
            •
          </span>
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            <span className="text-tyrian-purple-primary text-sm sm:text-[15px] font-medium font-nunito">
              Total subscription cost:
            </span>
            <span className="text-white text-sm sm:text-[15px] font-bold font-nunito">
              $89 / month
            </span>
          </div>
        </div>

        {/* Portfolios Table */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[900px] flex flex-col items-start self-stretch rounded-xl border border-tyrian-gray-darker bg-tyrian-black/50 backdrop-blur-[50px]">
            {/* Table Header */}
            <div className="flex px-4 py-3 items-center self-stretch border-b border-tyrian-gray-darker">
              <div className="flex w-6 flex-col items-start">
                <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
                  #
                </span>
              </div>
              <div className="flex w-60 flex-col justify-center items-start">
                <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
                  Portfolio/Trader
                </span>
              </div>
              <div className="flex flex-1 flex-col justify-center items-start">
                <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
                  Assets
                </span>
              </div>
              <div className="flex flex-1 flex-col justify-center items-start">
                <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
                  Risk
                </span>
              </div>
              <div className="flex flex-1 flex-col justify-center items-start">
                <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
                  ROI 30d
                </span>
              </div>
              <div className="flex flex-1 flex-col justify-center items-start">
                <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
                  RPI 1y
                </span>
              </div>
              <div className="flex flex-1 flex-col justify-center items-start">
                <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
                  Signals/day
                </span>
              </div>
              <div className="flex flex-1 flex-col justify-center items-start">
                <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
                  Subscription
                </span>
              </div>
              <div className="flex w-24 items-center">
                <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
                  Unread
                </span>
              </div>
            </div>

            {/* Table Rows */}
            {portfoliosData.map((portfolio) => (
              <div
                key={portfolio.id}
                className="flex h-14 px-4 items-center self-stretch"
              >
                <div className="flex w-6 items-center gap-1">
                  <span className="text-white text-xs font-bold font-nunito">
                    {portfolio.id}
                  </span>
                </div>
                <div className="flex w-60 flex-col items-start">
                  <span className="text-white text-[15px] font-bold font-nunito">
                    {portfolio.name}
                  </span>
                  <span className="text-tyrian-gray-medium text-xs font-bold font-nunito">
                    {portfolio.trader}
                  </span>
                </div>
                <div className="flex h-5 flex-1 flex-col justify-between items-start">
                  <span className="text-white text-[15px] font-medium font-nunito">
                    {portfolio.assets}
                  </span>
                </div>
                <div className="flex flex-1 flex-col items-start">
                  <RiskBadge risk={portfolio.risk} />
                </div>
                <div className="flex h-5 flex-1 flex-col justify-between items-start">
                  <span
                    className={`text-[15px] font-medium font-nunito ${
                      portfolio.isPositive30d
                        ? "text-tyrian-green"
                        : "text-red-400"
                    }`}
                  >
                    {portfolio.roi30d}
                  </span>
                </div>
                <div className="flex h-5 flex-1 flex-col justify-between items-start">
                  <span
                    className={`text-[15px] font-medium font-nunito ${
                      portfolio.isPositive1y
                        ? "text-tyrian-green"
                        : "text-red-400"
                    }`}
                  >
                    {portfolio.rpi1y}
                  </span>
                </div>
                <div className="flex h-5 flex-1 flex-col justify-between items-start">
                  <span className="text-white text-[15px] font-medium font-nunito">
                    {portfolio.signalsPerDay}
                  </span>
                </div>
                <div className="flex h-5 flex-1 flex-col justify-between items-start">
                  <span className="text-white text-[15px] font-medium font-nunito">
                    {portfolio.subscription}
                  </span>
                </div>
                <div className="flex w-24 justify-between items-center">
                  {portfolio.unreadCount && (
                    <div className="flex w-5 h-5 px-2 justify-center items-center flex-shrink-0 rounded-[15px] bg-tyrian-purple-primary shadow-lg">
                      <span className="text-white text-xs font-bold font-nunito">
                        {portfolio.unreadCount}
                      </span>
                    </div>
                  )}
                  <MoreHorizontal className="w-6 h-6 text-white rotate-90" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowingPortfolios;
