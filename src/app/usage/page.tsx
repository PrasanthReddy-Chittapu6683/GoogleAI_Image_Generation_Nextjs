'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { 
  TrendingUp, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  BarChart3,
  CreditCard,
  Calendar,
  Zap,
  Brain
} from 'lucide-react'
import Link from 'next/link'

interface UsageData {
  currentUsage: {
    date: string
    requests: number
    tokensUsed: number
    estimatedCost: number
  }
  totalUsage: {
    requests: number
    tokens: number
    cost: number
  }
  freeTierLimits: {
    requestsPerDay: number
    tokensPerDay: number
  }
  usagePercentages: {
    requests: number
    tokens: number
  }
  status: {
    isApproachingLimit: boolean
    isOverLimit: boolean
    message: string
  }
  pricing: any
  recentUsage: any[]
  billingInfo: {
    freeTierActive: boolean
    estimatedMonthlyCost: number
    nextBillingDate: string
    paymentMethod: string
  }
}

export default function UsagePage() {
  const [usageData, setUsageData] = useState<UsageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsageData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/usage')
      if (!response.ok) {
        throw new Error('Failed to fetch usage data')
      }
      const data = await response.json()
      setUsageData(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsageData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Loading usage data...</span>
        </div>
      </div>
    )
  }

  if (error || !usageData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-500">Error Loading Usage Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchUsageData} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Usage & Billing Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your Google AI API usage and billing information
          </p>
        </div>

        {/* Status Alert */}
        <Card className={`mb-8 ${usageData.status.isOverLimit ? 'border-red-500 bg-red-50 dark:bg-red-950' : usageData.status.isApproachingLimit ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950' : 'border-green-500 bg-green-50 dark:bg-green-950'}`}>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              {usageData.status.isOverLimit ? (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              ) : usageData.status.isApproachingLimit ? (
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              <span className={`font-medium ${usageData.status.isOverLimit ? 'text-red-700 dark:text-red-300' : usageData.status.isApproachingLimit ? 'text-yellow-700 dark:text-yellow-300' : 'text-green-700 dark:text-green-300'}`}>
                {usageData.status.message}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Usage Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Requests</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usageData.currentUsage.requests}</div>
              <p className="text-xs text-muted-foreground">
                of {usageData.freeTierLimits.requestsPerDay} free requests
              </p>
              <Progress 
                value={usageData.usagePercentages.requests} 
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tokens Used Today</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usageData.currentUsage.tokensUsed.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                of {usageData.freeTierLimits.tokensPerDay.toLocaleString()} free tokens
              </p>
              <Progress 
                value={usageData.usagePercentages.tokens} 
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Cost</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${usageData.currentUsage.estimatedCost.toFixed(4)}
              </div>
              <p className="text-xs text-muted-foreground">
                {usageData.billingInfo.freeTierActive ? 'Free tier active' : 'Charges apply'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usageData.totalUsage.requests}</div>
              <p className="text-xs text-muted-foreground">
                Total cost: ${usageData.totalUsage.cost.toFixed(4)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Billing Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Billing Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method:</span>
                <span className="font-medium">{usageData.billingInfo.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Free Tier Status:</span>
                <span className={`font-medium ${usageData.billingInfo.freeTierActive ? 'text-green-600' : 'text-red-600'}`}>
                  {usageData.billingInfo.freeTierActive ? 'Active' : 'Exceeded'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Monthly Cost:</span>
                <span className="font-medium">
                  ${usageData.billingInfo.estimatedMonthlyCost.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Next Billing:</span>
                <span className="font-medium">{usageData.billingInfo.nextBillingDate}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Recent Usage</span>
              </CardTitle>
              <CardDescription>Last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {usageData.recentUsage.slice(-5).map((day, index) => (
                  <div key={day.date} className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {new Date(day.date).toLocaleDateString()}
                    </span>
                    <div className="flex space-x-4">
                      <span className="text-sm font-medium">{day.requests} requests</span>
                      <span className="text-sm text-muted-foreground">
                        ${day.estimatedCost.toFixed(4)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Information */}
        <Card>
          <CardHeader>
            <CardTitle>Google AI API Pricing</CardTitle>
            <CardDescription>
              Current pricing for Google AI models (estimated rates)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Model</th>
                    <th className="text-left py-2">Free Tier (Daily)</th>
                    <th className="text-left py-2">Cost per Request</th>
                    <th className="text-left py-2">Cost per Token</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(usageData.pricing).map(([model, pricing]: [string, any]) => (
                    <tr key={model} className="border-b">
                      <td className="py-2 font-medium">{model}</td>
                      <td className="py-2 text-sm text-muted-foreground">
                        {pricing.freeTier.requestsPerDay} requests, {pricing.freeTier.tokensPerDay.toLocaleString()} tokens
                      </td>
                      <td className="py-2">${pricing.paid.costPerRequest}</td>
                      <td className="py-2">${pricing.paid.costPerToken}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <Button onClick={fetchUsageData} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
          <Link href="/studio">
            <Button>
              <Brain className="mr-2 h-4 w-4" />
              Go to Studio
            </Button>
          </Link>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
