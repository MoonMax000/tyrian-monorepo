import React, { useState } from 'react';
import { Search, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface TransactionRowProps {
  type: string;
  asset: {
    name: string;
    symbol: string;
  };
  date: string;
  quantity: string;
  price: string;
  fee: string;
  amount: string;
  profit: {
    amount: string;
    percentage: string;
  };
}

const TransactionRow: React.FC<TransactionRowProps> = ({
  type,
  asset,
  date,
  quantity,
  price,
  fee,
  amount,
  profit
}) => (
  <div className="flex h-14 px-4 items-center w-full">
    {/* Type */}
    <div className="flex w-24 flex-col items-start">
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
    <div className="flex w-30 flex-col items-start">
      <span className="text-white text-[15px] font-bold font-nunito">{date}</span>
    </div>

    {/* Quantity */}
    <div className="flex flex-1 flex-col items-start">
      <span className="text-white text-[15px] font-bold font-nunito">{quantity}</span>
    </div>

    {/* Price */}
    <div className="flex flex-1 flex-col items-start">
      <span className="text-white text-[15px] font-bold font-nunito">{price}</span>
    </div>

    {/* Fee */}
    <div className="flex flex-1 flex-col items-start">
      <span className="text-white text-[15px] font-bold font-nunito">{fee}</span>
    </div>

    {/* Amount */}
    <div className="flex flex-1 flex-col items-start">
      <span className="text-white text-[15px] font-bold font-nunito">{amount}</span>
    </div>

    {/* Profit */}
    <div className="flex w-44 justify-end items-center gap-1">
      <span className="text-tyrian-green text-[15px] font-bold font-nunito">{profit.amount}</span>
      <div className="flex px-1 py-0.5 justify-center items-center rounded bg-tyrian-green-background">
        <span className="text-tyrian-green text-xs font-bold font-nunito">{profit.percentage}</span>
      </div>
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
    {[...Array(Math.min(4, totalPages))].map((_, index) => {
      const pageNum = index + 1;
      return (
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
      );
    })}

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

const TransactionsView: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('All Transactions');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Mock transaction data based on Figma design
  const transactions: TransactionRowProps[] = Array(24).fill(null).map((_, index) => ({
    type: 'Purchase',
    asset: {
      name: 'Bank of America Corp.',
      symbol: 'BAC'
    },
    date: '12.05.2023',
    quantity: '1,000,000',
    price: '$1,000,000.00',
    fee: '$1,000,000.00',
    amount: '$1,000,000.00',
    profit: {
      amount: '+$1,000,000.00',
      percentage: '+1000.00%'
    }
  }));

  const filteredTransactions = transactions.filter(transaction => 
    transaction.asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.asset.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTransactions.length / 20);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * 20,
    currentPage * 20
  );

  return (
    <div className="flex w-full flex-col items-center gap-6">
      {/* Main Table Container */}
      <div className="flex w-full flex-col items-start rounded-xl border border-tyrian-gray-darker bg-tyrian-black/50 backdrop-blur-[50px]">
        {/* Header with Filter and Search */}
        <div className="flex p-4 justify-between items-center w-full">
          {/* Transaction Filter Dropdown */}
          <div className="flex px-3 py-2.5 justify-center items-center gap-2 rounded border border-tyrian-gray-darker bg-tyrian-black/50 backdrop-blur-[50px]">
            <span className="text-white text-[15px] font-bold font-nunito">{selectedFilter}</span>
            <ChevronDown className="w-4 h-4 text-tyrian-gray-medium" />
          </div>

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
        <div className="flex px-4 py-3 items-center w-full border-b border-tyrian-gray-darker">
          <div className="flex w-24 flex-col items-start">
            <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">Type</span>
          </div>
          <div className="flex w-64 flex-col items-start">
            <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">Asset</span>
          </div>
          <div className="flex w-30 flex-col items-start">
            <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">Date</span>
          </div>
          <div className="flex flex-1 flex-col items-start">
            <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">Quantity</span>
          </div>
          <div className="flex flex-1 flex-col items-start">
            <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">Price</span>
          </div>
          <div className="flex flex-1 flex-col items-start">
            <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">Fee</span>
          </div>
          <div className="flex flex-1 flex-col items-start">
            <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">Amount</span>
          </div>
          <div className="flex w-44 flex-col justify-center items-end">
            <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase text-center">Profit</span>
          </div>
        </div>

        {/* Transaction Rows */}
        <div className="w-full">
          {paginatedTransactions.map((transaction, index) => (
            <div key={index}>
              <TransactionRow {...transaction} />
              {index < paginatedTransactions.length - 1 && (
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

export default TransactionsView;
