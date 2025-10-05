import React, { useState, useMemo, useRef } from "react";
import {
  Search,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  RefreshCw,
} from "lucide-react";
import { useMarketAssets, useTriggerSync } from "@/hooks/use-market-assets";
import { useVirtualizer } from "@tanstack/react-virtual";
import { MarketAsset } from "@shared/api";
import PersistentNav from "@/components/PersistentNav";

const Quotes: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("cryptocurrency");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<
    "rank" | "price" | "volume" | "marketCap" | "change24h" | "name"
  >("rank");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const parentRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError, refetch } = useMarketAssets({
    category: activeTab,
    search: searchQuery,
    page: currentPage,
    limit: 100,
    sortBy,
    sortOrder,
  });

  const triggerSync = useTriggerSync();

  const tabs = [
    { id: "stock", label: "Stocks" },
    { id: "etf", label: "Mutual Funds / ETFs" },
    { id: "bond", label: "Bonds" },
    { id: "cryptocurrency", label: "Cryptocurrencies" },
    { id: "currency", label: "Currencies" },
    { id: "index", label: "Indices" },
  ];

  const items = data?.items || [];
  const pagination = data?.pagination;

  // Virtualization setup
  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56, // 56px row height
    overscan: 10,
  });

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const formatNumber = (
    num?: number | string | null,
    decimals: number = 2,
  ): string => {
    if (num === null || num === undefined) return "N/A";

    // Convert string to number
    const value = typeof num === "string" ? parseFloat(num) : num;
    if (isNaN(value)) return "N/A";

    if (value >= 1e9) return `$${(value / 1e9).toFixed(decimals)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(decimals)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(decimals)}K`;
    return `$${value.toFixed(decimals)}`;
  };

  const formatPrice = (price?: number | string | null): string => {
    if (price === null || price === undefined) return "N/A";

    // Convert string to number
    const value = typeof price === "string" ? parseFloat(price) : price;
    if (isNaN(value)) return "N/A";

    if (value < 1) {
      return `$${value.toFixed(6)}`;
    }
    return `$${value.toFixed(2)}`;
  };

  const formatPercent = (percent?: number | string | null): string => {
    if (percent === null || percent === undefined) return "N/A";

    // Convert string to number
    const value = typeof percent === "string" ? parseFloat(percent) : percent;
    if (isNaN(value)) return "N/A";

    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleSyncNow = () => {
    triggerSync.mutate("coingecko");
  };

  return (
    <div className="w-full min-h-screen p-6 space-y-6">
      {/* Persistent Navigation */}
      <PersistentNav />

      {/* Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-white text-2xl font-bold font-nunito">
          Market Assets
        </h1>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-tyrian-gray-darker glass-card text-white hover:bg-tyrian-purple-dark/30 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
          <button
            onClick={handleSyncNow}
            disabled={triggerSync.isPending}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-tyrian-gradient text-white hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${triggerSync.isPending ? "animate-spin" : ""}`}
            />
            Sync Now
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="inline-flex p-1 items-center gap-3 rounded-[36px] border border-tyrian-gray-darker bg-tyrian-black/50 backdrop-blur-[50px] overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setCurrentPage(1);
            }}
            className={`flex items-center px-4 py-3 rounded-[32px] font-bold font-nunito text-[19px] whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-tyrian-gradient text-white"
                : "border border-tyrian-gray-darker glass-card text-tyrian-gray-medium hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row p-6 gap-4 rounded-lg border border-tyrian-gray-darker bg-tyrian-black/50 backdrop-blur-[50px]">
        {/* Search */}
        <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-lg border border-tyrian-gray-darker glass-card">
          <Search className="w-6 h-6 text-tyrian-gray-medium" />
          <input
            type="text"
            placeholder="Search by name or symbol..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 bg-transparent text-white text-[15px] font-medium font-nunito outline-none placeholder:text-tyrian-gray-medium"
          />
        </div>

        {/* Results info */}
        {pagination && (
          <div className="flex items-center px-4 text-tyrian-gray-medium text-sm font-nunito">
            Showing {(currentPage - 1) * pagination.limit + 1}-
            {Math.min(currentPage * pagination.limit, pagination.total)} of{" "}
            {pagination.total}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="w-full rounded-xl border border-tyrian-gray-darker bg-tyrian-black/50 backdrop-blur-[50px] overflow-hidden">
        {/* Table Header */}
        <div className="flex px-4 py-3 items-center gap-2 border-b border-tyrian-gray-darker bg-tyrian-black/80 sticky top-0 z-10">
          <div className="flex items-center w-16 gap-1">
            <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
              #
            </span>
          </div>
          <div
            className="flex items-center w-64 gap-1 cursor-pointer"
            onClick={() => handleSort("name")}
          >
            <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
              Name
            </span>
            {sortBy === "name" && (
              <ChevronDown
                className={`w-4 h-4 text-white transition-transform ${sortOrder === "desc" ? "rotate-180" : ""}`}
              />
            )}
          </div>
          <div
            className="flex items-center flex-1 gap-1 cursor-pointer"
            onClick={() => handleSort("price")}
          >
            <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
              Price
            </span>
            {sortBy === "price" && (
              <ChevronDown
                className={`w-4 h-4 text-white transition-transform ${sortOrder === "desc" ? "rotate-180" : ""}`}
              />
            )}
          </div>
          <div
            className="flex items-center flex-1 gap-1 cursor-pointer"
            onClick={() => handleSort("change24h")}
          >
            <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
              24h Change
            </span>
            {sortBy === "change24h" && (
              <ChevronDown
                className={`w-4 h-4 text-white transition-transform ${sortOrder === "desc" ? "rotate-180" : ""}`}
              />
            )}
          </div>
          <div
            className="flex items-center flex-1 gap-1 cursor-pointer"
            onClick={() => handleSort("marketCap")}
          >
            <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
              Market Cap
            </span>
            {sortBy === "marketCap" && (
              <ChevronDown
                className={`w-4 h-4 text-white transition-transform ${sortOrder === "desc" ? "rotate-180" : ""}`}
              />
            )}
          </div>
          <div
            className="flex items-center flex-1 gap-1 cursor-pointer"
            onClick={() => handleSort("volume")}
          >
            <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
              Volume (24h)
            </span>
            {sortBy === "volume" && (
              <ChevronDown
                className={`w-4 h-4 text-white transition-transform ${sortOrder === "desc" ? "rotate-180" : ""}`}
              />
            )}
          </div>
        </div>

        {/* Table Body with Virtualization */}
        <div
          ref={parentRef}
          className="h-[600px] overflow-auto custom-scrollbar"
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <RefreshCw className="w-8 h-8 text-tyrian-purple animate-spin" />
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-tyrian-red">
                Failed to load market assets. Please try again.
              </p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-tyrian-gray-medium">No assets found.</p>
            </div>
          ) : (
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: "100%",
                position: "relative",
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const asset = items[virtualRow.index];
                return (
                  <div
                    key={virtualRow.key}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    className="flex h-14 px-4 items-center gap-2 border-b border-tyrian-gray-darker hover:bg-tyrian-purple-dark/30 transition-colors"
                  >
                    {/* Rank */}
                    <div className="w-16">
                      <span className="text-tyrian-gray-medium text-xs font-bold font-nunito">
                        {asset.rank || "-"}
                      </span>
                    </div>

                    {/* Name & Symbol */}
                    <div className="flex items-center gap-2 w-64">
                      {asset.logoUrl ? (
                        <img
                          src={asset.logoUrl}
                          alt={asset.name}
                          className="w-8 h-8 rounded-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/placeholder.svg";
                          }}
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-tyrian-gray-medium" />
                      )}
                      <div className="flex flex-col">
                        <span className="text-white text-xs font-bold font-nunito">
                          {asset.name}
                        </span>
                        <span className="text-tyrian-purple text-[10px] font-bold font-nunito uppercase">
                          {asset.symbol}
                        </span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex-1">
                      <span className="text-white text-xs font-bold font-nunito">
                        {formatPrice(asset.currentPrice)}
                      </span>
                    </div>

                    {/* 24h Change */}
                    <div className="flex-1">
                      <span
                        className={`text-xs font-bold font-nunito ${
                          (asset.priceChange24h || 0) >= 0
                            ? "text-green-500"
                            : "text-tyrian-red"
                        }`}
                      >
                        {formatPercent(asset.priceChange24h)}
                      </span>
                    </div>

                    {/* Market Cap */}
                    <div className="flex-1">
                      <span className="text-white text-xs font-bold font-nunito">
                        {formatNumber(asset.marketCap)}
                      </span>
                    </div>

                    {/* Volume */}
                    <div className="flex-1">
                      <span className="text-white text-xs font-bold font-nunito">
                        {formatNumber(asset.volume24h)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-1">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="w-11 h-11 flex items-center justify-center rounded border border-tyrian-gray-darker glass-card hover:bg-tyrian-purple-dark/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronsLeft className="w-5 h-5 text-tyrian-gray-medium" />
          </button>
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="w-11 h-11 flex items-center justify-center rounded border border-tyrian-gray-darker glass-card hover:bg-tyrian-purple-dark/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5 text-tyrian-gray-medium" />
          </button>

          {/* Page numbers */}
          {Array.from(
            { length: Math.min(5, pagination.totalPages) },
            (_, i) => {
              let pageNum;
              if (pagination.totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-11 h-11 flex items-center justify-center rounded transition-colors ${
                    currentPage === pageNum
                      ? "bg-tyrian-gradient text-white"
                      : "border border-tyrian-gray-darker glass-card text-tyrian-gray-medium hover:bg-tyrian-purple-dark/30"
                  }`}
                >
                  <span className="text-[15px] font-bold font-nunito">
                    {pageNum}
                  </span>
                </button>
              );
            },
          )}

          <button
            onClick={() =>
              setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))
            }
            disabled={currentPage === pagination.totalPages}
            className="w-11 h-11 flex items-center justify-center rounded border border-tyrian-gray-darker glass-card hover:bg-tyrian-purple-dark/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5 text-tyrian-gray-medium" />
          </button>
          <button
            onClick={() => setCurrentPage(pagination.totalPages)}
            disabled={currentPage === pagination.totalPages}
            className="w-11 h-11 flex items-center justify-center rounded border border-tyrian-gray-darker glass-card hover:bg-tyrian-purple-dark/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronsRight className="w-5 h-5 text-tyrian-gray-medium" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Quotes;
