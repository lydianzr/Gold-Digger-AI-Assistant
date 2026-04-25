"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LineChart, TrendingUp, TrendingDown } from "lucide-react"
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart,
} from "recharts"
import { goldPriceHistory } from "@/lib/mock-data"

interface PricePoint { date: string; price: number }
interface PriceHistory { '7d': PricePoint[]; '30d': PricePoint[]; '90d': PricePoint[] }

interface GoldPriceChartProps {
  currentPrice: number
  triggerPrice: number
  priceHistory?: PriceHistory
}

type TimeframeName = "7d" | "30d" | "90d"

export function GoldPriceChart({ currentPrice, triggerPrice, priceHistory }: GoldPriceChartProps) {
  const [timeframe, setTimeframe] = useState<TimeframeName>("30d")
  const history = priceHistory || goldPriceHistory
  const data = history[timeframe]

  // Calculate stats
  const prices = data.map((d) => d.price)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length
  const priceChange = ((currentPrice - prices[0]) / prices[0]) * 100

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <LineChart className="w-5 h-5 text-gold-dark" />
            Gold Price Trend (RM/gram)
          </CardTitle>
          <div className="flex items-center gap-2">
            {(["7d", "30d", "90d"] as const).map((tf) => (
              <Button
                key={tf}
                variant={timeframe === tf ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframe(tf)}
                className={timeframe === tf ? "bg-foreground text-background" : ""}
              >
                {tf === "7d" ? "7 Days" : tf === "30d" ? "30 Days" : "90 Days"}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground mb-1">Current</p>
            <p className="text-lg font-semibold">RM{currentPrice}</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground mb-1">Period Change</p>
            <div className="flex items-center gap-1">
              {priceChange >= 0 ? (
                <TrendingUp className="w-4 h-4 text-success" />
              ) : (
                <TrendingDown className="w-4 h-4 text-destructive" />
              )}
              <span className={`text-lg font-semibold ${priceChange >= 0 ? "text-success" : "text-destructive"}`}>
                {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground mb-1">Average</p>
            <p className="text-lg font-semibold">RM{avgPrice.toFixed(0)}</p>
          </div>
          <div className="p-3 rounded-lg bg-gold-muted/50">
            <p className="text-xs text-muted-foreground mb-1">Buy Trigger</p>
            <p className="text-lg font-semibold text-gold-dark">RM{triggerPrice}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#b8860b" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#b8860b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#737373" }}
                dy={10}
              />
              <YAxis
                domain={[minPrice - 5, maxPrice + 5]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#737373" }}
                tickFormatter={(value) => `${value}`}
                dx={-10}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-card border border-border rounded-lg shadow-lg p-3">
                        <p className="text-sm font-medium">{payload[0].payload.date}</p>
                        <p className="text-lg font-bold text-gold-dark">
                          RM{payload[0].value}/g
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              {/* Buy Zone - below trigger price */}
              <ReferenceLine
                y={triggerPrice}
                stroke="#22c55e"
                strokeDasharray="5 5"
                label={{
                  value: "Buy Zone",
                  position: "insideTopRight",
                  fill: "#22c55e",
                  fontSize: 11,
                }}
              />
              {/* Current Price Line */}
              <ReferenceLine
                y={currentPrice}
                stroke="#b8860b"
                strokeDasharray="3 3"
                label={{
                  value: "Current",
                  position: "insideBottomRight",
                  fill: "#b8860b",
                  fontSize: 11,
                }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="none"
                fill="url(#colorPrice)"
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#b8860b"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: "#b8860b", stroke: "#fff", strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gold" />
            <span className="text-xs text-muted-foreground">Gold Price</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 bg-gold border-dashed border-gold" style={{ borderStyle: "dashed" }} />
            <span className="text-xs text-muted-foreground">Current Price</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 bg-success" style={{ borderStyle: "dashed" }} />
            <span className="text-xs text-muted-foreground">Buy Zone</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
