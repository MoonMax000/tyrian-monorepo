import React, { useState } from "react";
import { ChevronDown, Archive, Download, Copy } from "lucide-react";
import PersistentNav from "../components/PersistentNav";
import Breadcrumbs from "../components/Breadcrumbs";

const SignalsView: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedAuthor, setSelectedAuthor] = useState("Choose Author");

  return (
    <div className="relative min-h-screen bg-tyrian-black overflow-x-hidden text-white font-nunito">
      <div className="relative z-10 max-w-[1293px] mx-auto px-3 sm:px-4 lg:px-0 pt-6 sm:pt-8">
        {/* Breadcrumbs */}
        <Breadcrumbs />
        {/* Persistent Navigation */}
        <PersistentNav />

        {/* Filter Tabs */}
        <div className="w-full mb-4 sm:mb-6">
          <div className="flex items-center gap-1 sm:gap-2 p-1 rounded-[36px] border border-tyrian-gray-darker glass-card overflow-x-auto scrollbar-hide">
            {["All", "New", "Unread", "Archived"].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`flex items-center justify-center px-3 sm:px-4 py-2 sm:py-3 rounded-[32px] text-sm font-bold font-nunito transition-all whitespace-nowrap flex-shrink-0 min-h-[40px] sm:min-h-[44px] ${
                  selectedFilter === filter
                    ? "bg-tyrian-gradient text-white"
                    : "text-tyrian-gray-medium hover:text-white"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Today Section */}
        <div className="mb-10">
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4 sm:mb-6">
            <h2 className="text-white text-xl sm:text-2xl font-bold font-nunito">
              Today
            </h2>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-3 w-full lg:w-auto">
              {/* First row: Choose Author + Sell */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Choose Author Dropdown */}
                <div className="flex items-center justify-between px-2 sm:px-3 py-2 rounded-lg border border-tyrian-gray-darker glass-card backdrop-blur-50 flex-1 sm:flex-initial sm:min-w-[160px] lg:min-w-[180px] min-h-[44px]">
                  <span className="text-tyrian-gray-medium text-sm font-bold font-nunito px-1 sm:px-2 truncate">
                    Choose Author
                  </span>
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" />
                </div>

                {/* Sell Dropdown */}
                <div className="flex items-center justify-between px-2 sm:px-3 py-2 rounded-lg border border-tyrian-gray-darker glass-card backdrop-blur-50 min-w-[90px] sm:min-w-[96px] min-h-[44px]">
                  <div className="flex items-center gap-1 px-1 sm:px-2">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M8 13.332V2.66537"
                        stroke="#EF454A"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M11.3307 9.99872C11.3307 9.99872 8.87578 13.332 7.99738 13.332C7.11898 13.332 4.66406 9.9987 4.66406 9.9987"
                        stroke="#EF454A"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-white text-sm font-bold font-nunito">
                      Sell
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-white rotate-[-90deg] flex-shrink-0" />
                </div>
              </div>

              {/* Second row: Action buttons */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Mark all as read */}
                <button className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-[32px] border border-tyrian-gray-darker glass-card backdrop-blur-58 hover-lift hover:bg-tyrian-purple-dark/30 flex-1 sm:flex-initial min-h-[44px]">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="flex-shrink-0"
                  >
                    <g clipPath="url(#clip0_893_45613)">
                      <path
                        d="M14.1641 2.78282C12.9383 2.07378 11.5152 1.66797 9.9974 1.66797C5.39502 1.66797 1.66406 5.39893 1.66406 10.0013C1.66406 14.6036 5.39502 18.3346 9.9974 18.3346C14.5997 18.3346 18.3307 14.6036 18.3307 10.0013C18.3307 9.43055 18.2733 8.87314 18.1641 8.33464"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M6.66406 10.418C6.66406 10.418 7.91406 10.418 9.58073 13.3346C9.58073 13.3346 14.2131 5.69574 18.3307 4.16797"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_893_45613">
                        <rect width="20" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  <span className="text-white text-sm font-bold font-nunito hidden sm:inline whitespace-nowrap">
                    Mark all as read
                  </span>
                  <span className="text-white text-sm font-bold font-nunito sm:hidden">
                    Mark read
                  </span>
                </button>

                {/* Calendar */}
                <button className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-[32px] border border-tyrian-gray-darker glass-card backdrop-blur-58 hover-lift hover:bg-tyrian-purple-dark/30 flex-1 sm:flex-initial min-h-[44px]">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 21 20"
                    fill="none"
                    className="flex-shrink-0"
                  >
                    <path
                      d="M15.5 1.66797V3.33464M5.5 1.66797V3.33464"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10.4936 10.832H10.5011M10.4936 14.1654H10.5011M13.8232 10.832H13.8307M7.16406 10.832H7.17154M7.16406 14.1654H7.17154"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3.41406 6.66797H17.5807"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2.58594 10.2027C2.58594 6.57162 2.58594 4.75607 3.62937 3.62803C4.6728 2.5 6.35218 2.5 9.71094 2.5H11.2943C14.653 2.5 16.3324 2.5 17.3759 3.62803C18.4193 4.75607 18.4193 6.57162 18.4193 10.2027V10.6307C18.4193 14.2617 18.4193 16.0773 17.3759 17.2053C16.3324 18.3333 14.653 18.3333 11.2943 18.3333H9.71094C6.35218 18.3333 4.6728 18.3333 3.62937 17.2053C2.58594 16.0773 2.58594 14.2617 2.58594 10.6307V10.2027Z"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3 6.66797H18"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-white text-sm font-bold font-nunito">
                    Calendar
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Trading Signals */}
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* Signal Cards */}
            {tradingSignals.map((signal, index) => (
              <SignalCard key={index} signal={signal} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center gap-1 mt-6">
            <PaginationButton icon="first" />
            <PaginationButton icon="prev" />
            <PaginationButton active>1</PaginationButton>
            <PaginationButton>2</PaginationButton>
            <PaginationButton>3</PaginationButton>
            <PaginationButton>4</PaginationButton>
            <PaginationButton icon="next" />
            <PaginationButton icon="last" />
          </div>
        </div>

        {/* Yesterday Section */}
        <div className="mb-8 sm:mb-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
            <h2 className="text-white text-xl sm:text-2xl font-bold font-nunito">
              Yesterday
            </h2>
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <button className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-[9.33px] border border-tyrian-gray-darker glass-card backdrop-blur-58 flex-1 sm:flex-initial min-h-[44px]">
                <span className="text-white text-sm font-bold font-nunito">
                  Mark all as read
                </span>
              </button>
              <button className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-[9.33px] border border-tyrian-gray-darker glass-card backdrop-blur-58 flex-1 sm:flex-initial min-h-[44px]">
                <span className="text-white text-sm font-bold font-nunito">
                  Calendar
                </span>
              </button>
            </div>
          </div>

          {/* Yesterday Signals */}
          <div className="flex flex-col gap-4 sm:gap-6">
            {yesterdaySignals.map((signal, index) => (
              <SignalCard key={index} signal={signal} />
            ))}
          </div>
        </div>

        {/* Signals of the Day Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
            <h2 className="text-white text-xl sm:text-2xl font-bold font-nunito">
              Signals of the Day
            </h2>

            {/* Action buttons */}
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <button className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-[32px] bg-tyrian-gradient backdrop-blur-58 flex-1 sm:flex-initial min-h-[44px]">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="flex-shrink-0"
                >
                  <g clipPath="url(#clip0_893_46512)">
                    <path
                      d="M14.1355 7.48369C14.1335 5.02523 14.0963 3.75181 13.3806 2.87989C13.2424 2.7115 13.088 2.5571 12.9197 2.41891C11.9997 1.66406 10.6332 1.66406 7.8998 1.66406C5.16648 1.66406 3.79982 1.66406 2.87997 2.41891C2.71157 2.5571 2.55716 2.7115 2.41896 2.87989C1.66406 3.79968 1.66406 5.16625 1.66406 7.89937C1.66406 10.6325 1.66406 11.999 2.41896 12.9189C2.55715 13.0872 2.71157 13.2416 2.87997 13.3798C3.75195 14.0954 5.02546 14.1326 7.48408 14.1346"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11.6893 7.51989L14.1607 7.48438M11.6777 18.3339L14.149 18.2983M18.3087 11.6845L18.2854 14.1509M7.50768 11.6958L7.48438 14.1622M9.57182 7.51989C8.87783 7.64419 7.76392 7.77204 7.50768 9.20677M16.2446 18.2983C16.9404 18.1847 18.0562 18.0739 18.3345 16.6433M16.2446 7.51989C16.9386 7.64419 18.0525 7.77204 18.3087 9.20677M9.58241 18.2972C8.88841 18.1733 7.7744 18.046 7.51738 16.6114"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_893_46512">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <span className="text-white text-center text-sm font-bold font-nunito">
                  Copy All
                </span>
              </button>

              <button className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-[32px] border border-tyrian-gray-darker glass-card backdrop-blur-58 flex-shrink-0">
                <Download className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Signals Table */}
          <SignalsTable />
        </div>
      </div>
    </div>
  );
};

// Signal Card Component
interface Signal {
  time: string;
  author: string;
  portfolio: string;
  action: string;
  amount: string;
  asset: string;
  price: string;
  orderType: string;
  sl: string;
  tp: string;
  leverage: string;
  performance: string;
  performanceColor: string;
  borderColor: string;
  avatar: string;
}

const SignalCard: React.FC<{ signal: Signal }> = ({ signal }) => (
  <div className="flex items-start">
    <div className={`w-1 h-full rounded-l-lg ${signal.borderColor}`}></div>
    <div className="flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 sm:p-4 rounded-r-lg border-t border-r border-b border-tyrian-gray-darker glass-card backdrop-blur-50 gap-3 sm:gap-4">
      <div className="flex items-start gap-3 sm:gap-4 w-full sm:w-auto">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-gray-400 to-gray-600 flex-shrink-0"></div>

        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1 text-xs font-bold font-nunito">
            <span className="text-tyrian-purple">{signal.time}</span>
            <span className="text-tyrian-purple">•</span>
            <span className="text-tyrian-yellow">{signal.author}</span>
            <span className="text-tyrian-purple">•</span>
            <span className="text-tyrian-purple">{signal.portfolio}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-white text-sm font-bold font-nunito">
              {signal.action} {signal.amount} {signal.asset} @ {signal.price}{" "}
              USDT
            </span>
            <span className="text-tyrian-purple text-sm font-normal font-nunito">
              ({signal.orderType})
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1 text-xs font-bold font-nunito text-tyrian-purple">
            <span>SL {signal.sl}</span>
            <span>•</span>
            <span>TP {signal.tp}</span>
            <span>•</span>
            <span>Leverage {signal.leverage}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto">
        <div className="flex flex-col items-start sm:items-end gap-1">
          <span
            className={`text-sm font-bold font-nunito ${signal.performanceColor}`}
          >
            {signal.performance}
          </span>
          <span className="text-tyrian-purple text-xs font-bold font-nunito">
            from entry
          </span>
        </div>

        <Archive className="w-5 h-5 sm:w-6 sm:h-6 text-white flex-shrink-0" />
      </div>
    </div>
  </div>
);

// Pagination Button Component
const PaginationButton: React.FC<{
  children?: React.ReactNode;
  active?: boolean;
  icon?: "first" | "prev" | "next" | "last";
}> = ({ children, active = false, icon }) => {
  const getIcon = () => {
    switch (icon) {
      case "first":
        return (
          <svg width="21" height="20" viewBox="0 0 21 20" fill="none">
            <path
              d="M15.1609 15L16.3359 13.825L12.5193 10L16.3359 6.175L15.1609 5L10.1609 10L15.1609 15Z"
              fill="#B0B0B0"
            />
            <path
              d="M9.66875 15L10.8437 13.825L7.02708 10L10.8437 6.175L9.66875 5L4.66875 10L9.66875 15Z"
              fill="#B0B0B0"
            />
          </svg>
        );
      case "prev":
        return (
          <svg width="21" height="20" viewBox="0 0 21 20" fill="none">
            <path
              d="M13.075 15L14.25 13.825L10.4333 10L14.25 6.175L13.075 5L8.075 10L13.075 15Z"
              fill="#B0B0B0"
            />
          </svg>
        );
      case "next":
        return (
          <svg width="21" height="20" viewBox="0 0 21 20" fill="none">
            <path
              d="M9.175 5L8 6.175L11.8167 10L8 13.825L9.175 15L14.175 10L9.175 5Z"
              fill="#B0B0B0"
            />
          </svg>
        );
      case "last":
        return (
          <svg width="21" height="20" viewBox="0 0 21 20" fill="none">
            <path
              d="M5.83906 5L4.66406 6.175L8.48073 10L4.66406 13.825L5.83906 15L10.8391 10L5.83906 5Z"
              fill="#B0B0B0"
            />
            <path
              d="M11.3312 5L10.1562 6.175L13.9729 10L10.1562 13.825L11.3312 15L16.3313 10L11.3312 5Z"
              fill="#B0B0B0"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <button
      className={`flex items-center justify-center w-11 h-11 rounded border border-tyrian-gray-darker transition-all hover-lift ${
        active
          ? "bg-tyrian-gradient-animated text-white"
          : "glass-card backdrop-blur-50 text-tyrian-gray-medium hover:text-white hover:bg-tyrian-purple-dark/30"
      }`}
    >
      {icon ? (
        getIcon()
      ) : (
        <span className="text-sm font-bold font-nunito">{children}</span>
      )}
    </button>
  );
};

// Signals Table Component
const SignalsTable: React.FC = () => (
  <div className="w-full overflow-x-auto">
    <div className="min-w-[900px] rounded-xl border border-tyrian-gray-darker glass-card backdrop-blur-50">
      {/* Table Header */}
      <div className="flex items-center px-4 py-3 border-b border-tyrian-gray-darker">
        <div className="w-[72px] text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
          Time
        </div>
        <div className="w-[248px] text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
          Portfolio/Trader
        </div>
        <div className="flex-1 text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
          Type
        </div>
        <div className="flex-1 text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
          Asset
        </div>
        <div className="flex-1 text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
          Qty
        </div>
        <div className="flex-1 text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
          Price
        </div>
        <div className="flex-1 text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
          Order Type
        </div>
        <div className="flex-1 text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
          SL
        </div>
        <div className="flex-1 text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
          TP
        </div>
        <div className="w-[80px] text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
          Reason
        </div>
      </div>

      {/* Table Rows */}
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index}>
          <div className="flex items-center px-4 py-4">
            <div className="w-[72px] text-white text-sm font-normal font-nunito">
              12:34
            </div>
            <div className="w-[248px] text-white text-sm font-normal font-nunito">
              Crypto Momentum
            </div>
            <div className="flex-1 text-white text-sm font-normal font-nunito">
              Purchase
            </div>
            <div className="flex-1 text-white text-sm font-normal font-nunito">
              BTC
            </div>
            <div className="flex-1 text-white text-sm font-normal font-nunito">
              2.50
            </div>
            <div className="flex-1 text-white text-sm font-normal font-nunito">
              62,550.00
            </div>
            <div className="flex-1 text-white text-sm font-normal font-nunito">
              Market
            </div>
            <div className="flex-1 text-white text-sm font-normal font-nunito">
              62,550
            </div>
            <div className="flex-1 text-white text-sm font-normal font-nunito">
              62,550
            </div>
            <div className="w-[80px] text-white text-sm font-normal font-nunito">
              Crossover
            </div>
          </div>
          {index < 7 && <div className="h-px bg-tyrian-gray-darker"></div>}
        </div>
      ))}

      {/* Table Footer */}
      <div className="flex justify-between items-center px-4 py-3 border-t border-tyrian-gray-darker">
        <span className="text-white text-xs font-bold font-nunito uppercase">
          Total:
        </span>
        <span className="text-white text-xs font-bold font-nunito uppercase">
          8 signals - total volume: $10,000,000.00
        </span>
      </div>
    </div>
  </div>
);

// Sample data
const tradingSignals: Signal[] = [
  {
    time: "12:34",
    author: "Sarah Lee",
    portfolio: "Crypto Momentum",
    action: "Bought 2.50",
    amount: "2.50",
    asset: "BTC",
    price: "62 550",
    orderType: "Market",
    sl: "57 900",
    tp: "70 000",
    leverage: "1x",
    performance: "+3.2%",
    performanceColor: "text-green-500",
    borderColor: "bg-green-500",
    avatar: "",
  },
  {
    time: "11:15",
    author: "Alex Wong",
    portfolio: "Blue Chips",
    action: "Sold 150",
    amount: "150",
    asset: "ETH",
    price: "3 120",
    orderType: "Market",
    sl: "3 350",
    tp: "2 800",
    leverage: "2x",
    performance: "-1.8%",
    performanceColor: "text-red-500",
    borderColor: "bg-red-500",
    avatar: "",
  },
  // Add more signals as needed
];

const yesterdaySignals: Signal[] = [
  {
    time: "14:22",
    author: "Sarah Lee",
    portfolio: "Crypto Momentum",
    action: "Bought 1.75",
    amount: "1.75",
    asset: "BTC",
    price: "61 200",
    orderType: "Market",
    sl: "56 500",
    tp: "68 000",
    leverage: "1x",
    performance: "+2.1%",
    performanceColor: "text-green-500",
    borderColor: "bg-green-500",
    avatar: "",
  },
  // Add more yesterday signals as needed
];

export default SignalsView;
