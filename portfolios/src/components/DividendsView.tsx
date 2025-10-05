import React from 'react';
import { ChevronDown, Info, TrendingUp } from 'lucide-react';

interface MetricCardProps {
  title: string;
  mainValue: string;
  subtitle?: string;
  additionalInfo?: string;
  badge?: {
    text: string;
    type: 'positive' | 'negative';
  };
}

const MetricCard: React.FC<MetricCardProps> = ({ title, mainValue, subtitle, additionalInfo, badge }) => (
  <div className="flex w-[222px] h-[127px] p-4 flex-col justify-between items-start flex-shrink-0 rounded-xl border border-tyrian-gray-darker bg-tyrian-black/50 backdrop-blur-[50px]">
    <div className="flex w-full flex-col items-start gap-6">
      <div className="flex items-center gap-1.5 self-stretch">
        <div className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
          {title}
        </div>
        <Info className="w-4 h-4 text-tyrian-gray-medium" />
      </div>
      <div className="flex flex-col items-start gap-1 self-stretch">
        <div className="flex justify-between items-baseline self-stretch">
          <div className="text-white text-2xl font-bold font-nunito">
            {mainValue}
          </div>
          {subtitle && (
            <div className="text-tyrian-gray-medium text-[13px] font-semibold font-nunito">
              {subtitle}
            </div>
          )}
        </div>
        {additionalInfo && (
          <div className="self-stretch text-tyrian-gray-medium text-[13px] font-semibold font-nunito">
            {additionalInfo}
          </div>
        )}
      </div>
    </div>
    {badge && (
      <div className="flex px-1 py-0.5 justify-center items-center rounded bg-tyrian-green-background">
        <div className="text-tyrian-green text-xs font-bold font-nunito">
          {badge.text}
        </div>
      </div>
    )}
  </div>
);

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  filters?: Array<{
    label: string;
    hasDropdown: boolean;
  }>;
  legend?: Array<{
    color: string;
    label: string;
  }>;
  metrics?: Array<{
    label: string;
    value: string;
    color?: string;
  }>;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children, filters, legend, metrics }) => (
  <div className="flex h-[423px] p-4 flex-col items-start gap-2.5 rounded-3xl border border-tyrian-gray-darker bg-tyrian-black/50 backdrop-blur-[50px] overflow-hidden">
    <div className="flex flex-col items-end gap-4 flex-1 self-stretch">
      {/* Header */}
      <div className="flex justify-between items-center self-stretch">
        <div className="text-white text-2xl font-bold font-nunito">
          {title}
        </div>
        {filters && (
          <div className="flex items-center gap-4">
            {filters.map((filter, index) => (
              <div key={index} className="flex items-center">
                <div className="text-tyrian-gray-medium text-[15px] font-bold font-nunito">
                  {filter.label}
                </div>
                {filter.hasDropdown && (
                  <ChevronDown className="w-6 h-6 text-white ml-1 rotate-180" />
                )}
              </div>
            ))}
            {title === 'Dividends Received' && (
              <div className="flex h-[26px] px-3 py-2.5 justify-center items-center gap-2 rounded bg-tyrian-gradient">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Legend & Metrics */}
      {(legend || metrics) && (
        <div className="flex items-center gap-6">
          {legend && legend.map((item, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full`} style={{ backgroundColor: item.color }}></div>
              <div className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
                {item.label}
              </div>
            </div>
          ))}
          {metrics && metrics.map((metric, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-1 h-[42px] bg-tyrian-purple-primary"></div>
              <div className="flex flex-col items-start gap-1.5">
                <div className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">
                  {metric.label}
                </div>
                <div className="text-white text-[15px] font-bold font-nunito">
                  {metric.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chart Content */}
      <div className="flex flex-col items-start gap-2 flex-1 self-stretch">
        {children}
      </div>
    </div>
  </div>
);

const BarChart: React.FC<{ data: Array<{ label: string; value: number; maxValue?: number; colorClass: string }>; maxHeight?: number; barWidthClass?: string }> = ({ data, maxHeight = 160, barWidthClass = 'w-[56px] md:w-[64px] xl:w-[71px]' }) => {
  const max = data.reduce((m, d) => Math.max(m, d.maxValue ?? d.value), 0) || 1;
  return (
    <div className="flex justify-between items-end h-48 px-2 md:px-4 w-full">
      {data.map((item) => (
        <div key={item.label} className="flex flex-col items-center gap-1">
          <div
            className={`${barWidthClass} rounded-t ${item.colorClass} animate-pulse-subtle`}
            style={{ height: `${(item.value / max) * maxHeight}px` }}
          ></div>
          <div className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase text-center">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
};

const MonthsBarChart: React.FC<{ months: string[]; values: number[]; colorClass: string; maxHeight?: number; barWidthClass?: string }> = ({ months, values, colorClass, maxHeight = 160, barWidthClass = 'w-5 md:w-6' }) => {
  const max = Math.max(...values, 1);
  return (
    <div className="flex justify-between items-end h-48 px-2 md:px-4 w-full">
      {months.map((m, i) => (
        <div key={m} className="flex flex-col items-center gap-1">
          <div className={`${barWidthClass} rounded-t ${colorClass} animate-pulse-subtle`} style={{ height: `${(values[i] / max) * maxHeight}px` }}></div>
          <div className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">{m}</div>
        </div>
      ))}
    </div>
  );
};

const MonthsGroupedBarChart: React.FC<{ months: string[]; series: Array<{ values: number[]; colorClass: string }>; maxHeight?: number; barWidthClass?: string; gapClass?: string }> = ({ months, series, maxHeight = 160, barWidthClass = 'w-4 md:w-5', gapClass = 'gap-1' }) => {
  const max = Math.max(...series.flatMap((s) => s.values), 1);
  return (
    <div className="flex justify-between items-end h-48 px-2 md:px-6 w-full">
      {months.map((m, i) => (
        <div key={m} className="flex flex-col items-center">
          <div className={`flex items-end ${gapClass}`}>
            {series.map((s, idx) => (
              <div key={idx} className={`${barWidthClass} rounded-t ${s.colorClass} animate-pulse-subtle`} style={{ height: `${(s.values[i] / max) * maxHeight}px` }}></div>
            ))}
          </div>
          <div className="text-tyrian-gray-medium text-xs font-bold font-nunito uppercase">{m}</div>
        </div>
      ))}
    </div>
  );
};

const DividendsView: React.FC = () => {
  // Static, deterministic data to avoid janky re-renders
  const yieldData = [
    { label: 'SIBN', value: 18, colorClass: 'bg-tyrian-purple-primary' },
    { label: 'SBER', value: 14, colorClass: 'bg-tyrian-purple-primary' },
    { label: 'OFZ-PD 26219', value: 9, colorClass: 'bg-tyrian-purple-primary' },
    { label: 'CHMF', value: 8, colorClass: 'bg-tyrian-purple-primary' },
    { label: 'SCHD', value: 4, colorClass: 'bg-tyrian-purple-primary' },
    { label: 'VOO', value: 2, colorClass: 'bg-tyrian-purple-primary' },
    { label: 'AAPL', value: 1, colorClass: 'bg-tyrian-purple-primary' }
  ];

  const growthData = [
    { label: 'SIBN', value: 35, colorClass: 'bg-tyrian-blue' },
    { label: 'CHMF', value: 20, colorClass: 'bg-tyrian-blue' },
    { label: 'SBER', value: 15, colorClass: 'bg-tyrian-blue' },
    { label: 'SCHD', value: 12, colorClass: 'bg-tyrian-blue' },
    { label: 'AAPL', value: 8, colorClass: 'bg-tyrian-blue' },
    { label: 'VOO', value: 5, colorClass: 'bg-tyrian-blue' }
  ];

  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

  const annualizedMonthlyNext12 = [42187, 35500, 52100, 48120, 37050, 41000, 45010, 39200, 44210, 50320, 47110, 53250];
  const annualizedMonthly = [3515, 3230, 3810, 3620, 3310, 3400, 3510, 3440, 3610, 3720, 3550, 3800];

  const dividendsReceived = [2200, 1800, 2600, 2400, 2000, 2300, 2800, 2500, 2700, 3000, 2900, 3200];

  const growthByAsset = [
    { label: 'CHMF', value: 120, colorClass: 'bg-tyrian-blue' },
    { label: 'SCHD', value: 95, colorClass: 'bg-tyrian-blue' },
    { label: 'SIBN', value: 140, colorClass: 'bg-tyrian-blue' },
    { label: 'VOO', value: 85, colorClass: 'bg-tyrian-blue' },
    { label: 'SBER', value: 110, colorClass: 'bg-tyrian-blue' },
    { label: 'AAPL', value: 75, colorClass: 'bg-tyrian-blue' },
    { label: 'OFZ-PD 26219', value: 90, colorClass: 'bg-tyrian-blue' }
  ];

  const dividendGrowth2023 = [1200, 1000, 1500, 1300, 1100, 1250, 1600, 1400, 1700, 1800, 1750, 1900];
  const dividendGrowth2024 = [1400, 1150, 1650, 1500, 1300, 1450, 1800, 1600, 1900, 2000, 1950, 2100];

  return (
    <div className="w-full space-y-6">
      {/* Top Row */}
      <div className="flex items-start gap-6">
        {/* Left Side Cards */}
        <div className="flex flex-col gap-6">
          <MetricCard
            title="yield"
            mainValue="2.85%"
            subtitle="3.27% pre-tax"
            additionalInfo="4.08% on invested capital"
          />
          <MetricCard
            title="dividends"
            mainValue="$42,150.41"
            subtitle="annual"
            additionalInfo="$3,512.53 monthly"
            badge={{ text: '+18.7%', type: 'positive' }}
          />
        </div>

        {/* Yield/Payment Amount Chart */}
        <div className="flex-1">
          <ChartCard
            title="Yield/Payment Amount"
            filters={[
              { label: 'Yield (%)', hasDropdown: true },
              { label: 'By Assets', hasDropdown: true }
            ]}
          >
            <BarChart data={yieldData} />
          </ChartCard>
        </div>
      </div>

      {/* Middle Row */}
      <div className="flex items-center gap-6">
        <div className="flex-1">
          <ChartCard
            title="Annualized Growth"
            filters={[{ label: 'By Assets', hasDropdown: true }]}
          >
            <BarChart data={growthData} />
          </ChartCard>
        </div>

        <div className="flex-1">
          <ChartCard
            title="Annualized Growth"
            metrics={[
              { label: 'NEXT 12 MONTHS', value: '$42,187.43', color: '#A06AFF' },
              { label: 'MONTHLY', value: '$3,515.62', color: '#FFA800' }
            ]}
          >
            <MonthsGroupedBarChart
              months={months}
              series={[
                { values: annualizedMonthlyNext12, colorClass: 'bg-tyrian-purple-primary' },
                { values: annualizedMonthly, colorClass: 'bg-tyrian-yellow' }
              ]}
            />
          </ChartCard>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="flex items-center gap-6">
        <div className="flex-1">
          <ChartCard
            title="Dividends Received"
            filters={[
              { label: 'Yield (%)', hasDropdown: true },
              { label: 'By Assets', hasDropdown: true }
            ]}
            metrics={[
              { label: 'TOTAL', value: '$63,218.61' }
            ]}
          >
            <MonthsBarChart months={months} values={dividendsReceived} colorClass="bg-tyrian-purple-primary" />
          </ChartCard>
        </div>

        <div className="flex-1">
          <ChartCard
            title="Annualized Growth"
            filters={[{ label: 'By Assets', hasDropdown: true }]}
          >
            <BarChart data={growthByAsset} barWidthClass="w-8 md:w-10" />
          </ChartCard>
        </div>
      </div>

      {/* Dividend Growth Chart */}
      <ChartCard
        title="Dividend Growth"
        legend={[
          { color: '#FFA800', label: '2023' },
          { color: '#A06AFF', label: '2024' }
        ]}
      >
        <MonthsGroupedBarChart
          months={months}
          series={[
            { values: dividendGrowth2023, colorClass: 'bg-tyrian-yellow' },
            { values: dividendGrowth2024, colorClass: 'bg-tyrian-purple-primary' }
          ]}
          barWidthClass="w-5 md:w-6"
          gapClass="gap-1.5"
        />
      </ChartCard>
    </div>
  );
};

export default DividendsView;
