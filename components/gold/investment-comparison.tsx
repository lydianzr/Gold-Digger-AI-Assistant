"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, Droplet, AlertCircle, Check, Coins, PiggyBank, Lock } from "lucide-react"
import { investmentComparison } from "@/lib/mock-data"

export function InvestmentComparison() {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Physical Gold":
        return <Coins className="w-5 h-5" />
      case "Savings Account":
        return <PiggyBank className="w-5 h-5" />
      case "Fixed Deposit":
        return <Lock className="w-5 h-5" />
      default:
        return <BarChart3 className="w-5 h-5" />
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Very Low":
        return "bg-success/10 text-success border-success/30"
      case "Low-Medium":
        return "bg-gold-muted text-gold-dark border-gold/30"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <BarChart3 className="w-5 h-5 text-gold-dark" />
          Investment Comparison: Gold vs Alternatives
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-6">
          Compare gold investment with other common options available in Malaysia.
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          {investmentComparison.map((investment, index) => (
            <div
              key={investment.type}
              className={`p-5 rounded-xl border ${
                index === 0 
                  ? "bg-gold-muted/20 border-gold/30" 
                  : "bg-muted/30 border-border"
              }`}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  index === 0 ? "bg-gold text-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {getTypeIcon(investment.type)}
                </div>
                <div>
                  <h4 className="font-semibold">{investment.type}</h4>
                  {index === 0 && (
                    <Badge className="bg-gold/20 text-gold-dark border-gold/30 text-xs">
                      Recommended
                    </Badge>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    <span>Returns</span>
                  </div>
                  <span className={`text-sm font-medium ${index === 0 ? "text-success" : ""}`}>
                    {investment.returnRate}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Droplet className="w-4 h-4" />
                    <span>Liquidity</span>
                  </div>
                  <span className="text-sm font-medium">{investment.liquidity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <AlertCircle className="w-4 h-4" />
                    <span>Risk</span>
                  </div>
                  <Badge variant="outline" className={`text-xs ${getRiskColor(investment.risk)}`}>
                    {investment.risk}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Min. Investment</span>
                  <span className="text-sm font-medium">{investment.minInvestment}</span>
                </div>
              </div>

              {/* Pros */}
              <div className="pt-4 border-t border-border/50">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Key Benefits</p>
                <ul className="space-y-1.5">
                  {investment.pros.slice(0, 3).map((pro, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs">
                      <Check className="w-3 h-3 text-success mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6">
          Returns are historical averages and not guaranteed. Each investment has unique characteristics suitable for different goals.
        </p>
      </CardContent>
    </Card>
  )
}
