import React, { useState, useEffect } from 'react';
import { X, Search, ChevronRight, ChevronDown, Info, Calendar as CalendarIcon } from 'lucide-react';
import PortfolioAvatarModal from './PortfolioAvatarModal';
import CurrencySelect, { CURRENCIES, CurrencyCode } from './CurrencySelect';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import CompactCalendar from './CompactCalendar';
import { useCreatePortfolio } from '../hooks/use-portfolios';

interface AddPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string | null;
}

const AddPortfolioModal: React.FC<AddPortfolioModalProps> = ({ isOpen, onClose, userId }) => {
  const createPortfolio = useCreatePortfolio();
  const [selectedAccountType, setSelectedAccountType] = useState<string>('investments');
  const [showStep2, setShowStep2] = useState<boolean>(true); // Default to open
  const [searchQuery, setSearchQuery] = useState('');
  const [accountName, setAccountName] = useState('');
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<{ categoryId: string; iconId: string } | null>(null);
  const [currency, setCurrency] = useState<CurrencyCode>('RUB');
  const [investmentAccountType, setInvestmentAccountType] = useState<'Brokerage' | 'IIS'>('Brokerage');
  const [selectedBroker, setSelectedBroker] = useState<string>('Robinhood');
  const [otherBrokerOpen, setOtherBrokerOpen] = useState<boolean>(false);
  const [commission, setCommission] = useState<string>('');
  const [openDate, setOpenDate] = useState<Date | null>(new Date());
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);
  const [note, setNote] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setSelectedAccountType('investments'); // Default to investments
      setShowStep2(true); // Default step 2 open
      setSearchQuery('');
      setAccountName('');
      setSelectedIcon(null);
      setIsAvatarModalOpen(false);
      setCurrency('RUB');
      setInvestmentAccountType('Brokerage');
      setSelectedBroker('Robinhood');
      setOtherBrokerOpen(false);
      setCommission('');
      setOpenDate(new Date());
      setIsDatePopoverOpen(false);
      setNote('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const accountTypes = [
    { id: 'investments', label: 'Investments', icon: InvestmentsIcon },
    { id: 'crypto-wallet', label: 'Crypto Wallet', icon: CryptoWalletIcon },
    { id: 'real-estate', label: 'Real Estate', icon: RealEstateIcon },
    { id: 'deposit', label: 'Deposit', icon: DepositIcon },
    { id: 'debit-card', label: 'Debit Card', icon: DebitCardIcon },
    { id: 'credit-card', label: 'Credit Card', icon: CreditCardIcon },
    { id: 'bank-account', label: 'Bank Account', icon: BankAccountIcon },
    { id: 'business', label: 'Business', icon: BusinessIcon },
    { id: 'cash', label: 'Cash', icon: CashIcon },
    { id: 'other', label: 'Other', icon: OtherIcon },
    { id: 'composite', label: 'Composite', icon: CompositeIcon },
  ];

  const brokers = Array.from({ length: 9 }, (_, i) => ({
    id: `nasdaq-${i + 1}`,
    name: 'NASDAQ',
    logo: `https://api.builder.io/api/v1/image/assets/TEMP/88586f48cfca9261f6fb22f0108f7d9ca7fe42cf?width=56`
  }));

  const cryptoPlatforms = [
    { id: 'binance', name: 'Binance', icon: BinanceIcon },
    { id: 'huobi', name: 'Huobi', icon: HuobiIcon },
    { id: 'okx', name: 'OKX', logo: 'https://api.builder.io/api/v1/image/assets/TEMP/0da10c6ad7e9d1c9afe683497114380d40aa25a7?width=56' },
    { id: 'kucoin', name: 'KuCoin', logo: 'https://api.builder.io/api/v1/image/assets/TEMP/bbca558b756d5d06dd6bc50503088d4ce6e186bc?width=56' },
    { id: 'bybit', name: 'ByBit', logo: 'https://api.builder.io/api/v1/image/assets/TEMP/7aa64e19977a5db5d92d74ea6e9728883f27fd37?width=56' },
    { id: 'solana', name: 'Solana', icon: SolanaIcon },
    { id: 'polygon', name: 'Polygon', icon: PolygonIcon },
    { id: 'bsc', name: 'BSC', icon: BSCIcon },
    { id: 'btc', name: 'BTC', icon: BTCIcon },
    { id: 'ethereum', name: 'Ethereum', icon: EthereumIcon },
    { id: 'tron', name: 'Tron', icon: TronIcon },
    { id: 'ton', name: 'TON', icon: TONIcon },
  ];

  const banks = [
    { id: 'boa-1', name: 'Bank of America', logo: 'https://api.builder.io/api/v1/image/assets/TEMP/1f0fc19da16b40b0037a4b93cf469341cfd7196a?width=56' },
    { id: 'boa-2', name: 'Bank of America', logo: 'https://api.builder.io/api/v1/image/assets/TEMP/c51c9a675c267c2708e187eb895472528b3f3060?width=56' },
    { id: 'boa-3', name: 'Bank of America', logo: 'https://api.builder.io/api/v1/image/assets/TEMP/9e4c11087e3eda06ae3c81b0897f251949d83f60?width=56' },
    { id: 'boa-4', name: 'Bank of America', logo: 'https://api.builder.io/api/v1/image/assets/TEMP/93b67886a610e2d9b39554a40f60eaa52787fc84?width=56' },
    { id: 'boa-5', name: 'Bank of America', logo: 'https://api.builder.io/api/v1/image/assets/TEMP/93dbf0731f1ad611c03530dc74321e25d1598409?width=56' },
    { id: 'boa-6', name: 'Bank of America', logo: 'https://api.builder.io/api/v1/image/assets/TEMP/c0b7e90ad63c510dfb319ccf35630ad3ddf3a59f?width=56' },
    { id: 'boa-7', name: 'Bank of America', logo: 'https://api.builder.io/api/v1/image/assets/TEMP/0381aa81dc5df2733d368b8b3b916b12e2fa47f8?width=56' },
    { id: 'boa-8', name: 'Bank of America', logo: 'https://api.builder.io/api/v1/image/assets/TEMP/25d0863ef7e96aa78414103f3f4a427df3568e3e?width=56' },
    // Add more rows to fill the grid
    { id: 'boa-9', name: 'Bank of America', logo: 'https://api.builder.io/api/v1/image/assets/TEMP/1f0fc19da16b40b0037a4b93cf469341cfd7196a?width=56' },
    { id: 'boa-10', name: 'Bank of America', logo: 'https://api.builder.io/api/v1/image/assets/TEMP/c51c9a675c267c2708e187eb895472528b3f3060?width=56' },
    { id: 'boa-11', name: 'Bank of America', logo: 'https://api.builder.io/api/v1/image/assets/TEMP/9e4c11087e3eda06ae3c81b0897f251949d83f60?width=56' },
    { id: 'boa-12', name: 'Bank of America', logo: 'https://api.builder.io/api/v1/image/assets/TEMP/93b67886a610e2d9b39554a40f60eaa52787fc84?width=56' },
    { id: 'boa-13', name: 'Bank of America', logo: 'https://api.builder.io/api/v1/image/assets/TEMP/93dbf0731f1ad611c03530dc74321e25d1598409?width=56' },
    { id: 'boa-14', name: 'Bank of America', logo: 'https://api.builder.io/api/v1/image/assets/TEMP/c0b7e90ad63c510dfb319ccf35630ad3ddf3a59f?width=56' },
    { id: 'boa-15', name: 'Bank of America', logo: 'https://api.builder.io/api/v1/image/assets/TEMP/0381aa81dc5df2733d368b8b3b916b12e2fa47f8?width=56' },
    { id: 'boa-16', name: 'Bank of America', logo: 'https://api.builder.io/api/v1/image/assets/TEMP/25d0863ef7e96aa78414103f3f4a427df3568e3e?width=56' },
    { id: 'boa-17', name: 'Bank of America', logo: 'https://api.builder.io/api/v1/image/assets/TEMP/1f0fc19da16b40b0037a4b93cf469341cfd7196a?width=56' },
    { id: 'boa-18', name: 'Bank of America', logo: 'https://api.builder.io/api/v1/image/assets/TEMP/c51c9a675c267c2708e187eb895472528b3f3060?width=56' },
    { id: 'boa-19', name: 'Bank of America', logo: 'https://api.builder.io/api/v1/image/assets/TEMP/9e4c11087e3eda06ae3c81b0897f251949d83f60?width=56' },
    { id: 'boa-20', name: 'Bank of America', logo: 'https://api.builder.io/api/v1/image/assets/TEMP/93b67886a610e2d9b39554a40f60eaa52787fc84?width=56' },
    { id: 'boa-21', name: 'Bank of America', logo: 'https://api.builder.io/api/v1/image/assets/TEMP/93dbf0731f1ad611c03530dc74321e25d1598409?width=56' },
    { id: 'boa-22', name: 'Bank of America', logo: 'https://api.builder.io/api/v1/image/assets/TEMP/c0b7e90ad63c510dfb319ccf35630ad3ddf3a59f?width=56' },
    { id: 'boa-23', name: 'Bank of America', logo: 'https://api.builder.io/api/v1/image/assets/TEMP/0381aa81dc5df2733d368b8b3b916b12e2fa47f8?width=56' },
    { id: 'boa-24', name: 'Bank of America', logo: 'https://api.builder.io/api/v1/image/assets/TEMP/25d0863ef7e96aa78414103f3f4a427df3568e3e?width=56' },
    { id: 'boa-25', name: 'Bank of America', logo: 'https://api.builder.io/api/v1/image/assets/TEMP/1f0fc19da16b40b0037a4b93cf469341cfd7196a?width=56' },
    { id: 'boa-26', name: 'Bank of America', logo: 'https://api.builder.io/api/v1/image/assets/TEMP/c51c9a675c267c2708e187eb895472528b3f3060?width=56' },
    { id: 'boa-27', name: 'Bank of America', logo: 'https://api.builder.io/api/v1/image/assets/TEMP/9e4c11087e3eda06ae3c81b0897f251949d83f60?width=56' },
    { id: 'boa-28', name: 'Bank of America', logo: 'https://api.builder.io/api/v1/image/assets/TEMP/93b67886a610e2d9b39554a40f60eaa52787fc84?width=56' },
    { id: 'boa-29', name: 'Bank of America', logo: 'https://api.builder.io/api/v1/image/assets/TEMP/93dbf0731f1ad611c03530dc74321e25d1598409?width=56' },
    { id: 'boa-30', name: 'Bank of America', logo: 'https://api.builder.io/api/v1/image/assets/TEMP/c0b7e90ad63c510dfb319ccf35630ad3ddf3a59f?width=56' },
    { id: 'boa-31', name: 'Bank of America', logo: 'https://api.builder.io/api/v1/image/assets/TEMP/0381aa81dc5df2733d368b8b3b916b12e2fa47f8?width=56' },
    { id: 'boa-32', name: 'Bank of America', logo: 'https://api.builder.io/api/v1/image/assets/TEMP/25d0863ef7e96aa78414103f3f4a427df3568e3e?width=56' },
  ];

  const selectedTypeData = accountTypes.find(type => type.id === selectedAccountType);

  const isCryptoWallet = selectedAccountType === 'crypto-wallet';
  const isRealEstate = selectedAccountType === 'real-estate';
  const isDeposit = selectedAccountType === 'deposit';
  
  let platforms = brokers;
  if (isCryptoWallet) {
    platforms = cryptoPlatforms;
  } else if (isDeposit) {
    platforms = banks;
  }
  
  const filteredPlatforms = platforms.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  const getSelectedAccountTypeData = () => {
    return accountTypes.find(type => type.id === selectedAccountType);
  };

  const handleCreate = async () => {
    if (!userId || !accountName.trim()) return;

    try {
      // Map UI category to DB category
      let dbCategory: 'investments' | 'composite' | 'cryptowallet' | 'all_assets' = 'investments';
      if (selectedAccountType === 'crypto-wallet') dbCategory = 'cryptowallet';
      else if (selectedAccountType === 'composite') dbCategory = 'composite';
      else if (selectedAccountType === 'investments') dbCategory = 'investments';

      await createPortfolio.mutateAsync({
        userId,
        name: accountName.trim(),
        currency,
        category: dbCategory
      });
      onClose();
    } catch (error) {
      console.error('Failed to create portfolio:', error);
    }
  };

  const handleAccountTypeSelect = (typeId: string) => {
    setSelectedAccountType(typeId);
    setShowStep2(true);
    setAccountName(''); // Reset account name when changing type
  };

  const handleAvatarClick = () => {
    setIsAvatarModalOpen(true);
  };

  const handleAvatarModalClose = () => {
    setIsAvatarModalOpen(false);
  };

  const handleIconSelect = (categoryId: string, iconId: string) => {
    setSelectedIcon({ categoryId, iconId });
    setIsAvatarModalOpen(false);
  };

  const getCurrentIcon = () => {
    if (selectedIcon) {
      return selectedIcon;
    }
    return null;
  };

  const getIconComponent = () => {
    // Always show the selected account type icon for now
    // In the future, we can map selectedIcon to specific components
    return selectedTypeData?.icon;
  };

  const getStep2Title = () => {
    if (isCryptoWallet) {
      return 'Select a broker or investment platform';
    } else if (isDeposit) {
      return 'Select a bank';
    } else if (selectedAccountType === 'investments') {
      return 'Investments setup';
    } else {
      return 'Additional details';
    }
  };

  const getSearchPlaceholder = () => {
    if (isCryptoWallet) {
      return 'Enter the name of the crypto exchange or blockchain';
    } else if (isDeposit) {
      return 'Enter the name of the bank';
    } else {
      return 'Enter broker name';
    }
  };

  const BrokerAvatar: React.FC<{ label: string; color?: string }> = ({ label, color = '#6C00F6' }) => (
    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: color }}>
      {label.split(' ').map(w => w[0]).slice(0,2).join('')}
    </div>
  );

  const usaBrokers = [
    { id: 'Robinhood', name: 'Robinhood', color: '#0CB477' },
    { id: 'Fidelity', name: 'Fidelity', color: '#107C41' },
    { id: 'Charles Schwab', name: 'Charles Schwab', color: '#00A1E0' },
    { id: 'E*TRADE', name: 'E*TRADE', color: '#4B2E83' },
    { id: 'TD Ameritrade', name: 'TD Ameritrade', color: '#00724A' },
    { id: 'Interactive Brokers', name: 'Interactive Brokers', color: '#D90000' },
    { id: 'Vanguard', name: 'Vanguard', color: '#7A0019' },
    { id: 'Merrill Edge', name: 'Merrill Edge', color: '#00A3E0' },
    { id: 'Webull', name: 'Webull', color: '#2962FF' },
    { id: 'SoFi', name: 'SoFi', color: '#00B6DE' },
    { id: 'Ally Invest', name: 'Ally Invest', color: '#7F1D7D' },
  ];

  const formatDate = (d: Date | null) => {
    if (!d) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const renderStep2Content = () => {
    if (isRealEstate) return null;

    if (selectedAccountType === 'investments') {
      const popular = usaBrokers.slice(0, 3);
      const allBrokers = usaBrokers;
      const isSelectedPopular = popular.some((p) => p.id === selectedBroker);
      return (
        <div className="mt-2 sm:mt-4">
          <div className="text-tyrian-gray-medium text-sm font-nunito mb-2">Step 2</div>
          <h3 className="text-white text-2xl font-bold font-nunito mb-6">Investments setup</h3>

          {/* Account type */}
          <div className="mb-4">
            <label className="block text-white text-sm font-bold font-nunito mb-2">Account type</label>
            <Select value={investmentAccountType} onValueChange={(v) => setInvestmentAccountType(v as 'Brokerage' | 'IIS')}>
              <SelectTrigger className="w-full sm:w-64 h-10 rounded-xl border border-tyrian-gray-darker glass-card bg-transparent text-white px-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-[120] border border-tyrian-gray-darker bg-[#0C1014] text-white">
                <SelectItem value="Brokerage" className="text-white">Brokerage</SelectItem>
                <SelectItem value="IIS" className="text-white">IIS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Brokers */}
          <div className="mb-6">
            <div className="text-tyrian-gray-medium text-sm font-nunito mb-2">Broker</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {popular.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBroker(b.id)}
                  className={`flex items-center gap-2 p-3 rounded-lg border transition-colors duration-300 ${
                    selectedBroker === b.id
                      ? 'bg-tyrian-purple-dark/20 border-tyrian-purple-primary'
                      : 'border-tyrian-gray-darker glass-card hover:bg-tyrian-purple-dark/20 hover:border-tyrian-purple-primary/40'
                  }`}
                >
                  <BrokerAvatar label={b.name} color={b.color} />
                  <span className="text-white text-xs font-bold font-nunito">{b.name}</span>
                </button>
              ))}

              {/* Other */}
              <Popover open={otherBrokerOpen} onOpenChange={setOtherBrokerOpen}>
                <PopoverTrigger asChild>
                  <button
                    className={`flex items-center justify-between gap-2 p-3 rounded-lg border transition-colors duration-300 ${
                      !isSelectedPopular
                        ? 'bg-tyrian-purple-dark/10 border-tyrian-purple-primary/60'
                        : 'border-tyrian-gray-darker glass-card hover:bg-tyrian-purple-dark/20 hover:border-tyrian-purple-primary/40'
                    }`}
                    aria-expanded={otherBrokerOpen}
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 21H3V7h18z"/><path d="M16 3H8v4h8z"/></svg>
                      <span className="text-white text-xs font-bold font-nunito">Other</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-white" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="z-[120] w-80 border border-tyrian-gray-darker bg-[#0C1014]">
                  <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
                    {allBrokers.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => {
                          setSelectedBroker(b.id);
                          setOtherBrokerOpen(false);
                        }}
                        className={`flex items-center gap-2 p-2 rounded-lg border transition-colors duration-300 ${
                          selectedBroker === b.id
                            ? 'bg-tyrian-purple-dark/20 border-tyrian-purple-primary'
                            : 'border-tyrian-gray-darker glass-card hover:bg-tyrian-purple-dark/20 hover:border-tyrian-purple-primary/40'
                        }`}
                      >
                        <BrokerAvatar label={b.name} color={b.color} />
                        <span className="text-white text-xs font-bold font-nunito">{b.name}</span>
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Additional */}
          <div className="mb-8">
            <div className="text-tyrian-gray-medium text-sm font-nunito mb-2">Additionally</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-2">
                <label className="text-white text-sm font-bold font-nunito">Fixed commission, %</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={commission}
                  onChange={(e) => setCommission(e.target.value)}
                  placeholder="0.00"
                  className="w-full h-11 px-4 py-3 rounded-lg border border-tyrian-gray-darker glass-card bg-transparent text-white placeholder-tyrian-gray-medium text-sm font-nunito outline-none"
                />
                <div className="text-tyrian-gray-medium text-xs font-nunito">
                  For auto-calculation during imports if missing in statements.
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-white text-sm font-bold font-nunito">Open date</label>
                <Popover open={isDatePopoverOpen} onOpenChange={setIsDatePopoverOpen}>
                  <PopoverTrigger asChild>
                    <button className="flex items-center justify-between w-full h-11 px-4 py-3 rounded-lg border border-tyrian-gray-darker glass-card bg-transparent text-white text-sm">
                      <span>{formatDate(openDate)}</span>
                      <CalendarIcon className="w-4 h-4" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="z-[120] p-0 border-0 bg-transparent shadow-none">
                    <CompactCalendar
                      selected={openDate}
                      onSelect={(d) => {
                        setOpenDate(d);
                        setIsDatePopoverOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-white text-sm font-bold font-nunito">Note</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value.slice(0, 500))}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-tyrian-gray-darker glass-card bg-transparent text-white placeholder-tyrian-gray-medium text-sm font-nunito outline-none"
                placeholder=""
              />
              <div className="text-tyrian-gray-medium text-xs font-nunito">{`${note.length} / 500`}</div>
            </div>
          </div>
        </div>
      );
    }

    // Default for other types (crypto, deposit)
    return (
      <div className="mt-2 sm:mt-4">
        <div className="text-tyrian-gray-medium text-sm font-nunito mb-2">Step 2</div>
        <h3 className="text-white text-2xl font-bold font-nunito mb-6">{getStep2Title()}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4 mb-8">
          {filteredPlatforms.map((platform) => (
            <div key={platform.id} className="flex items-center gap-2 p-2 rounded-lg border border-tyrian-gray-darker glass-card hover:bg-tyrian-purple-dark/20 hover:border-tyrian-purple-primary/40 transition-colors duration-900 cursor-pointer">
              {platform.icon ? (
                <platform.icon className="w-7 h-7" />
              ) : platform.logo ? (
                <img src={platform.logo} alt={platform.name} className="w-7 h-7 rounded-full" />
              ) : null}
              <span className="text-white text-xs font-bold font-nunito">{platform.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
        <div className="w-full rounded-3xl border border-tyrian-gray-darker glass-card backdrop-blur-[50px] p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-white text-2xl font-bold font-nunito">Add Portfolio</h2>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-tyrian-purple-dark/30 transition duration-900"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Account header (icon + name) */}
          <div className="mt-2 sm:mt-0 mb-6 sm:mb-8">
            <h3 className="text-white text-2xl font-bold font-nunito mb-6">Enter account name</h3>
            <div className="flex items-center gap-4 p-4 rounded-lg border border-tyrian-gray-darker glass-card">
              <div className="flex items-center">
                <button
                  onClick={handleAvatarClick}
                  className="flex w-16 h-16 justify-center items-center rounded-full bg-tyrian-gradient-animated backdrop-blur-[50px] hover:scale-105 transition-transform duration-300 cursor-pointer"
                >
                  {(() => {
                    const IconComponent = getIconComponent();
                    return IconComponent ? <IconComponent className="w-8 h-8" /> : null;
                  })()}
                </button>
                <ChevronDown className="w-6 h-6 text-white ml-2 -rotate-90" />
              </div>
              <div className="w-px h-full bg-tyrian-gray-darker"></div>
              <div className="flex-1 flex flex-col gap-4 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-end">
                  <div className="flex flex-col gap-2 min-w-0">
                    <label className="text-white text-sm font-bold font-nunito">Account name</label>
                    <input
                      type="text"
                      placeholder={selectedTypeData ? selectedTypeData.label : ''}
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      className="w-full h-11 px-4 py-3 rounded-lg border border-tyrian-gray-darker glass-card bg-transparent text-white placeholder-tyrian-gray-medium text-sm font-nunito outline-none transition duration-900"
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full sm:w-32">
                    <label className="text-white text-sm font-bold font-nunito">Currency</label>
                    <CurrencySelect value={currency} onChange={setCurrency} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-tyrian-gray-medium" />
                  <span className="text-tyrian-gray-medium text-sm font-nunito">You can change this name and currency at any time</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 1 */}
          <div className="mb-6 sm:mb-8">
            <div className="text-tyrian-gray-medium text-sm font-nunito mb-2">Step 1</div>
            <h3 className="text-white text-2xl font-bold font-nunito mb-2">Account Creation</h3>
            <div className="text-tyrian-gray-medium text-sm font-nunito">Choose account type</div>
          </div>

          {/* Account Type Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-4 sm:mb-6">
            {accountTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleAccountTypeSelect(type.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border duration-900 transition-colors motion-reduce:transition-none ${
                  selectedAccountType === type.id
                    ? 'bg-tyrian-gradient-animated border-tyrian-purple-primary'
                    : 'border-tyrian-gray-darker glass-card hover:bg-tyrian-purple-dark/20 hover:border-tyrian-purple-primary/40'
                }`}
              >
                <type.icon className="w-5 h-5" />
                <span className="text-white text-xs font-bold font-nunito text-center">{type.label}</span>
              </button>
            ))}
          </div>

          {/* Step 2 (inline below) */}
          {renderStep2Content() && (
            <div className={`transition-opacity duration-900 ${showStep2 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              {renderStep2Content()}
            </div>
          )}

          {/* Footer CTA */}
          <div className="flex justify-end">
            <button
              onClick={() => (showStep2 ? handleCreate() : setShowStep2(true))}
              className="flex items-center gap-2 px-4 py-3 rounded-full bg-tyrian-gradient-animated transition-all duration-1200 hover:scale-[1.02] motion-reduce:transition-none"
            >
              <span className="text-white text-xs font-bold font-nunito uppercase">
                {showStep2 ? 'CREATE' : 'NEXT'}
              </span>
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Portfolio Avatar Modal */}
      <PortfolioAvatarModal
        isOpen={isAvatarModalOpen}
        onClose={handleAvatarModalClose}
        onSelectIcon={handleIconSelect}
        currentIcon={getCurrentIcon()}
      />
    </div>
  );
};

// Account Type Icons
const InvestmentsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none">
    <path d="M2.5 3.33398V11.6673C2.5 14.0243 2.5 15.2028 3.23223 15.9351C3.96447 16.6673 5.14297 16.6673 7.5 16.6673H17.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 11.6673L7.70833 8.95898C8.24504 8.42223 8.51342 8.15392 8.82725 8.06537C9.04925 8.00277 9.28408 8.00277 9.50608 8.06537C9.81992 8.15392 10.0883 8.42223 10.625 8.95898C11.1618 9.49573 11.4301 9.76407 11.7439 9.85257C11.9659 9.91523 12.2008 9.91523 12.4228 9.85257C12.7366 9.76407 13.0049 9.49573 13.5417 8.95898L16.6667 5.83398" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CryptoWalletIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none">
    <g clipPath="url(#clip0_3_135073)">
      <path d="M10.0013 18.3327C14.6037 18.3327 18.3346 14.6017 18.3346 9.99935C18.3346 5.39698 14.6037 1.66602 10.0013 1.66602C5.39893 1.66602 1.66797 5.39698 1.66797 9.99935C1.66797 14.6017 5.39893 18.3327 10.0013 18.3327Z" stroke="white" strokeWidth="1.5"/>
      <path d="M7.91797 13.3327V6.66602" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M9.16797 6.66667V5M11.2513 6.66667V5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M9.16797 15.0007V13.334M11.2513 15.0007V13.334" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M7.91797 10H12.0846C12.775 10 13.3346 10.5597 13.3346 11.25V12.0833C13.3346 12.7737 12.775 13.3333 12.0846 13.3333H6.66797" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.66797 6.66602H12.0846C12.775 6.66602 13.3346 7.22566 13.3346 7.91602V8.74935C13.3346 9.43968 12.775 9.99935 12.0846 9.99935H7.91797" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    <defs>
      <clipPath id="clip0_3_135073">
        <rect width="20" height="20" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

const RealEstateIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none">
    <path d="M29.3307 14.0007L17.1741 3.76341C16.8447 3.48608 16.4279 3.33398 15.9974 3.33398C15.5669 3.33398 15.1501 3.48608 14.8207 3.76341L2.66406 14.0007" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M27.3307 6.66602V20.666C27.3307 24.4372 27.3307 26.3228 26.1591 27.4944C24.9875 28.666 23.1019 28.666 19.3307 28.666H12.6641C8.89282 28.666 7.00721 28.666 5.83564 27.4944C4.66406 26.3228 4.66406 24.4372 4.66406 20.666V12.666" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.9974 15.334H12.6641V16.6673H13.9974V15.334Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19.3333 15.334H18V16.6673H19.3333V15.334Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.9974 20.666H12.6641V21.9993H13.9974V20.666Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19.3333 20.666H18V21.9993H19.3333V20.666Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DepositIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none">
    <path d="M7.61891 2.08398C5.40473 2.13461 4.11144 2.34612 3.22781 3.22976C2.34416 4.11339 2.13266 5.40668 2.08203 7.62087M12.3784 2.08398C14.5927 2.13461 15.8859 2.34612 16.7696 3.22976C17.6532 4.11339 17.8647 5.40668 17.9154 7.62087M12.3784 17.9173C14.5927 17.8667 15.8859 17.6551 16.7696 16.7716C17.6532 15.8879 17.8647 14.5947 17.9154 12.3804M7.61891 17.9173C5.40473 17.8667 4.11144 17.6551 3.22781 16.7716C2.34416 15.8879 2.13266 14.5947 2.08203 12.3804" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.66797 6.66602H6.67545" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.332 13.334H13.3395" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.66797 13.3327L13.3346 6.66602" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const DebitCardIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none">
    <path d="M1.66797 10.0007C1.66797 7.05275 1.66797 5.57879 2.5453 4.59473C2.68563 4.43734 2.84029 4.29178 3.00752 4.15971C4.05308 3.33398 5.61915 3.33398 8.7513 3.33398H11.2513C14.3835 3.33398 15.9496 3.33398 16.9951 4.15971C17.1623 4.29178 17.317 4.43734 17.4573 4.59473C18.3346 5.57879 18.3346 7.05275 18.3346 10.0007C18.3346 12.9486 18.3346 14.4225 17.4573 15.4066C17.317 15.564 17.1623 15.7095 16.9951 15.8416C15.9496 16.6673 14.3835 16.6673 11.2513 16.6673H8.7513C5.61915 16.6673 4.05308 16.6673 3.00752 15.8416C2.84029 15.7095 2.68563 15.564 2.5453 15.4066C1.66797 14.4225 1.66797 12.9486 1.66797 10.0007Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8.33203 13.334H9.58203" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12.082 13.334H14.9987" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1.66797 7.5H18.3346" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);

const CreditCardIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none">
    <path d="M1.66797 10.0007C1.66797 7.05275 1.66797 5.57879 2.5453 4.59473C2.68563 4.43734 2.84029 4.29178 3.00752 4.15971C4.05308 3.33398 5.61915 3.33398 8.7513 3.33398H11.2513C14.3835 3.33398 15.9496 3.33398 16.9951 4.15971C17.1623 4.29178 17.317 4.43734 17.4573 4.59473C18.3346 5.57879 18.3346 7.05275 18.3346 10.0007C18.3346 12.9486 18.3346 14.4225 17.4573 15.4066C17.317 15.564 17.1623 15.7095 16.9951 15.8416C15.9496 16.6673 14.3835 16.6673 11.2513 16.6673H8.7513C5.61915 16.6673 4.05308 16.6673 3.00752 15.8416C2.84029 15.7095 2.68563 15.564 2.5453 15.4066C1.66797 14.4225 1.66797 12.9486 1.66797 10.0007Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4.77734 11H6.02734" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4.77734 13.334H7.69401" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1.66797 7.5H18.3346" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);

const BankAccountIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none">
    <g clipPath="url(#clip0_3_135112)">
      <path d="M1.66797 7.14024C1.66797 6.14342 2.06995 5.53253 2.90183 5.06958L6.32619 3.16388C8.12055 2.16531 9.01772 1.66602 10.0013 1.66602C10.9849 1.66602 11.8821 2.16531 13.6764 3.16388L17.1008 5.06958C17.9326 5.53253 18.3346 6.14343 18.3346 7.14024C18.3346 7.41054 18.3346 7.54569 18.3051 7.6568C18.1501 8.24056 17.6211 8.33268 17.1102 8.33268H2.89237C2.38153 8.33268 1.85257 8.24055 1.69749 7.6568C1.66797 7.54569 1.66797 7.41054 1.66797 7.14024Z" stroke="white" strokeWidth="1.5"/>
      <path d="M9.99609 5.83398H10.0036" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3.33203 8.33398V15.4173M6.66536 8.33398V15.4173" stroke="white" strokeWidth="1.5"/>
      <path d="M13.332 8.33398V15.4173M16.6654 8.33398V15.4173" stroke="white" strokeWidth="1.5"/>
      <path d="M15.8346 15.416H4.16797C2.78726 15.416 1.66797 16.5353 1.66797 17.916C1.66797 18.1461 1.85452 18.3327 2.08464 18.3327H17.918C18.1481 18.3327 18.3346 18.1461 18.3346 17.916C18.3346 16.5353 17.2154 15.416 15.8346 15.416Z" stroke="white" strokeWidth="1.5"/>
    </g>
    <defs>
      <clipPath id="clip0_3_135112">
        <rect width="20" height="20" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

const BusinessIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none">
    <g clipPath="url(#clip0_3_135120)">
      <path d="M1.66797 11.6667C1.66797 8.7445 1.66797 7.28336 2.4246 6.29993C2.56312 6.1199 2.71788 5.95483 2.88666 5.80708C3.80862 5 5.1784 5 7.91797 5H12.0846C14.8242 5 16.194 5 17.116 5.80708C17.2847 5.95483 17.4395 6.1199 17.578 6.29993C18.3346 7.28336 18.3346 8.7445 18.3346 11.6667C18.3346 14.5888 18.3346 16.05 17.578 17.0334C17.4395 17.2134 17.2847 17.3785 17.116 17.5262C16.194 18.3333 14.8242 18.3333 12.0846 18.3333H7.91797C5.1784 18.3333 3.80862 18.3333 2.88666 17.5262C2.71788 17.3785 2.56312 17.2134 2.4246 17.0334C1.66797 16.05 1.66797 14.5888 1.66797 11.6667Z" stroke="white" strokeWidth="1.5"/>
      <path d="M13.3346 4.99935C13.3346 3.428 13.3346 2.64232 12.8465 2.15417C12.3583 1.66602 11.5726 1.66602 10.0013 1.66602C8.42997 1.66602 7.64428 1.66602 7.15613 2.15417C6.66797 2.64232 6.66797 3.428 6.66797 4.99935" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9.9987 9.16732C9.0782 9.16732 8.33203 9.72698 8.33203 10.4173C8.33203 11.1077 9.0782 11.6673 9.9987 11.6673C10.9192 11.6673 11.6654 12.227 11.6654 12.9173C11.6654 13.6077 10.9192 14.1673 9.9987 14.1673M9.9987 9.16732C10.7244 9.16732 11.3417 9.51515 11.5705 10.0007M9.9987 9.16732V8.33398M9.9987 14.1673C9.27303 14.1673 8.6557 13.8195 8.42686 13.334M9.9987 14.1673V15.0007" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M5.0013 10H1.66797" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M18.3333 10H15" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </g>
    <defs>
      <clipPath id="clip0_3_135120">
        <rect width="20" height="20" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

const CashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none">
    <path d="M10.8333 2.91602H11.6667C12.4417 2.91602 12.8292 2.91602 13.1471 3.0012C14.0097 3.23237 14.6837 3.90624 14.9148 4.76897C15 5.08688 15 5.47437 15 6.24935H4.16667C3.24619 6.24935 2.5 5.50316 2.5 4.58268C2.5 3.66221 3.24619 2.91602 4.16667 2.91602H6.66667" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.5 4.58398V12.9173C2.5 15.2743 2.5 16.4528 3.23223 17.1851C3.96447 17.9173 5.14297 17.9173 7.5 17.9173H12.5C14.857 17.9173 16.0355 17.9173 16.7677 17.1851C17.5 16.4528 17.5 15.2743 17.5 12.9173V11.2507C17.5 8.89365 17.5 7.71512 16.7677 6.98288C16.0355 6.25065 14.857 6.25065 12.5 6.25065H5.83333" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17.5013 10.416H15.8346C15.4471 10.416 15.2534 10.416 15.0945 10.4586C14.6631 10.5742 14.3261 10.9111 14.2106 11.3425C14.168 11.5014 14.168 11.6952 14.168 12.0827C14.168 12.4702 14.168 12.6639 14.2106 12.8228C14.3261 13.2543 14.6631 13.5912 15.0945 13.7068C15.2534 13.7493 15.4471 13.7493 15.8346 13.7493H17.5013" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8.7487 2.08398C10.3595 2.08398 11.6654 3.38982 11.6654 5.00065C11.6654 5.44798 11.5647 5.87179 11.3847 6.25065H6.11271C5.93274 5.87179 5.83203 5.44798 5.83203 5.00065C5.83203 3.38982 7.13786 2.08398 8.7487 2.08398Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const OtherIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none">
    <path d="M2.72575 12.57C3.30372 11.3555 3.5927 10.7482 4.09626 10.3971C4.13693 10.3687 4.17846 10.3418 4.22078 10.3163C4.74487 10 5.3859 10 6.66797 10C7.95003 10 8.59105 10 9.11513 10.3163C9.15747 10.3418 9.19897 10.3687 9.23963 10.3971C9.74322 10.7482 10.0322 11.3555 10.6102 12.57C11.472 14.381 11.9029 15.2865 11.5374 15.9521C11.5236 15.977 11.5092 16.0015 11.4941 16.0255C11.0911 16.6667 10.1357 16.6667 8.22519 16.6667H5.11074C3.20018 16.6667 2.24489 16.6667 1.84179 16.0255C1.82668 16.0015 1.81228 15.977 1.79858 15.9521C1.43308 15.2865 1.86398 14.381 2.72575 12.57Z" stroke="white" strokeWidth="1.5"/>
    <path d="M12.1211 10.0173C12.4513 10 12.8452 10 13.3311 10C14.6132 10 15.2543 10 15.7783 10.3163C15.8206 10.3418 15.8622 10.3687 15.9028 10.3971C16.4064 10.7482 16.6953 11.3555 17.2733 12.57C18.1351 14.381 18.566 15.2865 18.2005 15.9521C18.1868 15.977 18.1724 16.0015 18.1573 16.0255C17.7542 16.6667 16.7989 16.6667 14.8883 16.6667H13.9479" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M14.6737 7.50065C14.4933 7.06026 14.2446 6.53754 13.9431 5.90403C13.3652 4.68946 13.0762 4.08218 12.5726 3.73107C12.5319 3.70271 12.4904 3.67574 12.4481 3.6502C11.924 3.33398 11.283 3.33398 10.0009 3.33398C8.71884 3.33398 8.07782 3.33398 7.55373 3.6502C7.5114 3.67574 7.46988 3.70271 7.42921 3.73107C6.92565 4.08218 6.63667 4.68946 6.0587 5.90403C5.75722 6.53754 5.50848 7.06026 5.32812 7.50065" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const CompositeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none">
    <path d="M13.7977 3.84902C13.1253 3.39249 12.395 3.0404 11.6306 2.80017C10.6664 2.49707 10.1842 2.34552 9.67614 2.72625C9.16797 3.10699 9.16797 3.72542 9.16797 4.96227V8.75533C9.16797 9.80808 9.16797 10.3344 9.36305 10.8063C9.55822 11.2783 9.92814 11.6467 10.668 12.3837L13.3338 15.0388C14.2031 15.9046 14.6377 16.3375 15.261 16.2352C15.8843 16.1331 16.1152 15.6771 16.5772 14.7652C16.9307 14.0675 17.1889 13.3196 17.3412 12.5416C17.6627 10.899 17.4977 9.1965 16.867 7.64919C16.2362 6.10193 15.1681 4.77946 13.7977 3.84902Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11.6667 17.0161C10.8947 17.3286 10.0508 17.5007 9.16667 17.5007C5.48477 17.5007 2.5 14.5159 2.5 10.834C2.5 7.96987 4.30613 5.52758 6.84157 4.58398" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Crypto Platform Icons
const BinanceIcon: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`${className} relative`}>
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="14" fill="#EEB00E"/>
      <g clipPath="url(#binance-clip)">
        <path d="M8.575 11.765L14 6.34L19.425 11.77L21.81 9.38L14 1.57L6.19 9.38L8.575 11.765Z" fill="white"/>
        <path d="M2 14L4.385 11.615L6.77 14L4.385 16.385L2 14Z" fill="white"/>
        <path d="M8.575 16.235L14 21.66L19.425 16.23L21.81 18.615L14 26.43L6.19 18.62L8.575 16.235Z" fill="white"/>
        <path d="M21.23 14L23.615 11.615L26 14L23.615 16.385L21.23 14Z" fill="white"/>
        <path d="M17.22 14L14 10.78L11.48 13.3L11.24 13.54L10.78 14L14 17.22L17.22 14Z" fill="white"/>
      </g>
      <defs>
        <clipPath id="binance-clip">
          <rect width="24" height="24" fill="white" transform="translate(2 2)"/>
        </clipPath>
      </defs>
    </svg>
  </div>
);

const HuobiIcon: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`${className} relative`}>
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <defs>
        <linearGradient id="huobi-gradient" x1="5.834" y1="4.856" x2="34.6985" y2="38.0085" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1A1E21"/>
          <stop offset="1" stopColor="#06060A"/>
        </linearGradient>
      </defs>
      <circle cx="14" cy="14" r="14" fill="url(#huobi-gradient)"/>
      <path d="M17 9.8476C17 7.1196 15.6935 4.7736 14.7 4.0096C14.6955 4.0071 14.6235 3.9661 14.63 4.0751L14.628 4.0786C14.5455 9.3456 11.9 10.7736 10.4455 12.6966C7.089 17.1341 10.2105 21.9996 13.3895 22.8991C15.168 23.4021 12.9785 22.0091 12.6965 19.0656C12.3555 15.5081 17 12.7926 17 9.8476Z" fill="#E6EEFA"/>
      <path d="M18.734 11.513C18.714 11.499 18.685 11.489 18.665 11.523C18.6105 12.1935 17.9475 13.628 17.1075 14.945C14.2575 19.412 15.8815 21.5655 16.795 22.722C17.325 23.3935 16.795 22.722 18.12 22.036C18.224 21.982 20.706 20.544 20.975 17.2675C21.235 14.0945 19.3905 12.094 18.734 11.513Z" fill="#2EA7DF"/>
    </svg>
  </div>
);

const SolanaIcon: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`${className} relative`}>
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <defs>
        <linearGradient id="solana-bg" x1="5.335" y1="4.855" x2="34.2" y2="38.01" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1A1E21"/>
          <stop offset="1" stopColor="#06060A"/>
        </linearGradient>
        <linearGradient id="solana-1" x1="7.15371" y1="11.72" x2="20.8487" y2="7.675" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6E73E3"/>
          <stop offset="0.32" stopColor="#41B8C8"/>
          <stop offset="0.58" stopColor="#27E2B7"/>
          <stop offset="1" stopColor="#16FC99"/>
        </linearGradient>
        <linearGradient id="solana-2" x1="6.31985" y1="20.02" x2="21.9298" y2="17.83" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9E48FF"/>
          <stop offset="0.34" stopColor="#8D4DF9"/>
          <stop offset="0.57" stopColor="#6B7AE1"/>
          <stop offset="0.95" stopColor="#45B3CE"/>
        </linearGradient>
        <linearGradient id="solana-3" x1="7.21485" y1="14" x2="21.3348" y2="14" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8654F3"/>
          <stop offset="0.47" stopColor="#549AD6"/>
          <stop offset="0.93" stopColor="#26D9B2"/>
        </linearGradient>
      </defs>
      <circle cx="14" cy="14" r="14" fill="url(#solana-bg)"/>
      <path d="M19.1937 10.355C19.0937 10.445 18.9687 10.5 18.8387 10.5H6.93871C6.67871 10.5 6.53371 10.22 6.68871 10.02L9.01371 7.65C9.11371 7.555 9.23871 7.5 9.36871 7.5H21.3087C21.5687 7.5 21.7137 7.785 21.5587 7.98L19.1937 10.355Z" fill="url(#solana-1)"/>
      <path d="M19.1948 20.36C19.0948 20.45 18.9698 20.5 18.8348 20.5H6.93485C6.68485 20.5 6.53485 20.22 6.68485 20.02L9.01485 17.645C9.11485 17.55 9.23985 17.5 9.36985 17.5H21.3098C21.5698 17.5 21.7148 17.785 21.5598 17.98L19.1948 20.36Z" fill="url(#solana-2)"/>
      <path d="M19.1948 12.64C19.0948 12.55 18.9698 12.5 18.8348 12.5H6.93485C6.68485 12.5 6.53485 12.78 6.68485 12.98L9.01485 15.355C9.11485 15.445 9.23985 15.5 9.36985 15.5H21.3098C21.5698 15.5 21.7148 15.215 21.5598 15.02L19.1948 12.64Z" fill="url(#solana-3)"/>
    </svg>
  </div>
);

const PolygonIcon: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`${className} relative`}>
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="14" fill="#6C00F6"/>
      <path d="M6.75 18.485V13.435L11.225 10.835L12.75 11.775V14.05L11.225 13.14L8.75 14.52V17.33L11.225 18.76L13.75 17.33V9.515L18.215 7L22.75 9.515V14.57L18.215 17.12L16.75 16.2V13.94L18.215 14.835L20.75 13.435V10.655L18.215 9.245L15.75 10.65V18.48L11.225 21L6.75 18.485Z" fill="white"/>
    </svg>
  </div>
);

const BSCIcon: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`${className} relative`}>
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="14" fill="#EEB00E"/>
      <g clipPath="url(#bsc-clip)">
        <path d="M8.575 11.765L14 6.34L19.425 11.77L21.81 9.38L14 1.57L6.19 9.38L8.575 11.765Z" fill="white"/>
        <path d="M2 14L4.385 11.615L6.77 14L4.385 16.385L2 14Z" fill="white"/>
        <path d="M8.575 16.235L14 21.66L19.425 16.23L21.81 18.615L14 26.43L6.19 18.62L8.575 16.235Z" fill="white"/>
        <path d="M21.23 14L23.615 11.615L26 14L23.615 16.385L21.23 14Z" fill="white"/>
        <path d="M17.22 14L14 10.78L11.48 13.3L11.24 13.54L10.78 14L14 17.22L17.22 14Z" fill="white"/>
      </g>
      <defs>
        <clipPath id="bsc-clip">
          <rect width="24" height="24" fill="white" transform="translate(2 2)"/>
        </clipPath>
      </defs>
    </svg>
  </div>
);

const BTCIcon: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`${className} relative`}>
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="14" fill="#F7931A"/>
      <path d="M19.9673 12.3512C20.2248 10.6042 18.9023 9.67269 17.0808 9.04019L17.6708 6.68619L16.2323 6.32819L15.6583 8.62419L14.5103 8.34969L15.0923 6.03719L13.6533 5.67969L13.0628 8.04219L12.1478 7.82569V7.81769L10.1598 7.31819L9.77684 8.85719C9.77684 8.85719 10.8418 9.10719 10.8248 9.11519C11.4073 9.26519 11.5073 9.64769 11.4908 9.94719L10.8248 12.6422L10.9748 12.6922L10.8168 12.6587L9.87684 16.4272C9.81034 16.6022 9.62684 16.8682 9.21984 16.7597C9.23634 16.7847 8.17984 16.5102 8.17984 16.5102L7.46484 18.1492L9.33634 18.6147L10.3593 18.8812L9.76034 21.2687L11.1993 21.6262L11.7818 19.2637L12.9378 19.5632L12.3478 21.9172L13.7863 22.2752L14.3768 19.8877C16.8308 20.3532 18.6778 20.1707 19.4518 17.9492C20.0753 16.1612 19.4183 15.1377 18.1288 14.4557C19.0688 14.2477 19.7758 13.6237 19.9588 12.3507H19.9673V12.3512ZM16.6813 16.9597C16.2403 18.7482 13.2293 17.7747 12.2563 17.5417L13.0463 14.3727C14.0193 14.6222 17.1473 15.0962 16.6813 16.9512V16.9597ZM17.1223 12.3262C16.7228 13.9482 14.2108 13.1247 13.4038 12.9252L14.1188 10.0552C14.9343 10.2552 17.5463 10.6377 17.1223 12.3262Z" fill="white"/>
    </svg>
  </div>
);

const EthereumIcon: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`${className} relative`}>
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <defs>
        <linearGradient id="eth-gradient" x1="14" y1="0" x2="14" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#465191"/>
          <stop offset="0.36" stopColor="#32498F"/>
          <stop offset="0.7" stopColor="#555E99"/>
          <stop offset="1" stopColor="#4F5795"/>
        </linearGradient>
      </defs>
      <circle cx="14" cy="14" r="14" fill="url(#eth-gradient)"/>
      <path d="M14 4.14062V10.9406L8.165 14.1656L14 4.14062Z" fill="#E7F0FF"/>
      <path d="M8.165 14.1645L8.13 14.2145L14 17.9395V10.9395L8.165 14.1645Z" fill="#A5B9EE"/>
      <path d="M14 4.14094V10.9409L19.84 14.2209H19.845L13.93 4.08594L14 4.13594V4.14094Z" fill="#A5B8F0"/>
      <path d="M19.84 14.2195L13.93 17.9595L14 17.9395V10.9395L19.84 14.2195Z" fill="#687FCB"/>
      <path d="M14 23.9104L8.165 15.2754L14 18.9054L19.835 15.2754L14 23.9104Z" fill="#A8B9EF"/>
      <path d="M14 18.9004H14L8.165 15.2754L14 23.9104L14 23.8954V18.8954V18.9004Z" fill="#E8F1FF"/>
    </svg>
  </div>
);

const TronIcon: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`${className} relative`}>
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="14" fill="#C4342B"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M7.9609 7.24103C8.02139 7.17406 8.09888 7.12471 8.18515 7.09821C8.27142 7.07171 8.36325 7.06906 8.4509 7.09053L19.0009 9.67353C19.0644 9.68903 19.1239 9.71703 19.1769 9.75503L21.3234 11.32C21.4283 11.3966 21.4994 11.5111 21.5214 11.6391C21.5434 11.7672 21.5147 11.8988 21.4414 12.006L14.0564 22.811C14.0044 22.8874 13.9322 22.9478 13.8479 22.9856C13.7636 23.0234 13.6705 23.0371 13.5788 23.0252C13.4872 23.0133 13.4007 22.9762 13.3289 22.9181C13.257 22.86 13.2027 22.7831 13.1719 22.696L7.8609 7.74403C7.8307 7.65904 7.82404 7.56746 7.84165 7.479C7.85925 7.39053 7.90046 7.30798 7.9609 7.24103ZM9.7019 9.93953L13.3889 20.3195L13.9954 14.94L9.7019 9.93953ZM14.9819 15.1135L14.3659 20.5865L19.5809 12.955L14.9819 15.1135ZM20.0514 11.63L16.6899 13.2075L18.9434 10.8225L20.0514 11.63ZM17.9284 10.4405L9.7259 8.43203L14.5349 14.033L17.9284 10.4405Z" fill="white"/>
    </svg>
  </div>
);

const TONIcon: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`${className} relative`}>
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="14" fill="#0088CC"/>
      <path d="M23.0706 10.7352L15.6606 22.5352C15.5704 22.6777 15.4456 22.795 15.2979 22.8763C15.1502 22.9576 14.9843 23.0002 14.8156 23.0002C14.6457 23.0006 14.4785 22.9576 14.3297 22.8753C14.181 22.7931 14.0557 22.6743 13.9656 22.5302L6.70063 10.7302C6.49711 10.3995 6.38976 10.0186 6.39063 9.63021C6.39984 9.05687 6.63613 8.51061 7.04764 8.11128C7.45915 7.71196 8.01227 7.49219 8.58563 7.50021H21.2056C22.4106 7.50021 23.3906 8.45021 23.3906 9.62521C23.3906 10.0152 23.2806 10.4002 23.0706 10.7352ZM8.48563 10.3402L13.8906 18.6752V9.50021H9.05063C8.49063 9.50021 8.24063 9.87021 8.48563 10.3402ZM15.8906 18.6752L21.2956 10.3402C21.5456 9.87021 21.2906 9.50021 20.7306 9.50021H15.8906V18.6752Z" fill="white"/>
    </svg>
  </div>
);

export default AddPortfolioModal;
