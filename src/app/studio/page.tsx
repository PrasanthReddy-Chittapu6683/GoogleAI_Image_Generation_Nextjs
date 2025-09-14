'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2Icon } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

// In-memory storage for demo purposes
// In a real app, this would be stored in a database
let history: { id: string; base64: string }[] = []

// Available Google AI models for image generation
const AI_MODELS = [
  { value: 'gemini-2.5-flash-image-preview', label: 'Gemini 2.5 Flash (Banana Model)', description: 'Latest model with enhanced image generation' },
  { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash', description: 'Fast and efficient image generation' },
  { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro', description: 'High-quality image generation with advanced capabilities' }
]

export default function StudioPage() {
  const [preview, setPreview] = useState<string | null>(null)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState<string>('gemini-2.5-flash-image-preview') // Default to Banana model

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (preview) {
      URL.revokeObjectURL(preview)
    }

    if (file) {
      setPreview(URL.createObjectURL(file))
    }
  }

  const downloadImage = (imageUrl: string, filename: string) => {
    try {
      // Convert data URL to blob for better mobile support
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new window.Image()
      
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx?.drawImage(img, 0, 0)
        
        canvas.toBlob((blob) => {
          if (blob) {
            const blobUrl = URL.createObjectURL(blob)
            
            // Create a temporary anchor element
            const link = document.createElement('a')
            link.href = blobUrl
            link.download = filename
            
            // For mobile devices, try to trigger download
            if (navigator.userAgent.match(/iPhone|iPad|iPod|Android/i)) {
              // On mobile, open the blob URL
              window.open(blobUrl, '_blank')
              // Also try to trigger download
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            } else {
              // Desktop browsers
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            }
            
            // Clean up the blob URL after a delay
            setTimeout(() => URL.revokeObjectURL(blobUrl), 1000)
          }
        }, 'image/png')
      }
      
      img.src = imageUrl
    } catch (error) {
      console.error('Download failed:', error)
      // Fallback: open in new tab
      window.open(imageUrl, '_blank')
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsGenerating(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const image = formData.get('image') as File
    const prompt = formData.get('prompt') as string

    if (!image || !prompt) {
      setError('Image and prompt are required')
      setIsGenerating(false)
      return
    }

    // Add selected model to form data
    formData.append('model', selectedModel)

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to generate image')
      }

      const data = await response.json()
      setGeneratedImage(data.generatedImage)
      
      // Add to history
      const newItem = { id: crypto.randomUUID(), base64: data.generatedImage }
      history.push(newItem)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="p-6 flex-1 flex flex-col max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-4xl font-bold">Studio</h1>
          <Link href="/usage" className="text-sm text-muted-foreground hover:text-foreground underline">
            View Usage & Billing
          </Link>
        </div>
        <ThemeToggle />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Image upload</CardTitle>
          </CardHeader>
          <CardContent>
            {preview && (
              <div className="mb-4">
                <Image
                  src={preview}
                  alt="Preview"
                  width={500}
                  height={400}
                  className="rounded-xl w-full h-auto"
                  unoptimized
                />
              </div>
            )}
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <Input type="file" name="image" onChange={handleFileChange} accept="image/*" />
              
              <div className="mt-4">
                <label className="text-sm font-medium mb-2 block">AI Model</label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an AI model" />
                  </SelectTrigger>
                  <SelectContent>
                    {AI_MODELS.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        <div>
                          <div className="font-medium">{model.label}</div>
                          <div className="text-xs text-muted-foreground">{model.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Textarea name="prompt" className="mt-2" placeholder="Describe what you want to generate..." />
              <Button type="submit" className="mt-4 w-full" disabled={isGenerating}>
                {isGenerating ? 'Generating...' : 'Generate'}
              </Button>
            </form>
            {error && <p className="text-destructive text-sm mt-2">{error}</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>AI generated image</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col flex-1">
            <div className="p-4 border rounded-xl flex-1 flex items-center justify-center">
              {generatedImage ? (
                <div className="text-center">
                  <div className="mb-4">
                    <Image
                      src={generatedImage}
                      alt="Generated image"
                      width={500}
                      height={400}
                      className="rounded-xl w-full h-auto max-w-full"
                      unoptimized
                    />
                  </div>
                  <Button
                    onClick={() => downloadImage(generatedImage, `generated-image-${Date.now()}.png`)}
                    variant="outline"
                  >
                    Download
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64">
                  {isGenerating ? <Loader2Icon className="animate-spin" /> : 'No image generated yet'}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      {history.length > 0 && (
        <div className="mt-6 p-4 border rounded-xl grid grid-cols-2 md:grid-cols-5 gap-4">
          {history.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="w-full">
                  <Image
                    src={item.base64}
                    alt="Generated image"
                    width={200}
                    height={200}
                    className="w-full h-auto rounded object-contain"
                    unoptimized
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => downloadImage(item.base64, `generated-image-${Date.now()}.png`)}
                  variant="outline"
                  size="sm"
                >
                  Download
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
