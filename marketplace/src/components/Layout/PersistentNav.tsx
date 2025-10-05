'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
} from 'lucide-react';

const PersistentNav: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const currencyButtonRef = useRef<HTMLDivElement>(null);
  const currencyDropdownRef = useRef<HTMLDivElement>(null);

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

      // Currency dropdown
      if (
        currencyDropdownRef.current &&
        currencyButtonRef.current &&
        !currencyDropdownRef.current.contains(target) &&
        !currencyButtonRef.current.contains(target)
      ) {
        setIsCurrencyDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full max-w-[1293px] mx-auto px-3 sm:px-4 lg:px-0 pt-6">
      {/* Header row: left (wallet + quick actions), right (calendar menu) */}
      <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-4 lg:gap-6 mb-6 w-full">
        {/* Left cluster: Current Wallet + Quick Actions */}
        <div className="flex flex-col sm:flex-row lg:flex-row items-start sm:items-end lg:items-end gap-3 sm:gap-4 lg:gap-[18px] w-full lg:w-auto">
          {/* Current Wallet */}
          <div className="flex flex-col gap-1 w-full sm:w-auto relative">
            <span className="text-[#B0B0B0] text-xs font-bold font-nunito">
              Current Wallet
            </span>
            <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 p-2 pl-3 sm:pl-4 pr-2 rounded-lg border border-[#181B22] container-card hover-lift w-full sm:w-auto">
              <div className="flex items-center justify-between min-w-[160px] sm:w-[180px] flex-1 sm:flex-initial">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#523A83] flex-shrink-0"></div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-white text-sm font-bold font-nunito truncate">
                      MetaMask
                    </span>
                    <span className="text-white text-xs font-bold font-nunito">
                      1,000$
                    </span>
                  </div>
                </div>
                <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-white rotate-180 flex-shrink-0" />
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Currency dropdown button */}
                <div
                  ref={currencyButtonRef}
                  onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                  className="flex items-center px-2 py-1 rounded bg-gradient-to-r from-[#A06AFF] to-[#482090] hover-lift cursor-pointer"
                >
                  <span className="text-white text-xs font-bold font-nunito">USD</span>
                  <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-white ml-1 sm:ml-2" />
                </div>
                {/* Three dots menu button */}
                <button className="p-1 hover:bg-[#20252B]/30 rounded">
                  <MoreHorizontal className="w-5 h-5 sm:w-6 sm:h-6 text-white rotate-90" />
                </button>
              </div>
            </div>

            {/* Currency Dropdown */}
            {isCurrencyDropdownOpen && (
              <div
                ref={currencyDropdownRef}
                className="absolute top-full right-12 mt-2 z-50 animate-in slide-in-from-top-2 duration-200"
              >
                <CurrencyDropdown onClose={() => setIsCurrencyDropdownOpen(false)} />
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="relative">
            <button
              ref={buttonRef}
              onClick={() => setIsQuickActionsOpen(!isQuickActionsOpen)}
              className="flex items-center justify-center gap-0 sm:gap-2 w-10 h-10 sm:w-auto sm:h-auto px-0 sm:px-4 py-0 sm:py-3 rounded-[12px] sm:rounded-[32px] bg-gradient-to-r from-[#A06AFF] to-[#482090] backdrop-blur-[58px] hover-lift"
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
                  router={router}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right side: Calendar/New listings/Psychology */}
        <div className="w-full lg:w-auto flex flex-col gap-2">
          <div className="flex items-center gap-2 sm:gap-3 p-1 rounded-[36px] border border-[#181B22] container-card overflow-x-auto scrollbar-hide w-full lg:w-auto">
            <NavButton
              icon={<Calendar className="w-4 h-4 sm:w-5 sm:h-5" />}
              onClick={() => router.push('/calendar')}
            >
              Calendar
            </NavButton>
            <NavButton
              icon={<FileText className="w-4 h-4 sm:w-5 sm:h-5" />}
              onClick={() => router.push('/all-tab')}
            >
              All Products
            </NavButton>
            <NavButton
              icon={<Brain className="w-4 h-4 sm:w-5 sm:h-5" />}
              onClick={() => router.push('/strategies-tab')}
            >
              Strategies
            </NavButton>
            <NavButton icon={<Settings className="w-4 h-4 sm:w-5 sm:h-5" />} iconOnly />
          </div>
        </div>
      </div>

      {/* Portfolio Navigation */}
      <div className="w-full mb-8">
        <div className="flex items-center gap-2 sm:gap-3 p-1 rounded-[36px] border border-[#181B22] container-card overflow-x-auto scrollbar-hide">
          <PortfolioNavButton
            active={pathname === '/'}
            icon={<Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />}
            onClick={() => router.push('/')}
          >
            <span className="sm:hidden">My</span>
            <span className="hidden sm:inline">My Products</span>
          </PortfolioNavButton>
          <PortfolioNavButton
            active={pathname === '/portfolios'}
            icon={<Users className="w-4 h-4 sm:w-5 sm:h-5" />}
            onClick={() => router.push('/portfolios')}
          >
            <span className="sm:hidden">Following</span>
            <span className="hidden sm:inline">All Categories</span>
          </PortfolioNavButton>
          <PortfolioNavButton
            active={pathname === '/signals'}
            icon={<TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />}
            onClick={() => router.push('/signals')}
          >
            Trending
          </PortfolioNavButton>
        </div>
      </div>
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
    className={`flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-[32px] border border-[#181B22] container-card text-white transition-all hover:bg-[#523A83]/40 hover-lift min-h-[40px] sm:min-h-[44px] ${
      iconOnly ? 'w-10 sm:w-12 flex-shrink-0' : 'flex-shrink-0'
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
        ? 'bg-gradient-to-r from-[#A06AFF] to-[#482090] text-white hover-lift'
        : 'border border-[#181B22] container-card text-[#B0B0B0] hover:text-white hover:bg-[#20252B]/30 hover-lift'
    }`}
  >
    {icon}
    <span className="whitespace-nowrap">{children}</span>
  </button>
);

interface QuickActionsDropdownProps {
  onClose: () => void;
  router: any;
}

const QuickActionsDropdown: React.FC<QuickActionsDropdownProps> = ({ onClose, router }) => {
  return (
    <div className="w-40 p-4 flex flex-col justify-center items-start gap-4 rounded-lg border border-[#181B22] bg-black/50 backdrop-blur-[50px]">
      <button
        onClick={() => {
          router.push('/create-product');
          onClose();
        }}
        className="flex items-center gap-2 self-stretch text-white font-nunito text-xs font-bold uppercase tracking-wide hover:text-[#A06AFF] transition-colors"
      >
        Create Product
      </button>

      <button
        onClick={() => {
          router.push('/all-tab');
          onClose();
        }}
        className="flex items-center gap-2 self-stretch text-white font-nunito text-xs font-bold uppercase tracking-wide hover:text-[#A06AFF] transition-colors"
      >
        All Products
      </button>

      <button
        onClick={() => {
          router.push('/strategies-tab');
          onClose();
        }}
        className="flex items-center gap-2 self-stretch text-white font-nunito text-xs font-bold uppercase tracking-wide hover:text-[#A06AFF] transition-colors"
      >
        Strategies
      </button>

      <button
        onClick={() => {
          router.push('/scripts-tab');
          onClose();
        }}
        className="flex items-center gap-2 self-stretch text-white font-nunito text-xs font-bold uppercase tracking-wide hover:text-[#A06AFF] transition-colors"
      >
        Scripts
      </button>

      <div className="w-full h-px bg-[#181B22]"></div>

      <button
        onClick={() => {
          router.push('/courses-tab');
          onClose();
        }}
        className="flex items-center gap-1 self-stretch text-white font-nunito text-xs font-bold uppercase tracking-wide hover:text-[#A06AFF] transition-colors"
      >
        Courses
      </button>
    </div>
  );
};

interface CurrencyDropdownProps {
  onClose: () => void;
}

const CurrencyDropdown: React.FC<CurrencyDropdownProps> = ({ onClose }) => {
  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  ];

  const handleCurrencySelect = (currency: { code: string; name: string; symbol: string }) => {
    console.log(`Selected currency: ${currency.code}`);
    onClose();
  };

  return (
    <div className="w-48 p-2 flex flex-col gap-1 rounded-lg border border-[#181B22] bg-black/50 backdrop-blur-[50px] max-h-60 overflow-y-auto">
      {currencies.map((currency) => (
        <button
          key={currency.code}
          onClick={() => handleCurrencySelect(currency)}
          className="flex items-center justify-between px-3 py-2 rounded-md text-white font-nunito text-sm hover:bg-[#A06AFF]/20 transition-colors text-left"
        >
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-xs uppercase">{currency.code}</span>
            <span className="text-[#B0B0B0] text-xs truncate">{currency.name}</span>
          </div>
          <span className="text-white font-bold text-sm ml-2">{currency.symbol}</span>
        </button>
      ))}
    </div>
  );
};

export default PersistentNav;

