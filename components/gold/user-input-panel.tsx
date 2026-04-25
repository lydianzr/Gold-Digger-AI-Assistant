"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Settings2, TrendingUp, TrendingDown, Minus, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import type { UserInputs } from "@/app/dashboard/page"

interface UserInputPanelProps {
  inputs: UserInputs
  setInputs: (inputs: UserInputs) => void
  onAnalyze: (aiData: {
    recommendation: "buy" | "wait" | "split"
    confidence: number
    summary: string
    triggerPrice: number
    reasons: string[]
    strategy: {
      type: string
      phases: Array<{ phase: number; amount: string; timing: string; percentage: number }>
      rationale: string
    }
    tradeoff?: {
      buyNow: { title: string; pros: string[]; cons: string[]; riskLevel: string; potentialSavings: string; scenarioFit: string }
      wait: { title: string; pros: string[]; cons: string[]; riskLevel: string; potentialSavings: string; scenarioFit: string }
    }
    whatIfScenarios?: Array<{
      id: string
      title: string
      description: string
      riskLevel: "low" | "medium" | "high"
      possibleAdvantage: string
      possibleRisk: string
      recommendation: string
    }>
  }) => void
}

export function UserInputPanel({ inputs, setInputs, onAnalyze }: UserInputPanelProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyzeClick = async () => {
    console.log('[v0] handleAnalyzeClick triggered')
    console.log('[v0] Current inputs:', JSON.stringify(inputs, null, 2))

    try {
      setError(null)
      setIsLoading(true)
      console.log('[v0] Loading state set to true')

      const requestBody = JSON.stringify(inputs)
      console.log('[v0] Sending POST to /api/analyze-gold')
      console.log('[v0] Request body:', requestBody)

      const response = await fetch('/api/analyze-gold', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
      })

      console.log('[v0] Response received')
      console.log('[v0] Response status:', response.status)
      console.log('[v0] Response ok:', response.ok)
      console.log('[v0] Response headers:', JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2))

      const responseText = await response.text()
      console.log('[v0] Raw response text:', responseText)

      let data
      try {
        data = JSON.parse(responseText)
        console.log('[v0] Parsed response data:', JSON.stringify(data, null, 2))
      } catch (parseErr) {
        console.log('[v0] ERROR: Failed to parse response as JSON:', parseErr)
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 200)}`)
      }

      if (!response.ok) {
        console.log('[v0] ERROR: Response not OK')
        console.log('[v0] Error details:', data)
        throw new Error(data.error || `API error: ${response.status} ${response.statusText}`)
      }

      // Check if we have the required data fields (API returns data directly, not wrapped in success)
      if (!data.recommendation && !data.summary) {
        console.log('[v0] WARNING: API response missing expected fields')
        throw new Error(data.error || 'Analysis failed - missing data')
      }

      console.log('[v0] SUCCESS: Analysis received')
      console.log('[v0] Structured fields - recommendation:', data.recommendation, 'confidence:', data.confidence, 'triggerPrice:', data.triggerPrice)
      console.log('[v0] Reasons count:', data.reasons?.length, 'Strategy type:', data.strategy?.type)

      // Call parent handler with full structured AI data
      onAnalyze({
        recommendation: data.recommendation ?? 'split',
        confidence: data.confidence ?? 68,
        summary: data.summary ?? 'Analysis complete.',
        triggerPrice: data.triggerPrice ?? 310,
        reasons: data.reasons ?? ['AI analysis completed'],
        strategy: data.strategy ?? {
          type: 'Staggered Purchase',
          phases: [{ phase: 1, amount: 'RM2,500', timing: 'Now', percentage: 50 }],
          rationale: 'Default strategy.',
        },
        tradeoff: data.tradeoff,
        whatIfScenarios: data.whatIfScenarios,
      })
      toast.success('Analysis complete! Review the results below.')
    } catch (err) {
      console.log('[v0] CAUGHT ERROR in handleAnalyzeClick')
      console.log('[v0] Error type:', err?.constructor?.name)
      console.log('[v0] Error message:', err instanceof Error ? err.message : String(err))
      console.log('[v0] Full error:', err)

      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      console.log('[v0] handleAnalyzeClick completed, setting loading to false')
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-border/50 bg-card sticky top-24">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings2 className="w-5 h-5 text-gold-dark" />
          Analysis Parameters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Gold Price */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="goldPrice" className="text-sm font-medium">
              Current Gold Price (RM/gram)
            </Label>
            <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success font-medium border border-success/20">
              Live
            </span>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">RM</span>
            <Input
              id="goldPrice"
              type="number"
              value={inputs.goldPrice}
              onChange={(e) => setInputs({ ...inputs, goldPrice: Number(e.target.value) })}
              className="pl-10"
            />
          </div>
          <p className="text-xs text-muted-foreground">Auto-fetched live price. You can override manually.</p>
        </div>

        {/* Budget */}
        <div className="space-y-2">
          <Label htmlFor="budget" className="text-sm font-medium">
            Your Budget (RM)
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">RM</span>
            <Input
              id="budget"
              type="number"
              value={inputs.budget === 0 ? '' : inputs.budget}
              onChange={(e) => setInputs({ ...inputs, budget: e.target.value === '' ? 0 : Number(e.target.value) })}
              placeholder="0"
              className="pl-10"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {inputs.budget > 0 ? `Estimated quantity: ${(inputs.budget / inputs.goldPrice).toFixed(1)}g` : 'Enter your budget to calculate quantity'}
          </p>
        </div>

        {/* Investment Goal */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Investment Goal</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={inputs.goal === "short-term" ? "default" : "outline"}
              size="sm"
              onClick={() => setInputs({ ...inputs, goal: "short-term" })}
              className={inputs.goal === "short-term" ? "bg-foreground text-background" : ""}
            >
              Short-term Flip
            </Button>
            <Button
              type="button"
              variant={inputs.goal === "long-term" ? "default" : "outline"}
              size="sm"
              onClick={() => setInputs({ ...inputs, goal: "long-term" })}
              className={inputs.goal === "long-term" ? "bg-foreground text-background" : ""}
            >
              Long-term Savings
            </Button>
          </div>
        </div>

        {/* Risk Preference */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Risk Preference</Label>
          <div className="grid grid-cols-3 gap-2">
            {(["low", "medium", "high"] as const).map((level) => (
              <Button
                key={level}
                type="button"
                variant={inputs.risk === level ? "default" : "outline"}
                size="sm"
                onClick={() => setInputs({ ...inputs, risk: level })}
                className={inputs.risk === level ? "bg-foreground text-background" : ""}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* USD/MYR Trend */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">USD/MYR Trend (Optional)</Label>
          <div className="grid grid-cols-3 gap-2">
            <Button
              type="button"
              variant={inputs.usdMyrTrend === "up" ? "default" : "outline"}
              size="sm"
              onClick={() => setInputs({ ...inputs, usdMyrTrend: "up" })}
              className={inputs.usdMyrTrend === "up" ? "bg-foreground text-background" : ""}
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              Up
            </Button>
            <Button
              type="button"
              variant={inputs.usdMyrTrend === "stable" ? "default" : "outline"}
              size="sm"
              onClick={() => setInputs({ ...inputs, usdMyrTrend: "stable" })}
              className={inputs.usdMyrTrend === "stable" ? "bg-foreground text-background" : ""}
            >
              <Minus className="w-4 h-4 mr-1" />
              Stable
            </Button>
            <Button
              type="button"
              variant={inputs.usdMyrTrend === "down" ? "default" : "outline"}
              size="sm"
              onClick={() => setInputs({ ...inputs, usdMyrTrend: "down" })}
              className={inputs.usdMyrTrend === "down" ? "bg-foreground text-background" : ""}
            >
              <TrendingDown className="w-4 h-4 mr-1" />
              Down
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Analyze Button */}
        <Button
          onClick={handleAnalyzeClick}
          disabled={isLoading}
          className="w-full bg-gold text-foreground hover:bg-gold/90 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Spinner className="w-4 h-4" />
              Analyzing...
            </div>
          ) : (
            'Analyze Now'
          )}
        </Button>

        {/* Info Text */}
        <p className="text-xs text-muted-foreground text-center">
          Analysis based on historical patterns and your inputs. Results are for decision support only.
        </p>
      </CardContent>
    </Card>
  )
}
