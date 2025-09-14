import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for demo purposes
// In production, this should be stored in a database
interface UsageData {
  date: string
  requests: number
  tokensUsed: number
  estimatedCost: number
}

// Simulated usage data - in production, this would come from your database
let usageData: UsageData[] = [
  {
    date: '2024-01-01',
    requests: 15,
    tokensUsed: 1250,
    estimatedCost: 0.001
  },
  {
    date: '2024-01-02',
    requests: 23,
    tokensUsed: 2100,
    estimatedCost: 0.002
  },
  {
    date: '2024-01-03',
    requests: 18,
    tokensUsed: 1800,
    estimatedCost: 0.001
  }
]

// Google AI API pricing (as of 2024 - these are estimated rates)
const PRICING = {
  'gemini-2.5-flash-image-preview': {
    freeTier: {
      requestsPerDay: 100,
      tokensPerDay: 10000
    },
    paid: {
      costPerRequest: 0.0005,
      costPerToken: 0.000001
    }
  },
  'gemini-1.5-flash': {
    freeTier: {
      requestsPerDay: 150,
      tokensPerDay: 15000
    },
    paid: {
      costPerRequest: 0.0003,
      costPerToken: 0.0000008
    }
  },
  'gemini-1.5-pro': {
    freeTier: {
      requestsPerDay: 50,
      tokensPerDay: 5000
    },
    paid: {
      costPerRequest: 0.001,
      costPerToken: 0.000002
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    // Calculate current usage for today
    const today = new Date().toISOString().split('T')[0]
    const todayUsage = usageData.find(day => day.date === today) || {
      date: today,
      requests: 0,
      tokensUsed: 0,
      estimatedCost: 0
    }

    // Calculate totals
    const totalRequests = usageData.reduce((sum, day) => sum + day.requests, 0)
    const totalTokens = usageData.reduce((sum, day) => sum + day.tokensUsed, 0)
    const totalCost = usageData.reduce((sum, day) => sum + day.estimatedCost, 0)

    // Get free tier limits (using Gemini 2.5 Flash as default)
    const defaultModel = 'gemini-2.5-flash-image-preview'
    const freeTierLimits = PRICING[defaultModel].freeTier

    // Calculate usage percentages
    const requestsUsedPercent = (todayUsage.requests / freeTierLimits.requestsPerDay) * 100
    const tokensUsedPercent = (todayUsage.tokensUsed / freeTierLimits.tokensPerDay) * 100

    // Determine if user is approaching limits
    const isApproachingLimit = requestsUsedPercent > 80 || tokensUsedPercent > 80
    const isOverLimit = requestsUsedPercent > 100 || tokensUsedPercent > 100

    return NextResponse.json({
      currentUsage: todayUsage,
      totalUsage: {
        requests: totalRequests,
        tokens: totalTokens,
        cost: totalCost
      },
      freeTierLimits: freeTierLimits,
      usagePercentages: {
        requests: Math.round(requestsUsedPercent),
        tokens: Math.round(tokensUsedPercent)
      },
      status: {
        isApproachingLimit,
        isOverLimit,
        message: isOverLimit 
          ? 'You have exceeded your free tier limits. Charges will apply to additional usage.'
          : isApproachingLimit 
            ? 'You are approaching your free tier limits. Consider monitoring your usage.'
            : 'You are within your free tier limits.'
      },
      pricing: PRICING,
      recentUsage: usageData.slice(-7), // Last 7 days
      billingInfo: {
        freeTierActive: !isOverLimit,
        estimatedMonthlyCost: totalCost * 30, // Rough estimate
        nextBillingDate: 'N/A (Free Tier)',
        paymentMethod: 'Credit Card on file'
      }
    })
  } catch (error) {
    console.error('Error fetching usage data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch usage data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { model, tokensUsed, requestType = 'image-generation' } = await request.json()
    
    // Add new usage to today's data
    const today = new Date().toISOString().split('T')[0]
    const modelPricing = PRICING[model as keyof typeof PRICING] || PRICING['gemini-2.5-flash-image-preview']
    
    // Calculate cost
    const cost = modelPricing.paid.costPerRequest + (tokensUsed * modelPricing.paid.costPerToken)
    
    // Find or create today's usage record
    let todayUsage = usageData.find(day => day.date === today)
    if (!todayUsage) {
      todayUsage = {
        date: today,
        requests: 0,
        tokensUsed: 0,
        estimatedCost: 0
      }
      usageData.push(todayUsage)
    }
    
    // Update usage
    todayUsage.requests += 1
    todayUsage.tokensUsed += tokensUsed
    todayUsage.estimatedCost += cost
    
    return NextResponse.json({ 
      success: true, 
      updatedUsage: todayUsage,
      estimatedCost: cost
    })
  } catch (error) {
    console.error('Error updating usage data:', error)
    return NextResponse.json(
      { error: 'Failed to update usage data' },
      { status: 500 }
    )
  }
}
