"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../app/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../app/ui/chart"

const chartConfig = {
  user: {
    label: "Total Users",
    color: "var(--chart-2)",
  },
  post: {
    label: "Total Posts",
    color: "var(--chart-1)",
  },
}

export function ChartBarInteractive() {
  const [activeChart, setActiveChart] = React.useState("user")
  const [chartData, setChartData] = React.useState([])

  React.useEffect(() => {
    fetch("http://localhost:8000/api/analytics/") // Ganti dengan URL backend kamu
      .then((res) => res.json())
      .then((data) => setChartData(data))
      .catch((err) => console.error("Failed to fetch analytics data", err))
  }, [])

  const total = React.useMemo(
    () => ({
      user: chartData.reduce((acc, curr) => acc + curr.user, 0),
      post: chartData.reduce((acc, curr) => acc + curr.post, 0),
    }),
    [chartData]
  )

  return (
    <Card className="py-0 bg-gradient-to-tl from-blue-500 text-white">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
          <CardTitle>Total Users and Posts</CardTitle>
          <CardDescription>
            Showing total activity in the system
          </CardDescription>
        </div>
        <div className="flex">
          {["user", "post"].map((key) => (
            <button
              key={key}
              data-active={activeChart === key}
              className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
              onClick={() => setActiveChart(key)}
            >
              <span className="text-muted-foreground text-xs">
                {chartConfig[key].label}
              </span>
              <span className="text-lg leading-none font-bold sm:text-3xl">
                {total[key].toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full "
        >
          {chartData.length > 0 ? (
            <BarChart data={chartData} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey={activeChart}
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    }
                  />
                }
              />
              <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
            </BarChart>
          ) : (
            <p className="text-center text-sm text-white">Loading data...</p>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
