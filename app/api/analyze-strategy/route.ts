import { NextRequest, NextResponse } from 'next/server'

function fallback(goldPrice: number, budget: number) {
  const triggerPrice = Math.round(goldPrice * 0.98) // 2% dip target
  return {
    strategy: {
      type: 'Staggered Purchase',
      phases: [
        {
          phase: 1,
          action: `Buy ${Math.floor((budget * 0.5) / goldPrice)}g now`,
          amount: Math.floor(budget * 0.5),
          timing: 'Now'
        },
        {
          phase: 2,
          action: `Buy ${Math.floor((budget * 0.3) / goldPrice)}g on dip`,
          amount: Math.floor(budget * 0.3),
          timing: `In 2 weeks or if price drops to RM${triggerPrice}/g`
        },
        {
          phase: 3,
          action: `Buy ${Math.floor((budget * 0.2) / goldPrice)}g at target`,
          amount: Math.floor(budget * 0.2),
          timing: 'In 4 weeks or at next market correction'
        },
      ],
      rationale: 'Splitting purchases reduces timing risk and allows averaging into the position.',
    },
    tradeoff: {
      buyNow: {
        title: 'Buy Now',
        pros: ['Immediate market exposure', 'Avoids missing upside', 'Simple execution'],
        cons: ['No dip opportunity', 'Full capital committed immediately', 'Short-term volatility exposure'],
        riskLevel: 'Medium',
        potentialSavings: 'RM0 - RM200',
        scenarioFit: 'Best in bullish trend',
      },
      wait: {
        title: 'Wait for Dip',
        pros: ['Potential lower entry', 'Capital stays liquid', 'Better risk control'],
        cons: ['Price may increase further', 'Missed opportunity cost', 'Timing uncertainty'],
        riskLevel: 'Higher',
        potentialSavings: 'RM200 - RM600',
        scenarioFit: 'Best in overbought market',
      },
    },
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { goldPrice, budget, goal, risk, recommendation } = body

    if (!goldPrice || !budget || !goal || !risk) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const systemPrompt = `You are a gold investment strategy advisor for Malaysian investors.
Return ONLY valid JSON — no markdown, no explanation:
{
  "strategy": {
    "type": "string (e.g. Staggered Purchase, Single Entry, DCA)",
    "phases": [{ "phase": number, "action": "string", "amount": number, "timing": "string (e.g. Now, In 2 weeks, If price drops to RMxxx/g)" }],
    "rationale": "One clear sentence explaining the strategy"
  },
  "tradeoff": {
    "buyNow": {
      "title": "Buy Now",
      "pros": ["up to 3 short points"],
      "cons": ["up to 3 short points"],
      "riskLevel": "Low|Medium|High",
      "potentialSavings": "string",
      "scenarioFit": "string"
    },
    "wait": {
      "title": "Wait for Dip",
      "pros": ["up to 3 short points"],
      "cons": ["up to 3 short points"],
      "riskLevel": "Low|Medium|High",
      "potentialSavings": "string",
      "scenarioFit": "string"
    }
  }
}`

    const userPrompt = `Price: RM${goldPrice}/g | Budget: RM${budget} | Goal: ${goal} | Risk: ${risk} | AI Recommendation: ${recommendation || 'split'}`

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 120000)

    let response: Response
    try {
      response = await fetch('https://api.ilmu.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.STRATEGY_API_KEY}`,
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
    } catch {
      clearTimeout(timeout)
      return NextResponse.json(fallback(goldPrice, budget))
    }

    clearTimeout(timeout)

    if (!response.ok) return NextResponse.json(fallback(goldPrice, budget))

    const data = await response.json()
    const aiText = data.choices?.[0]?.message?.content

    let parsed
    try {
      const jsonMatch = aiText.match(/\{[\s\S]*\}/)
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : aiText)
    } catch {
      return NextResponse.json(fallback(goldPrice, budget))
    }

    const fb = fallback(goldPrice, budget)
    return NextResponse.json({
      strategy: parsed.strategy || fb.strategy,
      tradeoff: parsed.tradeoff || fb.tradeoff,
    })
  } catch {
    return NextResponse.json(fallback(316, 5000), { status: 500 })
  }
}
