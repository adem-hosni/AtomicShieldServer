import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ChartDataPoint {
  time: string;
  players: number;
  bans: number;
}

interface ServerAnalyticsChartProps {
  period: "today" | "week" | "month";
  data?: ChartDataPoint[];
}

// Sample data for different periods
const generateSampleData = (period: string): ChartDataPoint[] => {
  switch (period) {
    case "today":
      return [
        { time: "00:00", players: 234, bans: 2 },
        { time: "02:00", players: 187, bans: 1 },
        { time: "04:00", players: 145, bans: 0 },
        { time: "06:00", players: 189, bans: 3 },
        { time: "08:00", players: 267, bans: 4 },
        { time: "10:00", players: 345, bans: 5 },
        { time: "12:00", players: 456, bans: 8 },
        { time: "14:00", players: 523, bans: 12 },
        { time: "16:00", players: 598, bans: 15 },
        { time: "18:00", players: 674, bans: 18 },
        { time: "20:00", players: 744, bans: 24 },
        { time: "22:00", players: 687, bans: 21 },
      ];
    case "week":
      return [
        { time: "Mon", players: 456, bans: 45 },
        { time: "Tue", players: 523, bans: 52 },
        { time: "Wed", players: 498, bans: 38 },
        { time: "Thu", players: 567, bans: 67 },
        { time: "Fri", players: 634, bans: 78 },
        { time: "Sat", players: 744, bans: 65 },
        { time: "Sun", players: 698, bans: 55 },
      ];
    case "month":
      return [
        { time: "Week 1", players: 456, bans: 234 },
        { time: "Week 2", players: 523, bans: 267 },
        { time: "Week 3", players: 498, bans: 198 },
        { time: "Week 4", players: 567, bans: 289 },
      ];
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
            <span className="font-medium">
              {entry.value.toLocaleString()}
              {entry.dataKey === "players" ? " players" : " bans"}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function ServerAnalyticsChart({
  period,
  data,
}: ServerAnalyticsChartProps) {
  const chartData = data || generateSampleData(period);

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
          syncId="serverAnalytics"
          stackOffset="none"
        >
          <defs>
            <linearGradient id="playersGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="hsl(var(--primary))"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="hsl(var(--primary))"
                stopOpacity={0.1}
              />
            </linearGradient>
            <linearGradient id="bansGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="hsl(var(--destructive))"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="hsl(var(--destructive))"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--border))"
            opacity={0.3}
            horizontal={true}
            vertical={true}
          />
          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            width={60}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "hsl(var(--muted))", opacity: 0.1 }}
            animationDuration={150}
          />
          <Legend
            wrapperStyle={{
              paddingTop: "20px",
            }}
            iconType="circle"
            align="center"
            verticalAlign="bottom"
          />
          <Area
            type="monotone"
            dataKey="players"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fill="url(#playersGradient)"
            name="Players"
            connectNulls={false}
            isAnimationActive={true}
            animationDuration={750}
          />
          <Area
            type="monotone"
            dataKey="bans"
            stroke="hsl(var(--destructive))"
            strokeWidth={2}
            fill="url(#bansGradient)"
            name="Bans"
            connectNulls={false}
            isAnimationActive={true}
            animationDuration={750}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
