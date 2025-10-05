'use client';

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Q3 '23", debt: 12, coverage: 6, extra: -2 },
  { name: "Q4 '23", debt: 14, coverage: 8, extra: 0 },
  { name: "Q1 '24", debt: 10, coverage: 7, extra: -1 },
  { name: "Q2 '24", debt: 11, coverage: 6, extra: 1 },
  { name: "Q3 '24", debt: 16, coverage: 9, extra: 2 },
];

const formatYAxis = (tick: number) => {
  return `${tick.toFixed(2)}B`;
};

const renderLegendText = (value: string) => (
  <span style={{ color: "#FFFFFF7A" }}>{value}</span>
);

const CustomBarChart = () => {
  return (
    <div style={{ width: "520px", margin: "0 auto" }}>
      <ResponsiveContainer width="100%" height={324}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
        >
          <CartesianGrid stroke="#FFFFFF0A" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: "#FFFFFF7A", fontSize: 12 }} 
            axisLine={{ stroke: "#FFFFFF0A" }} 
            tickLine={{ stroke: "#FFFFFF0A" }} 
          />
          <YAxis
            tick={{ fill: "#FFFFFF7A", fontSize: 12 }} 
            tickFormatter={formatYAxis} 
            axisLine={false} 
            tickLine={false}
            tickMargin={15}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              color: "#000",
              border: "1px solid #ccc",
            }}
            cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12 }} 
            iconType="circle" 
            formatter={renderLegendText} 
          />
          <Bar
            dataKey="debt"
            fill="#FFA800"
            name="Debt Level"
            radius={[10, 10, 0, 0]}  
            barSize={24}  
          />
          <Bar
            dataKey="coverage"
            fill="#A06AFF"
            name="Coverage Level"
            radius={[10, 10, 0, 0]}  
            barSize={24}  
          />
          <Bar
            dataKey="extra"
            fill="#6AA5FF"
            name="Extra"
            radius={[10, 10, 0, 0]}  
            barSize={24}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
