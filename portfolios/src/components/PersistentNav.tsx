import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AddPortfolioModal from "./AddPortfolioModal";
import CreateAssetModal from "./CreateAssetModal";
import AddTradeModal from "./AddTradeModal";
import { useUser } from "../hooks/use-user";
import { usePortfolioContext } from "../contexts/PortfolioContext";
import { usePortfolios } from "../hooks/use-portfolios";
import {
  Plus,
  Calendar,
  FileText,
  Brain,
  Settings,
  Briefcase,
  Users,
  ChevronDown,
  MoreHorizontal,
  TrendingUp,
} from "lucide-react";

const PersistentNav: React.FC = () => {
  const [addPortfolioOpen, setAddPortfolioOpen] = useState(false);
  const [createAssetOpen, setCreateAssetOpen] = useState(false);
  const [addTradeOpen, setAddTradeOpen] = useState(false);
  const { userId } = useUser();
  const { currentPortfolioId, setCurrentPortfolioId } = usePortfolioContext();
  const { data: investmentsData } = usePortfolios(userId, "investments");
  const location = useLocation();
  const navigate = useNavigate();

  // Find current portfolio data
  const currentPortfolio = investmentsData?.items.find(
    (p) => p.id === currentPortfolioId,
  );
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [isWalletMenuOpen, setIsWalletMenuOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [isWalletDotsMenuOpen, setIsWalletDotsMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const walletMenuRef = useRef<HTMLDivElement>(null);
  const walletButtonRef = useRef<HTMLDivElement>(null);
  const currencyButtonRef = useRef<HTMLDivElement>(null);
  const currencyDropdownRef = useRef<HTMLDivElement>(null);
  const dotsButtonRef = useRef<HTMLButtonElement>(null);
  const dotsMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Quick Actions dropdown
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(target) &&
        !buttonRef.current.contains(target)
      ) {
        setIsQuickActionsOpen(false);
      }

      // Wallet menu dropdown
      if (
        walletMenuRef.current &&
        walletButtonRef.current &&
        !walletMenuRef.current.contains(target) &&
        !walletButtonRef.current.contains(target)
      ) {
        setIsWalletMenuOpen(false);
      }

      // Currency dropdown
      if (
        currencyDropdownRef.current &&
        currencyButtonRef.current &&
        !currencyDropdownRef.current.contains(target) &&
        !currencyButtonRef.current.contains(target)
      ) {
        setIsCurrencyDropdownOpen(false);
      }

      // Wallet dots menu
      if (
        dotsMenuRef.current &&
        dotsButtonRef.current &&
        !dotsMenuRef.current.contains(target) &&
        !dotsButtonRef.current.contains(target)
      ) {
        setIsWalletDotsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full max-w-[1293px] mx-auto px-3 sm:px-4 lg:px-0">
      {/* Header row: left (wallet + quick actions), right (calendar menu) */}
      <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-4 lg:gap-6 mb-6 w-full">
        {/* Left cluster: Current Wallet + Quick Actions */}
        <div className="flex flex-col sm:flex-row lg:flex-row items-start sm:items-end lg:items-end gap-3 sm:gap-4 lg:gap-[18px] w-full lg:w-auto">
          {/* Current Wallet */}
          <div className="flex flex-col gap-1 w-full sm:w-auto relative">
            <span className="text-tyrian-gray-medium text-xs font-bold font-nunito">
              Current Wallet
            </span>
            <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 p-2 pl-3 sm:pl-4 pr-2 rounded-lg border border-tyrian-gray-darker glass-card hover-lift w-full sm:w-auto">
              {/* Clickable wallet info area */}
              <div
                ref={walletButtonRef}
                onClick={() => setIsWalletMenuOpen(!isWalletMenuOpen)}
                className="flex items-center justify-between min-w-[160px] sm:w-[180px] flex-1 sm:flex-initial cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-tyrian-purple-background flex-shrink-0"></div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-white text-sm font-bold font-nunito truncate">
                      {currentPortfolio ? currentPortfolio.name : "MetaMask"}
                    </span>
                    <span className="text-white text-xs font-bold font-nunito">
                      {currentPortfolio ? currentPortfolio.currency : "1,000$"}
                    </span>
                  </div>
                </div>
                <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-white rotate-180 flex-shrink-0" />
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Currency dropdown button */}
                <div
                  ref={currencyButtonRef}
                  onClick={() =>
                    setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)
                  }
                  className="flex items-center px-2 py-1 rounded bg-tyrian-gradient-animated hover-lift cursor-pointer"
                >
                  <span className="text-white text-xs font-bold font-nunito">
                    USD
                  </span>
                  <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-white ml-1 sm:ml-2" />
                </div>
                {/* Three dots menu button */}
                <button
                  ref={dotsButtonRef}
                  onClick={() => setIsWalletDotsMenuOpen(!isWalletDotsMenuOpen)}
                  className="p-1 hover:bg-tyrian-purple-dark/30 rounded"
                >
                  <MoreHorizontal className="w-5 h-5 sm:w-6 sm:h-6 text-white rotate-90" />
                </button>
              </div>
            </div>

            {/* Wallet Main Menu */}
            {isWalletMenuOpen && (
              <div
                ref={walletMenuRef}
                className="absolute top-full left-0 mt-2 z-50 animate-in slide-in-from-top-2 duration-200"
              >
                <WalletMainMenu
                  onClose={() => setIsWalletMenuOpen(false)}
                  onSelectPortfolio={(id) => {
                    setCurrentPortfolioId(id);
                    setIsWalletMenuOpen(false);
                    navigate(`/portfolio/${id}`);
                  }}
                />
              </div>
            )}

            {/* Currency Dropdown */}
            {isCurrencyDropdownOpen && (
              <div
                ref={currencyDropdownRef}
                className="absolute top-full right-12 mt-2 z-50 animate-in slide-in-from-top-2 duration-200"
              >
                <CurrencyDropdown
                  onClose={() => setIsCurrencyDropdownOpen(false)}
                />
              </div>
            )}

            {/* Wallet Dots Menu */}
            {isWalletDotsMenuOpen && (
              <div
                ref={dotsMenuRef}
                className="absolute top-full right-0 mt-2 z-50 animate-in slide-in-from-top-2 duration-200"
              >
                <WalletDotsMenu
                  onClose={() => setIsWalletDotsMenuOpen(false)}
                />
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="relative">
            <button
              ref={buttonRef}
              onClick={() => setIsQuickActionsOpen(!isQuickActionsOpen)}
              className="flex items-center justify-center gap-0 sm:gap-2 w-10 h-10 sm:w-auto sm:h-auto px-0 sm:px-4 py-0 sm:py-3 rounded-[12px] sm:rounded-[32px] bg-tyrian-gradient-animated backdrop-blur-58 hover-lift"
            >
              <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-white flex-shrink-0" />
              <span className="hidden sm:inline text-white text-sm font-bold font-nunito whitespace-nowrap">
                Quick Actions
              </span>
            </button>

            {/* Quick Actions Dropdown */}
            {isQuickActionsOpen && (
              <div
                ref={dropdownRef}
                className="absolute top-full left-0 mt-2 z-50 animate-in slide-in-from-top-2 duration-200"
              >
                <QuickActionsDropdown
                  onClose={() => setIsQuickActionsOpen(false)}
                  onOpenAdd={() => setAddPortfolioOpen(true)}
                  onOpenCreateAsset={() => setCreateAssetOpen(true)}
                  onOpenAddTrade={() => setAddTradeOpen(true)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right side: Calendar/New listings/Psychology */}
        <div className="w-full lg:w-auto flex flex-col gap-2">
          <div className="flex items-center gap-2 sm:gap-3 p-1 rounded-[36px] border border-tyrian-gray-darker glass-card overflow-x-auto scrollbar-hide w-full lg:w-auto">
            <NavButton
              icon={<Calendar className="w-4 h-4 sm:w-5 sm:h-5" />}
              onClick={() => navigate("/calendar")}
            >
              Calendar
            </NavButton>
            <NavButton
              icon={<FileText className="w-4 h-4 sm:w-5 sm:h-5" />}
              onClick={() => navigate("/new-listings")}
            >
              New listings
            </NavButton>
            <NavButton
              icon={<Brain className="w-4 h-4 sm:w-5 sm:h-5" />}
              onClick={() => navigate("/psychology")}
            >
              Psychology
            </NavButton>
            <NavButton
              icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5" />}
              iconOnly
            />
          </div>
          <div className="flex items-center gap-2 sm:gap-3 p-1 rounded-[36px] border border-white/10 custom-bg-blur overflow-x-auto scrollbar-hide w-full lg:w-auto">
            <NavButton
              icon={<FileText className="w-4 h-4 sm:w-5 sm:h-5" />}
              onClick={() => navigate("/quotes")}
            >
              Quotes
            </NavButton>
            <NavButton
              icon={<TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />}
              onClick={() => navigate("/screener")}
            >
              Screener
            </NavButton>
          </div>
        </div>
      </div>

      {/* Portfolio Navigation */}
      <div className="w-full mb-8">
        <div className="flex items-center gap-2 sm:gap-3 p-1 rounded-[36px] border border-tyrian-gray-darker glass-card overflow-x-auto scrollbar-hide">
          <PortfolioNavButton
            active={location.pathname === "/"}
            icon={<Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />}
            onClick={() => navigate("/")}
          >
            <span className="sm:hidden">My</span>
            <span className="hidden sm:inline">My Portfolios</span>
          </PortfolioNavButton>
          <PortfolioNavButton
            active={location.pathname === "/following-portfolios"}
            icon={<Users className="w-4 h-4 sm:w-5 sm:h-5" />}
            onClick={() => navigate("/following-portfolios")}
          >
            <span className="sm:hidden">Following</span>
            <span className="hidden sm:inline">Following Portfolios</span>
          </PortfolioNavButton>
          <PortfolioNavButton
            active={location.pathname === "/signals"}
            icon={<SignalsIcon />}
            onClick={() => navigate("/signals")}
          >
            Signals
          </PortfolioNavButton>
        </div>
      </div>

      {/* Add Portfolio Modal */}
      {addPortfolioOpen && (
        <AddPortfolioModal
          isOpen={addPortfolioOpen}
          onClose={() => setAddPortfolioOpen(false)}
          userId={userId}
        />
      )}

      {/* Create Asset Modal */}
      {createAssetOpen && (
        <CreateAssetModal
          isOpen={createAssetOpen}
          onClose={() => setCreateAssetOpen(false)}
          userId={userId}
        />
      )}

      {/* Add Trade Modal */}
      {addTradeOpen && (
        <AddTradeModal
          isOpen={addTradeOpen}
          onClose={() => setAddTradeOpen(false)}
          userId={userId}
          portfolioName="Crypto Wallet"
        />
      )}
    </div>
  );
};

interface NavButtonProps {
  children?: React.ReactNode;
  icon: React.ReactNode;
  iconOnly?: boolean;
  onClick?: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({
  children,
  icon,
  iconOnly = false,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-[32px] border border-tyrian-gray-darker glass-card text-white transition-all hover:bg-tyrian-purple-background/40 hover-lift min-h-[40px] sm:min-h-[44px] ${
      iconOnly ? "w-10 sm:w-12 flex-shrink-0" : "flex-shrink-0"
    }`}
  >
    {icon}
    {!iconOnly && (
      <span className="hidden sm:inline text-sm font-bold font-nunito whitespace-nowrap">
        {children}
      </span>
    )}
  </button>
);

interface PortfolioNavButtonProps {
  children: React.ReactNode;
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

const PortfolioNavButton: React.FC<PortfolioNavButtonProps> = ({
  children,
  icon,
  active = false,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-[32px] text-xs sm:text-sm font-bold font-nunito transition-all min-w-[120px] sm:min-w-[160px] lg:min-w-[200px] flex-shrink-0 min-h-[40px] sm:min-h-[44px] ${
      active
        ? "bg-tyrian-gradient-animated text-white hover-lift"
        : "border border-tyrian-gray-darker glass-card text-tyrian-gray-medium hover:text-white hover:bg-tyrian-purple-dark/30 hover-lift"
    }`}
  >
    {icon}
    <span className="whitespace-nowrap">{children}</span>
  </button>
);

const SignalsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M2.91406 10.418V16.2513C2.91406 16.6396 2.91406 16.8337 2.9775 16.9869C3.06207 17.1911 3.2243 17.3533 3.4285 17.4379C3.58164 17.5013 3.77578 17.5013 4.16406 17.5013C4.55235 17.5013 4.74649 17.5013 4.89963 17.4379C5.10382 17.3533 5.26605 17.1911 5.35063 16.9869C5.41406 16.8337 5.41406 16.6396 5.41406 16.2513V10.418C5.41406 10.0297 5.41406 9.83555 5.35063 9.68239C5.26605 9.47822 5.10382 9.31597 4.89963 9.23139C4.74649 9.16797 4.55235 9.16797 4.16406 9.16797C3.77578 9.16797 3.58164 9.16797 3.4285 9.23139C3.2243 9.31597 3.06207 9.47822 2.9775 9.68239C2.91406 9.83555 2.91406 10.0297 2.91406 10.418Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      strokeLinejoin="round"
    />
    <path
      d="M8.75 12.082V16.2483C8.75 16.6365 8.75 16.8307 8.81342 16.9839C8.898 17.188 9.06025 17.3503 9.26442 17.4349C9.41758 17.4983 9.61175 17.4983 10 17.4983C10.3882 17.4983 10.5824 17.4983 10.7356 17.4349C10.9397 17.3503 11.102 17.188 11.1866 16.9839C11.25 16.8307 11.25 16.6365 11.25 16.2483V12.082C11.25 11.6938 11.25 11.4996 11.1866 11.3464C11.102 11.1423 10.9397 10.98 10.7356 10.8954C10.5824 10.832 10.3882 10.832 10 10.832C9.61175 10.832 9.41758 10.832 9.26442 10.8954C9.06025 10.98 8.898 11.1423 8.81342 11.3464C8.75 11.4996 8.75 11.6938 8.75 12.082Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      strokeLinejoin="round"
    />
    <path
      d="M14.5859 8.75V16.25C14.5859 16.6382 14.5859 16.8324 14.6494 16.9856C14.7339 17.1897 14.8962 17.352 15.1004 17.4366C15.2535 17.5 15.4477 17.5 15.8359 17.5C16.2242 17.5 16.4184 17.5 16.5715 17.4366C16.7757 17.352 16.9379 17.1897 17.0225 16.9856C17.0859 16.8324 17.0859 16.6382 17.0859 16.25V8.75C17.0859 8.36175 17.0859 8.16758 17.0225 8.01443C16.9379 7.81024 16.7757 7.64801 16.5715 7.56343C16.4184 7.5 16.2242 7.5 15.8359 7.5C15.4477 7.5 15.2535 7.5 15.1004 7.56343C14.8962 7.64801 14.7339 7.81024 14.6494 8.01443C14.5859 8.16758 14.5859 8.36175 14.5859 8.75Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      strokeLinejoin="round"
    />
    <path
      d="M5.41406 5.41797C5.41406 6.10833 4.85442 6.66797 4.16406 6.66797C3.4737 6.66797 2.91406 6.10833 2.91406 5.41797C2.91406 4.72761 3.4737 4.16797 4.16406 4.16797C4.85442 4.16797 5.41406 4.72761 5.41406 5.41797Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M17.0859 3.75C17.0859 4.44036 16.5263 5 15.8359 5C15.1456 5 14.5859 4.44036 14.5859 3.75C14.5859 3.05964 15.1456 2.5 15.8359 2.5C16.5263 2.5 17.0859 3.05964 17.0859 3.75Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M11.25 7.08203C11.25 7.77239 10.6903 8.33203 10 8.33203C9.30967 8.33203 8.75 7.77239 8.75 7.08203C8.75 6.39167 9.30967 5.83203 10 5.83203C10.6903 5.83203 11.25 6.39167 11.25 7.08203Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M5.36719 5.76097L8.79605 6.74066M11.0838 6.46387L14.7461 4.37109"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

interface QuickActionsDropdownProps {
  onClose: () => void;
  onOpenAdd?: () => void;
  onOpenCreateAsset?: () => void;
  onOpenAddTrade?: () => void;
}

const QuickActionsDropdown: React.FC<QuickActionsDropdownProps> = ({
  onClose,
  onOpenAdd,
  onOpenCreateAsset,
  onOpenAddTrade,
}) => {
  return (
    <div className="w-40 p-4 flex flex-col justify-center items-start gap-4 rounded-lg border border-tyrian-gray-darker bg-tyrian-black/50 backdrop-blur-[50px]">
      <button
        onClick={() => {
          onOpenAddTrade?.();
          onClose();
        }}
        className="flex items-center gap-2 self-stretch text-white font-nunito text-xs font-bold uppercase tracking-wide hover:text-tyrian-purple-primary transition-colors"
      >
        Add Trade
      </button>

      <button
        onClick={() => {
          onOpenCreateAsset?.();
          onClose();
        }}
        className="flex items-center gap-2 self-stretch text-white font-nunito text-xs font-bold uppercase tracking-wide hover:text-tyrian-purple-primary transition-colors"
      >
        Create Asset
      </button>

      <button
        onClick={() => handleAction("add-deposit")}
        className="flex items-center gap-2 self-stretch text-white font-nunito text-xs font-bold uppercase tracking-wide hover:text-tyrian-purple-primary transition-colors"
      >
        Add Deposit
      </button>

      <button
        onClick={() => handleAction("add-dividend")}
        className="flex items-center gap-2 self-stretch text-white font-nunito text-xs font-bold uppercase tracking-wide hover:text-tyrian-purple-primary transition-colors"
      >
        Add Dividend
      </button>

      <div className="w-full h-px bg-tyrian-gray-darker"></div>

      <button
        onClick={() => handleAction("import-trades")}
        className="flex items-center gap-2 self-stretch text-white font-nunito text-xs font-bold uppercase tracking-wide hover:text-tyrian-purple-primary transition-colors pb-4 border-b border-tyrian-gray-darker"
      >
        Import Trades
      </button>

      <button
        onClick={() => {
          onOpenAdd?.();
          onClose();
        }}
        className="flex items-center gap-1 self-stretch text-white font-nunito text-xs font-bold uppercase tracking-wide hover:text-tyrian-purple-primary transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Portfolio
      </button>
    </div>
  );
};

interface WalletDotsMenuProps {
  onClose: () => void;
}

const WalletDotsMenu: React.FC<WalletDotsMenuProps> = ({ onClose }) => {
  const handleAction = (action: string) => {
    console.log(`Wallet action: ${action}`);
    onClose();
  };

  return (
    <div className="w-40 p-4 flex flex-col justify-center items-start gap-4 rounded-lg border border-tyrian-gray-darker bg-tyrian-black/50 backdrop-blur-[50px]">
      <button
        onClick={() => handleAction("edit")}
        className="flex items-center gap-2 self-stretch text-white font-nunito text-xs font-bold uppercase tracking-wide hover:text-tyrian-purple-primary transition-colors"
      >
        Edit
      </button>

      <button
        onClick={() => handleAction("pin")}
        className="flex items-center gap-2 self-stretch text-white font-nunito text-xs font-bold uppercase tracking-wide hover:text-tyrian-purple-primary transition-colors"
      >
        Pin
      </button>

      <button
        onClick={() => handleAction("duplicate")}
        className="flex items-center gap-2 self-stretch text-white font-nunito text-xs font-bold uppercase tracking-wide hover:text-tyrian-purple-primary transition-colors"
      >
        Duplicate
      </button>

      <button
        onClick={() => handleAction("edit-balance")}
        className="flex items-center gap-2 self-stretch text-white font-nunito text-xs font-bold uppercase tracking-wide hover:text-tyrian-purple-primary transition-colors"
      >
        Edit Balance
      </button>

      <div className="w-full h-px bg-tyrian-gray-darker"></div>

      <button
        onClick={() => handleAction("import")}
        className="flex items-center gap-2 self-stretch text-white font-nunito text-xs font-bold uppercase tracking-wide hover:text-tyrian-purple-primary transition-colors"
      >
        Import
      </button>

      <button
        onClick={() => handleAction("import-csv")}
        className="flex items-center gap-2 self-stretch text-tyrian-gray-medium font-nunito text-xs font-bold uppercase tracking-wide hover:text-white transition-colors"
      >
        Import to csv
      </button>

      <button
        onClick={() => handleAction("import-xlsx")}
        className="flex items-center gap-2 self-stretch text-tyrian-gray-medium font-nunito text-xs font-bold uppercase tracking-wide hover:text-white transition-colors"
      >
        Import to xlsx
      </button>

      <div className="w-full h-px bg-tyrian-gray-darker"></div>

      <button
        onClick={() => handleAction("clear")}
        className="flex items-center gap-2 self-stretch text-red-500 font-nunito text-xs font-bold uppercase tracking-wide hover:text-red-400 transition-colors"
      >
        Clear
      </button>

      <button
        onClick={() => handleAction("delete")}
        className="flex items-center gap-2 self-stretch text-red-500 font-nunito text-xs font-bold uppercase tracking-wide hover:text-red-400 transition-colors"
      >
        Delete
      </button>
    </div>
  );
};

interface CurrencyDropdownProps {
  onClose: () => void;
}

const CurrencyDropdown: React.FC<CurrencyDropdownProps> = ({ onClose }) => {
  const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥" },
    { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$" },
    { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
    { code: "KRW", name: "South Korean Won", symbol: "₩" },
    { code: "INR", name: "Indian Rupee", symbol: "₹" },
  ];

  const handleCurrencySelect = (currency: {
    code: string;
    name: string;
    symbol: string;
  }) => {
    console.log(`Selected currency: ${currency.code}`);
    onClose();
  };

  return (
    <div className="w-48 p-2 flex flex-col gap-1 rounded-lg border border-tyrian-gray-darker bg-tyrian-black/50 backdrop-blur-[50px] max-h-60 overflow-y-auto">
      {currencies.map((currency) => (
        <button
          key={currency.code}
          onClick={() => handleCurrencySelect(currency)}
          className="flex items-center justify-between px-3 py-2 rounded-md text-white font-nunito text-sm hover:bg-tyrian-purple-primary/20 transition-colors text-left"
        >
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-xs uppercase">{currency.code}</span>
            <span className="text-tyrian-gray-medium text-xs truncate">
              {currency.name}
            </span>
          </div>
          <span className="text-white font-bold text-sm ml-2">
            {currency.symbol}
          </span>
        </button>
      ))}
    </div>
  );
};

interface WalletMainMenuProps {
  onClose: () => void;
  onSelectPortfolio?: (portfolioId: string) => void;
}

const WalletMainMenu: React.FC<WalletMainMenuProps> = ({
  onClose,
  onSelectPortfolio,
}) => {
  const [cryptoExpanded, setCryptoExpanded] = useState(true);
  const [addPortfolioOpen, setAddPortfolioOpen] = useState(false);
  const { userId } = useUser();
  const { data: investmentsData } = usePortfolios(userId, "investments");
  const { currentPortfolioId } = usePortfolioContext();

  const handleAction = (action: string) => {
    console.log(`Wallet menu action: ${action}`);
    onClose();
  };

  return (
    <div className="w-96 h-[650px] p-4 flex flex-col justify-between rounded-lg border border-tyrian-gray-darker bg-tyrian-black/50 backdrop-blur-[50px]">
      <div className="flex flex-col gap-4 flex-1 overflow-hidden">
        {/* Search */}
        <div className="flex h-10 px-3 py-2 items-center gap-2 rounded-lg border border-tyrian-gray-darker bg-tyrian-black/50 backdrop-blur-[50px]">
          <svg
            className="w-6 h-6 text-tyrian-gray-medium"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M22 22L20 20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-tyrian-gray-medium text-sm font-nunito">
            Search
          </span>
        </div>

        {/* All assets */}
        <div className="flex h-11 px-3 py-2 justify-between items-center rounded-lg border border-tyrian-gray-darker bg-tyrian-black/50 backdrop-blur-[50px] hover:bg-tyrian-purple-primary/20 cursor-pointer transition-colors">
          <div className="flex items-center gap-2">
            <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none">
              <path
                d="M10.5026 10.5026L5.83594 5.83594M18.6693 14.0026H25.6693M14.0026 18.6693V25.6693"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M14.0026 18.6693C16.5799 18.6693 18.6693 16.5799 18.6693 14.0026C18.6693 11.4253 16.5799 9.33594 14.0026 9.33594C11.4253 9.33594 9.33594 11.4253 9.33594 14.0026C9.33594 16.5799 11.4253 18.6693 14.0026 18.6693Z"
                stroke="white"
                strokeWidth="1.5"
              />
              <path
                d="M14.0026 25.6693C20.4459 25.6693 25.6693 20.4459 25.6693 14.0026C25.6693 7.55928 20.4459 2.33594 14.0026 2.33594C7.55928 2.33594 2.33594 7.55928 2.33594 14.0026C2.33594 20.4459 7.55928 25.6693 14.0026 25.6693Z"
                stroke="white"
                strokeWidth="1.5"
              />
            </svg>
            <div className="flex flex-col">
              <span className="text-white text-sm font-bold font-nunito">
                All assets
              </span>
              <span className="text-tyrian-gray-medium text-xs font-bold font-nunito">
                Composite ($)
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-white text-sm font-bold font-nunito">
              $1,000,000.00
            </span>
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
              <path
                d="M13.3333 7.33594V10.6693H10"
                stroke="#EF454A"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.3307 10.6693L9.9974 7.33594C9.409 6.74754 9.11486 6.45337 8.7538 6.42085C8.69406 6.41547 8.63406 6.41547 8.57433 6.42085C8.21326 6.45337 7.91913 6.74754 7.33073 7.33594C6.74233 7.92434 6.44816 8.21847 6.08711 8.251C6.02742 8.2564 5.96737 8.2564 5.90768 8.251C5.54663 8.21847 5.25244 7.92434 4.66406 7.33594L2.66406 5.33594"
                stroke="#EF454A"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Composite */}
        <div className="flex h-11 px-3 py-2 justify-between items-center rounded-lg border border-tyrian-gray-darker bg-tyrian-black/50 backdrop-blur-[50px] hover:bg-tyrian-purple-primary/20 cursor-pointer transition-colors">
          <div className="flex items-center gap-2">
            <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none">
              <path
                d="M19.3176 5.38863C18.3762 4.74949 17.3537 4.25656 16.2837 3.92023C14.9337 3.49589 14.2587 3.28372 13.5474 3.81675C12.8359 4.34979 12.8359 5.21558 12.8359 6.94717V12.2575C12.8359 13.7313 12.8359 14.4682 13.1091 15.1289C13.3823 15.7897 13.9002 16.3054 14.9359 17.3371L18.6681 21.0544C19.8851 22.2664 20.4936 22.8725 21.3661 22.7293C22.2388 22.5863 22.5621 21.9479 23.2089 20.6712C23.7038 19.6945 24.0652 18.6474 24.2785 17.5582C24.7286 15.2586 24.4976 12.8751 23.6145 10.7089C22.7315 8.54271 21.2362 6.69124 19.3176 5.38863Z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16.3333 23.819C15.2525 24.2565 14.071 24.4974 12.8333 24.4974C7.67867 24.4974 3.5 20.3187 3.5 15.1641C3.5 11.1543 6.02859 7.7351 9.57819 6.41406"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex items-center gap-1">
              <span className="text-white text-sm font-bold font-nunito">
                Composite
              </span>
              <div className="flex w-5 h-4 px-1 justify-center items-center rounded bg-tyrian-gray-darker">
                <span className="text-tyrian-purple-primary text-xs font-bold font-nunito">
                  1
                </span>
              </div>
            </div>
          </div>
          <ChevronDown className="w-5 h-5 text-white rotate-180" />
        </div>

        {/* Cryptowallet expanded */}
        <div className="flex flex-col gap-2">
          <div
            onClick={() => setCryptoExpanded(!cryptoExpanded)}
            className="flex h-11 px-3 py-2 justify-between items-center rounded-lg border border-tyrian-gray-darker bg-tyrian-black/50 backdrop-blur-[50px] hover:bg-tyrian-purple-primary/20 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2">
              <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none">
                <path
                  d="M14.0026 25.6693C20.4459 25.6693 25.6693 20.4459 25.6693 14.0026C25.6693 7.55928 20.4459 2.33594 14.0026 2.33594C7.55928 2.33594 2.33594 7.55928 2.33594 14.0026C2.33594 20.4459 7.55928 25.6693 14.0026 25.6693Z"
                  stroke="white"
                  strokeWidth="1.5"
                />
                <path
                  d="M11.0859 18.6693V9.33594"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M12.8359 9.33333V7M15.7526 9.33333V7"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M12.8359 20.9974V18.6641M15.7526 20.9974V18.6641"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M11.0859 14H16.9193C17.8857 14 18.6693 14.7835 18.6693 15.75V16.9167C18.6693 17.8831 17.8857 18.6667 16.9193 18.6667H9.33594"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.33594 9.33594H16.9193C17.8857 9.33594 18.6693 10.1194 18.6693 11.0859V12.2526C18.6693 13.2191 17.8857 14.0026 16.9193 14.0026H11.0859"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex items-center gap-1">
                <span className="text-white text-sm font-bold font-nunito">
                  Investments
                </span>
                {investmentsData && investmentsData.items.length > 0 && (
                  <div className="flex w-5 h-4 px-1 justify-center items-center rounded bg-tyrian-gray-darker">
                    <span className="text-tyrian-purple-primary text-xs font-bold font-nunito">
                      {investmentsData.items.length}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-white transition-transform ${cryptoExpanded ? "rotate-180" : ""}`}
            />
          </div>

          {/* Expanded portfolios */}
          {cryptoExpanded &&
            investmentsData &&
            investmentsData.items.length > 0 && (
              <div className="flex flex-col gap-2 pl-4">
                {investmentsData.items.map((portfolio) => (
                  <div
                    key={portfolio.id}
                    onClick={() => onSelectPortfolio?.(portfolio.id)}
                    className={`flex h-11 px-4 justify-between items-center rounded-lg border cursor-pointer transition-colors ${
                      currentPortfolioId === portfolio.id
                        ? "border-tyrian-purple-primary bg-tyrian-purple-primary/20"
                        : "border-tyrian-gray-darker bg-tyrian-black/50 backdrop-blur-[50px] hover:bg-tyrian-purple-primary/20"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-tyrian-purple-primary flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {portfolio.name.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white text-sm font-bold font-nunito">
                          {portfolio.name}
                        </span>
                        <span className="text-tyrian-gray-medium text-xs font-bold font-nunito">
                          Investments ({portfolio.currency})
                        </span>
                      </div>
                    </div>
                    <span className="text-white text-sm font-bold font-nunito">
                      $0.00
                    </span>
                  </div>
                ))}
              </div>
            )}
        </div>

        {/* Bottom buttons */}
        <div className="mt-auto space-y-2">
          <button
            onClick={() => handleAction("add-crypto-wallet")}
            className="flex w-full h-10 px-4 py-3 justify-center items-center gap-2 rounded-[32px] bg-tyrian-gradient-animated backdrop-blur-[58px] hover-lift"
          >
            <Plus className="w-5 h-5 text-white" />
            <span className="text-white text-sm font-bold font-nunito">
              Add Crypto Wallet
            </span>
          </button>

          <button
            onClick={() => setAddPortfolioOpen(true)}
            className="flex w-full h-10 px-4 py-3 justify-center items-center gap-2 rounded-[32px] bg-tyrian-gradient-animated backdrop-blur-[58px] hover-lift"
          >
            <Plus className="w-5 h-5 text-white" />
            <span className="text-white text-sm font-bold font-nunito">
              Add Portfolio
            </span>
          </button>
        </div>
      </div>

      {/* Bottom Add Portfolio button */}
      <button
        onClick={() => setAddPortfolioOpen(true)}
        className="flex w-full h-10 px-4 py-3 justify-center items-center gap-2 rounded-[32px] bg-tyrian-gradient-animated backdrop-blur-[58px] hover-lift mt-4"
      >
        <Plus className="w-5 h-5 text-white" />
        <span className="text-white text-sm font-bold font-nunito">
          Add Portfolio
        </span>
      </button>
      {addPortfolioOpen && (
        <div className="fixed inset-0 z-[100]">
          <AddPortfolioModal
            isOpen={addPortfolioOpen}
            onClose={() => setAddPortfolioOpen(false)}
            userId={userId}
          />
        </div>
      )}
    </div>
  );
};

export default PersistentNav;
