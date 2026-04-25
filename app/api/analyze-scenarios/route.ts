import { NextRequest, NextResponse } from 'next/server'

export interface AnalyzeRequest {
  goldPrice: number
  budget: number
  goal: 'short-term' | 'long-term'
  risk: 'low' | 'medium' | 'high'
  usdMyrTrend?: 'up' | 'down' | 'stable'
}

function generateFallback(body: AnalyzeRequest) {
  const { goldPrice, budget } = body
  const quantity = budget / goldPrice

  return {
    whatIfScenarios: [
      {
        id: 'scenario-1',
        title: 'Price Drops 5%',
        description: `Gold price decreases to RM${Math.round(goldPrice * 0.95)}/g in the next 2 weeks`,
        riskLevel: 'low' as const,
        possibleAdvantage: `You could buy ${((budget / (goldPrice * 0.95)) - quantity).toFixed(1)}g more gold for the same budget.`,
        possibleRisk: 'Waiting might cause you to miss current prices if the drop doesn\'t happen.',
        recommendation: 'Set a price alert and be ready to buy if the price reaches your target.',
      },
      {
        id: 'scenario-2',
        title: 'Price Rises 10%',
        description: `Gold price increases to RM${Math.round(goldPrice * 1.1)}/g in the next month`,
        riskLevel: 'high' as const,
        possibleAdvantage: `If you buy now, your RM${budget.toLocaleString()} investment gains RM${Math.round(budget * 0.1).toLocaleString()} in value.`,
        possibleRisk: 'Missing the current price could mean paying significantly more later.',
        recommendation: 'Consider buying at least a portion now to hedge against price increases.',
      },
      {
        id: 'scenario-3',
        title: 'USD Strengthens',
        description: 'USD/MYR rate increases, affecting gold prices in Ringgit',
        riskLevel: 'medium' as const,
        possibleAdvantage: 'A stronger USD typically pushes gold prices higher in MYR terms.',
        possibleRisk: 'Currency fluctuations add another layer of uncertainty to your investment.',
        recommendation: 'Monitor USD/MYR trends alongside gold prices for better timing.',
      },
    ],
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeRequest = await request.json()
    const usdMyrTrend = body.usdMyrTrend || 'stable'

    if (!body.goldPrice || !body.budget || !body.goal || !body.risk) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!process.env.SCENARIO_API_KEY) {
      return NextResponse.json(generateFallback(body))
    }

    const systemPrompt = `You are a Malaysian gold investment expert. Return ONLY valid JSON:
{
  "whatIfScenarios": [
    {
      "id": "scenario-1",
      "title": "<scenario title e.g. 'Price Drops 5%'>",
      "description": "<brief description>",
      "riskLevel": "low" | "medium" | "high",
      "possibleAdvantage": "<what user gains>",
      "possibleRisk": "<what user might lose>",
      "recommendation": "<specific action>"
    },
    {
      "id": "scenario-2",
      "title": "<scenario title>",
      "description": "<description>",
      "riskLevel": "low" | "medium" | "high",
      "possibleAdvantage": "<advantage>",
      "possibleRisk": "<risk>",
      "recommendation": "<action>"
    },
    {
      "id": "scenario-3",
      "title": "<scenario title>",
      "description": "<description>",
      "riskLevel": "low" | "medium" | "high",
      "possibleAdvantage": "<advantage>",
      "possibleRisk": "<risk>",
      "recommendation": "<action>"
    }
  ]
}
Generate 3 unique scenarios: price drop, price rise, and currency/external factor.`

    const userPrompt = `Generate what-if scenarios for:
Gold price: RM${body.goldPrice}/g
Budget: RM${body.budget} (~${(body.budget / body.goldPrice).toFixed(1)}g)
Goal: ${body.goal}
Risk: ${body.risk}
USD/MYR: ${usdMyrTrend}`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 120000)

    try {
      const response = await fetch('https://api.ilmu.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SCENARIO_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'ilmu-glm-5.1',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.4,
          max_tokens: 1000,
        }),
        signal: controller.signal,
      })
      clearTimeout(timeoutId)

      if (!response.ok) {
        return NextResponse.json(generateFallback(body))
      }

      const data = await response.json()
      const content = data.choices?.[0]?.message?.content

      if (!content) {
        return NextResponse.json(generateFallback(body))
      }

      let cleaned = content.trim()
      if (cleaned.startsWith('```json')) cleaned = cleaned.slice(7)
      else if (cleaned.startsWith('```')) cleaned = cleaned.slice(3)
      if (cleaned.endsWith('```')) cleaned = cleaned.slice(0, -3)

      const parsed = JSON.parse(cleaned.trim())
      return NextResponse.json(parsed)
    } catch {
      clearTimeout(timeoutId)
      return NextResponse.json(generateFallback(body))
    }
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
