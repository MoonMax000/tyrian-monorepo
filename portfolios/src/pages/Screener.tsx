import React, { useMemo, useRef, useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
  Star,
} from "lucide-react";
import { useVirtualizer } from "@tanstack/react-virtual";
import PersistentNav from "@/components/PersistentNav";
import { useMarketAssets } from "@/hooks/use-market-assets";
import { useAssets } from "@/hooks/use-assets";
import { useUser } from "@/hooks/use-user";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { MarketAsset } from "@shared/api";

const CATEGORY_TABS: {
  id: string;
  label: string;
  category?: MarketAsset["category"];
  disabled?: boolean;
}[] = [
  { id: "stock", label: "Stocks", category: "stock" },
  { id: "etf", label: "Mutual Funds / ETFs", category: "etf" },
  { id: "bond", label: "Bonds", category: "bond" },
  {
    id: "cryptocurrency",
    label: "Cryptocurrencies",
    category: "cryptocurrency",
  },
  { id: "currency", label: "Currencies", category: "currency" },
  { id: "index", label: "Indices", category: "index" },
  { id: "custom", label: "Custom Assets" },
  { id: "other", label: "Other Assets" },
];

const COUNTRY_CODE_MAP: Record<string, string> = {
  US: "United States",
  HK: "Hong Kong",
  GB: "United Kingdom",
  DE: "Germany",
  FR: "France",
  CA: "Canada",
  JP: "Japan",
  SG: "Singapore",
  AU: "Australia",
  CN: "China",
  IN: "India",
};

const SECTOR_LABELS: Record<MarketAsset["category"], string> = {
  stock: "Equities",
  bond: "Fixed Income",
  etf: "Funds",
  cryptocurrency: "Digital Assets",
  currency: "FX",
  index: "Benchmarks",
};

type SortableColumn = "name" | "price" | "change24h" | "marketCap" | "volume";

type Option = {
  label: string;
  value: string;
};

interface FilterControlsProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onGoToFirstPage: () => void;
  onGoToPreviousPage: () => void;
  onGoToNextPage: () => void;
  onGoToLastPage: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
  exchangeOptions: Option[];
  currencyOptions: Option[];
  countryOptions: Option[];
  sectorOptions: Option[];
  selectedExchange: string;
  selectedCurrency: string;
  selectedCountry: string;
  selectedSector: string;
  onExchangeChange: (value: string) => void;
  onCurrencyChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  onSectorChange: (value: string) => void;
  showOnlyFavorites: boolean;
  onToggleFavorites: () => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  searchValue,
  onSearchChange,
  onGoToFirstPage,
  onGoToPreviousPage,
  onGoToNextPage,
  onGoToLastPage,
  canGoPrev,
  canGoNext,
  exchangeOptions,
  currencyOptions,
  countryOptions,
  sectorOptions,
  selectedExchange,
  selectedCurrency,
  selectedCountry,
  selectedSector,
  onExchangeChange,
  onCurrencyChange,
  onCountryChange,
  onSectorChange,
  showOnlyFavorites,
  onToggleFavorites,
}) => {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-tyrian-gray-darker bg-tyrian-black/50 backdrop-blur-[50px] p-6">
      <div className="flex items-center gap-4">
        <div className="flex flex-1 items-center gap-2 px-2 py-2.5 rounded-lg border border-tyrian-gray-darker glass-card">
          <Search className="w-6 h-6 text-tyrian-gray-medium flex-shrink-0" />
          <input
            type="text"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search"
            className="w-full bg-transparent text-tyrian-gray-medium text-[15px] font-medium font-nunito outline-none placeholder:text-tyrian-gray-medium"
          />
        </div>
        <div className="flex items-center gap-0">
          <button
            onClick={onGoToPreviousPage}
            disabled={!canGoPrev}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-tyrian-gray-darker bg-tyrian-black/50 backdrop-blur-[50px] hover:bg-tyrian-purple-dark/30 transition disabled:opacity-40"
            aria-label="Previous"
          >
            <ChevronLeft
              className={`w-4 h-4 ${!canGoPrev ? "text-tyrian-purple-dark/60" : "text-tyrian-purple"}`}
            />
          </button>
          <button
            onClick={onGoToNextPage}
            disabled={!canGoNext}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-tyrian-gray-darker bg-tyrian-black/50 backdrop-blur-[50px] hover:bg-tyrian-purple-dark/30 transition disabled:opacity-40"
            aria-label="Next"
          >
            <ChevronRight
              className={`w-4 h-4 ${!canGoNext ? "text-tyrian-purple-dark/60" : "text-tyrian-purple"}`}
            />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <FilterSelect
          label="Exchange"
          value={selectedExchange}
          options={exchangeOptions}
          onValueChange={onExchangeChange}
        />
        <FilterSelect
          label="Currency"
          value={selectedCurrency}
          options={currencyOptions}
          onValueChange={onCurrencyChange}
        />
        <FilterSelect
          label="Country"
          value={selectedCountry}
          options={countryOptions}
          onValueChange={onCountryChange}
        />
        <FilterSelect
          label="Sector"
          value={selectedSector}
          options={sectorOptions}
          onValueChange={onSectorChange}
        />
        <div className="flex items-center gap-2 flex-1">
          <div
            onClick={onToggleFavorites}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onToggleFavorites();
              }
            }}
            className={`relative inline-flex h-5 w-[38px] p-0.5 items-center rounded-full cursor-pointer transition-colors ${showOnlyFavorites ? "bg-tyrian-purple" : "bg-tyrian-gray-darker"}`}
          >
            <span
              className={`h-4 w-4 rounded-full bg-white transition-transform ${showOnlyFavorites ? "translate-x-[18px]" : "translate-x-0"}`}
            />
          </div>
          <span className="text-white text-[15px] font-bold font-nunito">
            My Assets
          </span>
        </div>
      </div>
    </div>
  );
};

interface FilterSelectProps {
  label: string;
  value: string;
  options: Option[];
  onValueChange: (value: string) => void;
}

const FilterSelect: React.FC<FilterSelectProps> = ({
  label,
  value,
  options,
  onValueChange,
}) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[144px] h-8 rounded-lg border border-tyrian-gray-darker glass-card bg-transparent px-2 text-white text-[15px] font-bold font-nunito justify-between">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent className="border border-tyrian-gray-darker bg-tyrian-black/80 backdrop-blur-[40px]">
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="text-[15px] font-bold"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

interface ScreenerTableProps {
  assets: MarketAsset[];
  favorites: Set<string>;
  showOnlyFavorites: boolean;
  isLoading: boolean;
  isError: boolean;
  sortBy: SortableColumn;
  sortOrder: "asc" | "desc";
  onSort: (column: SortableColumn) => void;
}

const ScreenerTable: React.FC<ScreenerTableProps> = ({
  assets,
  favorites,
  showOnlyFavorites,
  isLoading,
  isError,
  sortBy,
  sortOrder,
  onSort,
}) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: assets.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64,
    overscan: 12,
  });

  const renderSortIndicator = (column: SortableColumn) => {
    if (sortBy !== column) {
      return null;
    }
    return (
      <ChevronRight
        className={`w-3.5 h-3.5 text-white transition-transform ${sortOrder === "desc" ? "rotate-90" : "-rotate-90"}`}
      />
    );
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[1200px] rounded-2xl border border-tyrian-gray-darker bg-tyrian-black/60 backdrop-blur-[50px]">
        <div className="grid grid-cols-[140px,260px,120px,120px,90px,110px,140px,140px,150px,150px,60px] px-6 py-4 items-center gap-4 border-b border-tyrian-gray-darker bg-tyrian-black/70 sticky top-0 z-10">
          <TableHeaderCell> TICKER </TableHeaderCell>
          <TableHeaderCell> COMPANY </TableHeaderCell>
          <TableHeaderCell sortable onClick={() => onSort("price")}>
            {" "}
            PRICE {renderSortIndicator("price")}{" "}
          </TableHeaderCell>
          <TableHeaderCell sortable onClick={() => onSort("change24h")}>
            {" "}
            CHANGE {renderSortIndicator("change24h")}{" "}
          </TableHeaderCell>
          <TableHeaderCell> LOT SIZE </TableHeaderCell>
          <TableHeaderCell> CURRENCY </TableHeaderCell>
          <TableHeaderCell> SECTOR </TableHeaderCell>
          <TableHeaderCell sortable onClick={() => onSort("marketCap")}>
            {" "}
            RATING {renderSortIndicator("marketCap")}{" "}
          </TableHeaderCell>
          <TableHeaderCell sortable onClick={() => onSort("volume")}>
            {" "}
            EXCHANGE, % {renderSortIndicator("volume")}{" "}
          </TableHeaderCell>
          <TableHeaderCell sortable onClick={() => onSort("name")}>
            {" "}
            ISSUER PROFILE {renderSortIndicator("name")}{" "}
          </TableHeaderCell>
          <TableHeaderCell> </TableHeaderCell>
        </div>

        <div
          ref={parentRef}
          className="max-h-[640px] overflow-auto custom-scrollbar"
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-[320px]">
              <div className="w-8 h-8 border-2 border-tyrian-purple border-t-transparent rounded-full animate-spin" />
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center h-[320px]">
              <p className="text-tyrian-red text-sm font-nunito">
                Failed to load screener data. Please try again shortly.
              </p>
            </div>
          ) : assets.length === 0 ? (
            <div className="flex items-center justify-center h-[320px]">
              <p className="text-tyrian-gray-medium text-sm font-nunito">
                {showOnlyFavorites
                  ? "You have no assets matching the current filters."
                  : "No assets match the selected filters."}
              </p>
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
                const asset = assets[virtualRow.index];
                const isFavorite = favorites.has(asset.symbol.toUpperCase());
                const lotSize = computeLotSize(asset);
                const sector = getSector(asset);
                const rating = computeRating(asset);
                const exchangeLabel = getExchangeLabel(asset.dataSource);
                const exchangePerformance =
                  asset.priceChange7d ?? asset.priceChange24h ?? null;
                const country = deriveCountry(asset.symbol);

                return (
                  <div
                    key={asset.id ?? `${asset.symbol}-${virtualRow.index}`}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    className={`grid grid-cols-[140px,260px,120px,120px,90px,110px,140px,140px,150px,150px,60px] items-center gap-4 px-6 border-b border-tyrian-gray-darker transition-colors ${
                      isFavorite
                        ? "bg-tyrian-purple-dark/20"
                        : "hover:bg-tyrian-purple-dark/20"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-tyrian-purple/30 bg-tyrian-purple-dark/20 text-tyrian-purple text-xs font-bold font-nunito uppercase">
                        {asset.symbol.slice(0, 2)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-tyrian-purple text-xs font-bold font-nunito uppercase">
                          {asset.symbol}
                        </span>
                        <span className="text-tyrian-gray-medium text-[11px] font-semibold font-nunito">
                          {country}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-white text-xs font-bold font-nunito truncate">
                        {asset.name}
                      </span>
                      <span className="text-tyrian-gray-medium text-[11px] font-semibold font-nunito">
                        {exchangeLabel}
                      </span>
                    </div>

                    <div className="text-white text-xs font-bold font-nunito">
                      {formatPrice(asset.currentPrice, asset.priceCurrency)}
                    </div>

                    <div
                      className={`text-xs font-bold font-nunito ${
                        (asset.priceChange24h ?? 0) >= 0
                          ? "text-green-500"
                          : "text-tyrian-red"
                      }`}
                    >
                      {formatPercent(asset.priceChange24h)}
                    </div>

                    <div className="text-white text-xs font-bold font-nunito">
                      {lotSize}
                    </div>

                    <div className="text-white text-xs font-bold font-nunito">
                      {asset.priceCurrency.toUpperCase()}
                    </div>

                    <div className="text-white text-xs font-bold font-nunito">
                      {sector}
                    </div>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className={`w-4 h-4 ${index < rating ? "text-tyrian-purple" : "text-tyrian-gray-darker"}`}
                          fill={index < rating ? "currentColor" : "none"}
                        />
                      ))}
                    </div>

                    <div
                      className={`text-xs font-bold font-nunito ${
                        (exchangePerformance ?? 0) >= 0
                          ? "text-green-500"
                          : "text-tyrian-red"
                      }`}
                    >
                      {formatPercent(exchangePerformance)}
                    </div>

                    <div className="flex flex-col">
                      <span className="text-white text-xs font-bold font-nunito">
                        {exchangeLabel}
                      </span>
                      <span className="text-tyrian-gray-medium text-[11px] font-semibold font-nunito">
                        Updated {formatRelativeTime(asset.lastUpdated)}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="flex items-center justify-center w-9 h-9 rounded-full border border-tyrian-gray-darker glass-card hover:bg-tyrian-purple-dark/30 transition"
                      aria-label="Asset actions"
                    >
                      <MoreHorizontal className="w-4 h-4 text-white" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TableHeaderCell: React.FC<{
  sortable?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}> = ({ sortable = false, onClick, children }) => {
  if (sortable) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex items-center gap-1 text-tyrian-gray-medium text-[11px] font-bold font-nunito uppercase tracking-wide"
      >
        {children}
      </button>
    );
  }
  return (
    <span className="text-tyrian-gray-medium text-[11px] font-bold font-nunito uppercase tracking-wide">
      {children}
    </span>
  );
};

const Screener: React.FC = () => {
  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    CATEGORY_TABS[0].id,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortableColumn>("price");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedExchange, setSelectedExchange] = useState("all");
  const [selectedCurrency, setSelectedCurrency] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedSector, setSelectedSector] = useState("all");
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const { userId } = useUser();
  const { data: userAssetsData } = useAssets(userId ?? null);

  const activeCategory = CATEGORY_TABS.find(
    (tab) => tab.id === activeCategoryId,
  );
  const { data, isLoading, isError } = useMarketAssets({
    category: activeCategory?.category,
    search: searchTerm || undefined,
    page: currentPage,
    limit: 100,
    sortBy,
    sortOrder,
  });

  const marketAssets = data?.items ?? [];
  const pagination = data?.pagination;

  const favoriteSymbols = useMemo(() => {
    if (!userAssetsData?.items) {
      return new Set<string>();
    }
    return new Set(
      userAssetsData.items
        .map((asset) => asset.code?.toUpperCase())
        .filter((code): code is string => Boolean(code)),
    );
  }, [userAssetsData?.items]);

  const exchangeOptions = useMemo<Option[]>(() => {
    const set = new Set<string>();
    marketAssets.forEach((asset) => {
      if (asset.dataSource) {
        set.add(asset.dataSource);
      }
    });
    const options = Array.from(set)
      .sort()
      .map((source) => ({ label: getExchangeLabel(source), value: source }));
    return [{ label: "All Exchanges", value: "all" }, ...options];
  }, [marketAssets]);

  const currencyOptions = useMemo<Option[]>(() => {
    const set = new Set<string>();
    marketAssets.forEach((asset) => {
      if (asset.priceCurrency) {
        set.add(asset.priceCurrency.toUpperCase());
      }
    });
    const options = Array.from(set)
      .sort()
      .map((currency) => ({ label: currency, value: currency }));
    return [{ label: "All Currencies", value: "all" }, ...options];
  }, [marketAssets]);

  const countryOptions = useMemo<Option[]>(() => {
    const set = new Set<string>();
    marketAssets.forEach((asset) => {
      set.add(deriveCountry(asset.symbol));
    });
    const options = Array.from(set)
      .sort()
      .map((country) => ({ label: country, value: country }));
    return [{ label: "All Countries", value: "all" }, ...options];
  }, [marketAssets]);

  const sectorOptions = useMemo<Option[]>(() => {
    const set = new Set<string>();
    marketAssets.forEach((asset) => {
      set.add(getSector(asset));
    });
    const options = Array.from(set)
      .sort()
      .map((sector) => ({ label: sector, value: sector }));
    return [{ label: "All Sectors", value: "all" }, ...options];
  }, [marketAssets]);

  const filteredAssets = useMemo(() => {
    return marketAssets.filter((asset) => {
      if (selectedExchange !== "all" && asset.dataSource !== selectedExchange) {
        return false;
      }
      if (
        selectedCurrency !== "all" &&
        asset.priceCurrency.toUpperCase() !== selectedCurrency
      ) {
        return false;
      }
      if (
        selectedCountry !== "all" &&
        deriveCountry(asset.symbol) !== selectedCountry
      ) {
        return false;
      }
      if (selectedSector !== "all" && getSector(asset) !== selectedSector) {
        return false;
      }
      if (
        showOnlyFavorites &&
        !favoriteSymbols.has(asset.symbol.toUpperCase())
      ) {
        return false;
      }
      return true;
    });
  }, [
    marketAssets,
    selectedExchange,
    selectedCurrency,
    selectedCountry,
    selectedSector,
    showOnlyFavorites,
    favoriteSymbols,
  ]);

  const totalPages = pagination?.totalPages ?? 1;
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const handleSort = (column: SortableColumn) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const goToPage = (page: number) => {
    if (!pagination) {
      setCurrentPage(Math.max(1, page));
      return;
    }
    const nextPage = Math.min(Math.max(page, 1), pagination.totalPages);
    setCurrentPage(nextPage);
  };

  const visiblePages = useMemo(() => {
    const pages: number[] = [];
    const maxButtons = 5;
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + maxButtons - 1);
    for (let page = start; page <= end; page += 1) {
      pages.push(page);
    }
    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="w-full min-h-screen p-6 space-y-6">
      <PersistentNav />

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-white text-2xl sm:text-3xl font-bold font-nunito">
            Screener
          </h1>
          <p className="text-tyrian-gray-medium text-sm font-nunito">
            Track performance across global markets with real-time analytics.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 p-1 rounded-[36px] border border-tyrian-gray-darker glass-card overflow-x-auto scrollbar-hide">
        {CATEGORY_TABS.map((tab) => {
          const isActive = activeCategoryId === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.disabled) {
                  return;
                }
                setActiveCategoryId(tab.id);
                setCurrentPage(1);
              }}
              className={`flex items-center px-4 py-3 rounded-[32px] text-[15px] font-bold font-nunito whitespace-nowrap transition ${
                isActive
                  ? "bg-tyrian-gradient text-white"
                  : "border border-tyrian-gray-darker glass-card text-tyrian-gray-medium hover:text-white"
              } ${tab.disabled ? "opacity-60 cursor-not-allowed" : ""}`}
              disabled={tab.disabled}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <FilterControls
        searchValue={searchTerm}
        onSearchChange={(value) => {
          setSearchTerm(value);
          setCurrentPage(1);
        }}
        onGoToFirstPage={() => goToPage(1)}
        onGoToPreviousPage={() => goToPage(currentPage - 1)}
        onGoToNextPage={() => goToPage(currentPage + 1)}
        onGoToLastPage={() => goToPage(totalPages)}
        canGoPrev={canGoPrev}
        canGoNext={canGoNext}
        exchangeOptions={exchangeOptions}
        currencyOptions={currencyOptions}
        countryOptions={countryOptions}
        sectorOptions={sectorOptions}
        selectedExchange={selectedExchange}
        selectedCurrency={selectedCurrency}
        selectedCountry={selectedCountry}
        selectedSector={selectedSector}
        onExchangeChange={(value) => {
          setSelectedExchange(value);
          setCurrentPage(1);
        }}
        onCurrencyChange={(value) => {
          setSelectedCurrency(value);
          setCurrentPage(1);
        }}
        onCountryChange={(value) => {
          setSelectedCountry(value);
          setCurrentPage(1);
        }}
        onSectorChange={(value) => {
          setSelectedSector(value);
          setCurrentPage(1);
        }}
        showOnlyFavorites={showOnlyFavorites}
        onToggleFavorites={() => setShowOnlyFavorites((prev) => !prev)}
      />

      <ScreenerTable
        assets={filteredAssets}
        favorites={favoriteSymbols}
        showOnlyFavorites={showOnlyFavorites}
        isLoading={isLoading}
        isError={isError}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
      />

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-1">
          <button
            onClick={() => goToPage(1)}
            disabled={!canGoPrev}
            className="w-11 h-11 flex items-center justify-center rounded border border-tyrian-gray-darker glass-card hover:bg-tyrian-purple-dark/30 transition disabled:opacity-40"
            aria-label="First page"
          >
            <ChevronsLeft className="w-5 h-5 text-tyrian-gray-medium" />
          </button>
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={!canGoPrev}
            className="w-11 h-11 flex items-center justify-center rounded border border-tyrian-gray-darker glass-card hover:bg-tyrian-purple-dark/30 transition disabled:opacity-40"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-5 h-5 text-tyrian-gray-medium" />
          </button>
          {visiblePages.map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`w-11 h-11 flex items-center justify-center rounded border border-tyrian-gray-darker transition font-bold font-nunito ${
                page === currentPage
                  ? "bg-tyrian-gradient text-white"
                  : "glass-card text-tyrian-gray-medium hover:bg-tyrian-purple-dark/30"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={!canGoNext}
            className="w-11 h-11 flex items-center justify-center rounded border border-tyrian-gray-darker glass-card hover:bg-tyrian-purple-dark/30 transition disabled:opacity-40"
            aria-label="Next page"
          >
            <ChevronRight className="w-5 h-5 text-tyrian-gray-medium" />
          </button>
          <button
            onClick={() => goToPage(totalPages)}
            disabled={!canGoNext}
            className="w-11 h-11 flex items-center justify-center rounded border border-tyrian-gray-darker glass-card hover:bg-tyrian-purple-dark/30 transition disabled:opacity-40"
            aria-label="Last page"
          >
            <ChevronsRight className="w-5 h-5 text-tyrian-gray-medium" />
          </button>
        </div>
      )}
    </div>
  );
};

function formatPrice(value?: number | null, currency?: string): string {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return "N/A";
  }
  const formatted = value < 1 ? value.toFixed(6) : value.toFixed(2);
  return `${formatted}${currency ? ` ${currency.toUpperCase()}` : ""}`;
}

function formatPercent(value?: number | null): string {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return "N/A";
  }
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function computeLotSize(asset: MarketAsset): number {
  if (asset.marketCap && asset.currentPrice && asset.currentPrice > 0) {
    const theoreticalLot = Math.max(
      Math.floor(asset.marketCap / asset.currentPrice / 1e6),
      1,
    );
    return theoreticalLot;
  }
  return 1;
}

function computeRating(asset: MarketAsset): number {
  const marketCapScore = asset.marketCap ? Math.log10(asset.marketCap + 1) : 0;
  const volumeScore = asset.volume24h ? Math.log10(asset.volume24h + 1) : 0;
  const momentumScore = Math.abs(asset.priceChange24h ?? 0) / 10;
  const combined =
    marketCapScore * 0.6 + volumeScore * 0.3 + momentumScore * 0.1;
  if (combined >= 9) return 5;
  if (combined >= 7) return 4;
  if (combined >= 5) return 3;
  if (combined >= 3) return 2;
  return 1;
}

function deriveCountry(symbol: string): string {
  if (!symbol.includes(".")) {
    return "International";
  }
  const code = symbol.split(".").pop()?.toUpperCase() ?? "";
  return COUNTRY_CODE_MAP[code] ?? "International";
}

function getSector(asset: MarketAsset): string {
  return SECTOR_LABELS[asset.category] ?? "Diversified";
}

function getExchangeLabel(source?: string | null): string {
  if (!source) {
    return "Global";
  }
  switch (source.toLowerCase()) {
    case "coingecko":
      return "CoinGecko";
    case "alphavantage":
      return "Alpha Vantage";
    case "twelve_data":
      return "Twelve Data";
    default:
      return source
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
  }
}

function formatRelativeTime(timestamp: string | undefined): string {
  if (!timestamp) {
    return "recently";
  }
  const updatedAt = new Date(timestamp);
  const timestampMs = updatedAt.getTime();
  if (Number.isNaN(timestampMs)) {
    return "recently";
  }
  const diff = Date.now() - timestampMs;
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default Screener;
