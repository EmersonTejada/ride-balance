import { Cell, Pie, PieChart, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from "@/shared/components/ui/chart";

interface DonutChartData {
  category: string;
  percentage: number;
  amount?: number;
}

interface DonutChartProps {
  data: DonutChartData[];
  title: string;
  description?: string;
}

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const chartConfig = {
  percentage: {
    label: "Porcentaje",
  },
} satisfies ChartConfig;

export function DonutChart({ data, title, description }: DonutChartProps) {
  if (!data?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className="flex h-[300px] items-center justify-center text-muted-foreground text-sm">
          Sin datos
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((item, index) => ({
    ...item,
    fill: CHART_COLORS[index % CHART_COLORS.length],
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <PieChart>
            <Pie
              data={chartData}
              dataKey="percentage"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={110}
              paddingAngle={2}
              stroke="transparent"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              content={<ChartTooltipContent hideLabel />}
              formatter={(value: number, name: string) => [
                `${value}%`,
                name,
              ]}
            />
          </PieChart>
        </ChartContainer>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-sm"
                style={{ backgroundColor: item.fill }}
              />
              <span className="text-sm text-muted-foreground">
                {item.category} ({item.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}