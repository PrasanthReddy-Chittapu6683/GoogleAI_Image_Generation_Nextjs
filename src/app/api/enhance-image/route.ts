import { google } from '@ai-sdk/google'
import { generateText } from 'ai'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
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
    const enhancementType = formData.get('enhancementType') as string || 'auto'
    const model = formData.get('model') as string || 'gemini-2.5-flash-image-preview'

    if (!image) {
      return NextResponse.json(
        { error: 'Image is required' },
        { status: 400 }
      )
    }

    const validEnhancementTypes = [
      'auto',
      'upscale',
      'enhance_quality',
      'remove_noise',
      'improve_lighting',
      'enhance_colors',
      'sharpen'
    ]

    if (!validEnhancementTypes.includes(enhancementType)) {
      return NextResponse.json(
        { error: 'Invalid enhancement type' },
        { status: 400 }
      )
    }

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

    const imageBuffer = Buffer.from(await image.arrayBuffer())
    const base64 = imageBuffer.toString('base64')

    // Create enhancement prompts based on type
    const enhancementPrompts = {
      auto: "Analyze this image and automatically enhance it by improving brightness, contrast, colors, and sharpness. Make it look more professional and visually appealing while maintaining the original composition and style.",
      upscale: "Upscale this image to higher resolution while maintaining quality and sharpness. Enhance details and reduce pixelation. Make it suitable for high-resolution display.",
      enhance_quality: "Improve the overall quality of this image by enhancing sharpness, reducing noise, and improving clarity. Make it look more professional and crisp.",
      remove_noise: "Remove noise, grain, and artifacts from this image while preserving important details and textures. Clean up the image quality.",
      improve_lighting: "Improve the lighting in this image by adjusting brightness, contrast, and shadows. Make the image well-lit and balanced without overexposure or underexposure.",
      enhance_colors: "Enhance the colors in this image by improving saturation, vibrancy, and color balance. Make the colors more vivid and appealing while maintaining naturalness.",
      sharpen: "Sharpen this image to improve clarity and detail definition. Enhance edges and fine details while avoiding over-sharpening artifacts."
    }

    const prompt = enhancementPrompts[enhancementType as keyof typeof enhancementPrompts]

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

    // For now, return the original image with enhancement metadata
    // In a real implementation, you would process the result and return an enhanced image
    const enhancedImageUrl = `data:${image.type};base64,${base64}`

    return NextResponse.json({ 
      enhancedImage: enhancedImageUrl,
      enhancementType,
      model,
      message: result.text,
      error: null 
    })
  } catch (error) {
    console.error('Error enhancing image:', error)
    
    let errorMessage = 'Failed to enhance image'
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
        enhancedImage: null 
      },
      { status: 500 }
    )
  }
}
