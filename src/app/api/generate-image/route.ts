import { google } from '@ai-sdk/google'
import { generateText } from 'ai'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Check if API key is available
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    if (!apiKey) {
      console.error('GOOGLE_GENERATIVE_AI_API_KEY environment variable is not set')
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const image = formData.get('image') as File
    const prompt = formData.get('prompt') as string
    const model = formData.get('model') as string || 'gemini-2.5-flash-image-preview' // Default to Banana model

    if (!image || !prompt) {
      return NextResponse.json(
        { error: 'Image and prompt are required' },
        { status: 400 }
      )
    }

    // Validate model selection
    const validModels = [
      'gemini-2.5-flash-image-preview',
      'gemini-1.5-flash',
      'gemini-1.5-pro'
    ]
    
    if (!validModels.includes(model)) {
      return NextResponse.json(
        { error: 'Invalid model selected' },
        { status: 400 }
      )
    }

    // Convert image to base64
    const imageBuffer = Buffer.from(await image.arrayBuffer())
    const base64 = imageBuffer.toString('base64')

    // Generate image using selected Google Gemini model
    const result = await generateText({
      model: google(model),
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image', image: base64 }
          ]
        }
      ]
    })

    // Extract generated image from response
    const generatedImageUrl = `data:${image.type};base64,${result.files[0].base64}`

    // Track usage (estimate tokens based on prompt length)
    const estimatedTokens = Math.max(100, prompt.length * 1.5) // Rough estimation
    try {
      await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/usage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          tokensUsed: estimatedTokens,
          requestType: 'image-generation'
        })
      })
    } catch (usageError) {
      console.error('Failed to track usage:', usageError)
      // Don't fail the request if usage tracking fails
    }

    return NextResponse.json({ 
      generatedImage: generatedImageUrl,
      error: null 
    })
  } catch (error) {
    console.error('Error generating image:', error)
    
    // Provide more specific error messages
    let errorMessage = 'Failed to generate image'
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        errorMessage = 'Invalid API key or API key not set'
      } else if (error.message.includes('quota')) {
        errorMessage = 'API quota exceeded'
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error - please try again'
      } else {
        errorMessage = `Error: ${error.message}`
      }
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        generatedImage: null 
      },
      { status: 500 }
    )
  }
}
