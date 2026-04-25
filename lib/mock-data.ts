// Mock gold price data for demonstration
export const goldPriceHistory = {
  "7d": [
    { date: "Apr 16", price: 305, volume: 1200 },
    { date: "Apr 17", price: 308, volume: 1350 },
    { date: "Apr 18", price: 312, volume: 1500 },
    { date: "Apr 19", price: 310, volume: 1100 },
    { date: "Apr 20", price: 315, volume: 1800 },
    { date: "Apr 21", price: 318, volume: 2100 },
    { date: "Apr 22", price: 316, volume: 1600 },
  ],
  "30d": [
    { date: "Mar 23", price: 295, volume: 1000 },
    { date: "Mar 26", price: 298, volume: 1100 },
    { date: "Mar 29", price: 302, volume: 1250 },
    { date: "Apr 1", price: 300, volume: 1150 },
    { date: "Apr 4", price: 303, volume: 1300 },
    { date: "Apr 7", price: 307, volume: 1400 },
    { date: "Apr 10", price: 305, volume: 1200 },
    { date: "Apr 13", price: 310, volume: 1550 },
    { date: "Apr 16", price: 308, volume: 1350 },
    { date: "Apr 19", price: 315, volume: 1800 },
    { date: "Apr 22", price: 316, volume: 1600 },
  ],
  "90d": [
    { date: "Jan 22", price: 280, volume: 900 },
    { date: "Feb 1", price: 285, volume: 950 },
    { date: "Feb 11", price: 282, volume: 880 },
    { date: "Feb 21", price: 288, volume: 1000 },
    { date: "Mar 3", price: 292, volume: 1100 },
    { date: "Mar 13", price: 290, volume: 1050 },
    { date: "Mar 23", price: 295, volume: 1000 },
    { date: "Apr 2", price: 302, volume: 1250 },
    { date: "Apr 12", price: 308, volume: 1400 },
    { date: "Apr 22", price: 316, volume: 1600 },
  ],
}

export const defaultAnalysisResult = {
  recommendation: "split" as const,
  confidence: 72,
  summary: "Based on recent price trends and your investment profile, we recommend a split purchase strategy to balance risk and opportunity.",
  triggerPrice: 310,
  reasons: [
    "Price increased 3.5% in the last 7 days, showing upward momentum",
    "Current price (RM316/g) is 4.2% above the 30-day average (RM303/g)",
    "Historical patterns suggest potential short-term correction after rapid increases",
    "Your long-term savings goal supports staggered buying to average costs",
    "Medium risk tolerance aligns with split purchase approach",
  ],
  strategy: {
    type: "Staggered Purchase",
    phases: [
      { phase: 1, amount: "RM2,500", timing: "Now", percentage: 50 },
      { phase: 2, amount: "RM2,500", timing: "In 2 weeks or if price drops to RM310/g", percentage: 50 },
    ],
    rationale: "This approach reduces timing risk while ensuring market participation. If prices continue rising, you benefit from the initial purchase. If prices correct, you can buy the second phase at a better rate.",
  },
  savings: {
    randomBuying: 320,
    guidedBuying: 308,
    savingsPerGram: 12,
    totalQuantity: 50,
    totalSavings: 600,
  },
}

export const whatIfScenarios = [
  {
    id: "wait-1-week",
    title: "What if I wait 1 week?",
    description: "Analyze potential outcomes of waiting 7 days before purchasing",
    possibleAdvantage: "If prices correct by 2-3%, you could save RM300-450 on a RM5,000 purchase",
    possibleRisk: "If upward trend continues, prices may increase by another 2-4%, adding RM320-640 to your cost",
    recommendation: "Based on current momentum, waiting carries moderate risk. Consider partial purchase now.",
    riskLevel: "medium" as const,
  },
  {
    id: "buy-now-2000",
    title: "What if I buy now with RM2,000?",
    description: "Analyze immediate purchase with partial budget",
    possibleAdvantage: "Lock in current price for 6.3g of gold. Remaining budget stays flexible for future opportunities.",
    possibleRisk: "If prices drop significantly, the initial purchase will be at a higher rate than later purchases.",
    recommendation: "Good strategy for risk-conscious buyers. Ensures market participation while preserving flexibility.",
    riskLevel: "low" as const,
  },
  {
    id: "split-2-purchases",
    title: "What if I split into 2 purchases?",
    description: "Analyze 50/50 split purchase strategy",
    possibleAdvantage: "Averages your buying price, reducing the impact of short-term volatility by approximately 30%.",
    possibleRisk: "If prices only go up, you miss out on buying everything at today's lower price.",
    recommendation: "Strongly recommended for your risk profile. Balances opportunity cost with downside protection.",
    riskLevel: "low" as const,
  },
]

export const tradeoffComparison = {
  buyNow: {
    title: "Buy Now",
    pros: [
      "Lock in current price immediately",
      "No risk of further price increases",
      "Start your investment journey today",
      "Simpler decision - one transaction",
    ],
    cons: [
      "Paying current market premium",
      "No opportunity to benefit from potential dips",
      "Full capital committed at once",
    ],
    riskLevel: "Low" as const,
    potentialSavings: "RM0 - RM200",
    scenarioFit: "Best if you believe prices will continue rising",
  },
  wait: {
    title: "Wait for Dip",
    pros: [
      "Potential to buy at lower price",
      "More time to research and decide",
      "Capital remains liquid",
      "Can set target price alerts",
    ],
    cons: [
      "Risk of prices increasing further",
      "Psychological difficulty of timing",
      "May lead to analysis paralysis",
    ],
    riskLevel: "Higher" as const,
    potentialSavings: "RM300 - RM600 (if price drops)",
    scenarioFit: "Best if recent price spike seems unsustainable",
  },
}

export const investmentComparison = [
  {
    type: "Physical Gold",
    returnRate: "8-12% annually (historical)",
    liquidity: "Medium",
    risk: "Low-Medium",
    minInvestment: "RM300+",
    pros: ["Tangible asset", "Inflation hedge", "No counterparty risk"],
    cons: ["Storage costs", "Spread on buy/sell", "No dividends"],
  },
  {
    type: "Savings Account",
    returnRate: "2-3% annually",
    liquidity: "High",
    risk: "Very Low",
    minInvestment: "RM0",
    pros: ["PIDM protected", "Instant access", "No fees"],
    cons: ["Low returns", "Loses to inflation", "No capital growth"],
  },
  {
    type: "Fixed Deposit",
    returnRate: "3-4% annually",
    liquidity: "Low",
    risk: "Very Low",
    minInvestment: "RM1,000",
    pros: ["Guaranteed returns", "PIDM protected", "Predictable"],
    cons: ["Lock-in period", "Penalty for early withdrawal", "Low returns"],
  },
]
