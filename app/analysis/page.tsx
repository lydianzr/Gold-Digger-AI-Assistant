"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Coins, RefreshCw, Sparkles, Shield, Target, TrendingUp, TrendingDown, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ReasoningCard } from "@/components/gold/reasoning-card"
import { StrategyCard } from "@/components/gold/strategy-card"
import { GoldPriceChart } from "@/components/gold/gold-price-chart"
import { WhatIfSimulation } from "@/components/gold/what-if-simulation"
import { TradeoffAnalysis } from "@/components/gold/tradeoff-analysis"
import { InvestmentComparison } from "@/components/gold/investment-comparison"
import { defaultAnalysisResult, goldPriceHistory } from "@/lib/mock-data"
import { Slider } from "@/components/ui/slider"

interface PricePoint { date: string; price: number }
interface PriceHistory { '7d': PricePoint[]; '30d': PricePoint[]; '90d': PricePoint[] }

export interface UserInputs {
  goldPrice: number
  budget: number
  goal: "short-term" | "long-term"
  risk: "low" | "medium" | "high"
  usdMyrTrend: "up" | "down" | "stable"
}

export default function AnalysisPage() {
  const [inputs, setInputs] = useState<UserInputs>({
    goldPrice: 316,
    budget: 5000,
    goal: "long-term",
    risk: "medium",
    usdMyrTrend: "stable",
  })
  const [isAnalyzed, setIsAnalyzed] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(defaultAnalysisResult)
  const [isAiPowered, setIsAiPowered] = useState(false)
  const [priceHistory, setPriceHistory] = useState<PriceHistory>(goldPriceHistory)
  const [isPriceFetching, setIsPriceFetching] = useState(false)
  const [priceLastUpdated, setPriceLastUpdated] = useState<string | null>(null)
  const [priceError, setPriceError] = useState<string | null>(null)

  const fetchLiveGoldPrice = async () => {
    try {
      setIsPriceFetching(true)
      setPriceError(null)
      const res = await fetch('/api/gold-price')
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to fetch price')
      setInputs(prev => ({ ...prev, goldPrice: data.pricePerGram }))
      setPriceHistory(data.history)
      setPriceLastUpdated(new Date(data.fetchedAt).toLocaleTimeString('en-MY'))
    } catch {
      setPriceError('Could not fetch live price. Using last known value.')
    } finally {
      setIsPriceFetching(false)
    }
  }

  useEffect(() => {
    fetchLiveGoldPrice()
  }, [])

  const handleAnalyze = async () => {
    setIsAnalyzing(true)

    const requestBody = {
      goldPrice: inputs.goldPrice,
      budget: inputs.budget,
      goal: inputs.goal,
      risk: inputs.risk,
    }

    const fetchOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    }

    try {
      // Call all 3 APIs in parallel
      const [recommendationRes, strategyRes, scenariosRes] = await Promise.all([
        fetch('/api/analyze-gold', fetchOptions),
        fetch('/api/analyze-strategy', fetchOptions),
        fetch('/api/analyze-scenarios', fetchOptions),
      ])

      const [recommendationData, strategyData, scenariosData] = await Promise.all([
        recommendationRes.json(),
        strategyRes.json(),
        scenariosRes.json(),
      ])

      // Build result from all 3 API responses
      const newResult = {
        // From /api/analyze-gold (recommendation card)
        recommendation: recommendationData.recommendation || defaultAnalysisResult.recommendation,
        confidence: recommendationData.confidence || defaultAnalysisResult.confidence,
        summary: recommendationData.summary || defaultAnalysisResult.summary,
        triggerPrice: recommendationData.triggerPrice || defaultAnalysisResult.triggerPrice,
        reasons: recommendationData.reasons || defaultAnalysisResult.reasons,
        // From /api/analyze-strategy (strategy & tradeoff cards)
        strategy: strategyData.strategy || defaultAnalysisResult.strategy,
        tradeoff: strategyData.tradeoff || defaultAnalysisResult.tradeoff,
        // From /api/analyze-scenarios (what-if card)
        whatIfScenarios: scenariosData.whatIfScenarios || defaultAnalysisResult.whatIfScenarios,
        // Calculated savings
        savings: {
          ...defaultAnalysisResult.savings,
          totalQuantity: Math.floor(inputs.budget / inputs.goldPrice),
          totalSavings: Math.floor(inputs.budget / inputs.goldPrice) * defaultAnalysisResult.savings.savingsPerGram,
        }
      }
      setAnalysisResult(newResult)
      setIsAiPowered(true)
      setIsAnalyzed(true)
    } catch (error) {
      console.error('[v0] Failed to analyze:', error)
      // Fall back to default result on network error
      const fallbackResult = {
        ...defaultAnalysisResult,
        savings: {
          ...defaultAnalysisResult.savings,
          totalQuantity: Math.floor(inputs.budget / inputs.goldPrice),
          totalSavings: Math.floor(inputs.budget / inputs.goldPrice) * defaultAnalysisResult.savings.savingsPerGram,
        }
      }
      setAnalysisResult(fallbackResult)
      setIsAiPowered(false)
      setIsAnalyzed(true)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setInputs({
      goldPrice: 316,
      budget: 5000,
      goal: "long-term",
      risk: "medium",
      usdMyrTrend: "stable",
    })
    setAnalysisResult(defaultAnalysisResult)
    setIsAiPowered(false)
    setIsAnalyzed(false)
  }

  const getRecommendationStyle = () => {
    switch (analysisResult.recommendation) {
      case "buy": return {
        cardClass: "market-card-positive",
        text: "text-white",
        label: "BUY",
        badgeBg: "bg-white/20"
      }
      case "wait": return {
        cardClass: "market-card-negative",
        text: "text-white",
        label: "WAIT",
        badgeBg: "bg-white/20"
      }
      default: return {
        cardClass: "market-card-neutral",
        text: "text-black",
        label: "SPLIT",
        badgeBg: "bg-black/10"
      }
    }
  }

  const recStyle = getRecommendationStyle()

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
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="/analysis" className="text-sm text-primary font-medium">
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
                  ? 'Fetching price...'
                  : priceError
                    ? 'Using cached price'
                    : `Live · RM${inputs.goldPrice.toFixed(2)}/g · ${priceLastUpdated}`}
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
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="border-border/50 hover:bg-secondary/50 hover:text-foreground glass-card"
            >
              Reset
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-foreground text-balance">Gold Buying Analysis</h1>
          <p className="text-muted-foreground text-pretty">
            Enter your parameters to receive AI-powered decision support based on current market trends.
          </p>
        </div>

        {/* TOP SECTION: Side-by-Side Input + AI Recommendation */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* LEFT: Analysis Parameters Input Card */}
          <div className="glass-card rounded-xl p-6 gradient-border-gold">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Analysis Parameters</h2>
                <p className="text-sm text-muted-foreground">Configure your investment criteria</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Budget Input */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Investment Budget
                </label>
                <div className="glass-card rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl font-bold text-primary">RM{inputs.budget.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground">
                      ~{Math.floor(inputs.budget / inputs.goldPrice)}g gold
                    </span>
                  </div>
                  <Slider
                    value={[inputs.budget]}
                    onValueChange={([value]) => setInputs(prev => ({ ...prev, budget: value }))}
                    min={500}
                    max={50000}
                    step={500}
                    className="w-full"
                  />
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>RM500</span>
                    <span>RM50,000</span>
                  </div>
                </div>
              </div>

              {/* Investment Goal */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Investment Goal
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setInputs(prev => ({ ...prev, goal: "short-term" }))}
                    className={`p-4 rounded-lg border transition-all ${inputs.goal === "short-term"
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border/50 bg-secondary/30 text-muted-foreground hover:border-primary/50"
                      }`}
                  >
                    <TrendingUp className="w-5 h-5 mx-auto mb-2" />
                    <span className="text-sm font-medium">Short-term</span>
                    <p className="text-xs text-muted-foreground mt-1">{"<"} 1 year</p>
                  </button>
                  <button
                    onClick={() => setInputs(prev => ({ ...prev, goal: "long-term" }))}
                    className={`p-4 rounded-lg border transition-all ${inputs.goal === "long-term"
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border/50 bg-secondary/30 text-muted-foreground hover:border-primary/50"
                      }`}
                  >
                    <Shield className="w-5 h-5 mx-auto mb-2" />
                    <span className="text-sm font-medium">Long-term</span>
                    <p className="text-xs text-muted-foreground mt-1">{">"}1 year</p>
                  </button>
                </div>
              </div>

              {/* Risk Tolerance (Optional) */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Risk Tolerance <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["low", "medium", "high"] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setInputs(prev => ({ ...prev, risk: level }))}
                      className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all capitalize ${inputs.risk === level
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border/50 bg-secondary/30 text-muted-foreground hover:border-primary/50"
                        }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Analyze Button */}
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || inputs.budget < 500}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-gold h-12 text-base font-semibold"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Analyze Now
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* RIGHT: AI Recommendation Output Card - Premium Gradient */}
          {isAnalyzed ? (
            <div className={`market-card ${recStyle.cardClass} transition-all duration-500`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${recStyle.badgeBg}`}>
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">AI Recommendation</h2>
                  <p className="text-sm opacity-75">Powered by market analysis</p>
                </div>
              </div>

              <div className="space-y-5">
                {/* Main Recommendation */}
                <div className="text-center py-4">
                  <div className={`inline-block px-8 py-4 rounded-2xl ${recStyle.badgeBg} mb-4`}>
                    <span className="text-5xl md:text-6xl font-black uppercase tracking-wider">
                      {recStyle.label}
                    </span>
                  </div>
                  <p className="opacity-85 text-sm max-w-sm mx-auto">
                    {analysisResult.summary}
                  </p>
                </div>

                {/* Stats Row - nested cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className={`rounded-xl p-4 text-center ${recStyle.badgeBg}`}>
                    <p className="text-xs uppercase tracking-wider mb-1 opacity-75">Risk Level</p>
                    <p className="text-2xl font-bold capitalize">
                      {inputs.risk}
                    </p>
                    <span className={`volatility-badge mt-2 inline-block ${inputs.risk === "low" ? 'volatility-badge-low' :
                        inputs.risk === "high" ? 'volatility-badge-high' : 'volatility-badge-medium'
                      }`}>
                      {inputs.risk === "low" ? 'Safe' : inputs.risk === "high" ? 'Aggressive' : 'Balanced'}
                    </span>
                  </div>
                  <div className={`rounded-xl p-4 text-center ${recStyle.badgeBg}`}>
                    <p className="text-xs uppercase tracking-wider mb-1 opacity-75">Confidence</p>
                    <p className="text-2xl font-bold">{analysisResult.confidence}%</p>
                    <span className={`volatility-badge mt-2 inline-block ${analysisResult.confidence >= 80 ? 'volatility-badge-low' :
                        analysisResult.confidence >= 60 ? 'volatility-badge-medium' : 'volatility-badge-high'
                      }`}>
                      {analysisResult.confidence >= 80 ? 'High' : analysisResult.confidence >= 60 ? 'Medium' : 'Low'}
                    </span>
                  </div>
                </div>

                {/* AI Badge */}
                {isAiPowered && (
                  <div className={`flex items-center justify-center gap-2 text-xs ${recStyle.badgeBg} rounded-lg py-2`}>
                    <Sparkles className="w-3 h-3" />
                    <span>AI-powered analysis based on real-time market data</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="market-card market-card-neutral">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-black/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">AI Recommendation</h2>
                  <p className="text-sm opacity-75">Powered by market analysis</p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-20 h-20 rounded-full bg-black/10 flex items-center justify-center mb-6">
                  <Coins className="w-10 h-10 opacity-60" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Awaiting Analysis</h3>
                <p className="opacity-75 text-sm max-w-xs">
                  Configure your parameters and click &quot;Analyze Now&quot; to receive AI-powered recommendations.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* BELOW SECTION: Detailed Insights (only show when analyzed) */}
        {isAnalyzed && (
          <div className="space-y-6">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Detailed Insights</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>

            {/* Reasoning & Strategy Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <ReasoningCard reasons={analysisResult.reasons} />
              <StrategyCard strategy={analysisResult.strategy} totalBudget={inputs.budget} />
            </div>

            {/* Gold Price Chart */}
            <GoldPriceChart currentPrice={inputs.goldPrice} triggerPrice={analysisResult.triggerPrice} priceHistory={priceHistory} />

            {/* What If Simulation */}
            <WhatIfSimulation budget={inputs.budget} currentPrice={inputs.goldPrice} scenarios={analysisResult.whatIfScenarios} />

            {/* Trade-off Analysis */}
            <TradeoffAnalysis data={analysisResult.tradeoff} />

            {/* Investment Comparison */}
            <InvestmentComparison />
          </div>
        )}
      </main>

      {/* Disclaimer Footer */}
      <footer className="border-t border-border/30 mt-12 py-6 bg-card/40 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <p className="text-xs text-muted-foreground text-center max-w-3xl mx-auto">
            <strong className="text-foreground">Disclaimer:</strong> This system provides decision support based on historical trends and patterns.
            It does not predict future prices with certainty. All recommendations are for informational purposes only
            and should not be considered financial advice. Please consult a qualified financial advisor before making
            investment decisions.
          </p>
        </div>
      </footer>
    </div>
  )
}
