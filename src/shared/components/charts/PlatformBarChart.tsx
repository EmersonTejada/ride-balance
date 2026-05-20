import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/shared/components/ui/chart";

interface PlatformBarChartData {
  platform: string;
  amount: number;
  percentage?: number;
}

interface PlatformBarChartProps {
  data: PlatformBarChartData[];
  title: string;
  description?: string;
}

const chartConfig = {
  amount: {
    label: "Monto",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function PlatformBarChart({
  data,
  title,
  description,
}: PlatformBarChartProps) {
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
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{
                top: 8,
                right: 24,
                bottom: 8,
                left: 60,
              }}
            >
              <CartesianGrid horizontal={false} strokeDasharray="3 3" />
              <XAxis type="number" tickLine={false} axisLine={false} />
              <YAxis
                dataKey="platform"
                type="category"
                tickLine={false}
                axisLine={false}
                width={50}
              />
              <ChartTooltip
                cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                content={<ChartTooltipContent hideLabel />}
                formatter={(value: number) => [`$${value}`, "Monto"]}
              />
              <Bar dataKey="amount" fill="var(--color-amount)" radius={[0, 6, 6, 0]}>
                <LabelList
                  dataKey="amount"
                  position="right"
                  className="fill-foreground font-semibold text-xs"
                  formatter={(value: number) => `$${value}`}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}