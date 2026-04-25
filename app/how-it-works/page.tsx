import Link from "next/link"
import { Coins, Database, Brain, FileText, ArrowRight, CheckCircle2, Zap, Shield, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function HowItWorksPage() {
  const steps: { step: number; icon: React.ElementType; title: string; description: string; details: string[] }[] = [
    {
      step: 1,
      icon: Database,
      title: "Fetch Real-Time Gold Data",
      description: "We pull live gold prices from Malaysian market sources, including historical data for trend analysis. Our system updates continuously to ensure you have the most accurate information.",
      details: [
        "Live gold prices in MYR per gram",
        "Historical price data (7, 30, 90 days)",
        "USD/MYR exchange rate trends",
        "Market volatility indicators"
      ]
    },
    {
      step: 2,
      icon: Brain,
      title: "Analyze Using AI",
      description: "Our AI engine (powered by Z.AI GLM) processes the data using advanced algorithms to identify patterns, trends, and optimal buying opportunities.",
      details: [
        "Pattern recognition in price movements",
        "Trend analysis and momentum detection",
        "Risk assessment based on volatility",
        "Contextual factors consideration"
      ]
    },
    {
      step: 3,
      icon: FileText,
      title: "Generate Recommendation",
      description: "Based on your inputs (budget, goals, risk tolerance), the AI generates a personalized recommendation with a confidence score.",
      details: [
        "Buy / Hold / Wait recommendation",
        "Confidence score (0-100%)",
        "Optimal trigger price",
        "Smart buying strategy"
      ]
    },
    {
      step: 4,
      icon: TrendingUp,
      title: "Show Explanation",
      description: "We don't just tell you what to do — we explain why. Get detailed reasoning, simulations, and comparisons to make informed decisions.",
      details: [
        "Detailed reasoning for recommendation",
        "What-if scenario simulations",
        "Buy Now vs Wait trade-off analysis",
        "Investment comparison charts"
      ]
    }
  ]

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
            <Link href="/analysis" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Analysis
            </Link>
            <Link href="/how-it-works" className="text-sm text-foreground font-medium">
              How It Works
            </Link>
            <Link href="/chat" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              AI Chat
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-gold">
              <Link href="/analysis">Start Analysis</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-foreground text-balance">
                How Gold Digger AI Works
              </h1>
              <p className="text-lg text-muted-foreground text-pretty">
                Our AI-powered system combines real-time market data with advanced analytics 
                to help Malaysian gold buyers make smarter investment decisions.
              </p>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {steps.map((step, index) => (
                <div key={step.step} className="relative">
                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div className="absolute left-8 top-24 bottom-0 w-px bg-border hidden md:block" />
                  )}
                  
                  <div className="flex gap-6 mb-12">
                    {/* Step number */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center glow-gold">
                        <step.icon className="w-8 h-8 text-primary-foreground" />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-sm font-medium text-primary">Step {step.step}</span>
                      </div>
                      <h2 className="text-2xl font-bold mb-3 text-foreground">{step.title}</h2>
                      <p className="text-muted-foreground mb-4 text-pretty">{step.description}</p>
                      
                      <div className="glass-card rounded-xl p-4">
                        <ul className="grid sm:grid-cols-2 gap-2">
                          {step.details.map((detail, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">Why Trust Our Analysis?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
                Our system is built on solid foundations to give you reliable, actionable insights.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="glass-card rounded-xl p-6 text-center gradient-border-gold">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2 text-foreground">Real-Time Data</h3>
                <p className="text-sm text-muted-foreground">
                  Live prices updated continuously from Malaysian gold market sources.
                </p>
              </div>
              
              <div className="glass-card rounded-xl p-6 text-center gradient-border-gold">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2 text-foreground">Advanced AI</h3>
                <p className="text-sm text-muted-foreground">
                  Powered by Z.AI GLM for intelligent pattern recognition and analysis.
                </p>
              </div>
              
              <div className="glass-card rounded-xl p-6 text-center gradient-border-gold">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2 text-foreground">Transparent</h3>
                <p className="text-sm text-muted-foreground">
                  Every recommendation comes with detailed reasoning and explanations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">Ready to Try It?</h2>
              <p className="text-muted-foreground mb-8 text-pretty">
                Experience AI-powered gold investment analysis for yourself. 
                Enter your details and get personalized recommendations in seconds.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-gold px-8">
                  <Link href="/analysis" className="flex items-center gap-2">
                    Start Analysis
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-border/50 hover:bg-secondary/50 glass-card px-8">
                  <Link href="/chat">Ask AI Questions</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 py-6 bg-card/40 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <p className="text-xs text-muted-foreground text-center">
            For informational purposes only. Not financial advice. Consult a qualified advisor before investing.
          </p>
        </div>
      </footer>
    </div>
  )
}
