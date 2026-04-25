"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, CheckCircle2 } from "lucide-react"

interface ReasoningCardProps {
  reasons: string[]
}

export function ReasoningCard({ reasons }: ReasoningCardProps) {
  return (
    <Card className="border-border/50 bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Brain className="w-5 h-5 text-gold-dark" />
          Why This Recommendation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {reasons.map((reason, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
              <span className="text-sm text-muted-foreground leading-relaxed">{reason}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
