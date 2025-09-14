'use client'

import { useState } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Loader2Icon } from 'lucide-react'

// In-memory storage for demo purposes
// In a real app, this would be stored in a database
let history: { id: string; base64: string }[] = []

export default function StudioPage() {
  const [preview, setPreview] = useState<string | null>(null)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
            {preview && <img src={preview} alt="Preview" className="mb-4 rounded-xl" />}
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <Input type="file" name="image" onChange={handleFileChange} accept="image/*" />
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
                <div>
                  <img src={generatedImage} alt="Generated image" className="mb-4 rounded-xl" />
                  <a
                    href={generatedImage}
                    download={`generated-image-${Date.now()}.png`}
                    className={buttonVariants({ variant: 'outline' })}
                  >
                    Download
                  </a>
                </div>
              ) : (
                <div>
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
                <img src={item.base64} alt="Generated image" />
              </CardHeader>
              <CardContent>
                <a
                  href={item.base64}
                  download={`generated-image-${Date.now()}.png`}
                  className={buttonVariants({ variant: 'outline' })}
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
