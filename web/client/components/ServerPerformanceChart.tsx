import React from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

interface PerformanceDataPoint {
  server: string;
  cpu: number;
  memory: number;
  uptime: number;
}

interface ServerPerformanceChartProps {
  period: "current" | "average" | "peak";
}

// Generate sample performance data
const generatePerformanceData = (period: string): PerformanceDataPoint[] => {
  const servers = ["FiveM-01", "FiveM-02", "FiveM-03", "FiveM-04", "FiveM-05"];

  switch (period) {
    case "current":
      return servers.map((server, index) => ({
        server,
        cpu: Math.floor(Math.random() * 80) + 10,
        memory: Math.floor(Math.random() * 70) + 15,
        uptime: Math.floor(Math.random() * 30) + 85,
      }));
    case "average":
      return servers.map((server, index) => ({
        server,
        cpu: Math.floor(Math.random() * 60) + 20,
        memory: Math.floor(Math.random() * 50) + 25,
        uptime: Math.floor(Math.random() * 15) + 90,
      }));
    case "peak":
      return servers.map((server, index) => ({
        server,
        cpu: Math.floor(Math.random() * 40) + 60,
        memory: Math.floor(Math.random() * 40) + 50,
        uptime: Math.floor(Math.random() * 20) + 80,
      }));
    default:
      return [];
  }
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="capitalize">{entry.dataKey}:</span>
            <span className="font-medium">{entry.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function ServerPerformanceChart({
  period,
}: ServerPerformanceChartProps) {
  const data = generatePerformanceData(period);

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--border))"
            opacity={0.3}
          />
          <XAxis
            dataKey="server"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            width={60}
            domain={[0, 100]}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "hsl(var(--muted))", opacity: 0.1 }}
          />
          <Legend
            wrapperStyle={{
              paddingTop: "20px",
            }}
            iconType="rect"
            align="center"
            verticalAlign="bottom"
          />
          <Bar
            dataKey="cpu"
            fill="hsl(var(--destructive))"
            name="CPU Usage"
            radius={[2, 2, 0, 0]}
            animationDuration={750}
          />
          <Bar
            dataKey="memory"
            fill="hsl(var(--primary))"
            name="Memory Usage"
            radius={[2, 2, 0, 0]}
            animationDuration={750}
          />
          <Bar
            dataKey="uptime"
            fill="hsl(142 76% 36%)"
            name="Uptime"
            radius={[2, 2, 0, 0]}
            animationDuration={750}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
