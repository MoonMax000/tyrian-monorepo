import { Line, LineChart, YAxis } from 'recharts';

interface SmallChartProps {
    data: number[];
    width?: number;
    height?: number;
    color?: string;
}

const SmallChart = ({
    data = [],
    width = 126,
    height = 52,
    color = '#2EBD85'
}: SmallChartProps) => {
    const chartData = data.map((value, index) => ({
        value,
        index
    }));

    return (
        <LineChart
            width={width}
            height={height}
            data={chartData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
            <YAxis
                domain={['dataMin', 'dataMax']}
                hide={true}
            />
            <defs>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={1.5}
                dot={false}
                isAnimationActive={false}
                filter="url(#glow)"
            />
        </LineChart>
    );
};

export default SmallChart;