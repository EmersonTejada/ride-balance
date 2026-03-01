import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Rectangle,
  XAxis,
} from "recharts";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
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
import type { ChartDataPoint } from "../types/weekly-summary";

const chartConfig = {
  amount: {
    label: "Ganancias",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function ChartBarLabel({ chartData }: { chartData: ChartDataPoint[] }) {
  if (!chartData?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ganancias por día</CardTitle>
          <CardDescription>
            No hay datos disponibles para este período
          </CardDescription>
        </CardHeader>
        <CardContent className="flex h-[300px] items-center justify-center text-muted-foreground text-sm">
          Sin datos
        </CardContent>
      </Card>
    );
  }

  const startDate = parseISO(chartData[0].date);
  const endDate = parseISO(chartData[chartData.length - 1].date);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ganancias por día</CardTitle>
        <CardDescription className="capitalize">
          {format(startDate, "dd MMMM yyyy", { locale: es })} -{" "}
          {format(endDate, "dd MMMM yyyy", { locale: es })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[150px] sm:h-[300px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 24,
            }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              strokeOpacity={0.4}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={12}
              axisLine={false}
              tickFormatter={(value) =>
                format(parseISO(value), "eee", { locale: es })
                  .slice(0, 3)
                  .toUpperCase()
              }
            />
            <ChartTooltip
              cursor={{ fill: "var(--muted)", opacity: 0.4 }}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="amount"
              fill="var(--color-amount)"
              radius={[6, 6, 0, 0]}
              activeBar={<Rectangle fillOpacity={0.8} />}
              maxBarSize={60}
            >
              <LabelList
                dataKey="amount"
                position="top"
                offset={10}
                className="fill-foreground font-semibold text-[10px] md:text-sm"
                formatter={(value: number) => `${value}$`}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
