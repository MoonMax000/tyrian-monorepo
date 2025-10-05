import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';

interface DataPoint {
  category: string;
  value: number;
}

const LiquidationBtcRadarChart = () => {
  const data: DataPoint[] = [
    { category: 'Скорость', value: 85 },
    { category: 'Защита', value: 65 },
    { category: 'Мощность', value: 90 },
    { category: 'Точность', value: 75 },
    { category: 'Контроль', value: 80 },
  ];

  return (
    <div className='w-[306px] h-[286px]'>
      <ResponsiveContainer width='100%' height='100%'>
        <RadarChart cx='50%' cy='50%' outerRadius='80%' data={data}>
          {/* Фоновые круги */}
          <circle
            r={100}
            cx='50%'
            cy='50%'
            fill='transparent'
            stroke='#2A2A2A'
            strokeWidth={20}
          />{' '}
          {/* Большой круг */}
          <circle
            r={65}
            cx='50%'
            cy='50%'
            fill='transparent'
            stroke='#2A2A2A'
            strokeWidth={20}
          />{' '}
          {/* Средний круг */}
          <circle r={37} cx='50%' cy='50%' fill='#242424' /> {/* Внутренний заполненный круг */}
          <Radar
            name='Показатели'
            dataKey='value'
            stroke='#8B5CF6'
            fill='#8B5CF6'
            fillOpacity={0.5}
          />
          {/* Точки на расстоянии 8px от графика */}
          {data.map((entry, index) => {
            const angle = -Math.PI / 2 + (index * 2 * Math.PI) / data.length;
            const radius = 40;
            const offset = 8;
            const offsetPercent = (offset / Math.min(306, 286)) * 100;
            const totalRadius = radius + offsetPercent;

            return (
              <circle
                key={`point-${index}`}
                cx={`${50 + totalRadius * Math.cos(angle)}%`}
                cy={`${50 + totalRadius * Math.sin(angle)}%`}
                r={6}
                fill={['#A06AFF', '#FFB46A', '#6AA6FF', '#6AFF9C', '#FF6A79'][index]}
              />
            );
          })}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LiquidationBtcRadarChart;
