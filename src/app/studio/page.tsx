'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2Icon } from 'lucide-react'

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
      <h1 className="text-4xl font-bold mb-6">Studio</h1>

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
                  <a
                    href={generatedImage}
                    download={`generated-image-${Date.now()}.png`}
                    className={buttonVariants({ variant: 'outline' })}
                  >
                    Download
                  </a>
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
                <a
                  href={item.base64}
                  download={`generated-image-${Date.now()}.png`}
                  className={buttonVariants({ variant: 'outline', size: 'sm' })}
                >
                  Download
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
