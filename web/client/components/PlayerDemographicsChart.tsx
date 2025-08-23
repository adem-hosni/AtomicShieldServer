import React from "react";
import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Cell,
} from "recharts";

interface DemographicsDataPoint {
  region: string;
  players: number;
  percentage: number;
}

interface PlayerDemographicsChartProps {
  period: "current" | "weekly" | "monthly";
}

// Generate sample demographics data
const generateDemographicsData = (period: string): DemographicsDataPoint[] => {
  const baseData = [
    { region: "North America", players: 1456, percentage: 42 },
    { region: "Europe", players: 1123, percentage: 32 },
    { region: "Asia Pacific", players: 567, percentage: 16 },
    { region: "South America", players: 234, percentage: 7 },
    { region: "Other", players: 105, percentage: 3 },
  ];

  switch (period) {
    case "current":
      return baseData;
    case "weekly":
      return baseData.map((item) => ({
        ...item,
        players: Math.floor(item.players * 1.2),
        percentage: Math.floor(item.percentage * 0.95),
      }));
    case "monthly":
      return baseData.map((item) => ({
        ...item,
        players: Math.floor(item.players * 1.5),
        percentage: Math.floor(item.percentage * 1.1),
      }));
    default:
      return baseData;
  }
};

const COLORS = [
  "hsl(var(--primary))",
  "hsl(198 93% 60%)",
  "hsl(142 76% 36%)",
  "hsl(25 95% 53%)",
  "hsl(var(--muted-foreground))",
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium mb-2">{data.region}</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: payload[0].color }}
            />
            <span>Players: {data.players.toLocaleString()}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {data.percentage}% of total
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const CustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percentage,
}: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percentage < 5) return null; // Don't show labels for very small slices

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={12}
      fontWeight="500"
    >
      {`${percentage}%`}
    </text>
  );
};

export function PlayerDemographicsChart({
  period,
}: PlayerDemographicsChartProps) {
  const data = generateDemographicsData(period);

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={CustomLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="players"
            animationDuration={750}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{
              paddingTop: "20px",
            }}
            iconType="circle"
            align="center"
            verticalAlign="bottom"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
