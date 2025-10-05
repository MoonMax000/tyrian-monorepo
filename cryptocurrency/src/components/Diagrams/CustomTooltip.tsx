import { formatShortCurrency } from '@/utils/helpers/formatShortCurrency';
import { FC } from 'react';
import { CHART_COLORS } from './chartColors';

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  labelMapping?: Record<string, string>;
  colors?: string[];
  noFormatKeys?: string[];
}

const CustomTooltip: FC<TooltipProps> = ({
  active,
  payload,
  labelMapping = {},
  colors = [],
  noFormatKeys = [],
}) => {
  if (!active || !payload || payload.length === 0) return null;
  const { date, time } = payload[0].payload;
  const dateObj = new Date(date);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString('en-US', { month: 'long' });
  const year = `'${dateObj.getFullYear().toString().slice(-2)}`;
  const formattedDate = `${day} ${month} ${year}`;

  return (
    <div
      style={{
        backgroundColor: 'rgba(35, 37, 45, 1)',
        padding: '12px',
        borderRadius: '8px',
        color: '#fff',
        fontSize: '12px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
        <p>{formattedDate}</p>
        <p style={{ opacity: 0.5 }}>{time}</p>
      </div>
      {payload.map((entry, index) => {
        const color = colors[index] || CHART_COLORS.lineChartGray;
        const label = labelMapping[entry.name] || entry.name;
        const shouldFormat = typeof entry.value === 'number' && !noFormatKeys.includes(entry.name);
        const formattedValue = shouldFormat ? formatShortCurrency(entry.value) : entry.value;
        return (
          <div className='flex items-center gap-1.5 mt-2' key={index}>
            <div className='size-2 rounded-full' style={{ backgroundColor: color }} />
            <p>
              <span style={{ opacity: 0.5 }}>{label}:</span> {formattedValue}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default CustomTooltip;
