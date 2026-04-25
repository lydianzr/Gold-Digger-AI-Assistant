"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target } from "lucide-react"

interface Phase {
  phase: number
  amount: string | number
  timing?: string
  action?: string
  percentage?: number
}

interface StrategyCardProps {
  strategy: {
    type: string
    phases: Phase[]
    rationale: string
  }
  totalBudget?: number
}

export function StrategyCard({ strategy, totalBudget }: StrategyCardProps) {
  // Derive a numeric budget total from phases if not passed in
  const computedTotal =
    totalBudget ??
    strategy.phases.reduce((sum, p) => {
      const raw = typeof p.amount === "number" ? p.amount : parseFloat(String(p.amount).replace(/[^\d.]/g, ""))
      return sum + (isNaN(raw) ? 0 : raw)
    }, 0)

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-gold-dark" />
            Smart Buying Strategy
          </div>
          <Badge variant="outline" className="bg-gold-muted text-gold-dark border-gold/30">
            {strategy.type}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Phases */}
        <div className="space-y-3">
          {strategy.phases.map((phase) => {
            // Normalize amount to a number
            const numericAmount =
              typeof phase.amount === "number"
                ? phase.amount
                : parseFloat(String(phase.amount).replace(/[^\d.]/g, ""))

            // Format RM display
            const rmDisplay =
              typeof phase.amount === "string" && phase.amount.startsWith("RM")
                ? phase.amount
                : `RM${isNaN(numericAmount) ? "—" : numericAmount.toLocaleString()}`

            // Calculate percentage from totalBudget
            const pct =
              computedTotal > 0 && !isNaN(numericAmount)
                ? ((numericAmount / computedTotal) * 100).toFixed(0)
                : null

            // Timing: prefer 'timing' field, fall back to 'action'
            const timingText = phase.timing ?? phase.action ?? null

            return (
              <div key={phase.phase} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gold-muted flex items-center justify-center shrink-0 mt-1">
                  <span className="text-sm font-semibold text-gold-dark">{phase.phase}</span>
                </div>
                <div className="flex-1 min-w-0">
                  {/* Prominent RM value */}
                  <span className="font-bold text-lg leading-tight text-foreground">{rmDisplay}</span>
                  {/* Subtext: percentage + timing */}
                  <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                    {pct !== null && <span>{pct}% of budget</span>}
                    {pct !== null && timingText && <span className="mx-1">·</span>}
                    {timingText && <span>Timing: {timingText}</span>}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Rationale */}
        <div className="pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground leading-relaxed">{strategy.rationale}</p>
        </div>
      </CardContent>
    </Card>
  )
}
