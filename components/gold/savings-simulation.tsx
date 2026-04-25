"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PiggyBank, TrendingDown, ArrowRight, Sparkles } from "lucide-react"

interface SavingsSimulationProps {
  savings: {
    randomBuying: number
    guidedBuying: number
    savingsPerGram: number
    totalQuantity: number
    totalSavings: number
  }
  currentPrice: number
}

export function SavingsSimulation({ savings, currentPrice }: SavingsSimulationProps) {
  const savingsPercentage = ((savings.savingsPerGram / savings.randomBuying) * 100).toFixed(1)

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <PiggyBank className="w-5 h-5 text-gold-dark" />
            Potential Savings Simulation
          </div>
          <Badge className="bg-success/10 text-success border-success/30">
            <Sparkles className="w-3 h-3 mr-1" />
            Save up to RM{savings.totalSavings}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {/* Random Buying */}
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Random Buying</span>
            </div>
            <p className="text-2xl font-bold">RM{savings.randomBuying}/g</p>
            <p className="text-xs text-muted-foreground mt-1">Average market rate</p>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex items-center justify-center">
            <div className="flex items-center gap-2 text-success">
              <TrendingDown className="w-5 h-5" />
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>

          {/* Guided Buying */}
          <div className="p-4 rounded-lg bg-success/5 border border-success/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span className="text-xs font-medium text-success uppercase tracking-wider">AI-Guided Buying</span>
            </div>
            <p className="text-2xl font-bold text-success">RM{savings.guidedBuying}/g</p>
            <p className="text-xs text-muted-foreground mt-1">Optimized entry price</p>
          </div>
        </div>

        {/* Savings Breakdown */}
        <div className="p-4 rounded-lg bg-gold-muted/30 border border-gold/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Current Price</p>
              <p className="font-semibold">RM{currentPrice}/g</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Savings per Gram</p>
              <p className="font-semibold text-success">RM{savings.savingsPerGram} ({savingsPercentage}%)</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Est. Quantity</p>
              <p className="font-semibold">{savings.totalQuantity}g</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Savings</p>
              <p className="font-semibold text-success">RM{savings.totalSavings}</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-4 text-center">
          Simulation based on historical data. Actual savings may vary based on market conditions and timing.
        </p>
      </CardContent>
    </Card>
  )
}
