import React, { useState } from 'react';
import { X, Briefcase, DollarSign, Globe, Building } from 'lucide-react';

interface PortfolioAvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectIcon: (categoryId: string, iconId: string) => void;
  currentIcon?: { categoryId: string; iconId: string };
}

const PortfolioAvatarModal: React.FC<PortfolioAvatarModalProps> = ({
  isOpen,
  onClose,
  onSelectIcon,
  currentIcon
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('broker');
  const [selectedIcon, setSelectedIcon] = useState<{ categoryId: string; iconId: string } | null>(
    currentIcon || null
  );

  if (!isOpen) return null;

  const categories = [
    { id: 'broker', label: 'Broker', icon: Briefcase, color: '#A06AFF' },
    { id: 'crypto', label: 'Crypto', icon: CryptoIcon, color: '#B0B0B0' },
    { id: 'finance', label: 'Finance', icon: FinanceIcon, color: '#B0B0B0' },
    { id: 'countries', label: 'Countries', icon: Globe, color: '#B0B0B0' },
    { id: 'banks', label: 'Banks', icon: Building, color: '#B0B0B0' },
  ];

  const iconsByCategory = {
    broker: [
      { id: 'nasdaq-1', component: NasdaqIcon },
      { id: 'nasdaq-2', component: NasdaqIcon },
      { id: 'nasdaq-3', component: NasdaqIcon },
      { id: 'nasdaq-4', component: NasdaqIcon },
      { id: 'nasdaq-5', component: NasdaqIcon },
      { id: 'nasdaq-6', component: NasdaqIcon },
      { id: 'nasdaq-7', component: NasdaqIcon },
      { id: 'nasdaq-8', component: NasdaqIcon },
      { id: 'nasdaq-9', component: NasdaqIcon },
      { id: 'nasdaq-10', component: NasdaqIcon },
      { id: 'nasdaq-11', component: NasdaqIcon },
      { id: 'nasdaq-12', component: NasdaqIcon },
      { id: 'nasdaq-13', component: NasdaqIcon },
      { id: 'nasdaq-14', component: NasdaqIcon },
      { id: 'nasdaq-15', component: NasdaqIcon },
      { id: 'nasdaq-16', component: NasdaqIcon },
      { id: 'nasdaq-17', component: NasdaqIcon },
      { id: 'nasdaq-18', component: NasdaqIcon },
      { id: 'nasdaq-19', component: NasdaqIcon },
      { id: 'nasdaq-20', component: NasdaqIcon },
      { id: 'nasdaq-21', component: NasdaqIcon },
      { id: 'nasdaq-22', component: NasdaqIcon },
      { id: 'nasdaq-23', component: NasdaqIcon },
      { id: 'nasdaq-24', component: NasdaqIcon },
    ],
    crypto: [
      { id: 'huobi', component: HuobiIcon },
      { id: 'okx', component: OkxIcon },
      { id: 'kucoin', component: KucoinIcon },
      { id: 'bybit', component: BybitIcon },
      { id: 'solana', component: SolanaIcon },
      { id: 'polygon', component: PolygonIcon },
      { id: 'bsc', component: BSCIcon },
      { id: 'bitcoin', component: BitcoinIcon },
      { id: 'ethereum', component: EthereumIcon },
      { id: 'tron', component: TronIcon },
      { id: 'ton', component: TONIcon },
      { id: 'binance', component: BinanceIcon },
      { id: 'huobi-2', component: HuobiIcon },
      { id: 'okx-2', component: OkxIcon },
      { id: 'kucoin-2', component: KucoinIcon },
      { id: 'ethereum-2', component: EthereumIcon },
      { id: 'tron-2', component: TronIcon },
      { id: 'solana-2', component: SolanaIcon },
      { id: 'bitcoin-2', component: BitcoinIcon },
      { id: 'polygon-2', component: PolygonIcon },
      { id: 'huobi-3', component: HuobiIcon },
      { id: 'okx-3', component: OkxIcon },
      { id: 'binance-2', component: BinanceIcon },
      { id: 'bybit-2', component: BybitIcon },
      { id: 'ton-2', component: TONIcon },
    ],
    finance: [
      { id: 'finance-1', component: FinanceIcon },
      { id: 'finance-2', component: FinanceIcon },
      { id: 'finance-3', component: FinanceIcon },
      { id: 'finance-4', component: FinanceIcon },
      { id: 'finance-5', component: FinanceIcon },
      { id: 'finance-6', component: FinanceIcon },
      { id: 'finance-7', component: FinanceIcon },
      { id: 'finance-8', component: FinanceIcon },
      { id: 'finance-9', component: FinanceIcon },
      { id: 'finance-10', component: FinanceIcon },
      { id: 'finance-11', component: FinanceIcon },
      { id: 'finance-12', component: FinanceIcon },
      { id: 'finance-13', component: FinanceIcon },
      { id: 'finance-14', component: FinanceIcon },
      { id: 'finance-15', component: FinanceIcon },
      { id: 'finance-16', component: FinanceIcon },
      { id: 'finance-17', component: FinanceIcon },
      { id: 'finance-18', component: FinanceIcon },
      { id: 'finance-19', component: FinanceIcon },
      { id: 'finance-20', component: FinanceIcon },
      { id: 'finance-21', component: FinanceIcon },
      { id: 'finance-22', component: FinanceIcon },
      { id: 'finance-23', component: FinanceIcon },
      { id: 'finance-24', component: FinanceIcon },
    ],
    countries: [
      { id: 'country-1', component: CountryIcon },
      { id: 'country-2', component: CountryIcon },
      { id: 'country-3', component: CountryIcon },
      { id: 'country-4', component: CountryIcon },
      { id: 'country-5', component: CountryIcon },
      { id: 'country-6', component: CountryIcon },
      { id: 'country-7', component: CountryIcon },
      { id: 'country-8', component: CountryIcon },
      { id: 'country-9', component: CountryIcon },
      { id: 'country-10', component: CountryIcon },
      { id: 'country-11', component: CountryIcon },
      { id: 'country-12', component: CountryIcon },
      { id: 'country-13', component: CountryIcon },
      { id: 'country-14', component: CountryIcon },
      { id: 'country-15', component: CountryIcon },
      { id: 'country-16', component: CountryIcon },
      { id: 'country-17', component: CountryIcon },
      { id: 'country-18', component: CountryIcon },
      { id: 'country-19', component: CountryIcon },
      { id: 'country-20', component: CountryIcon },
      { id: 'country-21', component: CountryIcon },
      { id: 'country-22', component: CountryIcon },
      { id: 'country-23', component: CountryIcon },
      { id: 'country-24', component: CountryIcon },
    ],
    banks: [
      { id: 'bank-1', component: BankIcon },
      { id: 'bank-2', component: BankIcon },
      { id: 'bank-3', component: BankIcon },
      { id: 'bank-4', component: BankIcon },
      { id: 'bank-5', component: BankIcon },
      { id: 'bank-6', component: BankIcon },
      { id: 'bank-7', component: BankIcon },
      { id: 'bank-8', component: BankIcon },
      { id: 'bank-9', component: BankIcon },
      { id: 'bank-10', component: BankIcon },
      { id: 'bank-11', component: BankIcon },
      { id: 'bank-12', component: BankIcon },
      { id: 'bank-13', component: BankIcon },
      { id: 'bank-14', component: BankIcon },
      { id: 'bank-15', component: BankIcon },
      { id: 'bank-16', component: BankIcon },
      { id: 'bank-17', component: BankIcon },
      { id: 'bank-18', component: BankIcon },
      { id: 'bank-19', component: BankIcon },
      { id: 'bank-20', component: BankIcon },
      { id: 'bank-21', component: BankIcon },
      { id: 'bank-22', component: BankIcon },
      { id: 'bank-23', component: BankIcon },
      { id: 'bank-24', component: BankIcon },
    ],
  };

  const handleSave = () => {
    if (selectedIcon) {
      onSelectIcon(selectedIcon.categoryId, selectedIcon.iconId);
      onClose();
    }
  };

  const handleIconSelect = (categoryId: string, iconId: string) => {
    setSelectedIcon({ categoryId, iconId });
  };

  const isIconSelected = (categoryId: string, iconId: string) => {
    return selectedIcon?.categoryId === categoryId && selectedIcon?.iconId === iconId;
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden mx-4">
        <div className="w-full rounded-lg border border-tyrian-gray-darker glass-card backdrop-blur-[50px] bg-tyrian-dark/50">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-tyrian-gray-darker">
            <h2 className="text-white text-2xl font-bold font-nunito">Portfolio Avatar</h2>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-6 h-6 rounded-md hover:bg-tyrian-purple-dark/30 transition duration-300"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="flex h-[512px]">
            {/* Sidebar */}
            <div className="flex flex-col w-24 p-6 gap-4 border-r border-tyrian-gray-darker">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl transition duration-300 ${
                    selectedCategory === category.id
                      ? 'text-tyrian-purple-primary'
                      : 'text-tyrian-gray-medium hover:text-white'
                  }`}
                >
                  <category.icon
                    className="w-5 h-5"
                    style={{ color: selectedCategory === category.id ? '#A06AFF' : '#B0B0B0' }}
                  />
                  <span className="text-sm font-bold font-nunito text-center">{category.label}</span>
                </button>
              ))}
            </div>

            {/* Icons Grid */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="grid grid-cols-6 gap-4 items-center justify-items-center">
                {iconsByCategory[selectedCategory as keyof typeof iconsByCategory]?.map((iconData) => (
                  <button
                    key={iconData.id}
                    onClick={() => handleIconSelect(selectedCategory, iconData.id)}
                    className={`relative w-16 h-16 rounded-full transition duration-300 hover:scale-105 ${
                      isIconSelected(selectedCategory, iconData.id)
                        ? 'ring-2 ring-tyrian-purple-primary'
                        : ''
                    }`}
                  >
                    <iconData.component className="w-16 h-16" />
                    {isIconSelected(selectedCategory, iconData.id) && (
                      <div className="absolute -top-1 -right-1">
                        <CheckIcon className="w-6 h-6" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-4 p-6 border-t border-tyrian-gray-darker">
            <button
              onClick={onClose}
              className="flex items-center justify-center w-45 h-10 px-4 py-3 rounded-full border border-tyrian-gray-darker glass-card bg-tyrian-dark/50 backdrop-blur-[58px] text-white text-sm font-bold font-nunito transition duration-300 hover:bg-tyrian-purple-dark/20"
            >
              Delete
            </button>
            <button
              onClick={handleSave}
              disabled={!selectedIcon}
              className="flex items-center justify-center w-45 h-10 px-4 py-3 rounded-full bg-tyrian-gradient-animated backdrop-blur-[58px] text-white text-sm font-bold font-nunito transition duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Crypto Icon Component
const CryptoIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ 
  className, 
  style 
}) => (
  <svg className={className} style={style} viewBox="0 0 20 20" fill="none">
    <g clipPath="url(#clip0_crypto)">
      <path d="M10.0013 18.3327C14.6037 18.3327 18.3346 14.6017 18.3346 9.99935C18.3346 5.39698 14.6037 1.66602 10.0013 1.66602C5.39893 1.66602 1.66797 5.39698 1.66797 9.99935C1.66797 14.6017 5.39893 18.3327 10.0013 18.3327Z" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M7.91797 13.3327V6.66602" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M9.16797 6.66667V5M11.2513 6.66667V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M9.16797 15.0007V13.334M11.2513 15.0007V13.334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M7.91797 10H12.0846C12.775 10 13.3346 10.5597 13.3346 11.25V12.0833C13.3346 12.7737 12.775 13.3333 12.0846 13.3333H6.66797" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.66797 6.66602H12.0846C12.775 6.66602 13.3346 7.22566 13.3346 7.91602V8.74935C13.3346 9.43968 12.775 9.99935 12.0846 9.99935H7.91797" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    <defs>
      <clipPath id="clip0_crypto">
        <rect width="20" height="20" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

// Finance Icon Component
const FinanceIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ 
  className, 
  style 
}) => (
  <svg className={className} style={style} viewBox="0 0 20 20" fill="none">
    <path d="M12.0846 10.0013C12.0846 11.1519 11.1519 12.0847 10.0013 12.0847C8.8507 12.0847 7.91797 11.1519 7.91797 10.0013C7.91797 8.85074 8.8507 7.91797 10.0013 7.91797C11.1519 7.91797 12.0846 8.85074 12.0846 10.0013Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.3346 4.16797C15.4008 4.16797 16.8266 4.48814 17.6121 4.73157C18.0643 4.87173 18.3346 5.30038 18.3346 5.77384V13.9032C18.3346 14.8325 17.3112 15.5317 16.3981 15.3592C15.6147 15.2113 14.5936 15.0925 13.3346 15.0925C9.37555 15.0925 8.42597 16.5972 2.62197 15.3173C2.06184 15.1938 1.66797 14.6901 1.66797 14.1165V5.76894C1.66797 4.95572 2.43529 4.36269 3.23295 4.52097C8.49855 5.56585 9.51872 4.16797 13.3346 4.16797Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1.66797 7.50065C3.29408 7.50065 4.75533 6.17154 4.94214 4.79578M15.4184 4.58398C15.4184 6.28368 16.8892 7.89148 18.3346 7.89148M18.3346 12.5007C16.7521 12.5007 15.2181 13.5925 15.0863 15.0826M5.00171 15.4141C5.00171 13.5731 3.50933 12.0808 1.66838 12.0808" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Country Icon Component  
const CountryIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ 
  className, 
  style 
}) => (
  <svg className={className} style={style} viewBox="0 0 20 20" fill="none">
    <g clipPath="url(#clip0_country)">
      <path d="M10.0013 18.3327C5.39893 18.3327 1.66797 14.6017 1.66797 9.99935C1.66797 7.67223 2.62184 5.56791 4.15994 4.05603M10.0013 18.3327C9.1988 17.738 9.32689 17.0456 9.72947 16.3533C10.3485 15.2888 10.3485 15.2888 10.3485 13.8697C10.3485 12.4505 11.1918 11.7851 14.168 12.3803C15.5052 12.6478 16.4797 10.8001 18.2157 11.4102M10.0013 18.3327C14.1228 18.3327 17.5455 15.3407 18.2157 11.4102M4.15994 4.05603C4.86769 4.13072 5.26394 4.50988 5.9221 5.20532C7.17164 6.52562 8.42114 6.63578 9.25422 6.19568C10.5037 5.53554 9.45372 4.46627 10.9202 3.88517C11.8193 3.52894 11.9906 2.59601 11.5651 1.81251M4.15994 4.05603C5.66376 2.57786 7.72604 1.66602 10.0013 1.66602C10.5358 1.66602 11.0586 1.71634 11.5651 1.81251M18.2157 11.4102C18.2939 10.9516 18.3346 10.4803 18.3346 9.99935C18.3346 5.93149 15.42 2.54439 11.5651 1.81251" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </g>
    <defs>
      <clipPath id="clip0_country">
        <rect width="20" height="20" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

// Bank Icon Component
const BankIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ 
  className, 
  style 
}) => (
  <svg className={className} style={style} viewBox="0 0 20 20" fill="none">
    <g clipPath="url(#clip0_bank)">
      <path d="M1.66797 7.14024C1.66797 6.14342 2.06995 5.53253 2.90183 5.06958L6.32619 3.16388C8.12055 2.16531 9.01772 1.66602 10.0013 1.66602C10.9849 1.66602 11.8821 2.16531 13.6764 3.16388L17.1008 5.06958C17.9326 5.53253 18.3346 6.14343 18.3346 7.14024C18.3346 7.41054 18.3346 7.54569 18.3051 7.6568C18.1501 8.24056 17.6211 8.33268 17.1102 8.33268H2.89237C2.38153 8.33268 1.85257 8.24055 1.69749 7.6568C1.66797 7.54569 1.66797 7.41054 1.66797 7.14024Z" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M9.99609 5.83398H10.0036" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3.33203 8.33398V15.4173M6.66536 8.33398V15.4173" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M13.332 8.33398V15.4173M16.6654 8.33398V15.4173" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M15.8346 15.416H4.16797C2.78726 15.416 1.66797 16.5353 1.66797 17.916C1.66797 18.1461 1.85452 18.3327 2.08464 18.3327H17.918C18.1481 18.3327 18.3346 18.1461 18.3346 17.916C18.3346 16.5353 17.2154 15.416 15.8346 15.416Z" stroke="currentColor" strokeWidth="1.5"/>
    </g>
    <defs>
      <clipPath id="clip0_bank">
        <rect width="20" height="20" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

// Crypto Platform Icons
const HuobiIcon: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`${className} relative`}>
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id="huobi-gradient" x1="11.9063" y1="11.0994" x2="77.8823" y2="86.8766" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1A1E21"/>
          <stop offset="1" stopColor="#06060A"/>
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="32" fill="url(#huobi-gradient)"/>
      <path d="M36.5709 22.5085C36.5709 16.2731 33.5846 10.9108 31.3138 9.16453C31.3035 9.15882 31.1389 9.0651 31.1538 9.31424L31.1492 9.32224C30.9606 21.3611 24.9138 24.6251 21.5892 29.0205C13.9172 39.1634 21.0521 50.2845 28.3183 52.3405C32.3835 53.4902 27.3789 50.3062 26.7343 43.5782C25.9549 35.4468 36.5709 29.24 36.5709 22.5085Z" fill="#E6EEFA"/>
      <path d="M40.5365 26.3149C40.4908 26.2829 40.4245 26.26 40.3788 26.3377C40.2542 27.8703 38.7388 31.1492 36.8188 34.1594C30.3045 44.3697 34.0165 49.292 36.1045 51.9354C37.3159 53.4703 36.1045 51.9354 39.1331 50.3674C39.3708 50.244 45.0439 46.9572 45.6588 39.468C46.2531 32.2154 42.0371 27.6429 40.5365 26.3149Z" fill="#2EA7DF"/>
    </svg>
  </div>
);

const OkxIcon: React.FC<{ className?: string }> = ({ className }) => (
  <img src="https://api.builder.io/api/v1/image/assets/TEMP/9b644e1de2162788125b7168f15b37f4397997ff?width=128" className={`${className} rounded-full`} alt="Okx" />
);

const BinanceIcon: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`${className} relative`}>
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="32" fill="#EEB00E"/>
      <g clipPath="url(#binance-clip)">
        <path d="M20.575 27.765L32 16.34L43.425 27.77L49.81 21.38L32 3.57L14.19 21.38L20.575 27.765Z" fill="white"/>
        <path d="M6 32L11.385 26.615L16.77 32L11.385 37.385L6 32Z" fill="white"/>
        <path d="M20.575 36.235L32 47.66L43.425 36.23L49.81 42.615L32 60.43L14.19 42.62L20.575 36.235Z" fill="white"/>
        <path d="M47.23 32L52.615 26.615L58 32L52.615 37.385L47.23 32Z" fill="white"/>
        <path d="M41.22 32L32 22.78L27.48 27.3L27.24 27.54L26.78 32L32 37.22L41.22 32Z" fill="white"/>
      </g>
      <defs>
        <clipPath id="binance-clip">
          <rect width="52" height="52" fill="white" transform="translate(6 6)"/>
        </clipPath>
      </defs>
    </svg>
  </div>
);

const BybitIcon: React.FC<{ className?: string }> = ({ className }) => (
  <img src="https://api.builder.io/api/v1/image/assets/TEMP/69248b3c08ca92f2bf0dca45ed7f3121c7332004?width=128" className={`${className} rounded-full`} alt="ByBit" />
);

const SolanaIcon: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`${className} relative`}>
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id="solana-bg" x1="11.9086" y1="11.0971" x2="77.8857" y2="86.88" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1A1E21"/>
          <stop offset="1" stopColor="#06060A"/>
        </linearGradient>
        <linearGradient id="solana-1" x1="16.0679" y1="26.7883" x2="47.3707" y2="17.5426" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6E73E3"/>
          <stop offset="0.32" stopColor="#41B8C8"/>
          <stop offset="0.58" stopColor="#27E2B7"/>
          <stop offset="1" stopColor="#16FC99"/>
        </linearGradient>
        <linearGradient id="solana-2" x1="14.1619" y1="45.76" x2="49.8419" y2="40.7543" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9E48FF"/>
          <stop offset="0.34" stopColor="#8D4DF9"/>
          <stop offset="0.57" stopColor="#6B7AE1"/>
          <stop offset="0.95" stopColor="#45B3CE"/>
        </linearGradient>
        <linearGradient id="solana-3" x1="16.2076" y1="32.0008" x2="48.4819" y2="32.0008" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8654F3"/>
          <stop offset="0.47" stopColor="#549AD6"/>
          <stop offset="0.93" stopColor="#26D9B2"/>
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="32" fill="url(#solana-bg)"/>
      <path d="M43.5879 23.6683C43.3593 23.874 43.0736 23.9997 42.7764 23.9997H15.5764C14.9821 23.9997 14.6507 23.3597 15.005 22.9026L20.3193 17.4854C20.5479 17.2683 20.8336 17.1426 21.1307 17.1426H48.4221C49.0164 17.1426 49.3479 17.794 48.9936 18.2397L43.5879 23.6683Z" fill="url(#solana-1)"/>
      <path d="M43.5905 46.5371C43.3619 46.7429 43.0762 46.8571 42.7676 46.8571H15.5676C14.9962 46.8571 14.6533 46.2171 14.9962 45.76L20.3219 40.3314C20.5505 40.1143 20.8362 40 21.1333 40H48.4247C49.019 40 49.3505 40.6514 48.9962 41.0971L43.5905 46.5371Z" fill="url(#solana-2)"/>
      <path d="M43.5905 28.8923C43.3619 28.6866 43.0762 28.5723 42.7676 28.5723H15.5676C14.9962 28.5723 14.6533 29.2123 14.9962 29.6694L20.3219 35.098C20.5505 35.3037 20.8362 35.4294 21.1333 35.4294H48.4247C49.019 35.4294 49.3505 34.778 48.9962 34.3323L43.5905 28.8923Z" fill="url(#solana-3)"/>
    </svg>
  </div>
);

const PolygonIcon: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`${className} relative`}>
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="32" fill="#6C00F6"/>
      <path d="M13.7148 42.2514V30.7086L23.9434 24.7657L27.4291 26.9143V32.1143L23.9434 30.0343L18.2863 33.1886V39.6114L23.9434 42.88L29.7148 39.6114V21.7486L39.9206 16L50.2863 21.7486V33.3029L39.9206 39.1314L36.572 37.0286V31.8629L39.9206 33.9086L45.7148 30.7086V24.3543L39.9206 21.1314L34.2863 24.3429V42.24L23.9434 48L13.7148 42.2514Z" fill="white"/>
    </svg>
  </div>
);

const BSCIcon: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`${className} relative`}>
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="32" fill="#EEB00E"/>
      <g clipPath="url(#bsc-clip)">
        <path d="M20.575 27.765L32 16.34L43.425 27.77L49.81 21.38L32 3.57L14.19 21.38L20.575 27.765Z" fill="white"/>
        <path d="M6 32L11.385 26.615L16.77 32L11.385 37.385L6 32Z" fill="white"/>
        <path d="M20.575 36.235L32 47.66L43.425 36.23L49.81 42.615L32 60.43L14.19 42.62L20.575 36.235Z" fill="white"/>
        <path d="M47.23 32L52.615 26.615L58 32L52.615 37.385L47.23 32Z" fill="white"/>
        <path d="M41.22 32L32 22.78L27.48 27.3L27.24 27.54L26.78 32L32 37.22L41.22 32Z" fill="white"/>
      </g>
      <defs>
        <clipPath id="bsc-clip">
          <rect width="52" height="52" fill="white" transform="translate(6 6)"/>
        </clipPath>
      </defs>
    </svg>
  </div>
);

const BitcoinIcon: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`${className} relative`}>
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="32" fill="#F7931A"/>
      <path d="M45.6396 28.2335C46.2282 24.2404 43.2054 22.1112 39.0419 20.6655L40.3905 15.2849L37.1025 14.4667L35.7905 19.7147L33.1665 19.0872L34.4968 13.8015L31.2076 12.9844L29.8579 18.3844L27.7665 17.8895V17.8712L23.2225 16.7295L22.3471 20.2472C22.3471 20.2472 24.7814 20.8187 24.7425 20.8369C26.0739 21.1798 26.3025 22.0541 26.2648 22.7387L24.7425 28.8987L25.0854 29.0129L24.7242 28.9364L22.5756 37.5501C22.4236 37.9501 22.0042 38.5581 21.0739 38.3101C21.1116 38.3672 18.6968 37.7398 18.6968 37.7398L17.0625 41.4861L21.3402 42.5501L23.6785 43.1592L22.3094 48.6164L25.5985 49.4335L26.9299 44.0335L29.5722 44.7181L28.2236 50.0987L31.5116 50.9169L32.8614 45.4598C38.4705 46.5238 42.6922 46.1067 44.4614 41.0289C45.8865 36.9421 44.3848 34.6027 41.4374 33.0438C43.5859 32.5684 45.2019 31.1421 45.6202 28.2324H45.6396V28.2335ZM38.1288 38.7672C37.1208 42.8552 30.2385 40.6301 28.0145 40.0975L29.8202 32.8541C32.0442 33.4244 39.1939 34.5078 38.1288 38.7478V38.7672ZM39.1368 28.1764C38.2236 31.8838 32.4819 30.0015 30.6374 29.5455L32.2716 22.9855C34.1356 23.4427 40.1059 24.3169 39.1368 28.1764Z" fill="white"/>
    </svg>
  </div>
);

const EthereumIcon: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`${className} relative`}>
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id="eth-gradient" x1="32" y1="0" x2="32" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#465191"/>
          <stop offset="0.36" stopColor="#32498F"/>
          <stop offset="0.7" stopColor="#555E99"/>
          <stop offset="1" stopColor="#4F5795"/>
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="32" fill="url(#eth-gradient)"/>
      <path d="M32 9.46289V25.0057L18.5703 32.3772L32 9.46289Z" fill="#E7F0FF"/>
      <path d="M18.5722 32.3773L18.4922 32.4916L32 41.0059V25.0059L18.5722 32.3773Z" fill="#A5B9EE"/>
      <path d="M32 9.4636V25.0065L45.4873 32.5036H45.4987L32 9.33789V9.4636Z" fill="#A5B8F0"/>
      <path d="M45.4873 32.503L32 41.0516V25.0059L45.4873 32.503Z" fill="#687FCB"/>
      <path d="M32 54.6512L18.3867 34.9141L32 43.2112L45.5981 34.9141L32 54.6512Z" fill="#A8B9EF"/>
      <path d="M32 43.1998H32L18.3867 34.9141L32 54.6512V43.1883V43.1998Z" fill="#E8F1FF"/>
    </svg>
  </div>
);

const TronIcon: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`${className} relative`}>
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="32" fill="#C4342B"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M17.5992 16.5526C17.7375 16.3995 17.9146 16.2867 18.1118 16.2262C18.309 16.1656 18.5189 16.1595 18.7192 16.2086L42.8335 22.1126C42.9787 22.148 43.1147 22.212 43.2358 22.2989L48.1421 25.876C48.382 26.0511 48.5443 26.3127 48.5946 26.6054C48.645 26.8981 48.5794 27.1988 48.4118 27.444L31.5318 52.1412C31.4129 52.3156 31.2479 52.4537 31.0552 52.5401C30.8625 52.6265 30.6496 52.6579 30.4402 52.6306C30.2308 52.6034 30.0331 52.5187 29.8689 52.3859C29.7047 52.2531 29.5805 52.0774 29.5101 51.8783L17.3707 17.7023C17.3016 17.508 17.2864 17.2987 17.3267 17.0965C17.3669 16.8943 17.4611 16.7056 17.5992 16.5526ZM21.5787 22.7206L30.0061 46.4463L31.3924 34.1503L21.5787 22.7206ZM33.6472 34.5469L32.2392 47.0566L44.1592 29.6132L33.6472 34.5469ZM45.2347 26.5846L37.5513 30.1903L42.7021 24.7389L45.2347 26.5846ZM40.3821 23.8657L21.6335 19.2749L32.6255 32.0772L40.3821 23.8657Z" fill="white"/>
    </svg>
  </div>
);

const TONIcon: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`${className} relative`}>
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="32" fill="#0088CC"/>
      <path d="M50.696 24.5373L33.7589 51.5088C33.5527 51.8344 33.2675 52.1026 32.9298 52.2884C32.5921 52.4743 32.2129 52.5717 31.8275 52.5716C31.439 52.5724 31.0568 52.4742 30.7168 52.2862C30.3769 52.0982 30.0905 51.8267 29.8846 51.4973L13.2789 24.5259C12.8137 23.7699 12.5683 22.8993 12.5703 22.0116C12.5914 20.7011 13.1315 19.4525 14.0721 18.5398C15.0127 17.6271 16.2769 17.1247 17.5875 17.1431H46.4332C49.1875 17.1431 51.4275 19.3145 51.4275 22.0002C51.4275 22.8916 51.176 23.7716 50.696 24.5373ZM17.3589 23.6345L29.7132 42.6859V21.7145H18.6503C17.3703 21.7145 16.7989 22.5602 17.3589 23.6345ZM34.2846 42.6859L46.6389 23.6345C47.2103 22.5602 46.6275 21.7145 45.3475 21.7145H34.2846V42.6859Z" fill="white"/>
    </svg>
  </div>
);

const KucoinIcon: React.FC<{ className?: string }> = ({ className }) => (
  <img src="https://api.builder.io/api/v1/image/assets/TEMP/662fedeace03f706507eaec228fabdaed3cb1aad?width=128" className={`${className} rounded-full`} alt="BingX" />
);

const NasdaqIcon: React.FC<{ className?: string }> = ({ className }) => (
  <img src="https://api.builder.io/api/v1/image/assets/TEMP/88586f48cfca9261f6fb22f0108f7d9ca7fe42cf?width=56" className={`${className} rounded-full`} alt="NASDAQ" />
);

// Check Icon Component
const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="12" fill="url(#paint0_linear_check)"/>
    <path d="M8 12.75C8 12.75 9.6 13.6625 10.4 15C10.4 15 12.8 9.75 16 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="paint0_linear_check" x1="22" y1="12" x2="2" y2="12" gradientUnits="userSpaceOnUse">
        <stop stopColor="#A06AFF"/>
        <stop offset="1" stopColor="#482090"/>
      </linearGradient>
    </defs>
  </svg>
);

export default PortfolioAvatarModal;
