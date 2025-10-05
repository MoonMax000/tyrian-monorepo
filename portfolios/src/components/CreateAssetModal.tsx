import React, { useState, useEffect } from "react";
import { X, ChevronDown, Info } from "lucide-react";
import CurrencySelect, { CurrencyCode } from "./CurrencySelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { usePortfolioContext } from "../contexts/PortfolioContext";
import { useCreateAsset } from "../hooks/use-assets";
import { api } from "../lib/api-client";
import { useQueryClient } from "@tanstack/react-query";

interface CreateAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string | null;
}

const ASSET_CATEGORIES = [
  "Stocks",
  "Bonds",
  "Cash",
  "ETF/Mutual Fund",
  "Bank Deposit",
  "Futures",
  "Options",
  "Precious Metals",
  "Real Estate",
  "Currencies",
  "Cryptocurrencies",
  "NFT",
  "Crowdfunding Loan",
  "Other",
] as const;

type AssetCategory = (typeof ASSET_CATEGORIES)[number];

const CreateAssetModal: React.FC<CreateAssetModalProps> = ({
  isOpen,
  onClose,
  userId,
}) => {
  const { currentPortfolioId } = usePortfolioContext();
  const createAsset = useCreateAsset();
  const queryClient = useQueryClient();
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);

  const [assetCategory, setAssetCategory] = useState<AssetCategory>("Futures");
  const [assetCode, setAssetCode] = useState("");
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [assetName, setAssetName] = useState("");
  const [manualPrice, setManualPrice] = useState(true);
  const [assetPrice, setAssetPrice] = useState("");
  const [nominalValue, setNominalValue] = useState("");
  const [accruedInterest, setAccruedInterest] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (isOpen) {
      setAssetCategory("Futures");
      setAssetCode("");
      setCurrency("USD");
      setAssetName("");
      setManualPrice(true);
      setAssetPrice("");
      setNominalValue("");
      setAccruedInterest("");
      setNote("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isBond = assetCategory === "Bonds";
  const numericAssetPrice =
    assetPrice === "" ? undefined : parseFloat(assetPrice);
  const numericNominal =
    nominalValue === "" ? undefined : parseFloat(nominalValue);
  const numericAccrued =
    accruedInterest === "" ? undefined : parseFloat(accruedInterest);
  const hasValidNumbers = isBond
    ? typeof numericAssetPrice === "number" &&
      !isNaN(numericAssetPrice) &&
      numericAssetPrice > 0 &&
      typeof numericNominal === "number" &&
      !isNaN(numericNominal) &&
      numericNominal > 0
    : numericAssetPrice === undefined ||
      (!isNaN(numericAssetPrice) && numericAssetPrice >= 0);
  const isFormValid = assetCode.trim() && assetName.trim() && hasValidNumbers;

  const handleCreate = async () => {
    if (!isFormValid || !userId) return;

    try {
      await createAsset.mutateAsync({
        userId,
        portfolioId: currentPortfolioId || undefined,
        category: assetCategory,
        code: assetCode.trim(),
        currency,
        name: assetName.trim(),
        manualPrice,
        price: numericAssetPrice,
        nominalValue: numericNominal,
        accruedInterest: numericAccrued,
        note: note.trim() || undefined,
      });

      onClose();
    } catch (error) {
      console.error("Failed to create asset:", error);
      // TODO: Show error toast
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-[985px] max-h-[90vh] overflow-y-auto mx-4">
        <div className="w-full rounded-lg border border-tyrian-gray-darker glass-card backdrop-blur-[50px] py-6">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pb-4 border-b border-tyrian-gray-darker">
            <h2 className="text-white text-2xl font-bold font-nunito">
              Create Custom Asset
            </h2>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-6 h-6 rounded-md hover:bg-tyrian-purple-dark/30 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Form content */}
          <div className="px-6 pt-4 space-y-4">
            {/* Row 1: Asset Category, Asset Code, Currency */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Asset Category */}
              <div className="flex flex-col gap-2">
                <label className="text-white text-[15px] font-bold font-nunito">
                  Asset Category
                </label>
                <Select
                  value={assetCategory}
                  onValueChange={(v) => setAssetCategory(v as AssetCategory)}
                >
                  <SelectTrigger className="h-11 px-4 rounded-lg border border-tyrian-gray-darker glass-card bg-transparent text-white text-[15px] font-bold font-nunito">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[120] max-h-80 overflow-y-auto border border-tyrian-gray-darker bg-[#0C1014] backdrop-blur-[50px] shadow-xl">
                    {ASSET_CATEGORIES.map((cat) => (
                      <SelectItem
                        key={cat}
                        value={cat}
                        className="text-white text-[15px] font-bold font-nunito hover:bg-tyrian-purple-background/40 focus:bg-tyrian-purple-background/40 focus:text-white data-[highlighted]:bg-tyrian-purple-background/40 data-[highlighted]:text-white cursor-pointer"
                      >
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Asset Code */}
              <div className="flex flex-col gap-2">
                <label className="text-white text-[15px] font-bold font-nunito">
                  Asset Code (ticker/isin)
                  <span className="text-tyrian-gray-medium">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Asset Code (ticker/isin)"
                  value={assetCode}
                  onChange={(e) => setAssetCode(e.target.value)}
                  className="h-11 px-4 rounded-lg border border-tyrian-gray-darker glass-card bg-transparent text-white placeholder-tyrian-gray-medium text-[15px] font-medium font-nunito outline-none focus:border-tyrian-purple-primary/50 transition-colors"
                />
              </div>

              {/* Currency */}
              <div className="flex flex-col gap-2">
                <label className="text-white text-[15px] font-bold font-nunito">
                  Asset Currency
                  <span className="text-tyrian-gray-medium">*</span>
                </label>
                <Select
                  value={currency}
                  onValueChange={(v) => setCurrency(v as CurrencyCode)}
                >
                  <SelectTrigger className="h-11 px-4 rounded-lg border border-tyrian-gray-darker glass-card bg-transparent text-white text-[15px] font-bold font-nunito">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[120] max-h-80 overflow-y-auto border border-tyrian-gray-darker bg-[#0C1014] backdrop-blur-[50px] shadow-xl">
                    {[
                      "USD",
                      "EUR",
                      "GBP",
                      "JPY",
                      "CHF",
                      "CAD",
                      "AUD",
                      "CNY",
                      "RUB",
                      "INR",
                      "BRL",
                      "KRW",
                      "SGD",
                      "HKD",
                      "SEK",
                      "NOK",
                      "DKK",
                      "PLN",
                      "CZK",
                      "TRY",
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
            </div>

            {/* Row 2: Asset Name */}
            <div className="flex flex-col gap-2">
              <label className="text-white text-[15px] font-bold font-nunito">
                Asset Name<span className="text-tyrian-gray-medium">*</span>
              </label>
              <input
                type="text"
                placeholder="Asset Name"
                value={assetName}
                onChange={(e) => setAssetName(e.target.value)}
                className="h-11 px-4 rounded-lg border border-tyrian-gray-darker glass-card bg-transparent text-white placeholder-tyrian-gray-medium text-[15px] font-medium font-nunito outline-none focus:border-tyrian-purple-primary/50 transition-colors"
              />
            </div>

            {/* Row 3: Manual Price Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setManualPrice(!manualPrice)}
                className={`relative w-[38px] h-5 p-[2px] rounded-full transition-colors ${
                  manualPrice
                    ? "bg-tyrian-purple-background"
                    : "bg-tyrian-gray-darker"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    manualPrice ? "translate-x-[18px]" : "translate-x-0"
                  }`}
                />
              </button>
              <span className="text-white text-[15px] font-bold font-nunito">
                Current price: Enter manually
              </span>
              <button className="flex items-center justify-center w-5 h-5">
                <Info className="w-5 h-5 text-tyrian-gray-medium" />
              </button>
            </div>

            {/* Row 4: Asset Price / Nominal / Accrued Interest */}
            {isBond ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-white text-[15px] font-bold font-nunito">
                    Asset Price
                    <span className="text-tyrian-gray-medium">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Enter price"
                    value={assetPrice}
                    onChange={(e) => setAssetPrice(e.target.value)}
                    className="h-11 px-4 rounded-lg border border-tyrian-gray-darker glass-card bg-transparent text-white placeholder-tyrian-gray-medium text-[15px] font-bold font-nunito outline-none focus:border-tyrian-purple-primary/50 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-white text-[15px] font-bold font-nunito">
                    Nominal<span className="text-tyrian-gray-medium">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Enter nominal value"
                    value={nominalValue}
                    onChange={(e) => setNominalValue(e.target.value)}
                    className="h-11 px-4 rounded-lg border border-tyrian-gray-darker glass-card bg-transparent text-white placeholder-tyrian-gray-medium text-[15px] font-bold font-nunito outline-none focus:border-tyrian-purple-primary/50 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-white text-[15px] font-bold font-nunito">
                    ACI
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Accrued interest"
                    value={accruedInterest}
                    onChange={(e) => setAccruedInterest(e.target.value)}
                    className="h-11 px-4 rounded-lg border border-tyrian-gray-darker glass-card bg-transparent text-white placeholder-tyrian-gray-medium text-[15px] font-bold font-nunito outline-none focus:border-tyrian-purple-primary/50 transition-colors"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 max-w-[460px]">
                <label className="text-white text-[15px] font-bold font-nunito">
                  Asset Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Asset Price"
                  value={assetPrice}
                  onChange={(e) => setAssetPrice(e.target.value)}
                  className="h-11 px-4 rounded-lg border border-tyrian-gray-darker glass-card bg-transparent text-white placeholder-tyrian-gray-medium text-[15px] font-bold font-nunito outline-none focus:border-tyrian-purple-primary/50 transition-colors"
                />
              </div>
            )}

            {/* Row 5: Note */}
            <div className="flex flex-col gap-2">
              <label className="text-white text-[15px] font-bold font-nunito">
                Note
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full h-11 px-4 pr-10 rounded-lg border border-tyrian-gray-darker glass-card bg-transparent text-tyrian-gray-medium placeholder-tyrian-gray-medium text-[15px] font-medium font-nunito outline-none focus:border-tyrian-purple-primary/50 transition-colors"
                />
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white pointer-events-none" />
              </div>
            </div>

            {/* Required text */}
            <div className="flex items-center gap-1 text-tyrian-gray-medium text-[15px] font-medium font-nunito">
              <span>*</span>
              <span>Required</span>
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
                onClick={handleCreate}
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

export default CreateAssetModal;
