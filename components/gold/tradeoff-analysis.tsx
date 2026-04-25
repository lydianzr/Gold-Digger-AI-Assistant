"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Scale, Check, X, Shield, AlertTriangle } from "lucide-react"
import { tradeoffComparison } from "@/lib/mock-data"

interface TradeoffData {
  buyNow: {
    title: string
    pros: string[]
    cons: string[]
    riskLevel: string
    potentialSavings: string
    scenarioFit: string
  }
  wait: {
    title: string
    pros: string[]
    cons: string[]
    riskLevel: string
    potentialSavings: string
    scenarioFit: string
  }
}

interface TradeoffAnalysisProps {
  data?: TradeoffData
}

export function TradeoffAnalysis({ data }: TradeoffAnalysisProps) {
  const comparison = data || tradeoffComparison

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Scale className="w-5 h-5 text-gold-dark" />
          Trade-off Analysis: Buy Now vs Wait
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Buy Now */}
          <div className="p-5 rounded-xl bg-success/5 border border-success/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-success" />
                <h4 className="font-semibold text-lg">{comparison.buyNow.title}</h4>
              </div>
              <Badge className="bg-success/10 text-success border-success/30">
                {comparison.buyNow.riskLevel} Risk
              </Badge>
            </div>

            <div className="space-y-4">
              {/* Pros */}
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Advantages</p>
                <ul className="space-y-2">
                  {comparison.buyNow.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Disadvantages</p>
                <ul className="space-y-2">
                  {comparison.buyNow.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <X className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stats */}
              <div className="pt-4 border-t border-success/20 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Potential Savings</span>
                  <span className="font-medium">{comparison.buyNow.potentialSavings}</span>
                </div>
                <p className="text-xs text-muted-foreground italic">{comparison.buyNow.scenarioFit}</p>
              </div>
            </div>
          </div>

          {/* Wait */}
          <div className="p-5 rounded-xl bg-warning/5 border border-warning/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                <h4 className="font-semibold text-lg">{comparison.wait.title}</h4>
              </div>
              <Badge className="bg-warning/10 text-warning border-warning/30">
                {comparison.wait.riskLevel} Risk
              </Badge>
            </div>

            <div className="space-y-4">
              {/* Pros */}
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Advantages</p>
                <ul className="space-y-2">
                  {comparison.wait.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Disadvantages</p>
                <ul className="space-y-2">
                  {comparison.wait.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <X className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stats */}
              <div className="pt-4 border-t border-warning/20 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Potential Savings</span>
                  <span className="font-medium">{comparison.wait.potentialSavings}</span>
                </div>
                <p className="text-xs text-muted-foreground italic">{comparison.wait.scenarioFit}</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6">
          This analysis helps you understand the trade-offs. The best choice depends on your personal risk tolerance and market outlook.
        </p>
      </CardContent>
    </Card>
  )
}
