"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Lightbulb,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  RotateCcw
} from "lucide-react"
import { whatIfScenarios as defaultScenarios } from "@/lib/mock-data"

interface WhatIfScenario {
  id: string
  title: string
  description: string
  riskLevel: "low" | "medium" | "high"
  possibleAdvantage: string
  possibleRisk: string
  recommendation: string
}

interface WhatIfSimulationProps {
  budget: number
  currentPrice: number
  scenarios?: WhatIfScenario[]
}

export function WhatIfSimulation({ budget, currentPrice, scenarios }: WhatIfSimulationProps) {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)

  const activeScenarios = scenarios && scenarios.length > 0 ? scenarios : defaultScenarios

  const handleRunSimulation = (scenarioId: string) => {
    setSelectedScenario(scenarioId)
    setShowResult(true)
  }

  const handleReset = () => {
    setSelectedScenario(null)
    setShowResult(false)
  }

  const selectedScenarioData = activeScenarios.find(s => s.id === selectedScenario)

  const getRiskBadge = (level: "low" | "medium" | "high") => {
    switch (level) {
      case "low":
        return <Badge className="bg-success/10 text-success border-success/30">Low Risk</Badge>
      case "medium":
        return <Badge className="bg-warning/10 text-warning border-warning/30">Medium Risk</Badge>
      case "high":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/30">High Risk</Badge>
    }
  }

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-gold-dark" />
            &quot;What If&quot; Simulation
          </div>
          {showResult && (
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!showResult ? (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              Test different scenarios to understand potential outcomes. Click on a scenario to run simulation.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {activeScenarios.map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => handleRunSimulation(scenario.id)}
                  className="p-4 rounded-lg border border-border bg-muted/30 hover:border-gold/50 hover:bg-gold-muted/20 transition-all text-left group"
                >
                  <h4 className="font-medium mb-2 group-hover:text-gold-dark transition-colors">
                    {scenario.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-3">{scenario.description}</p>
                  <div className="flex items-center justify-between">
                    {getRiskBadge(scenario.riskLevel)}
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-gold-dark transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : selectedScenarioData ? (
          <div className="space-y-4">
            {/* Scenario Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <h4 className="font-semibold text-lg">{selectedScenarioData.title}</h4>
                <p className="text-sm text-muted-foreground">Budget: RM{budget.toLocaleString()} | Current Price: RM{currentPrice}/g</p>
              </div>
              {getRiskBadge(selectedScenarioData.riskLevel)}
            </div>

            {/* Results Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Possible Advantage */}
              <div className="p-4 rounded-lg bg-success/5 border border-success/20">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-success" />
                  <span className="font-medium text-success">Possible Advantage</span>
                </div>
                <p className="text-sm text-muted-foreground">{selectedScenarioData.possibleAdvantage}</p>
              </div>

              {/* Possible Risk */}
              <div className="p-4 rounded-lg bg-warning/5 border border-warning/20">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  <span className="font-medium text-warning">Possible Risk</span>
                </div>
                <p className="text-sm text-muted-foreground">{selectedScenarioData.possibleRisk}</p>
              </div>
            </div>

            {/* Recommendation */}
            <div className="p-4 rounded-lg bg-gold-muted/30 border border-gold/20">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-gold-dark" />
                <span className="font-medium text-gold-dark">Recommendation</span>
              </div>
              <p className="text-sm text-muted-foreground">{selectedScenarioData.recommendation}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <Button variant="outline" size="sm" onClick={handleReset}>
                Try Another Scenario
              </Button>
              <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90">
                Apply This Strategy
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
