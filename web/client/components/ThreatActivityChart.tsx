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
  Bar,
  ComposedChart,
} from "recharts";

export interface ThreatActivityDataPoint {
  time: string;
  threatDetections: number;
  falsePositives: number;
  blockedAttempts: number;
  severity: "low" | "medium" | "high" | "critical";
}

interface ThreatActivityChartProps {
  period: "today" | "week" | "month";
  data?: ThreatActivityDataPoint[];
}

// Sample data generator for different periods
const generateSampleData = (period: string): ThreatActivityDataPoint[] => {
  const now = new Date();
  const currentHour = now.getHours();

  switch (period) {
    case "today":
      return Array.from({ length: 24 }, (_, i) => {
        const hour = i;
        const isPeakHour = hour >= 14 && hour <= 22;
        const isCurrentOrPast = hour <= currentHour;

        if (!isCurrentOrPast) {
          return {
            time: `${hour.toString().padStart(2, "0")}:00`,
            threatDetections: 0,
            falsePositives: 0,
            blockedAttempts: 0,
            severity: "low" as const,
          };
        }

        const baseDetections = isPeakHour ? 15 : 8;
        const detections = baseDetections + Math.floor(Math.random() * 10);
        const blocked = detections + Math.floor(Math.random() * 5);
        const falsePos = Math.floor(Math.random() * 2);

        return {
          time: `${hour.toString().padStart(2, "0")}:00`,
          threatDetections: detections,
          falsePositives: falsePos,
          blockedAttempts: blocked,
          severity:
            detections > 20
              ? "critical"
              : detections > 15
                ? "high"
                : detections > 10
                  ? "medium"
                  : "low",
        };
      });

    case "week":
      const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      return weekDays.map((day, index) => {
        const isWeekend = index >= 5;
        const baseDetections = isWeekend ? 120 : 95;
        const detections = baseDetections + Math.floor(Math.random() * 40);
        const blocked = detections + Math.floor(Math.random() * 20);
        const falsePos = Math.floor(Math.random() * 8);

        return {
          time: day,
          threatDetections: detections,
          falsePositives: falsePos,
          blockedAttempts: blocked,
          severity:
            detections > 140
              ? "critical"
              : detections > 120
                ? "high"
                : detections > 100
                  ? "medium"
                  : "low",
        };
      });

    case "month":
      return Array.from({ length: 4 }, (_, i) => {
        const weekNum = i + 1;
        const baseDetections = 650 + Math.floor(Math.random() * 200);
        const blocked = baseDetections + Math.floor(Math.random() * 100);
        const falsePos = Math.floor(Math.random() * 25);

        return {
          time: `Week ${weekNum}`,
          threatDetections: baseDetections,
          falsePositives: falsePos,
          blockedAttempts: blocked,
          severity:
            baseDetections > 750
              ? "critical"
              : baseDetections > 700
                ? "high"
                : baseDetections > 650
                  ? "medium"
                  : "low",
        };
      });

    default:
      return [];
  }
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload;

    return (
      <div className="bg-card border border-border rounded-lg shadow-lg p-4">
        <p className="text-sm font-medium mb-3">{label}</p>
        <div className="space-y-2">
          {payload.map((entry: any, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4 text-sm"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="capitalize">
                  {entry.dataKey === "threatDetections"
                    ? "Threat Detections"
                    : entry.dataKey === "falsePositives"
                      ? "False Positives"
                      : entry.dataKey === "blockedAttempts"
                        ? "Blocked Attempts"
                        : entry.dataKey}
                </span>
              </div>
              <span className="font-medium">
                {entry.value.toLocaleString()}
              </span>
            </div>
          ))}
          {data && (
            <div className="mt-3 pt-2 border-t border-border">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    data.severity === "critical"
                      ? "bg-red-500"
                      : data.severity === "high"
                        ? "bg-orange-500"
                        : data.severity === "medium"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                  }`}
                />
                <span className="text-xs text-muted-foreground capitalize">
                  {data.severity} severity level
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export function ThreatActivityChart({
  period,
  data,
}: ThreatActivityChartProps) {
  const chartData = data || generateSampleData(period);

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
          syncId="threatActivity"
        >
          <defs>
            <linearGradient
              id="threatDetectionsGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="hsl(var(--destructive))"
                stopOpacity={0.4}
              />
              <stop
                offset="95%"
                stopColor="hsl(var(--destructive))"
                stopOpacity={0.1}
              />
            </linearGradient>
            <linearGradient
              id="blockedAttemptsGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="hsl(var(--primary))"
                stopOpacity={0.4}
              />
              <stop
                offset="95%"
                stopColor="hsl(var(--primary))"
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
            dataKey="blockedAttempts"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fill="url(#blockedAttemptsGradient)"
            name="Blocked Attempts"
            connectNulls={false}
            isAnimationActive={true}
            animationDuration={750}
          />
          <Area
            type="monotone"
            dataKey="threatDetections"
            stroke="hsl(var(--destructive))"
            strokeWidth={2}
            fill="url(#threatDetectionsGradient)"
            name="Threat Detections"
            connectNulls={false}
            isAnimationActive={true}
            animationDuration={750}
          />
          <Bar
            dataKey="falsePositives"
            fill="#f59e0b"
            name="False Positives"
            opacity={0.7}
            maxBarSize={20}
            radius={[2, 2, 0, 0]}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
