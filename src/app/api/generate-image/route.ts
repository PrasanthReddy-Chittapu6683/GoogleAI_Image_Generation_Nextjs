import { google } from '@ai-sdk/google'
import { generateText } from 'ai'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File
    const prompt = formData.get('prompt') as string

    if (!image || !prompt) {
      return NextResponse.json(
        { error: 'Image and prompt are required' },
        { status: 400 }
      )
    }

    // Convert image to base64
    const imageBuffer = Buffer.from(await image.arrayBuffer())
    const base64 = imageBuffer.toString('base64')

    // Generate image using Google Gemini
    const result = await generateText({
      model: google('gemini-2.5-flash-image-preview'),
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

    return NextResponse.json({ 
      generatedImage: generatedImageUrl,
      error: null 
    })
  } catch (error) {
    console.error('Error generating image:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate image',
        generatedImage: null 
      },
      { status: 500 }
    )
  }
}
