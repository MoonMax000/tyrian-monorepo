import { Line, LineChart, XAxis, YAxis, ReferenceLine, ResponsiveContainer } from 'recharts';

interface LeadersChartProps {
    data: {
        timestamp: string;
        line1: number;
        line2: number;
        line3: number;
    }[];
    width?: number;
    height?: number;
}

const LeadersChart = ({
    data = [],
    width = 600,
    height = 400
}: LeadersChartProps) => {
    return (
        <div style={{ width, height }} className="relative">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{ top: 0, right: -20, left: 0, bottom: 0 }}
                >
                    <ReferenceLine y={180} stroke="#ffffff10" strokeWidth={1} />
                    <ReferenceLine y={60} stroke="#ffffff10" strokeWidth={1} />
                    <ReferenceLine y={-60} stroke="#ffffff10" strokeWidth={1} />

                    <XAxis
                        dataKey="timestamp"
                        stroke="#ffffff40"
                        fontSize={12}
                        axisLine={false}
                        tickLine={false}
                        dy={10}
                    />
                    <YAxis
                        stroke="#ffffff40"
                        fontSize={12}
                        tickFormatter={(value) => `${value}%`}
                        domain={[-60, 180]}
                        axisLine={false}
                        tickLine={false}
                        orientation="right"
                        ticks={[-60, 60, 180]}
                    />
                    <Line
                        type="monotone"
                        dataKey="line1"
                        stroke="#3C89FF"
                        strokeWidth={2}
                        dot={false}
                        style={{ filter: 'drop-shadow(0px 0px 6px #3C89FF)' }}
                        isAnimationActive={true}
                        animationDuration={600}
                    />
                    <Line
                        type="monotone"
                        dataKey="line2"
                        stroke="#A45EFF"
                        strokeWidth={2}
                        dot={false}
                        style={{ filter: 'drop-shadow(0px 0px 6px #A45EFF)' }}
                        isAnimationActive={true}
                        animationDuration={800}
                    />
                    <Line
                        type="monotone"
                        dataKey="line3"
                        stroke="#2EBD85"
                        strokeWidth={2}
                        dot={false}
                        style={{ filter: 'drop-shadow(0px 0px 6px #2EBD85)' }}
                        isAnimationActive={true}
                        animationDuration={1000}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default LeadersChart;