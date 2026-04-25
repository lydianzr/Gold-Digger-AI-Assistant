"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Coins, RefreshCw, TrendingUp, TrendingDown, ArrowRight, Activity, BarChart3, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { goldPriceHistory } from "@/lib/mock-data"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from "recharts"

interface PricePoint { date: string; price: number }
interface PriceHistory { '7d': PricePoint[]; '30d': PricePoint[]; '90d': PricePoint[] }

type TimeframeName = "7d" | "30d" | "90d"

export default function DashboardPage() {
  const [goldPrice, setGoldPrice] = useState(316)
  const [priceHistory, setPriceHistory] = useState<PriceHistory>(goldPriceHistory)
  const [isPriceFetching, setIsPriceFetching] = useState(false)
  const [priceLastUpdated, setPriceLastUpdated] = useState<string | null>(null)
  const [priceError, setPriceError] = useState<string | null>(null)
  const [timeframe, setTimeframe] = useState<TimeframeName>("30d")

  const fetchLiveGoldPrice = async () => {
    try {
      setIsPriceFetching(true)
      setPriceError(null)
      const res = await fetch('/api/gold-price')
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to fetch price')
      setGoldPrice(data.pricePerGram)
      setPriceHistory(data.history)
      setPriceLastUpdated(new Date(data.fetchedAt).toLocaleTimeString('en-MY'))
    } catch {
      setPriceError('Could not fetch live price.')
    } finally {
      setIsPriceFetching(false)
    }
  }

  useEffect(() => {
    fetchLiveGoldPrice()
  }, [])

  const data = priceHistory[timeframe]
  const prices = data.map((d) => d.price)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length
  const priceChange = ((goldPrice - prices[0]) / prices[0]) * 100
  const volatility = ((maxPrice - minPrice) / avgPrice * 100).toFixed(1)

  // Determine market trend
  const recentPrices = prices.slice(-7)
  const trendSlope = recentPrices[recentPrices.length - 1] - recentPrices[0]
  const trend = trendSlope > 1 ? "bullish" : trendSlope < -1 ? "bearish" : "neutral"

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <header className="border-b border-border/30 bg-card/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center glow-gold">
                <Coins className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">Gold Digger AI</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href="/dashboard" className="text-sm text-primary font-medium">
              Dashboard
            </Link>
            <Link href="/analysis" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Analysis
            </Link>
            <Link href="/how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </Link>
            <Link href="/chat" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              AI Chat
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            {/* Live price status */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground glass-card rounded-lg px-3 py-2">
              {isPriceFetching ? (
                <RefreshCw className="w-3 h-3 animate-spin text-primary" />
              ) : (
                <span className={`w-2 h-2 rounded-full ${priceError ? 'bg-destructive' : 'bg-success'} animate-pulse`} />
              )}
              <span>
                {isPriceFetching
                  ? 'Fetching...'
                  : priceError
                    ? 'Cached'
                    : `Live · ${priceLastUpdated}`}
              </span>
              {!isPriceFetching && (
                <button 
                  onClick={fetchLiveGoldPrice} 
                  className="hover:text-primary transition-colors ml-1"
                  aria-label="Refresh price"
                >
                  <RefreshCw className="w-3 h-3" />
                </button>
              )}
            </div>
            <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-gold">
              <Link href="/analysis">Start Analysis</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">Market Dashboard</h1>
          <p className="text-muted-foreground">Real-time gold market overview and analytics</p>
        </div>

        {/* Top Stats Cards - Premium Yellow/Gold Cards with Dynamic Text */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* 1. Current Price Card */}
          <div className="market-card">
            <div className="flex items-center justify-between">
              <p className="card-label">Current Price</p>
              <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center">
                <Coins className="w-5 h-5" />
              </div>
            </div>
            <p className="card-price">RM{goldPrice.toFixed(2)}</p>
            <p className="card-subtitle">per gram</p>
          </div>

          {/* 2. Price Change Card */}
          <div className="market-card">
            <div className="flex items-center justify-between">
              <p className="card-label">Price Change</p>
              <div className={`trend-arrow ${priceChange >= 0 ? 'trend-arrow-up' : 'trend-arrow-down'}`}>
                {priceChange >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
              </div>
            </div>
            <p className="card-price">
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
            </p>
            <div className="flex items-center justify-between">
              <p className="card-subtitle">{timeframe} period</p>
              <span className={`status-badge ${priceChange >= 0 ? 'status-badge-positive' : 'status-badge-negative'}`}>
                <span className={`status-dot ${priceChange >= 0 ? 'status-dot-positive' : 'status-dot-negative'}`} />
                {priceChange >= 0 ? 'Profit' : 'Loss'}
              </span>
            </div>
          </div>

          {/* 3. Market Trend Card */}
          <div className="market-card">
            <div className="flex items-center justify-between">
              <p className="card-label">Market Trend</p>
              <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <p className="card-price capitalize">{trend}</p>
            <div className="flex items-center justify-between">
              <p className="card-subtitle">7-day momentum</p>
              <span className={`status-badge ${
                trend === "bullish" ? 'status-badge-positive' : 
                trend === "bearish" ? 'status-badge-negative' : 
                'status-badge-neutral'
              }`}>
                <span className={`status-dot ${
                  trend === "bullish" ? 'status-dot-positive' : 
                  trend === "bearish" ? 'status-dot-negative' : 
                  'status-dot-neutral'
                }`} />
                {trend === "bullish" ? 'Buy' : trend === "bearish" ? 'Sell' : 'Hold'}
              </span>
            </div>
          </div>

          {/* 4. Volatility Card */}
          <div className="market-card">
            <div className="flex items-center justify-between">
              <p className="card-label">Volatility</p>
              <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
            </div>
            <p className="card-price">{volatility}%</p>
            <p className="card-subtitle">price range</p>
            {/* Volatility Meter Bar */}
            <div className="volatility-meter">
              <div className={`volatility-meter-fill ${
                parseFloat(volatility) < 2 ? 'volatility-meter-low' : 
                parseFloat(volatility) < 4 ? 'volatility-meter-medium' : 'volatility-meter-high'
              }`} />
            </div>
          </div>
        </div>

        {/* Main Chart Section */}
        <div className="glass-card rounded-xl mb-8 overflow-hidden">
          <div className="p-6 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-foreground">Gold Price Trend (RM/gram)</h2>
              <div className="flex items-center gap-2">
                {(["7d", "30d", "90d"] as const).map((tf) => (
                  <Button
                    key={tf}
                    variant={timeframe === tf ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setTimeframe(tf)}
                    className={timeframe === tf 
                      ? "bg-primary text-primary-foreground glow-gold" 
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    }
                  >
                    {tf === "7d" ? "7 Days" : tf === "30d" ? "30 Days" : "90 Days"}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div className="px-6 pb-6">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
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
                          <div className="glass-card rounded-lg shadow-2xl p-4 glow-gold">
                            <p className="text-sm text-muted-foreground mb-1">{payload[0].payload.date}</p>
                            <p className="text-2xl font-bold text-primary">
                              RM{payload[0].value}/g
                            </p>
                          </div>
                        )
                      }
                      return null
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
                    stroke="#D4AF37"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 8, fill: "#D4AF37", stroke: "#0B0B0B", strokeWidth: 3 }}
                    filter="url(#glow)"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Side Stats - Glassmorphism Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="stats-card">
            <p className="stats-label">Period High</p>
            <p className="stats-value stats-value-positive">RM{maxPrice.toFixed(2)}</p>
            <div className="flex items-center gap-1 mt-2 text-xs text-white/50">
              <TrendingUp className="w-3 h-3" />
              <span>highest in {timeframe}</span>
            </div>
          </div>
          <div className="stats-card">
            <p className="stats-label">Period Low</p>
            <p className="stats-value stats-value-negative">RM{minPrice.toFixed(2)}</p>
            <div className="flex items-center gap-1 mt-2 text-xs text-white/50">
              <TrendingDown className="w-3 h-3" />
              <span>lowest in {timeframe}</span>
            </div>
          </div>
          <div className="stats-card">
            <p className="stats-label">Average Price</p>
            <p className="stats-value stats-value-gold">RM{avgPrice.toFixed(2)}</p>
            <p className="mt-2 text-xs text-white/50">mean value in {timeframe}</p>
          </div>
          <div className="stats-card">
            <p className="stats-label">Price Range</p>
            <p className="stats-value">RM{(maxPrice - minPrice).toFixed(2)}</p>
            <p className="mt-2 text-xs text-white/50">spread in {timeframe}</p>
          </div>
        </div>

        {/* CTA */}
        <div className="glass-card rounded-xl overflow-hidden glow-gold">
          <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Ready to make a decision?</h3>
              <p className="text-sm text-muted-foreground">Get AI-powered recommendations based on current market conditions.</p>
            </div>
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-gold">
              <Link href="/analysis" className="flex items-center gap-2">
                Start Analysis
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 mt-12 py-6 bg-card/40 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <p className="text-xs text-muted-foreground text-center">
            Data for informational purposes only. Not financial advice. Consult a qualified advisor before investing.
          </p>
        </div>
      </footer>
    </div>
  )
}
