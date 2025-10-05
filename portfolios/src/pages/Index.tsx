import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PersistentNav from "../components/PersistentNav";
import Breadcrumbs from "../components/Breadcrumbs";
import AddPortfolioModal from "../components/AddPortfolioModal";
import { useUser } from "../hooks/use-user";
import { usePortfolios, useDeletePortfolio } from "../hooks/use-portfolios";
import { usePortfolioContext } from "../contexts/PortfolioContext";
import {
  Search,
  ChevronDown,
  Plus,
  MoreHorizontal,
  Menu,
  Table as TableIcon,
  LayoutGrid,
} from "lucide-react";

const Index: React.FC = () => {
  const [mobileActionsOpen, setMobileActionsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"free" | "paid">("free");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Default");
  const [addPortfolioModalOpen, setAddPortfolioModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"cards" | "table">(() =>
    typeof window !== "undefined" &&
    localStorage.getItem("portfolioViewMode") === "table"
      ? "table"
      : "cards",
  );
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { userId, loading: userLoading } = useUser();
  const { data: investmentsData, isLoading: portfoliosLoading } = usePortfolios(
    userId,
    "investments",
  );
  const deletePortfolio = useDeletePortfolio();
  const { setCurrentPortfolioId } = usePortfolioContext();

  const handleCardClick = (cardTitle: string, portfolioId?: string) => {
    if (portfolioId) {
      setCurrentPortfolioId(portfolioId);
      navigate(`/portfolio/${portfolioId}`);
    } else {
      const generatedId = cardTitle
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      navigate(`/portfolio/${generatedId}`);
    }
  };

  const sortOptions = [
    "Alphabetical",
    "Creation Date",
    "By Integration",
    "Default",
  ];

  const handleSortSelect = (option: string) => {
    setSelectedSort(option);
    setSortDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node)
      ) {
        setSortDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("portfolioViewMode", viewMode);
    }
  }, [viewMode]);

  const freeRows = useMemo(() => {
    const rows: {
      id?: string;
      name: string;
      currency: string;
      accountType: string;
      openingDate?: string;
    }[] = [];
    rows.push({
      name: "All assets",
      currency: "USD",
      accountType: "All Assets",
    });
    rows.push({
      name: "MetaMask - main portfolio",
      currency: "EUR",
      accountType: "Composite",
    });
    rows.push({
      name: "Binance",
      currency: "USD",
      accountType: "Cryptowallet",
    });
    rows.push({
      name: "MetaMask - BSC",
      currency: "USD",
      accountType: "Cryptowallet",
    });
    rows.push({
      name: "MetaMask - Ethereum",
      currency: "USD",
      accountType: "Cryptowallet",
    });
    investmentsData?.items.forEach((p) =>
      rows.push({
        id: p.id,
        name: p.name,
        currency: p.currency,
        accountType: "Investments",
        openingDate: p.createdAt,
      }),
    );
    return rows;
  }, [investmentsData]);

  const paidRows = useMemo(() => {
    return [
      {
        name: "Premium Global Portfolio",
        currency: "USD",
        accountType: "Premium Assets",
      },
      {
        name: "Elite Trading Account",
        currency: "EUR",
        accountType: "Premium Assets",
      },
      {
        name: "Pro Futures Account",
        currency: "USD",
        accountType: "Professional Trading",
      },
      {
        name: "Advanced Options Portfolio",
        currency: "GBP",
        accountType: "Professional Trading",
      },
      {
        name: "Institutional Account",
        currency: "USD",
        accountType: "Professional Trading",
      },
      {
        name: "VIP Binance Account",
        currency: "USD",
        accountType: "VIP Crypto Wallets",
      },
      {
        name: "Premium DeFi Portfolio",
        currency: "ETH",
        accountType: "VIP Crypto Wallets",
      },
      {
        name: "Private Equity Fund",
        currency: "USD",
        accountType: "Exclusive Investments",
      },
    ];
  }, []);

  return (
    <div className="relative w-full">
      {/* Centered content container */}
      <div className="relative z-10 w-full max-w-[1293px] mx-auto px-3 sm:px-4 lg:px-0 py-6 sm:py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs />
        {/* Persistent Navigation */}
        <PersistentNav />

        {/* Page Title */}
        <h1 className="text-white text-xl sm:text-2xl font-bold font-nunito mt-4 sm:mt-6">
          Portfolio
        </h1>

        {/* Free/Paid portfolio toggle */}
        <div className="mt-4 w-full max-w-[304px] h-10 sm:h-11 flex p-1 items-center gap-1 sm:gap-2 rounded-[36px] border border-tyrian-gray-darker glass-card hover-lift">
          <button
            onClick={() => setActiveTab("free")}
            className={`flex flex-1 h-8 sm:h-9 px-3 sm:px-4 py-2 sm:py-3 justify-center items-center rounded-[32px] transition-all ${
              activeTab === "free"
                ? "bg-tyrian-gradient-animated backdrop-blur-[58px] hover-lift"
                : "border border-tyrian-gray-darker glass-card hover:bg-tyrian-purple-dark/30 hover-lift"
            }`}
          >
            <span
              className={`text-xs sm:text-sm font-bold font-nunito whitespace-nowrap ${
                activeTab === "free" ? "text-white" : "text-tyrian-gray-medium"
              }`}
            >
              Free Portfolios
            </span>
          </button>
          <button
            onClick={() => setActiveTab("paid")}
            className={`flex flex-1 h-8 sm:h-9 px-3 sm:px-4 py-2 sm:py-3 justify-center items-center rounded-[32px] transition-all ${
              activeTab === "paid"
                ? "bg-tyrian-gradient-animated backdrop-blur-[58px] hover-lift"
                : "border border-tyrian-gray-darker glass-card hover:bg-tyrian-purple-dark/30 hover-lift"
            }`}
          >
            <span
              className={`text-xs sm:text-sm font-bold font-nunito whitespace-nowrap ${
                activeTab === "paid" ? "text-white" : "text-tyrian-gray-medium"
              }`}
            >
              Paid Portfolios
            </span>
          </button>
        </div>

        {/* Search and controls */}
        {/* Desktop/Tablet controls */}
        <div className="hidden sm:flex mt-4 w-full flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          {/* Search bar */}
          <div className="flex flex-1 h-11 px-3 py-2 items-center gap-2 rounded-lg border border-tyrian-gray-darker glass-card hover-lift">
            <Search className="w-6 h-6 text-tyrian-gray-medium flex-shrink-0" />
            <span className="text-tyrian-gray-medium text-sm font-medium font-nunito truncate">
              Search by portfolio name
            </span>
          </div>
          {/* Controls row */}
          <div className="flex items-center gap-3 flex-shrink-0 sm:flex-1 sm:justify-end flex-wrap sm:flex-nowrap">
            <div className="relative" ref={sortDropdownRef}>
              <button
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                className="flex w-[180px] h-11 px-4 py-3 justify-between items-center rounded-[32px] border border-tyrian-gray-darker glass-card backdrop-blur-[58px] hover:bg-tyrian-purple-dark/30 hover-lift transition-all duration-200"
              >
                <span className="text-white text-sm font-bold font-nunito">
                  {selectedSort}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-white flex-shrink-0 transition-transform duration-200 ${sortDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>
              {sortDropdownOpen && (
                <div className="absolute top-full mt-1 w-[180px] rounded-lg border border-tyrian-gray-darker glass-card backdrop-blur-[50px] py-2 z-50">
                  {sortOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleSortSelect(option)}
                      className={`w-full px-4 py-3 text-left text-sm font-bold font-nunito transition-colors duration-200 hover:bg-tyrian-purple-dark/30 ${
                        selectedSort === option ? "text-white" : "text-white"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => setAddPortfolioModalOpen(true)}
              className="flex h-11 px-4 py-3 justify-center items-center gap-2 rounded-[32px] bg-tyrian-gradient-animated backdrop-blur-[58px] hover-lift whitespace-nowrap"
            >
              <Plus className="w-5 h-5 text-white flex-shrink-0" />
              <span className="text-white text-sm font-bold font-nunito">
                Add Portfolio
              </span>
            </button>
            <div className="flex items-center p-1 rounded-[12px] border border-tyrian-gray-darker glass-card">
              <button
                onClick={() => setViewMode("cards")}
                className={`flex items-center justify-center w-10 h-8 rounded-[8px] transition ${viewMode === "cards" ? "bg-tyrian-gradient-animated text-white" : "text-tyrian-gray-medium hover:bg-tyrian-purple-dark/30"}`}
                aria-pressed={viewMode === "cards"}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`flex items-center justify-center w-10 h-8 rounded-[8px] transition ${viewMode === "table" ? "bg-tyrian-gradient-animated text-white" : "text-tyrian-gray-medium hover:bg-tyrian-purple-dark/30"}`}
                aria-pressed={viewMode === "table"}
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile controls */}
        <div className="sm:hidden mt-3 w-full space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex flex-1 h-10 px-3 items-center gap-2 rounded-lg border border-tyrian-gray-darker glass-card hover-lift">
              <Search className="w-5 h-5 text-tyrian-gray-medium flex-shrink-0" />
              <span className="text-tyrian-gray-medium text-sm font-medium font-nunito truncate">
                Search by portfolio name
              </span>
            </div>
            <div className="relative">
              <button
                onClick={() => setMobileActionsOpen((v) => !v)}
                className="flex w-10 h-10 justify-center items-center rounded-[12px] border border-tyrian-gray-darker glass-card hover:bg-tyrian-purple-dark/30 hover-lift"
                aria-label="More actions"
              >
                <Menu className="w-5 h-5 text-white" />
              </button>
              {mobileActionsOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-lg border border-tyrian-gray-darker glass-card p-1 z-20">
                  <button className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-tyrian-purple-dark/30">
                    <span className="text-white text-sm font-bold font-nunito">
                      Sort: {selectedSort}
                    </span>
                    <ChevronDown className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={() => setAddPortfolioModalOpen(true)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-tyrian-purple-dark/30"
                  >
                    <Plus className="w-4 h-4 text-white" />
                    <span className="text-white text-sm font-bold font-nunito">
                      Add Portfolio
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sections / Table */}
        {viewMode === "table" ? (
          <div className="mt-6 sm:mt-8">
            <PortfolioTable rows={activeTab === "free" ? freeRows : paidRows} />
          </div>
        ) : (
          <div className="mt-6 sm:mt-8 space-y-6 sm:space-y-8">
            {activeTab === "free" ? (
              <>
                <PortfolioSection
                  title="All assets"
                  icon={<AllAssetsIcon />}
                  cards={[
                    {
                      title: "All assets",
                      currency: "USD",
                      icon: <AllAssetsCardIcon />,
                    },
                  ]}
                  onCardClick={handleCardClick}
                  smallMenuForFirstCard
                />

                <PortfolioSection
                  title="Composite"
                  icon={<CompositeIcon />}
                  cards={[
                    {
                      title: "MetaMask - main portfolio",
                      currency: "EUR",
                      platformIcon: <BinanceIcon />,
                    },
                  ]}
                  onCardClick={handleCardClick}
                />

                <PortfolioSection
                  title="Cryptowallet"
                  icon={<CryptowalletIcon />}
                  cards={[
                    {
                      title: "Binance",
                      currency: "USD",
                      platformIcon: <BinanceIcon />,
                    },
                    {
                      title: "MetaMask - BSC",
                      currency: "USD",
                      platformIcon: <BinanceIcon />,
                    },
                    {
                      title: "MetaMask - Ethereum",
                      currency: "USD",
                      platformIcon: <EthereumIcon />,
                    },
                  ]}
                  onCardClick={handleCardClick}
                />

                {investmentsData && investmentsData.items.length > 0 && (
                  <PortfolioSection
                    title="Investments"
                    icon={<InvestmentsIcon />}
                    cards={investmentsData.items.map((p) => ({
                      id: p.id,
                      title: p.name,
                      currency: p.currency,
                      platformIcon: <BinanceIcon />,
                    }))}
                    onCardClick={handleCardClick}
                    onDelete={(id) =>
                      userId && deletePortfolio.mutate({ id, userId })
                    }
                    userId={userId}
                  />
                )}
              </>
            ) : (
              <>
                <PortfolioSection
                  title="Premium Assets"
                  icon={<AllAssetsIcon />}
                  cards={[
                    {
                      title: "Premium Global Portfolio",
                      currency: "USD",
                      icon: <AllAssetsCardIcon />,
                    },
                    {
                      title: "Elite Trading Account",
                      currency: "EUR",
                      platformIcon: <BinanceIcon />,
                    },
                  ]}
                  onCardClick={handleCardClick}
                />

                <PortfolioSection
                  title="Professional Trading"
                  icon={<CompositeIcon />}
                  cards={[
                    {
                      title: "Pro Futures Account",
                      currency: "USD",
                      platformIcon: <BinanceIcon />,
                    },
                    {
                      title: "Advanced Options Portfolio",
                      currency: "GBP",
                      platformIcon: <EthereumIcon />,
                    },
                    {
                      title: "Institutional Account",
                      currency: "USD",
                      platformIcon: <PolygonIcon />,
                    },
                  ]}
                  onCardClick={handleCardClick}
                />

                <PortfolioSection
                  title="VIP Crypto Wallets"
                  icon={<CryptowalletIcon />}
                  cards={[
                    {
                      title: "VIP Binance Account",
                      currency: "USD",
                      platformIcon: <BinanceIcon />,
                    },
                    {
                      title: "Premium DeFi Portfolio",
                      currency: "ETH",
                      platformIcon: <EthereumIcon />,
                    },
                  ]}
                  onCardClick={handleCardClick}
                />

                <PortfolioSection
                  title="Exclusive Investments"
                  icon={<InvestmentsIcon />}
                  cards={[
                    {
                      title: "Private Equity Fund",
                      currency: "USD",
                      platformIcon: <BinanceIcon />,
                    },
                    {
                      title: "Hedge Fund Portfolio",
                      currency: "EUR",
                      platformIcon: <PolygonIcon />,
                    },
                    {
                      title: "Real Estate Investment",
                      currency: "GBP",
                      platformIcon: <EthereumIcon />,
                    },
                    {
                      title: "Venture Capital Fund",
                      currency: "USD",
                      platformIcon: <BinanceIcon />,
                    },
                  ]}
                  onCardClick={handleCardClick}
                />
              </>
            )}
          </div>
        )}
      </div>

      {/* Add Portfolio Modal */}
      <AddPortfolioModal
        isOpen={addPortfolioModalOpen}
        onClose={() => setAddPortfolioModalOpen(false)}
        userId={userId}
      />
    </div>
  );
};

interface PortfolioSectionProps {
  title: string;
  icon: React.ReactNode;
  cards: Array<{
    id?: string;
    title: string;
    currency: string;
    icon?: React.ReactNode;
    platformIcon?: React.ReactNode;
  }>;
  onCardClick?: (cardTitle: string, portfolioId?: string) => void;
  onDelete?: (id: string) => void;
  userId?: string | null;
  smallMenuForFirstCard?: boolean;
}

const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  title,
  icon,
  cards,
  onCardClick,
  onDelete,
  userId,
  smallMenuForFirstCard,
}) => {
  const [expanded, setExpanded] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  React.useEffect(() => {
    const handleDocMouseDown = (e: MouseEvent) => {
      if (!openMenuId) return;
      const target = e.target as HTMLElement;
      const inTrigger = target.closest(`[data-menu-trigger="${openMenuId}"]`);
      const inPanel = target.closest(`[data-menu-panel="${openMenuId}"]`);
      if (!inTrigger && !inPanel) setOpenMenuId(null);
    };
    document.addEventListener("mousedown", handleDocMouseDown);
    return () => document.removeEventListener("mousedown", handleDocMouseDown);
  }, [openMenuId]);

  return (
    <div className="w-full flex flex-col items-start gap-3 sm:gap-6">
      {/* Section header */}
      <div className="w-full">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-2 py-2 hover:bg-tyrian-purple-dark/30 focus:outline-none focus:ring-1 focus:ring-tyrian-purple-primary text-left"
          onClick={() => setExpanded((v) => !v)}
          aria-label="Toggle section"
          aria-expanded={expanded}
        >
          {icon}
          <span className="text-white text-base sm:text-lg font-bold font-nunito flex-1">
            {title}
          </span>
          <ChevronDown
            className={`w-5 h-5 sm:w-6 sm:h-6 text-white transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Cards */}
      <div className={`${expanded ? "block" : "hidden"} w-full`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-6 w-full">
          {cards.map((card, index) => {
            const id = `${title}-${card.title}-${index}`;
            const isDefaultTop = !!smallMenuForFirstCard && index === 0;
            return (
              <div
                key={id}
                className={`group relative w-full h-[112px] sm:h-[139px] cursor-pointer transition-transform hover:scale-[1.02] ${openMenuId === id ? "z-[70]" : ""}`}
                onClick={() => onCardClick?.(card.title, card.id)}
              >
                {/* Main card background */}
                <div className="absolute inset-0 rounded-2xl sm:rounded-3xl border border-tyrian-gray-darker glass-card transition-colors group-hover:bg-tyrian-purple-background/40 group-hover:border-tyrian-purple-primary/40" />

                {/* Purple accent area */}
                <div className="absolute right-0 top-5 sm:top-11 w-[72px] sm:w-[98px] h-[66px] sm:h-[94px] rounded-l-2xl sm:rounded-l-3xl overflow-hidden flex items-center justify-end pr-1 bg-transparent">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F7ee0e08331ad4de59dd7fa404556ca59%2F0975094bb5f7459a9009e7e8fdaf54f9?format=webp&width=800"
                    alt=""
                    className="w-[64px] sm:w-[88px] h-[64px] sm:h-[88px] opacity-95 bg-transparent"
                  />
                </div>

                {/* Card content */}
                <div className="relative z-10 h-full">
                  {/* Header */}
                  <div className="absolute left-4 sm:left-6 top-2.5 sm:top-4 right-24 sm:right-28">
                    <div className="flex justify-start items-center gap-2 min-w-0">
                      {card.platformIcon || card.icon}
                      <span className="text-white text-sm sm:text-lg font-bold font-nunito truncate">
                        {card.title}
                      </span>
                    </div>
                  </div>

                  {/* Three dots icon positioned at top-right */}
                  <div className="absolute top-2.5 sm:top-4 right-3 sm:right-4">
                    <button
                      data-menu-trigger={id}
                      className={`relative flex items-center justify-center w-8 h-8 rounded-md transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-tyrian-purple-primary ${openMenuId === id ? "bg-tyrian-purple-dark/60 ring-2 ring-tyrian-purple-primary/30 shadow-md" : "hover:bg-gradient-to-br hover:from-tyrian-purple-primary/90 hover:to-tyrian-purple-dark/90 hover:shadow-lg hover:ring-1 hover:ring-tyrian-purple-primary/30"}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === id ? null : id);
                      }}
                      onMouseDown={(e) => e.preventDefault()}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") setOpenMenuId(null);
                      }}
                      aria-haspopup="menu"
                      aria-expanded={openMenuId === id}
                    >
                      <MoreHorizontal className="w-5 h-5 sm:w-6 sm:h-6 text-white rotate-90" />
                    </button>
                    {openMenuId === id && (
                      <div
                        data-menu-panel={id}
                        className="absolute right-0 top-9 z-[80] w-56 rounded-lg border border-tyrian-gray-darker glass-card backdrop-blur-[50px] py-2 shadow-xl ring-1 ring-black/20"
                        onClick={(e) => e.stopPropagation()}
                        role="menu"
                      >
                        {isDefaultTop ? (
                          <>
                            <MenuItem label="Сдел��ть текущим" />
                            <MenuItem label="Закрепить" />
                            <Divider />
                            <MenuItem label="Скрыть" variant="danger" />
                          </>
                        ) : (
                          <>
                            <MenuItem label="Ред��ктировать" />
                            <MenuItem label="Сделать текущим" />
                            <MenuItem label="Закрепит��" />
                            <MenuItem label="��оздать копию" />
                            <MenuItem label="Изменит�� баланс" />
                            <Divider />
                            <MenuItem label="Импорт" />
                            <MenuItem label="Экспорт в csv" disabled />
                            <MenuItem label="Экспорт в xlsx" disabled />
                            <Divider />
                            <MenuItem label="Скрыть" variant="danger" />
                            <MenuItem label="Очистить" variant="danger" />
                            <MenuItem
                              label="Удалит��"
                              variant="danger"
                              onClick={() => {
                                if (card.id && onDelete) {
                                  onDelete(card.id);
                                  setOpenMenuId(null);
                                }
                              }}
                            />
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Currency */}
                  <div className="absolute left-4 sm:left-6 bottom-2.5 sm:bottom-6 inline-flex flex-col items-start gap-1 sm:gap-2">
                    <div className="flex items-center gap-1">
                      <span className="text-tyrian-gray-medium text-xs font-bold font-nunito">
                        Currency
                      </span>
                    </div>
                    <span className="text-white text-lg sm:text-2xl font-bold font-nunito">
                      {card.currency}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Icon components matching Figma exactly
const AllAssetsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M2 18C2 16.4596 2 15.6893 2.34673 15.1235C2.54074 14.8069 2.80693 14.5407 3.12353 14.3467C3.68934 14 4.45956 14 6 14C7.54044 14 8.31066 14 8.87647 14.3467C9.19307 14.5407 9.45926 14.8069 9.65327 15.1235C10 15.6893 10 16.4596 10 18C10 19.5404 10 20.3107 9.65327 20.8765C9.45926 21.1931 9.19307 21.4593 8.87647 21.6533C8.31066 22 7.54044 22 6 22C4.45956 22 3.68934 22 3.12353 21.6533C2.80693 21.4593 2.54074 21.1931 2.34673 20.8765C2 20.3107 2 19.5404 2 18Z"
      stroke="white"
      strokeWidth="1.5"
    />
    <path
      d="M14 18C14 16.4596 14 15.6893 14.3467 15.1235C14.5407 14.8069 14.8069 14.5407 15.1235 14.3467C15.6893 14 16.4596 14 18 14C19.5404 14 20.3107 14 20.8765 14.3467C21.1931 14.5407 21.4593 14.8069 21.6533 15.1235C22 15.6893 22 16.4596 22 18C22 19.5404 22 20.3107 21.6533 20.8765C21.4593 21.1931 21.1931 21.4593 20.8765 21.6533C20.3107 22 19.5404 22 18 22C16.4596 22 15.6893 22 15.1235 21.6533C14.8069 21.4593 14.5407 21.1931 14.3467 20.8765C14 20.3107 14 19.5404 14 18Z"
      stroke="white"
      strokeWidth="1.5"
    />
    <path
      d="M2 6C2 4.45956 2 3.68934 2.34673 3.12353C2.54074 2.80693 2.80693 2.54074 3.12353 2.34673C3.68934 2 4.45956 2 6 2C7.54044 2 8.31066 2 8.87647 2.34673C9.19307 2.54074 9.45926 2.80693 9.65327 3.12353C10 3.68934 10 4.45956 10 6C10 7.54044 10 8.31066 9.65327 8.87647C9.45926 9.19307 9.19307 9.45926 8.87647 9.65327C8.31066 10 7.54044 10 6 10C4.45956 10 3.68934 10 3.12353 9.65327C2.80693 9.45926 2.54074 9.19307 2.34673 8.87647C2 8.31066 2 7.54044 2 6Z"
      stroke="white"
      strokeWidth="1.5"
    />
  </svg>
);

const AllAssetsCardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M9 9L5 5M16 12H22M12 16V22"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
      stroke="white"
      strokeWidth="1.5"
    />
    <path
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
      stroke="white"
      strokeWidth="1.5"
    />
  </svg>
);

const CompositeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M16.5557 4.61883C15.7488 4.07099 14.8724 3.64848 13.9552 3.3602C12.7981 2.99648 12.2195 2.81462 11.6098 3.2715C11 3.72839 11 4.4705 11 5.95472V10.5064C11 11.7697 11 12.4013 11.2341 12.9676C11.4683 13.534 11.9122 13.9761 12.8 14.8604L15.999 18.0466C17.0421 19.0855 17.5637 19.605 18.3116 19.4823C19.0596 19.3597 19.3367 18.8125 19.8911 17.7182C20.3153 16.881 20.6251 15.9835 20.8079 15.0499C21.1937 13.0788 20.9957 11.0358 20.2388 9.17903C19.4819 7.32232 18.2002 5.73535 16.5557 4.61883Z"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 20.4185C13.0736 20.7935 12.0609 21 11 21C6.58172 21 3 17.4183 3 13C3 9.56306 5.16736 6.63232 8.20988 5.5"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CryptowalletIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
      stroke="white"
      strokeWidth="1.5"
    />
    <path
      d="M9.5 16V8"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M11 8V6M13.5 8V6"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M11 18V16M13.5 18V16"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M9.5 12H14.5C15.3284 12 16 12.6716 16 13.5V14.5C16 15.3284 15.3284 16 14.5 16H8"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 8H14.5C15.3284 8 16 8.67157 16 9.5V10.5C16 11.3284 15.3284 12 14.5 12H9.5"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const InvestmentsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M3 4V14C3 16.8284 3 18.2426 3.87868 19.1213C4.75736 20 6.17157 20 9 20H21"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 14L9.25 10.75C9.89405 10.1059 10.2161 9.78392 10.5927 9.67766C10.8591 9.60254 11.1409 9.60254 11.4073 9.67766C11.7839 9.78392 12.1059 10.1059 12.75 10.75C13.3941 11.3941 13.7161 11.7161 14.0927 11.8223C14.3591 11.8975 14.6409 11.8975 14.9073 11.8223C15.2839 11.7161 15.6059 11.3941 16.25 10.75L20 7"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BinanceIcon = () => (
  <div className="relative w-6 h-6">
    <div className="w-6 h-6 bg-tyrian-gold-binance rounded-full shadow-[0_2px_6px_rgba(31,32,56,0.16)]" />
    <svg
      className="absolute left-[3px] top-[3px] w-[17px] h-[17px]"
      viewBox="0 0 18 18"
      fill="none"
    >
      <g clipPath="url(#clip0)">
        <path
          d="M5.67193 7.63291L9.00139 4.3048L12.3322 7.63562L14.2684 5.69806L9.00139 0.429688L3.73438 5.69671L5.67193 7.63291Z"
          fill="white"
        />
        <path
          d="M0.429688 9.00006L2.36589 7.0625L4.30345 9.00006L2.36589 10.9363L0.429688 9.00006Z"
          fill="white"
        />
        <path
          d="M5.67193 10.3685L9.00139 13.698L12.3322 10.3672L14.2698 12.302L9.00275 17.5704L3.73438 12.3061L5.67193 10.3685Z"
          fill="white"
        />
        <path
          d="M13.6953 9.00006L15.6315 7.0625L17.5691 8.9987L15.6315 10.9376L13.6953 9.00006Z"
          fill="white"
        />
        <path
          d="M10.9683 9.00115L9.0037 7.03516L7.55087 8.48799L7.38298 8.65453L7.03906 8.99844L9.0037 10.9617L10.9683 9.0025V9.00115Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect
            width="17.1429"
            height="17.1429"
            fill="white"
            transform="translate(0.429688 0.429688)"
          />
        </clipPath>
      </defs>
    </svg>
  </div>
);

const EthereumIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient
        id="ethGradient"
        x1="12"
        y1="0"
        x2="12"
        y2="24"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#465191" />
        <stop offset="0.36" stopColor="#32498F" />
        <stop offset="0.7" stopColor="#555E99" />
        <stop offset="1" stopColor="#4F5795" />
      </linearGradient>
      <clipPath id="ethClip">
        <rect width="24" height="24" rx="12" fill="white" />
      </clipPath>
    </defs>
    <g clipPath="url(#ethClip)">
      <path d="M0 0H24V24H0V0Z" fill="url(#ethGradient)" />
      <path
        d="M11.9624 3.54688V9.37545L6.96094 12.1397L11.9624 3.54688Z"
        fill="#E7F0FF"
      />
      <path
        d="M6.9675 12.1432L6.9375 12.186L11.9689 15.3789V9.37891L6.9675 12.1432Z"
        fill="#A5B9EE"
      />
      <path
        d="M11.9688 3.54714V9.37571L17.0602 12.1871H17.0645L11.9945 3.5L11.9688 3.54286V3.54714Z"
        fill="#A5B8F0"
      />
      <path
        d="M17.0602 12.1903L11.9945 15.396L11.9688 15.3789V9.37891L17.0602 12.1903Z"
        fill="#687FCB"
      />
    </g>
  </svg>
);

const PolygonIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <defs>
      <clipPath id="polyClip">
        <rect width="24" height="24" rx="12" fill="white" />
      </clipPath>
    </defs>
    <g clipPath="url(#polyClip)">
      <path d="M0 0H24V24H0V0Z" fill="#6C00F6" />
      <path
        d="M5.14062 15.8443V11.5157L8.97634 9.28714L10.2835 10.0929V12.0429L8.97634 11.2629L6.85491 12.4457V14.8543L8.97634 16.08L11.1406 14.8543V8.15571L14.9678 6L18.8549 8.15571V12.4886L14.9678 14.6743L13.7121 13.8857V11.9486L14.9678 12.7157L17.1406 11.5157V9.13286L14.9678 7.92429L12.8549 9.12857V15.84L8.97634 18L5.14062 15.8443Z"
        fill="white"
      />
    </g>
  </svg>
);

// Context menu shared UI
const Divider: React.FC = () => (
  <div className="my-1 h-px bg-tyrian-gray-darker" />
);

const MenuItem: React.FC<{
  label: string;
  disabled?: boolean;
  variant?: "danger" | "default";
  onClick?: () => void;
}> = ({ label, disabled, variant = "default", onClick }) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClick?.();
    }}
    disabled={disabled}
    className={`w-full px-4 py-2.5 text-left text-sm font-bold font-nunito rounded-md transition-colors duration-150 ${
      disabled
        ? "text-tyrian-gray-medium/60 cursor-not-allowed"
        : variant === "danger"
          ? "text-rose-400 hover:bg-rose-500/10"
          : "text-white hover:bg-gradient-to-r hover:from-tyrian-purple-primary/10 hover:to-tyrian-purple-dark/40 hover:text-white"
    }`}
    role="menuitem"
  >
    {label}
  </button>
);

interface TableRow {
  id?: string;
  name: string;
  currency: string;
  accountType: string;
  openingDate?: string;
}
const currencySymbol = (code: string) =>
  ({ USD: "$", EUR: "€", GBP: "£", ETH: "Ξ" })[code?.toUpperCase()] ||
  code?.toUpperCase();
const formatDateShort = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${dd}.${mm}.${yy}`;
};
const PortfolioTable: React.FC<{ rows: TableRow[] }> = ({ rows }) => (
  <div className="w-full rounded-xl border border-tyrian-gray-darker bg-tyrian-black/50 backdrop-blur-[50px] overflow-x-auto">
    <div className="min-w-[760px]">
      <div className="flex items-center gap-4 px-4 py-3 border-b border-tyrian-gray-darker text-[12px] font-bold uppercase text-white/90">
        <div className="flex-1 pl-6">Company name</div>
        <div className="w-[172px] text-right hidden md:block">Fixed fee</div>
        <div className="w-[172px] text-center hidden md:block">Currency</div>
        <div className="w-[172px] hidden md:block">Account type</div>
        <div className="w-[172px] text-right hidden lg:block">Opening date</div>
        <div className="w-[47px]" />
      </div>
      <div className="divide-y divide-tyrian-gray-darker">
        {rows.map((r, idx) => (
          <div
            key={(r.id || r.name) + idx}
            className="flex items-center gap-4 px-4 h-14"
          >
            <div className="flex-1 flex items-center gap-2 min-w-0">
              <ChevronDown className="w-4 h-4 text-tyrian-gray-medium -rotate-90" />
              <span className="truncate text-white text-[15px] font-bold">
                {r.name}
              </span>
            </div>
            <div className="w-[172px] text-right text-white hidden md:block">
              —
            </div>
            <div className="w-[172px] text-center text-white hidden md:block">
              {currencySymbol(r.currency)}
            </div>
            <div className="w-[172px] text-white hidden md:block">
              {r.accountType}
            </div>
            <div className="w-[172px] text-right text-white hidden lg:block">
              {formatDateShort(r.openingDate)}
            </div>
            <div className="w-[47px] flex justify-end">
              <MoreHorizontal className="w-5 h-5 text-tyrian-gray-medium rotate-90" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Index;
