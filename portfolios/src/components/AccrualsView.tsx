import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface AccrualRowProps {
  type: 'Purchase' | 'Coupon';
  asset: {
    name: string;
    symbol: string;
  };
  date: string;
  total: string;
  perUnit: string;
  tax: string;
}

const AccrualRow: React.FC<AccrualRowProps> = ({
  type,
  asset,
  date,
  total,
  perUnit,
  tax
}) => (
  <div className="flex h-14 px-4 items-center gap-6 w-full">
    {/* Type */}
    <div className="flex w-[104px] flex-col items-start">
      <span className="text-tyrian-green text-[15px] font-bold font-nunito">{type}</span>
    </div>

    {/* Asset */}
    <div className="flex w-64 items-center gap-2">
      <div className="flex flex-col justify-center items-start">
        <span className="text-white text-[15px] font-bold font-nunito">{asset.name}</span>
        <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">{asset.symbol}</span>
      </div>
    </div>

    {/* Date */}
    <div className="flex flex-1 flex-col justify-center items-start">
      <span className="text-white text-[15px] font-bold font-nunito">{date}</span>
    </div>

    {/* Total */}
    <div className="flex flex-1 flex-col justify-center items-start">
      <span className="text-white text-[15px] font-bold font-nunito">{total}</span>
    </div>

    {/* Per Unit */}
    <div className="flex flex-1 flex-col justify-center items-start">
      <span className="text-white text-[15px] font-bold font-nunito">{perUnit}</span>
    </div>

    {/* Tax */}
    <div className="flex w-[104px] flex-col justify-center items-end">
      <span className="text-white text-[15px] font-bold font-nunito">{tax}</span>
    </div>
  </div>
);

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex items-start gap-1">
    {/* First */}
    <button 
      className="flex w-11 h-11 px-4 py-2.5 flex-col justify-center items-center gap-2 rounded border border-tyrian-gray-darker bg-tyrian-black/50 backdrop-blur-[50px]"
      onClick={() => onPageChange(1)}
      disabled={currentPage === 1}
    >
      <div className="flex">
        <ChevronLeft className="w-5 h-5 text-tyrian-gray-medium" />
        <ChevronLeft className="w-5 h-5 text-tyrian-gray-medium -ml-2" />
      </div>
    </button>

    {/* Previous */}
    <button 
      className="flex w-11 h-11 px-4 py-2.5 flex-col justify-center items-center gap-2 rounded border border-tyrian-gray-darker bg-tyrian-black/50 backdrop-blur-[50px]"
      onClick={() => onPageChange(Math.max(1, currentPage - 1))}
      disabled={currentPage === 1}
    >
      <ChevronLeft className="w-5 h-5 text-tyrian-gray-medium" />
    </button>

    {/* Page Numbers */}
    {[1, 2, 3, 4].map((pageNum) => (
      <button
        key={pageNum}
        className={`flex w-11 h-11 p-2 flex-col justify-center items-center gap-2.5 rounded ${
          currentPage === pageNum
            ? 'bg-tyrian-gradient'
            : 'border border-tyrian-gray-darker bg-tyrian-black/50 backdrop-blur-[50px]'
        }`}
        onClick={() => onPageChange(pageNum)}
      >
        <span className={`text-[15px] font-bold font-nunito ${
          currentPage === pageNum ? 'text-white' : 'text-tyrian-gray-medium'
        }`}>
          {pageNum}
        </span>
      </button>
    ))}

    {/* Next */}
    <button 
      className="flex w-11 h-11 px-4 py-2.5 flex-col justify-center items-center gap-2 rounded border border-tyrian-gray-darker bg-tyrian-black/50 backdrop-blur-[50px]"
      onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
      disabled={currentPage === totalPages}
    >
      <ChevronRight className="w-5 h-5 text-tyrian-gray-medium" />
    </button>

    {/* Last */}
    <button 
      className="flex w-11 h-11 px-4 py-2.5 flex-col justify-center items-center gap-2 rounded border border-tyrian-gray-darker bg-tyrian-black/50 backdrop-blur-[50px]"
      onClick={() => onPageChange(totalPages)}
      disabled={currentPage === totalPages}
    >
      <div className="flex">
        <ChevronRight className="w-5 h-5 text-tyrian-gray-medium" />
        <ChevronRight className="w-5 h-5 text-tyrian-gray-medium -ml-2" />
      </div>
    </button>
  </div>
);

const AccrualsView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Mock accrual data based on Figma design
  const accruals: AccrualRowProps[] = [
    ...Array(15).fill(null).map((_, index) => ({
      type: 'Purchase' as const,
      asset: {
        name: 'Bank of America Corp.',
        symbol: 'BAC'
      },
      date: '12.05.2023',
      total: '$1,000,000.00',
      perUnit: '$1,000,000.00',
      tax: '$1,000,000.00'
    })),
    {
      type: 'Coupon' as const,
      asset: {
        name: 'Bank of America Corp.',
        symbol: 'BAC'
      },
      date: '12.05.2023',
      total: '$1,000,000.00',
      perUnit: '$1,000,000.00',
      tax: '$1,000,000.00'
    },
    ...Array(8).fill(null).map((_, index) => ({
      type: 'Purchase' as const,
      asset: {
        name: 'Bank of America Corp.',
        symbol: 'BAC'
      },
      date: '12.05.2023',
      total: '$1,000,000.00',
      perUnit: '$1,000,000.00',
      tax: '$1,000,000.00'
    }))
  ];

  const filteredAccruals = accruals.filter(accrual => 
    accrual.asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    accrual.asset.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAccruals.length / 20);
  const paginatedAccruals = filteredAccruals.slice(
    (currentPage - 1) * 20,
    currentPage * 20
  );

  return (
    <div className="flex w-full flex-col items-center gap-6">
      {/* Main Table Container */}
      <div className="flex w-full flex-col items-start rounded-xl border border-tyrian-gray-darker bg-tyrian-black/50 backdrop-blur-[50px]">
        {/* Header with Search */}
        <div className="flex p-4 items-center gap-4 w-full">
          {/* Search Bar */}
          <div className="flex w-[647px] h-11 px-4 py-2.5 items-center gap-2 rounded-lg border border-tyrian-gray-darker bg-tyrian-black/50 backdrop-blur-[50px]">
            <Search className="w-6 h-6 text-tyrian-gray-medium" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-tyrian-gray-medium text-[15px] font-medium font-nunito placeholder-tyrian-gray-medium outline-none"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-tyrian-gray-darker"></div>

        {/* Table Header */}
        <div className="flex px-4 py-3 items-center gap-6 w-full border-b border-tyrian-gray-darker">
          <div className="flex w-[104px] flex-col items-start">
            <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">Type</span>
          </div>
          <div className="flex w-64 flex-col items-start">
            <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">Asset</span>
          </div>
          <div className="flex flex-1 flex-col justify-center items-start">
            <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">Date</span>
          </div>
          <div className="flex flex-1 flex-col justify-center items-start">
            <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">Total</span>
          </div>
          <div className="flex flex-1 flex-col justify-center items-start">
            <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">Per Unit</span>
          </div>
          <div className="flex w-[104px] flex-col items-end">
            <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">Tax</span>
          </div>
        </div>

        {/* Accrual Rows */}
        <div className="w-full">
          {paginatedAccruals.map((accrual, index) => (
            <div key={index}>
              <AccrualRow {...accrual} />
              {index < paginatedAccruals.length - 1 && (
                <div className="h-px w-full bg-tyrian-gray-darker"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default AccrualsView;
