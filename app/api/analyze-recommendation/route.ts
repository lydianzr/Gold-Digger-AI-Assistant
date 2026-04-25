import { NextRequest, NextResponse } from 'next/server'

export interface AnalyzeRequest {
  goldPrice: number
  budget: number
  goal: 'short-term' | 'long-term'
  risk: 'low' | 'medium' | 'high'
  usdMyrTrend?: 'up' | 'down' | 'stable'
}

function generateFallback(body: AnalyzeRequest) {
  const { goldPrice, budget, goal, risk } = body
  const usdMyrTrend = body.usdMyrTrend || 'stable'
  const quantity = budget / goldPrice

  let recommendation: 'buy' | 'wait' | 'split' = 'split'
  let confidence = 68

  if (risk === 'low' && goal === 'long-term') {
    recommendation = 'split'
    confidence = 72
  } else if (risk === 'high' && usdMyrTrend === 'down') {
    recommendation = 'wait'
    confidence = 65
  } else if (goal === 'short-term' && usdMyrTrend === 'up') {
    recommendation = 'buy'
    confidence = 70
  }

  const triggerPrice = recommendation === 'wait' ? Math.round(goldPrice * 0.97) : goldPrice

  return {
    recommendation,
    confidence,
    summary: recommendation === 'buy'
      ? `Based on your ${risk} risk tolerance and ${goal} goal, buying now at RM${goldPrice}/g appears favorable.`
      : recommendation === 'wait'
        ? `With your ${risk} risk profile, waiting for a potential dip to around RM${triggerPrice}/g could be beneficial.`
        : `A staggered approach suits your ${risk} risk tolerance. Consider splitting your RM${budget.toLocaleString()} budget.`,
    triggerPrice,
    reasons: [
      `Your ${goal === 'long-term' ? 'long-term savings' : 'short-term flip'} goal has been factored into this recommendation`,
      `${risk.charAt(0).toUpperCase() + risk.slice(1)} risk tolerance suggests ${risk === 'low' ? 'a cautious' : risk === 'high' ? 'an aggressive' : 'a balanced'} approach`,
      `Current price of RM${goldPrice}/g would yield approximately ${quantity.toFixed(1)}g of gold`,
      `USD/MYR trend (${usdMyrTrend}) indicates ${usdMyrTrend === 'up' ? 'potential price increases' : usdMyrTrend === 'down' ? 'possible price stability' : 'neutral outlook'}`,
      goal === 'long-term' ? 'For holdings over 1 year, remember Zakat obligation (2.5% if above nisab ~85g)' : 'Short-term holdings may be subject to price volatility',
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

    if (!process.env.RECOMMENDATION_API_KEY) {
      return NextResponse.json(generateFallback(body))
    }

    const systemPrompt = `You are a Malaysian gold investment expert. Return ONLY valid JSON with this structure:
{
  "recommendation": "buy" | "wait" | "split",
  "confidence": <number 0-100>,
  "summary": "<2-3 sentence summary>",
  "triggerPrice": <number - RM/gram>,
  "reasons": ["<reason 1>", "<reason 2>", "<reason 3>", "<reason 4>", "<reason 5>"]
}
Guidelines:
- For "buy": confidence 70-90%, triggerPrice equals current price
- For "wait": confidence 55-75%, triggerPrice 2-5% below current
- For "split": confidence 65-85%
- Include Malaysian context (Zakat, USD/MYR impact)`

    const userPrompt = `Analyze:
Gold price: RM${body.goldPrice}/g
Budget: RM${body.budget} (~${(body.budget / body.goldPrice).toFixed(1)}g)
Goal: ${body.goal === 'short-term' ? 'Short-term flip' : 'Long-term savings'}
Risk: ${body.risk}
USD/MYR: ${usdMyrTrend}`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 120000)

    try {
      const response = await fetch('https://api.ilmu.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RECOMMENDATION_API_KEY}`,
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
