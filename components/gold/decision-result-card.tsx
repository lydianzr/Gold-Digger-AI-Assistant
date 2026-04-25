"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Clock, Layers, Gauge } from "lucide-react"

interface DecisionResultCardProps {
  result: {
    recommendation: "buy" | "wait" | "split"
    confidence: number
    summary: string
    triggerPrice: number
  }
  isAiPowered?: boolean
}

export function DecisionResultCard({ result, isAiPowered = false }: DecisionResultCardProps) {
  const getRecommendationConfig = (rec: string) => {
    switch (rec) {
      case "buy":
        return {
          label: "Buy Now",
          icon: TrendingUp,
          bgColor: "bg-success/10",
          textColor: "text-success",
          borderColor: "border-success/30",
          badgeClass: "bg-success/20 text-success border-success/30",
        }
      case "wait":
        return {
          label: "Wait",
          icon: Clock,
          textColor: "text-warning",
          bgColor: "bg-warning/10",
          borderColor: "border-warning/30",
          badgeClass: "bg-warning/20 text-warning border-warning/30",
        }
      case "split":
        return {
          label: "Split Purchase",
          icon: Layers,
          textColor: "text-gold-dark",
          bgColor: "bg-gold-muted",
          borderColor: "border-gold/30",
          badgeClass: "bg-gold-muted text-gold-dark border-gold/30",
        }
      default:
        return {
          label: "Analyzing",
          icon: Clock,
          textColor: "text-muted-foreground",
          bgColor: "bg-muted",
          borderColor: "border-border",
          badgeClass: "bg-muted text-muted-foreground",
        }
    }
  }

  const config = getRecommendationConfig(result.recommendation)
  const Icon = config.icon

  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 75) return { label: "High", color: "text-success" }
    if (confidence >= 60) return { label: "Moderate", color: "text-gold-dark" }
    return { label: "Low", color: "text-warning" }
  }

  const confidenceLevel = getConfidenceLevel(result.confidence)

  return (
    <Card className={`${config.bgColor} ${config.borderColor} border-2`}>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {/* Recommendation Badge */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className={`w-16 h-16 rounded-2xl ${config.bgColor} border ${config.borderColor} flex items-center justify-center`}>
              <Icon className={`w-8 h-8 ${config.textColor}`} />
            </div>
            <Badge variant="outline" className={`${config.badgeClass} text-base px-4 py-1 font-semibold`}>
              {config.label}
            </Badge>
          </div>

          {/* Summary Content */}
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">AI Recommendation</h3>
              <p className="text-muted-foreground leading-relaxed">{result.summary}</p>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap gap-4 pt-1">
              {/* Confidence */}
              <div className="flex items-center gap-2 bg-background/50 px-4 py-2 rounded-lg">
                <Gauge className="w-4 h-4 text-muted-foreground" />
                <div className="text-sm">
                  <span className="text-muted-foreground">Confidence: </span>
                  <span className={`font-semibold ${confidenceLevel.color}`}>
                    {result.confidence}% ({confidenceLevel.label})
                  </span>
                </div>
              </div>

              {/* Trigger Price */}
              {result.recommendation !== "buy" && (
                <div className="flex items-center gap-2 bg-background/50 px-4 py-2 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <div className="text-sm">
                    <span className="text-muted-foreground">Buy trigger: </span>
                    <span className="font-semibold">RM{result.triggerPrice}/g</span>
                  </div>
                </div>
              )}

              {/* AI badge */}
              {isAiPowered && (
                <div className="flex items-center gap-2 bg-background/50 px-4 py-2 rounded-lg">
                  <span className="w-2 h-2 rounded-full bg-gold inline-block" />
                  <span className="text-xs text-muted-foreground font-medium">Powered by GLM Z.ai</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
