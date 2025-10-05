import React, { FC, useMemo } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatMoney } from '@/helpers/formatMoney';

interface ServerDataItem {
  value: number;
  datetime: string;
}

export interface ServerData {
  [key: string]: ServerDataItem[];
}

interface TransformedDataItem {
  datetime: string;
  [key: string]: number | string;
}

export interface LineConfig {
  isDashed?: boolean;
  dashPattern?: string;
  color?: string;
  strokeWidth?: number;
  showDots?: boolean;
  dotRadius?: number;
  dotColor?: string;
  dotBorderWidth?: number;
  showActiveDot?: boolean;
  activeDotRadius?: number;
  activeDotColor?: string;
  name?: string;
}

interface LineDiagramProps {
  serverData: ServerData;
  className?: string;
  width?: string | number;
  height?: string | number;
  lineConfigs?: { [key: string]: LineConfig };
  yTickFormatter?: (value: number) => string;
  yCustom?: boolean;
}
const LineDiagram: FC<LineDiagramProps> = ({
  serverData,
  className,
  width = '100%',
  height = 400,
  lineConfigs = {},
  yCustom = false,
  yTickFormatter = (value) => formatMoney(value, '', 2),
}) => {
  const getRandomColor = (): string => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  };

  const transformData = (data: ServerData): TransformedDataItem[] => {
    const dataMap = new Map<string, TransformedDataItem>();

    Object.keys(data).forEach((lineName) => {
      data[lineName].forEach((item) => {
        const datetime = item.datetime;

        if (!dataMap.has(datetime)) {
          dataMap.set(datetime, { datetime: datetime });
        }

        const existingEntry = dataMap.get(datetime)!;
        existingEntry[lineName] = item.value;
      });
    });

    return Array.from(dataMap.values()).sort(
      (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime(),
    );
  };

  const data = useMemo(() => transformData(serverData), [serverData]);

  const lineNames = useMemo(
    () => Object.keys(data[0] || {}).filter((key) => key !== 'datetime'),
    [data],
  );

  const lineStyles = useMemo(() => {
    const defaultConfig: LineConfig = {
      isDashed: false,
      dashPattern: '5 5',
      strokeWidth: 2,
    };

    return Object.keys(serverData).reduce(
      (acc, lineName) => {
        const config = {
          ...defaultConfig,
          color: getRandomColor(),
          ...lineConfigs[lineName],
        };
        acc[lineName] = config;
        return acc;
      },
      {} as { [key: string]: LineConfig },
    );
  }, [serverData, lineConfigs]);

  const yValues = useMemo(() => {
    const values: number[] = [];
    data.forEach((item) => {
      lineNames.forEach((lineName) => {
        const value = item[lineName];
        if (typeof value === 'number') {
          values.push(value);
        }
      });
    });
    return values;
  }, [data, lineNames]);

  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);

  return (
    <ResponsiveContainer width={width} height={height} className={className}>
      <LineChart data={data}>
        <CartesianGrid stroke='#2E2744' strokeWidth={2} vertical={false} />
        <XAxis
          axisLine={false}
          tickLine={{ stroke: '#2E2744', strokeWidth: 2 }}
          dataKey='datetime'
          tickFormatter={(timestamp) => {
            const date = new Date(timestamp);
            return `${date.getFullYear()}`;
          }}
          tick={{ fontSize: '12px', fontWeight: 700, fill: '#B0B0B0' }}
          dy={8}
          padding={{ left: 50, right: 40 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: '12px', fontWeight: 700, fill: '#B0B0B0', width: 100 }}
          tickFormatter={yTickFormatter}
          domain={yCustom ? [minY, maxY] : undefined}
        />

        <Tooltip
          labelFormatter={(label) => {
            const d = new Date(label);
            return !isNaN(d.getTime()) ? d.getFullYear().toString() : label;
          }}
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              const d = new Date(label);
              const year = !isNaN(d.getTime()) ? d.getFullYear() : label;
              const currentCompany = payload.find((p) => p.dataKey === 'current_company')?.value;
              const currentIndustry = payload.find((p) => p.dataKey === 'current_industry')?.value;

              return (
                <div
                  style={{
                    background: '#1f1f1f',
                    borderRadius: 10,
                    padding: '8px 12px',
                    color: '#fff',
                  }}
                >
                  <div style={{ color: '#B0B0B0' }}>{year}</div>
                  {payload.map((entry, index) => (
                    <div key={`item-${index}`} style={{ color: entry.color }}>
                      {entry.name}:{' '}
                      {typeof entry.value === 'number'
                        ? formatMoney(entry.value, '$', 2)
                        : entry.value}
                    </div>
                  ))}

                  {currentCompany && <div>Current company: {currentCompany}</div>}
                  {currentIndustry && <div>Current industry: {currentIndustry}</div>}
                </div>
              );
            }
            return null;
          }}
          cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
        />

        {lineNames.map((lineName) => {
          const lineStyle = lineStyles[lineName];
          return (
            <Line
              key={lineName}
              type='monotone'
              dataKey={lineName}
              stroke={lineStyle.color}
              strokeWidth={lineStyle.strokeWidth}
              strokeDasharray={lineStyle.isDashed ? lineStyle.dashPattern : 'none'}
              activeDot={{ r: 8 }}
              dot={{
                stroke: lineStyle.color,
                strokeWidth: 2,
                fill: lineStyle.color,
                r: 4,
              }}
            />
          );
        })}
        <ReferenceLine y={0} stroke='#2E2744' strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineDiagram;
