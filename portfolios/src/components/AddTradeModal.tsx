import React, { useState, useEffect } from "react";
import { X, Calendar as CalendarIcon } from "lucide-react";
import CurrencySelect, { CurrencyCode } from "./CurrencySelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import CompactCalendar from "./CompactCalendar";
import { usePortfolioContext } from "../contexts/PortfolioContext";
import { usePortfolios } from "../hooks/use-portfolios";
import { useCreateTrade } from "../hooks/use-trades";
import { api } from "../lib/api-client";
import { useQueryClient } from "@tanstack/react-query";

interface AddTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string | null;
  portfolioName?: string;
}

const ASSET_TYPES = [
  "Stocks, Mutual Funds, ETF",
  "Bonds",
  "Cash",
  "Other Asset",
  "Cryptocurrency",
  "Futures",
  "Bank Deposit",
] as const;

const OPERATIONS = [
  "Buy",
  "Sell",
  "Dividend",
  "Coupon",
  "Tax",
  "Commission",
  "Deposit",
  "Withdrawal",
  "Transfer In",
  "Transfer Out",
] as const;

type AssetType = (typeof ASSET_TYPES)[number];
type Operation = (typeof OPERATIONS)[number];

const AddTradeModal: React.FC<AddTradeModalProps> = ({
  isOpen,
  onClose,
  userId,
  portfolioName,
}) => {
  const { currentPortfolioId } = usePortfolioContext();
  const { data: investmentsData } = usePortfolios(userId, "investments");
  const createTrade = useCreateTrade();
  const queryClient = useQueryClient();
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);

  const currentPortfolio = investmentsData?.items.find(
    (p) => p.id === currentPortfolioId,
  );
  const displayName = portfolioName || currentPortfolio?.name || "Portfolio";
  const [assetType, setAssetType] = useState<AssetType>(
    "Stocks, Mutual Funds, ETF",
  );
  const [assetCode, setAssetCode] = useState("");
  const [operation, setOperation] = useState<Operation>("Buy");
  const [tradeDate, setTradeDate] = useState<Date>(new Date());
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);
  const [price, setPrice] = useState("");
  const [tradeCurrency, setTradeCurrency] = useState<CurrencyCode>("RUB");
  const [quantity, setQuantity] = useState("");
  const [commission, setCommission] = useState("");
  const [tags, setTags] = useState("");
  const [note, setNote] = useState("");
  const [repeat, setRepeat] = useState(false);
  const [deductMoney, setDeductMoney] = useState(true);
  const [dontCloseDialog, setDontCloseDialog] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAssetType("Stocks, Mutual Funds, ETF");
      setAssetCode("");
      setOperation("Buy");
      setTradeDate(new Date());
      setPrice("");
      setTradeCurrency("RUB");
      setQuantity("");
      setCommission("");
      setTags("");
      setNote("");
      setRepeat(false);
      setDeductMoney(true);
      setDontCloseDialog(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatDate = (d: Date | null) => {
    if (!d) return "";
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const calculateTotal = () => {
    const p = parseFloat(price) || 0;
    const q = parseFloat(quantity) || 0;
    const c = parseFloat(commission) || 0;
    return (p * q + c).toFixed(2);
  };

  const numericPrice = parseFloat(price);
  const numericQuantity = parseFloat(quantity);

  const isFormValid =
    assetCode.trim() &&
    !isNaN(numericPrice) &&
    numericPrice > 0 &&
    !isNaN(numericQuantity) &&
    numericQuantity > 0 &&
    tradeDate &&
    currentPortfolioId;

  const handleAdd = async () => {
    if (!isFormValid || !userId || !currentPortfolioId) return;

    const numericCommission = commission ? parseFloat(commission) : 0;
    if (commission && isNaN(numericCommission)) {
      console.error("Invalid commission value");
      return;
    }

    try {
      await createTrade.mutateAsync({
        userId,
        portfolioId: currentPortfolioId,
        assetType,
        assetCode: assetCode.trim(),
        operation,
        tradeDate: tradeDate.toISOString().split("T")[0],
        price: numericPrice,
        tradeCurrency,
        quantity: numericQuantity,
        commission: numericCommission,
        tags: tags.trim() ? tags.split(",").map((t) => t.trim()) : undefined,
        note: note.trim() || undefined,
      });

      if (!dontCloseDialog) {
        onClose();
      } else {
        // Reset form but keep dialog open
        setAssetCode("");
        setPrice("");
        setQuantity("");
        setCommission("");
        setTags("");
        setNote("");
      }
    } catch (error) {
      console.error("Failed to create trade:", error);
      // TODO: Show error toast
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto mx-4">
        <div className="w-full rounded-lg border border-tyrian-gray-darker glass-card backdrop-blur-[50px] py-6">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pb-4 border-b border-tyrian-gray-darker">
            <h2 className="text-white text-2xl font-bold font-nunito">
              Add Trade to{" "}
              <span className="text-tyrian-purple-primary">{displayName}</span>
            </h2>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-6 h-6 rounded-md hover:bg-tyrian-purple-dark/30 transition-colors"
            >
              <X className="w-6 h-6 text-tyrian-gray-medium" />
            </button>
          </div>

          {/* Form content */}
          <div className="px-6 pt-4 space-y-4">
            {/* Row 1: Asset Type */}
            <div className="flex flex-col gap-2">
              <label className="text-white text-[15px] font-bold font-nunito">
                Asset Type
              </label>
              <Select
                value={assetType}
                onValueChange={(v) => setAssetType(v as AssetType)}
              >
                <SelectTrigger className="h-11 px-4 rounded-lg border border-tyrian-gray-darker glass-card bg-transparent text-white text-[15px] font-bold font-nunito">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-[120] max-h-80 overflow-y-auto border border-tyrian-gray-darker bg-[#0C1014] backdrop-blur-[50px] shadow-xl">
                  {ASSET_TYPES.map((type) => (
                    <SelectItem
                      key={type}
                      value={type}
                      className="text-white text-[15px] font-bold font-nunito hover:bg-tyrian-purple-background/40 focus:bg-tyrian-purple-background/40 focus:text-white data-[highlighted]:bg-tyrian-purple-background/40 data-[highlighted]:text-white cursor-pointer"
                    >
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Row 2: Asset Code */}
            <div className="flex flex-col gap-2">
              <label className="text-white text-[15px] font-bold font-nunito">
                Asset Code or Company Name{" "}
                <span className="text-tyrian-gray-medium">*</span>
              </label>
              <input
                type="text"
                placeholder="Asset Code or Company Name *"
                value={assetCode}
                onChange={(e) => setAssetCode(e.target.value)}
                className="h-11 px-4 rounded-lg border border-tyrian-gray-darker glass-card bg-transparent text-white placeholder-tyrian-gray-medium text-[15px] font-medium font-nunito outline-none focus:border-tyrian-purple-primary/50 transition-colors"
              />
            </div>

            {/* Row 3: Operation and Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-white text-[15px] font-bold font-nunito">
                  Operation
                </label>
                <Select
                  value={operation}
                  onValueChange={(v) => setOperation(v as Operation)}
                >
                  <SelectTrigger className="h-11 px-4 rounded-lg border border-tyrian-gray-darker glass-card bg-transparent text-white text-[15px] font-bold font-nunito">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[120] max-h-80 overflow-y-auto border border-tyrian-gray-darker bg-[#0C1014] backdrop-blur-[50px] shadow-xl">
                    {OPERATIONS.map((op) => (
                      <SelectItem
                        key={op}
                        value={op}
                        className="text-white text-[15px] font-bold font-nunito hover:bg-tyrian-purple-background/40 focus:bg-tyrian-purple-background/40 focus:text-white data-[highlighted]:bg-tyrian-purple-background/40 data-[highlighted]:text-white cursor-pointer"
                      >
                        {op}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-white text-[15px] font-bold font-nunito">
                  Trade Date <span className="text-tyrian-gray-medium">*</span>
                </label>
                <Popover
                  open={isDatePopoverOpen}
                  onOpenChange={setIsDatePopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <button className="flex items-center justify-between h-11 px-4 rounded-lg border border-tyrian-gray-darker glass-card bg-transparent text-white text-[15px]">
                      <span>{formatDate(tradeDate)}</span>
                      <CalendarIcon className="w-4 h-4 text-tyrian-gray-medium" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="z-[120] p-0 border-0 bg-transparent shadow-none">
                    <CompactCalendar
                      selected={tradeDate}
                      onSelect={(d) => {
                        setTradeDate(d || new Date());
                        setIsDatePopoverOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Row 4: Price, Currency, Quantity */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-white text-[15px] font-bold font-nunito">
                  Price <span className="text-tyrian-gray-medium">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="h-11 px-4 rounded-lg border border-tyrian-gray-darker glass-card bg-transparent text-white placeholder-tyrian-gray-medium text-[15px] font-nunito outline-none focus:border-tyrian-purple-primary/50 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-white text-[15px] font-bold font-nunito">
                  Trade Currency
                </label>
                <Select
                  value={tradeCurrency}
                  onValueChange={(v) => setTradeCurrency(v as CurrencyCode)}
                >
                  <SelectTrigger className="h-11 px-4 rounded-lg border border-tyrian-gray-darker glass-card bg-transparent text-white text-[15px] font-bold font-nunito">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[120] max-h-80 overflow-y-auto border border-tyrian-gray-darker bg-[#0C1014] backdrop-blur-[50px] shadow-xl">
                    {[
                      "RUB",
                      "USD",
                      "EUR",
                      "GBP",
                      "JPY",
                      "CNY",
                      "CHF",
                      "CAD",
                      "AUD",
                    ].map((curr) => (
                      <SelectItem
                        key={curr}
                        value={curr}
                        className="text-white text-[15px] font-bold font-nunito hover:bg-tyrian-purple-background/40 focus:bg-tyrian-purple-background/40 focus:text-white data-[highlighted]:bg-tyrian-purple-background/40 data-[highlighted]:text-white cursor-pointer"
                      >
                        {curr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-white text-[15px] font-bold font-nunito">
                  Quantity <span className="text-tyrian-gray-medium">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="h-11 px-4 rounded-lg border border-tyrian-gray-darker glass-card bg-transparent text-white placeholder-tyrian-gray-medium text-[15px] font-nunito outline-none focus:border-tyrian-purple-primary/50 transition-colors"
                />
                <span className="text-tyrian-gray-medium text-xs font-nunito">
                  specified in units
                </span>
              </div>
            </div>

            {/* Row 5: Commission */}
            <div className="flex flex-col gap-2">
              <label className="text-white text-[15px] font-bold font-nunito">
                Commission
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={commission}
                onChange={(e) => setCommission(e.target.value)}
                className="h-11 px-4 rounded-lg border border-tyrian-gray-darker glass-card bg-transparent text-white placeholder-tyrian-gray-medium text-[15px] font-nunito outline-none focus:border-tyrian-purple-primary/50 transition-colors"
              />
            </div>

            {/* Row 6: Tags, Note, Repeat */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center gap-2 h-11 px-4 rounded-lg border border-tyrian-gray-darker glass-card bg-transparent text-tyrian-gray-medium text-[15px] font-bold font-nunito hover:text-white hover:border-tyrian-purple-primary/50 transition-colors">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                  <line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
                Tags
              </button>

              <button className="flex items-center gap-2 h-11 px-4 rounded-lg border border-tyrian-gray-darker glass-card bg-transparent text-tyrian-gray-medium text-[15px] font-bold font-nunito hover:text-white hover:border-tyrian-purple-primary/50 transition-colors">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Note
              </button>

              <button className="flex items-center gap-2 h-11 px-4 rounded-lg border border-tyrian-gray-darker glass-card bg-transparent text-tyrian-gray-medium text-[15px] font-bold font-nunito hover:text-white hover:border-tyrian-purple-primary/50 transition-colors">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Repeat
              </button>
            </div>

            {/* Row 7: Trade Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-tyrian-gray-darker">
              <div className="flex flex-col gap-1">
                <span className="text-tyrian-gray-medium text-xs font-nunito">
                  Trade Amount:
                </span>
                <span className="text-white text-lg font-bold font-nunito">
                  {calculateTotal()} {tradeCurrency}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-tyrian-gray-medium text-xs font-nunito">
                  Available:
                </span>
                <span className="text-white text-lg font-bold font-nunito">
                  10 000.00 ₽
                </span>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex flex-col gap-3 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={deductMoney}
                  onChange={(e) => setDeductMoney(e.target.checked)}
                  className="w-4 h-4 rounded border-tyrian-gray-darker bg-[#0C1014] text-tyrian-purple-primary focus:ring-tyrian-purple-primary focus:ring-offset-0"
                />
                <span className="text-white text-sm font-bold font-nunito">
                  Deduct money
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dontCloseDialog}
                  onChange={(e) => setDontCloseDialog(e.target.checked)}
                  className="w-4 h-4 rounded border-tyrian-gray-darker bg-[#0C1014] text-tyrian-purple-primary focus:ring-tyrian-purple-primary focus:ring-offset-0"
                />
                <span className="text-tyrian-gray-medium text-sm font-nunito">
                  Don't close dialog
                </span>
              </label>
            </div>

            {/* Required text */}
            <div className="text-tyrian-gray-medium text-xs font-nunito pt-2">
              * required fields
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between px-6 pt-4">
            <button
              onClick={async () => {
                if (!userId || !currentPortfolioId || isLoadingDemo) return;
                setIsLoadingDemo(true);
                try {
                  await api.demoData.seed(userId, currentPortfolioId);
                  queryClient.invalidateQueries({ queryKey: ["assets"] });
                  queryClient.invalidateQueries({ queryKey: ["trades"] });
                  onClose();
                } catch (error) {
                  console.error("Failed to seed demo data:", error);
                } finally {
                  setIsLoadingDemo(false);
                }
              }}
              disabled={!userId || !currentPortfolioId || isLoadingDemo}
              className="flex items-center justify-center px-4 py-3 rounded-[32px] border border-tyrian-purple-primary/50 text-tyrian-purple-primary text-[15px] font-bold font-nunito hover:bg-tyrian-purple-primary/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingDemo ? "Loading..." : "Demo"}
            </button>
            <div className="flex gap-3">
              <button
                onClick={handleAdd}
                disabled={!isFormValid}
                className={`flex items-center justify-center w-[180px] h-10 px-4 py-3 rounded-[32px] border border-tyrian-gray-darker glass-card backdrop-blur-[58px] transition-all ${
                  isFormValid
                    ? "hover:bg-tyrian-gradient-animated hover:border-tyrian-purple-primary hover-lift"
                    : "cursor-not-allowed"
                }`}
              >
                <span
                  className={`text-[15px] font-bold font-nunito text-center ${
                    isFormValid ? "text-white" : "text-tyrian-gray-medium"
                  }`}
                >
                  Add
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTradeModal;
