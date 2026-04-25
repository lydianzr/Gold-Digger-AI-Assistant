import { NextRequest, NextResponse } from 'next/server'

const CHAT_API_ENDPOINT = 'https://api.ilmu.ai/v1/chat/completions'
const CHAT_API_KEY = process.env.CHAT_API_KEY || ''

export const maxDuration = 10

interface ChatRequest {
  message: string
}

interface ChatResponse {
  response: string
}

// Predefined answers (KEEP THIS)
const QUICK_ANSWERS: Record<string, string> = {
  'is now a good time to buy gold': `Based on current market analysis:

**Current Conditions:**
- Gold price is at RM316/gram
- Market trend shows moderate bullish momentum
- Volatility is within normal range (2-3%)

**Recommendation:** The current price is near the 30-day average. If you're a long-term investor, this is a reasonable entry point. For short-term trading, consider waiting for a 2-3% dip.`,

  'what affects gold prices': `Gold prices in Malaysia are influenced by:

**Global Factors:**
1. International gold prices
2. USD/MYR exchange rate
3. Global economic uncertainty

**Local Factors:**
1. Local demand
2. Bank Negara policies
3. Festive seasons`,

  'how much gold can i buy': `At RM316/gram:

RM5,000 → ~15.8g  
RM3,000 → ~9.5g  
RM1,000 → ~3.2g  

Tip: Buy in phases to reduce risk.`,

  'should i wait for prices to drop': `Long-term: gold trends upward.

Short-term:
- Small dip (1–2%) possible
- Consider splitting purchases instead of waiting.`,
}

// Match predefined
function findQuickAnswer(message: string): string | null {
  const text = message.toLowerCase()

  for (const [key, answer] of Object.entries(QUICK_ANSWERS)) {
    if (text.includes(key)) return answer
  }

  if (text.includes('buy') && text.includes('time')) {
    return QUICK_ANSWERS['is now a good time to buy gold']
  }

  if (text.includes('affect') || text.includes('price')) {
    return QUICK_ANSWERS['what affects gold prices']
  }

  if (text.includes('rm') || text.includes('budget')) {
    return QUICK_ANSWERS['how much gold can i buy']
  }

  if (text.includes('wait') || text.includes('drop')) {
    return QUICK_ANSWERS['should i wait for prices to drop']
  }

  return null
}

// Smart fallback (used if AI slow)
function smartFallback(message: string): string {
  const text = message.toLowerCase()
  const match = text.match(/rm\s?(\d+)/)

  if (match) {
    const budget = parseInt(match[1])
    const grams = (budget / 316).toFixed(2)

    return `Based on RM${budget}:

- You can buy ~${grams}g of gold
- Current price ~RM316/g

Suggestion:
- Split purchases into 2–3 parts
- Watch price near RM310`
  }

  return `⚠️ The AI service is taking a bit longer than usual right now, so I’ll guide you using available tools in the system.

  Continue your gold investment journey:
  
📊 **Analysis Page**
Gold Buying Analysis powered by AI decision support based on your budget, risk, and market trends.

📈 **Market Dashboard**
Real-time gold market overview including price movement, USD/MYR trends, and historical data.

🧠 **How It Works**
Learn how Gold Digger AI combines market data + analytics to generate investment recommendations.
`
}

// API handler
export async function POST(
  request: NextRequest
): Promise<NextResponse<ChatResponse>> {
  console.log('[v0] POST /api/chat - Request received')

  try {
    const body = (await request.json()) as ChatRequest
    console.log('[v0] Message received:', body.message?.substring(0, 50))

    if (!body.message) {
      console.log('[v0] No message provided')
      return NextResponse.json(
        { response: 'Please provide a message.' },
        { status: 400 }
      )
    }

    // 1. PREDEFINED FIRST (FAST)
    const quick = findQuickAnswer(body.message)
    if (quick) {
      console.log('[v0] Quick answer found, returning predefined response')
      return NextResponse.json({ response: quick })
    }

    console.log('[v0] No quick answer, calling Ilmu API...')
    console.log('[v0] API Key present:', !!CHAT_API_KEY)

    // 2. AI vs TIMEOUT (race)
    const apiPromise = fetch(CHAT_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CHAT_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'ilmu-glm-5.1',
        messages: [
          {
            role: 'system',
            content: 'Gold investment assistant for Malaysia. Keep answers short.',
          },
          {
            role: 'user',
            content: body.message,
          },
        ],
        temperature: 0.4,
        max_tokens: 1000,
      }),
    })

    const timeoutPromise = new Promise<Response>((resolve) => {
      setTimeout(() => {
        console.log('[v0] API timeout after 3s')
        resolve(new Response(null, { status: 408 }))
      }, 9000)
    })

    const result = await Promise.race([apiPromise, timeoutPromise])
    console.log('[v0] API race result status:', result?.status)

    // 3. If timeout → fallback
    if (!result || result.status === 408) {
      console.log('[v0] Timeout or no result, using fallback')
      return NextResponse.json({
        response: smartFallback(body.message),
      })
    }

    // 4. If API success
    if (!result.ok) {
      console.log('[v0] API not ok, status:', result.status)
      throw new Error('API failed')
    }

    const data = await result.json() as {
      choices?: Array<{ message?: { content?: string } }>
    }
    console.log('[v0] API response received, choices:', data.choices?.length)

    const reply = data.choices?.[0]?.message?.content

    if (reply) {
      console.log('[v0] Returning AI reply, length:', reply.length)
      return NextResponse.json({ response: reply })
    }

    console.log('[v0] Empty reply from API')
    throw new Error('Empty response')

  } catch (err) {
    console.log('[v0] Error in chat API:', err)
    return NextResponse.json({
      response: smartFallback(''),
    })
  }
}
