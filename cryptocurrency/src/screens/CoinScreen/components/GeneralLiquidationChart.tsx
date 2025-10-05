import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

const GeneralLiquidationChart = () => {
  const data = [
    { date: '23 JAN', long: 600, short: -300, btcPrice: 90000 },
    { date: '24 JAN', long: 450, short: -200, btcPrice: 92000 },
    { date: '25 JAN', long: 300, short: -250, btcPrice: 91000 },
    { date: '26 JAN', long: 350, short: -200, btcPrice: 93000 },
    { date: '27 JAN', long: 250, short: -150, btcPrice: 92500 },
    { date: '28 JAN', long: 400, short: -300, btcPrice: 94000 },
    { date: '29 JAN', long: 350, short: -250, btcPrice: 95000 },
    { date: '30 JAN', long: 300, short: -200, btcPrice: 94000 },
    { date: '31 JAN', long: 450, short: -350, btcPrice: 96000 },
    { date: '1 FEB', long: 500, short: -400, btcPrice: 95000 },
    { date: '2 FEB', long: 350, short: -300, btcPrice: 97000 },
    { date: '3 FEB', long: 400, short: -350, btcPrice: 98000 },
    { date: '4 FEB', long: 300, short: -250, btcPrice: 99000 },
    { date: '5 FEB', long: 350, short: -300, btcPrice: 100000 },
    { date: '6 FEB', long: 400, short: -350, btcPrice: 102000 },
    { date: '7 FEB', long: 450, short: -400, btcPrice: 101000 },
    { date: '8 FEB', long: 500, short: -450, btcPrice: 103000 },
    { date: '9 FEB', long: 550, short: -500, btcPrice: 102000 },
    { date: '10 FEB', long: 450, short: -400, btcPrice: 104000 },
    { date: '11 FEB', long: 400, short: -350, btcPrice: 123000 },
    { date: '12 FEB', long: 350, short: -300, btcPrice: 105000 },
    { date: '13 FEB', long: 300, short: -250, btcPrice: 93000 },
    { date: '14 FEB', long: 250, short: -200, btcPrice: 106000 },
    { date: '15 FEB', long: 200, short: -150, btcPrice: 105000 },
    { date: '16 FEB', long: 150, short: -100, btcPrice: 117000 },
    { date: '17 FEB', long: 200, short: -150, btcPrice: 106000 },
    { date: '18 FEB', long: 250, short: -200, btcPrice: 108000 },
    { date: '19 FEB', long: 300, short: -250, btcPrice: 137000 },
    { date: '20 FEB', long: 350, short: -300, btcPrice: 109000 },
    { date: '21 FEB', long: 400, short: -350, btcPrice: 108000 },
    { date: '22 FEB', long: 450, short: -400, btcPrice: 107000 },
    { date: '23 FEB', long: 500, short: -450, btcPrice: 106000 },
    { date: '24 FEB', long: 550, short: -500, btcPrice: 105000 },
    { date: '25 FEB', long: 600, short: -550, btcPrice: 104000 },
    { date: '26 FEB', long: 650, short: -600, btcPrice: 103000 },
    { date: '27 FEB', long: 700, short: -650, btcPrice: 102000 },
    { date: '28 FEB', long: 750, short: -700, btcPrice: 101000 },
  ];

  return (
    <ResponsiveContainer width='100%' height={237}>
      <ComposedChart
        data={data}
        stackOffset='sign'
        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        barGap={-25}
      >
        <defs>
          <linearGradient id='purpleGradient' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0%' stopColor='rgba(160, 106, 255, 1)' />
            <stop offset='100%' stopColor='rgba(160, 106, 255, 0)' />
          </linearGradient>
          <linearGradient id='blueGradient' x1='0' y1='1' x2='0' y2='0'>
            <stop offset='0%' stopColor='rgba(106, 165, 255, 1)' />
            <stop offset='100%' stopColor='rgba(106, 165, 255, 0)' />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke='#2A2A2A' />
        <XAxis
          dataKey='date'
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#87888b', fontSize: 12, fontWeight: 600 }}
          dy={12}
        />
        <YAxis
          orientation='left'
          tickFormatter={(value) => `${Math.abs(value)}₽`}
          tick={{ fill: '#87888b', fontSize: 12, fontWeight: 600 }}
          axisLine={false}
          tickLine={false}
          ticks={[-400, -200, 0, 200, 400]}
          domain={[-400, 400]}
          dx={-22}
        />
        <YAxis
          yAxisId='right'
          orientation='right'
          dataKey='btcPrice'
          domain={[0, 'auto']}
          tickFormatter={(value) => `${value}₽`}
          tick={{ fill: '#87888b', fontSize: 12, fontWeight: 600 }}
          axisLine={false}
          tickLine={false}
          dx={12}
        />
        <ReferenceLine y={0} stroke='#2A2A2A' />
        <Bar dataKey='long' fill='url(#purpleGradient)' stackId='stack' radius={[4, 4, 0, 0]} />
        <Bar dataKey='short' fill='url(#blueGradient)' stackId='stack' radius={[4, 4, 0, 0]} />
        <Line
          yAxisId='right'
          type='monotone'
          dataKey='btcPrice'
          stroke='#F59E0B'
          strokeWidth={2}
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default GeneralLiquidationChart;
