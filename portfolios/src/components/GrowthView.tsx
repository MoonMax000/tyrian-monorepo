import React, { useState } from 'react';
import { Calendar, ChevronRight } from 'lucide-react';

interface TimeFilterProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const TimeFilter: React.FC<TimeFilterProps> = ({ activeFilter, onFilterChange }) => {
  const filters = ['7d', '1m', '3M', '6m', '1y', '5y', 'all'];
  
  return (
    <div className="flex items-center gap-2">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={`flex items-center justify-center px-4 py-2.5 rounded text-xs font-bold font-nunito uppercase transition-all ${
            activeFilter === filter
              ? 'bg-tyrian-gradient text-white'
              : 'border border-tyrian-purple-primary text-tyrian-gray-medium hover:text-white'
          }`}
        >
          {filter}
        </button>
      ))}
      <button className="flex items-center justify-center w-[42px] h-[26px] px-4 py-2.5 rounded border border-tyrian-purple-primary">
        <Calendar className="w-5 h-5 text-tyrian-gray-medium" />
      </button>
    </div>
  );
};

interface BenchmarkSelectorProps {
  selectedBenchmark: string;
  onBenchmarkChange: (benchmark: string) => void;
}

const BenchmarkSelector: React.FC<BenchmarkSelectorProps> = ({ selectedBenchmark, onBenchmarkChange }) => (
  <div className="flex items-center gap-2">
    <span className="text-white text-[15px] font-bold font-nunito">Benchmarks:</span>
    <div className="flex items-center px-1 py-0.5 gap-1 rounded bg-tyrian-purple-background">
      <span className="text-white text-xs font-bold font-nunito uppercase">{selectedBenchmark}</span>
    </div>
    <button 
      className="text-tyrian-purple-primary text-[15px] font-bold font-nunito underline"
      onClick={() => onBenchmarkChange('SPY')}
    >
      Select
    </button>
  </div>
);

interface PortfolioChartProps {
  title: string;
  subtitle?: string;
  timeFilter: string;
  onTimeFilterChange: (filter: string) => void;
  showBenchmark?: boolean;
  showPercentage?: boolean;
  children: React.ReactNode;
}

const PortfolioChart: React.FC<PortfolioChartProps> = ({ 
  title, 
  subtitle, 
  timeFilter, 
  onTimeFilterChange, 
  showBenchmark = false, 
  showPercentage = false,
  children 
}) => (
  <div className="flex w-full p-4 flex-col items-start gap-4 rounded-3xl border border-tyrian-gray-darker bg-tyrian-black/50 backdrop-blur-[50px]">
    {/* Header */}
    <div className="flex justify-between items-center w-full">
      <div className="text-white text-2xl font-bold font-nunito">{title}</div>
      <TimeFilter activeFilter={timeFilter} onFilterChange={onTimeFilterChange} />
    </div>

    {/* Subtitle/Metrics */}
    {subtitle && (
      <div className="flex justify-between items-center w-full">
        <div className="flex items-start gap-1">
          <span className="text-white text-[15px] font-bold font-nunito">Portfolio Outperformance vs IMOEX:</span>
          <span className="text-tyrian-green text-[15px] font-bold font-nunito">$385,516.55</span>
          <div className="flex px-1 py-0.5 justify-center items-center rounded bg-tyrian-green-background">
            <span className="text-tyrian-green text-xs font-bold font-nunito">+35.07%</span>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-tyrian-gray-medium text-[15px] font-bold font-nunito">24 Jan 2024 - 24 Jan 2025</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-tyrian-purple-primary"></div>
            <div className="flex px-1 py-0.5 justify-center items-center rounded bg-tyrian-green-background">
              <span className="text-tyrian-green text-xs font-bold font-nunito">+$250,759.06</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-tyrian-yellow"></div>
            <div className="flex px-1 py-0.5 justify-center items-center rounded bg-red-900/30">
              <span className="text-red-400 text-xs font-bold font-nunito">-$134,757.50</span>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Benchmark Selector */}
    {showBenchmark && (
      <div className="flex justify-between items-center w-full">
        <BenchmarkSelector selectedBenchmark="IMOEX" onBenchmarkChange={() => {}} />
        {showPercentage && (
          <div className="flex items-start gap-3">
            <span className="text-tyrian-gray-medium text-[15px] font-bold font-nunito">24 Jan 2024 - 24 Jan 2025</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-tyrian-purple-primary"></div>
              <div className="flex px-1 py-0.5 justify-center items-center rounded bg-tyrian-green-background">
                <span className="text-tyrian-green text-xs font-bold font-nunito">+$250,759.06</span>
              </div>
              <div className="flex px-1 py-0.5 justify-center items-center rounded bg-tyrian-green-background">
                <span className="text-tyrian-green text-xs font-bold font-nunito">+24.18%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    )}

    {/* Chart Content */}
    <div className="flex flex-col items-start gap-[-8px] flex-1 w-full">
      {children}
    </div>

    {/* Legend */}
    <div className="flex justify-center items-center gap-4 w-full">
      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-tyrian-purple-primary"></div>
        <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">Binance Crypto Portfolio</span>
      </div>
      {!showPercentage && (
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-tyrian-yellow"></div>
          <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">MOex</span>
        </div>
      )}
    </div>
  </div>
);

const LineChart: React.FC = () => (
  <div className="flex justify-between items-end w-full h-56 px-6">
    {/* Y-axis labels */}
    <div className="flex flex-col justify-between h-full text-right pr-2">
      <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">1.8M</span>
      <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">1.6M</span>
      <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">1.4M</span>
      <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">1.2M</span>
      <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">1M</span>
      <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">800K</span>
    </div>
    
    {/* Chart area with grid lines */}
    <div className="flex-1 h-full relative">
      {/* Horizontal grid lines */}
      <div className="absolute inset-0 flex flex-col justify-between">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-px bg-tyrian-purple-background opacity-50"></div>
        ))}
      </div>
      
      {/* Chart lines - simplified representation */}
      <svg className="w-full h-full" viewBox="0 0 1000 200" fill="none">
        {/* Purple line (Binance) */}
        <path
          d="M0 180 Q250 160 500 100 T1000 20"
          stroke="#A06AFF"
          strokeWidth="2"
          fill="none"
          className="chart-line"
          filter="drop-shadow(0 0 8px rgba(160, 106, 255, 0.24))"
        />
        {/* Yellow line (MOex) */}
        <path
          d="M0 160 Q250 140 500 120 T1000 80"
          stroke="#FFA800"
          strokeWidth="2"
          fill="none"
          className="chart-line"
          filter="drop-shadow(0 0 8px rgba(255, 168, 0, 0.24))"
        />
        {/* Gradient fill under purple line */}
        <defs>
          <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#A06AFF', stopOpacity: 0.32 }} />
            <stop offset="100%" style={{ stopColor: '#181A20', stopOpacity: 0 }} />
          </linearGradient>
        </defs>
        <path 
          d="M0 180 Q250 160 500 100 T1000 20 L1000 200 L0 200 Z" 
          fill="url(#purpleGradient)"
        />
      </svg>
    </div>

    {/* X-axis labels */}
    <div className="absolute bottom-0 left-6 right-6 flex justify-between">
      {['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', '2025'].map((month) => (
        <span key={month} className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
          {month}
        </span>
      ))}
    </div>
  </div>
);

const PercentageChart: React.FC = () => (
  <div className="flex justify-between items-end w-full h-56 px-6">
    {/* Y-axis labels */}
    <div className="flex flex-col justify-between h-full text-right pr-2">
      <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">40%</span>
      <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">20%</span>
      <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">0%</span>
      <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">-20%</span>
      <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">-40%</span>
    </div>
    
    {/* Chart area with bars */}
    <div className="flex-1 h-full flex justify-between items-end px-6">
      {/* Monthly percentage bars */}
      {[
        { label: 'FEB', value: 12, isPositive: true },
        { label: 'MAR', value: 8, isPositive: true },
        { label: 'APR', value: -6, isPositive: false },
        { label: 'MAY', value: 4, isPositive: true },
        { label: 'JUN', value: 3, isPositive: true },
        { label: 'JUL', value: 2, isPositive: true },
        { label: 'AUG', value: 1, isPositive: true },
        { label: 'SEP', value: 8, isPositive: true },
        { label: 'OCT', value: 30, isPositive: true },
        { label: 'NOV', value: 7, isPositive: true },
        { label: 'DEC', value: -20, isPositive: false }
      ].map((item, index) => (
        <div key={index} className="flex flex-col items-center gap-1">
          <div className="flex flex-col items-center">
            <span className="text-tyrian-purple-primary text-xs font-bold font-nunito mb-1">
              {item.value > 0 ? `+${item.value}` : item.value}%
            </span>
            <div
              className={`w-12 rounded animate-pulse-subtle ${
                item.isPositive
                  ? 'bg-gradient-to-t from-tyrian-black to-tyrian-purple-primary rounded-t'
                  : 'bg-gradient-to-b from-tyrian-black to-tyrian-yellow rounded-b'
              }`}
              style={{
                height: `${Math.abs(item.value) * 2}px`,
                ...(item.isPositive ? {} : { transform: 'scaleY(-1)' })
              }}
            ></div>
          </div>
          <span className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const HorizontalBarChart: React.FC = () => (
  <div className="flex items-center w-full h-64">
    {/* Y-axis labels */}
    <div className="flex flex-col justify-between h-full text-right pr-4 py-4">
      {['$120K', '$120K', '$120K', '$90K', '$60K', '$30K', '$0'].map((label, index) => (
        <span key={index} className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
          {label}
        </span>
      ))}
    </div>
    
    {/* Chart area */}
    <div className="flex-1 h-full flex flex-col justify-between py-4">
      {[
        { label: 'APPL', value: 90, percentage: '+110%' },
        { label: 'VOO', value: 75, percentage: '+88%' },
        { label: 'SIBN', value: 70, percentage: '+81%' },
        { label: 'SCHD', value: 55, percentage: '+62%' },
        { label: 'TMOS', value: 50, percentage: '+59%' },
        { label: 'CHMF', value: 32, percentage: '+35%' },
        { label: 'SBER', value: 32, percentage: '+35%' },
        { label: 'OFZ-PD 26129', value: 12, percentage: '+10%' },
        { label: 'ETH-USD', value: 6, percentage: '+2.2%' }
      ].map((item, index) => (
        <div key={index} className="flex items-center gap-2 w-full">
          <div className="w-20 text-tyrian-gray-medium text-xs font-bold font-nunito uppercase text-right">
            {item.label}
          </div>
          <div className="flex-1 flex items-center">
            <div
              className="h-2 rounded bg-gradient-to-r from-tyrian-black to-tyrian-purple-primary animate-pulse-subtle"
              style={{ width: `${item.value}%` }}
            ></div>
            <span className="ml-2 text-tyrian-purple-primary text-xs font-bold font-nunito uppercase">
              {item.percentage}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const GrowthView: React.FC = () => {
  const [timeFilter1, setTimeFilter1] = useState('1y');
  const [timeFilter2, setTimeFilter2] = useState('1y');
  const [timeFilter3, setTimeFilter3] = useState('1y');
  const [timeFilter4, setTimeFilter4] = useState('all');

  return (
    <div className="w-full space-y-6">
      {/* Benchmark Header Card */}
      <div className="flex w-full p-6 flex-col justify-between items-start rounded-xl border border-tyrian-gray-darker bg-tyrian-black/50 backdrop-blur-[50px]">
        <div className="flex items-baseline gap-4">
          <div className="flex items-center gap-1">
            <span className="text-white text-2xl font-bold font-nunito">Benchmarks:</span>
            <div className="flex items-center px-1 py-0.5 gap-1 rounded bg-tyrian-purple-background">
              <span className="text-white text-xs font-bold font-nunito uppercase">IMOEX</span>
              <svg className="w-4 h-4 text-tyrian-gray-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <button className="text-tyrian-purple-primary text-[15px] font-bold font-nunito underline">
            Select
          </button>
        </div>
      </div>

      {/* First Chart - Portfolio Value with Outperformance */}
      <PortfolioChart
        title="Portfolio Value"
        subtitle="Portfolio Outperformance vs IMOEX"
        timeFilter={timeFilter1}
        onTimeFilterChange={setTimeFilter1}
      >
        <LineChart />
      </PortfolioChart>

      {/* Second Chart - Portfolio Value with Benchmarks */}
      <PortfolioChart
        title="Portfolio Value"
        timeFilter={timeFilter2}
        onTimeFilterChange={setTimeFilter2}
        showBenchmark={true}
        showPercentage={true}
      >
        <LineChart />
      </PortfolioChart>

      {/* Third Chart - Portfolio Value Percentage */}
      <PortfolioChart
        title="Portfolio Value"
        timeFilter={timeFilter3}
        onTimeFilterChange={setTimeFilter3}
        showBenchmark={true}
      >
        <PercentageChart />
      </PortfolioChart>

      {/* Details Link */}
      <div className="flex items-center gap-1 justify-center w-full">
        <span className="text-tyrian-purple-primary text-[15px] font-bold font-nunito">Details</span>
        <ChevronRight className="w-6 h-6 text-tyrian-purple-primary" />
      </div>

      {/* Fourth Chart - Portfolio Value Horizontal Bars */}
      <PortfolioChart
        title="Portfolio Value"
        timeFilter={timeFilter4}
        onTimeFilterChange={setTimeFilter4}
        showBenchmark={true}
      >
        <HorizontalBarChart />
      </PortfolioChart>

      {/* Final Details Link */}
      <div className="flex items-center gap-1 justify-center w-full">
        <span className="text-tyrian-purple-primary text-[15px] font-bold font-nunito">Details</span>
        <ChevronRight className="w-6 h-6 text-tyrian-purple-primary" />
      </div>
    </div>
  );
};

export default GrowthView;
