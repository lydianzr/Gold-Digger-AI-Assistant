import { NextRequest, NextResponse } from 'next/server'

export interface AnalyzeGoldRequest {
  goldPrice: number
  budget: number
  goal: 'short-term' | 'long-term'
  risk: 'low' | 'medium' | 'high'
  usdMyrTrend?: 'up' | 'down' | 'stable'
}

/* -----------------------------
   FALLBACK (UNCHANGED LOGIC)
------------------------------*/
function generateFallback(body: AnalyzeGoldRequest) {
  console.log("[FALLBACK] triggered")

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

  const triggerPrice =
    recommendation === 'wait'
      ? Math.round(goldPrice * 0.97)
      : goldPrice

  return {
    recommendation,
    confidence,
    summary:
      recommendation === 'buy'
        ? `Buying looks favorable at RM${goldPrice}/g.`
        : recommendation === 'wait'
          ? `Waiting for dip near RM${triggerPrice}/g may help.`
          : `Splitting budget RM${budget.toLocaleString()} reduces risk.`,
    triggerPrice,
    reasons: [
      `Goal: ${goal}`,
      `Risk: ${risk}`,
      `~${quantity.toFixed(1)}g gold`,
      `USD/MYR: ${usdMyrTrend}`,
      goal === 'long-term'
        ? 'Consider Zakat if above nisab'
        : 'Short-term volatility applies',
    ],
  }
}

/* -----------------------------
   MAIN API
------------------------------*/
export async function POST(request: NextRequest) {
  console.log("\n[ANALYZE-GOLD] START")

  try {
    const body: AnalyzeGoldRequest = await request.json()
    const usdMyrTrend = body.usdMyrTrend || 'stable'

    if (!body.goldPrice || !body.budget || !body.goal || !body.risk) {
      return NextResponse.json(
        { error: 'Missing fields' },
        { status: 400 }
      )
    }

    if (!process.env.GOLD_API_KEY) {
      return NextResponse.json(generateFallback(body))
    }

    /* -----------------------------
       SIMPLIFIED PROMPTS (IMPORTANT FIX)
    ------------------------------*/
    const systemPrompt = `
Return JSON ONLY:
{
  "recommendation": "buy" | "wait" | "split",
  "confidence": number,
  "summary": string,
  "triggerPrice": number,
  "reasons": string[]
}
Keep it short and practical.
`

    const userPrompt = `
Gold RM${body.goldPrice}/g
Budget RM${body.budget}
Goal ${body.goal}
Risk ${body.risk}
USD/MYR ${usdMyrTrend}
`

    console.log("[AI] calling...")

    const controller = new AbortController()
    const timeout = setTimeout(() => {
      console.log("[AI] timeout 60s")
      controller.abort()
    }, 120000)

    try {
      const res = await fetch(
        'https://api.ilmu.ai/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.GOLD_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'ilmu-glm-5.1',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            temperature: 0.4,
            max_tokens: 600,
          }),
          signal: controller.signal,
        }
      )

      clearTimeout(timeout)

      console.log("[AI] status:", res.status)

      if (!res.ok) {
        return NextResponse.json(generateFallback(body))
      }

      const data = await res.json()
      const content = data.choices?.[0]?.message?.content

      if (!content) {
        return NextResponse.json(generateFallback(body))
      }

      const cleaned = content
        .replace(/```json|```/g, '')
        .trim()

      const parsed = JSON.parse(cleaned)

      console.log("[AI] success")

      return NextResponse.json(parsed)

    } catch (err) {
      clearTimeout(timeout)
      console.log("[AI] failed → fallback", err)
      return NextResponse.json(generateFallback(body))
    }

  } catch (err) {
    console.log("[GLOBAL ERROR]", err)

    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}