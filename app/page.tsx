"use client"

import Link from "next/link"
import { Coins, TrendingUp, Brain, BarChart3, ArrowRight, Sparkles, Shield, Zap, LineChart, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Navigation */}
      <header className="border-b border-border/30 bg-card/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center glow-gold">
              <Coins className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Gold Digger AI</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="/analysis" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
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
            <Button asChild variant="ghost" size="sm" className="hidden sm:flex hover:bg-secondary/50">
              <Link href="/dashboard">View Dashboard</Link>
            </Button>
            <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-gold">
              <Link href="/analysis">Start Analysis</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Gold gradient glow effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container mx-auto px-4 pt-20 pb-24 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">AI-Powered Decision Support</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground leading-tight text-balance">
              AI-Powered Gold Decision Support for{" "}
              <span className="text-primary">Malaysia</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-primary font-semibold mb-4">
              Buy Gold at the Right Time, Every Time
            </p>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty">
              Stop second-guessing and losing money on bad timing. Get clear, data-backed 
              recommendations tailored to Malaysian gold buyers.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 px-8">
                <Link href="/analysis" className="flex items-center gap-2">
                  Start Analysis
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-border hover:bg-secondary px-8">
                <Link href="/dashboard" className="flex items-center gap-2">
                  <LineChart className="w-4 h-4" />
                  Open Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Why Choose Gold Digger AI?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
              Make smarter gold investment decisions with AI-powered insights and real-time market analysis.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="glass-card rounded-xl p-6 gradient-border-gold">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">AI-Powered Insights</h3>
              <p className="text-sm text-muted-foreground">
                Advanced AI analyzes market trends, historical data, and patterns to give you actionable recommendations.
              </p>
            </div>
            
            <div className="glass-card rounded-xl p-6 gradient-border-gold">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Smart Simulations</h3>
              <p className="text-sm text-muted-foreground">
                Run what-if scenarios, savings projections, and trade-off analyses to understand your options.
              </p>
            </div>
            
            <div className="glass-card rounded-xl p-6 gradient-border-gold">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Clear Recommendations</h3>
              <p className="text-sm text-muted-foreground">
                Get Buy, Hold, or Wait recommendations with confidence scores and detailed explanations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-foreground">Professional Trading Dashboard</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
                Track gold prices, analyze trends, and make informed decisions with our comprehensive dashboard.
              </p>
            </div>
            
            {/* Dashboard Preview Cards */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <div className="glass-card rounded-xl p-4 gradient-border-gold">
                <p className="text-xs text-muted-foreground mb-1">Current Price</p>
                <p className="text-2xl font-bold text-foreground">RM316</p>
                <p className="text-xs text-success">+0.8% today</p>
              </div>
              <div className="glass-card rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-1">24h High</p>
                <p className="text-2xl font-bold text-foreground">RM318</p>
              </div>
              <div className="glass-card rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-1">24h Low</p>
                <p className="text-2xl font-bold text-foreground">RM314</p>
              </div>
              <div className="glass-card rounded-xl p-4 glow-green gradient-border-green">
                <p className="text-xs text-muted-foreground mb-1">Market Trend</p>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-success" />
                  <span className="text-lg font-semibold text-success">Bullish</span>
                </div>
              </div>
            </div>
            
            {/* Chart Preview */}
            <div className="glass-card rounded-xl overflow-hidden glow-gold">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Gold Price Trend</h3>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 text-xs rounded-md bg-secondary text-muted-foreground">7D</span>
                    <span className="px-3 py-1 text-xs rounded-md bg-primary text-primary-foreground">30D</span>
                    <span className="px-3 py-1 text-xs rounded-md bg-secondary text-muted-foreground">90D</span>
                  </div>
                </div>
                {/* Simulated chart area */}
                <div className="h-48 bg-gradient-to-b from-primary/5 to-transparent rounded-lg flex items-end justify-around px-4 pb-4">
                  {[40, 55, 45, 60, 50, 70, 65, 80, 75, 85, 78, 90].map((h, i) => (
                    <div 
                      key={i} 
                      className="w-6 rounded-t bg-gradient-to-t from-primary/60 to-primary"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto text-center">
            <div className="glass-card rounded-xl p-6">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2 text-foreground">Data-Driven</h3>
              <p className="text-sm text-muted-foreground">All recommendations backed by real market data and historical analysis</p>
            </div>
            <div className="glass-card rounded-xl p-6">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2 text-foreground">Real-Time Updates</h3>
              <p className="text-sm text-muted-foreground">Live gold prices from Malaysian market with instant analysis</p>
            </div>
            <div className="glass-card rounded-xl p-6">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2 text-foreground">AI Chat Support</h3>
              <p className="text-sm text-muted-foreground">Ask questions and get instant answers about gold investment</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Ready to Make Smarter Gold Investments?</h2>
            <p className="text-muted-foreground mb-8 text-pretty">
              Join thousands of Malaysian gold buyers using AI-powered insights to optimize their investments.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-gold px-8">
                <Link href="/analysis" className="flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-border/50 hover:bg-secondary/50 glass-card px-8">
                <Link href="/how-it-works">Learn How It Works</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8 bg-card/40 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">Gold Digger AI</span>
            </div>
            <nav className="flex items-center gap-6">
              <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Link href="/analysis" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Analysis
              </Link>
              <Link href="/how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                How It Works
              </Link>
              <Link href="/chat" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                AI Chat
              </Link>
            </nav>
            <p className="text-xs text-muted-foreground">
              For informational purposes only. Not financial advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
