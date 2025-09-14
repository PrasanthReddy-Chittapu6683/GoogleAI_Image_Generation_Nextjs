'use client'

import { useState, useRef, useCallback } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Upload, 
  Download, 
  Crop, 
  RotateCcw, 
  RotateCw, 
  FlipHorizontal, 
  FlipVertical,
  Palette,
  Image as ImageIcon,
  Settings,
  Wand2,
  FileImage,
  Save,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut
} from 'lucide-react'
import ImageEditor from '@/components/image-editor/image-editor'
import ImageCropper from '@/components/image-editor/image-cropper'
import { cn } from '@/lib/utils'

interface ImageState {
  original: string | null
  current: string | null
  width: number
  height: number
  format: string
}

interface EditorSettings {
  brightness: number
  contrast: number
  saturation: number
  hue: number
  blur: number
  sharpen: number
}

export default function ImageEditorPage() {
  const [imageState, setImageState] = useState<ImageState>({
    original: null,
    current: null,
    width: 0,
    height: 0,
    format: ''
  })
  
  const [settings, setSettings] = useState<EditorSettings>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hue: 0,
    blur: 0,
    sharpen: 0
  })

  const [activeTab, setActiveTab] = useState('upload')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showCropper, setShowCropper] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      const img = new window.Image()
      
      img.onload = () => {
        setImageState({
          original: result,
          current: result,
          width: img.width,
          height: img.height,
          format: file.type.split('/')[1].toUpperCase()
        })
      }
      
      img.src = result
    }
    
    reader.readAsDataURL(file)
  }, [])

  const handleDownload = useCallback(async () => {
    if (!imageState.current) return
    
    try {
      const link = document.createElement('a')
      link.href = imageState.current
      link.download = `edited-image-${Date.now()}.${imageState.format.toLowerCase()}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }, [imageState.current, imageState.format])

  const handleSettingsChange = useCallback((key: keyof EditorSettings, value: number) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }, [])

  const resetSettings = useCallback(() => {
    setSettings({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      hue: 0,
      blur: 0,
      sharpen: 0
    })
  }, [])

  const convertFormat = useCallback(async (newFormat: string) => {
    if (!imageState.current) return
    
    setIsProcessing(true)
    try {
      // Create canvas to convert format
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new window.Image()
      
      await new Promise((resolve) => {
        img.onload = () => {
          canvas.width = img.width
          canvas.height = img.height
          ctx?.drawImage(img, 0, 0)
          resolve(null)
        }
        img.src = imageState.current!
      })
      
      const newDataUrl = canvas.toDataURL(`image/${newFormat.toLowerCase()}`, 0.9)
      
      setImageState(prev => ({
        ...prev,
        current: newDataUrl,
        format: newFormat.toUpperCase()
      }))
    } catch (error) {
      console.error('Format conversion failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }, [imageState.current])

  const compressImage = useCallback(async (quality: number) => {
    if (!imageState.current) return
    
    setIsProcessing(true)
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new window.Image()
      
      await new Promise((resolve) => {
        img.onload = () => {
          canvas.width = img.width
          canvas.height = img.height
          ctx?.drawImage(img, 0, 0)
          resolve(null)
        }
        img.src = imageState.current!
      })
      
      const compressedDataUrl = canvas.toDataURL(`image/${imageState.format.toLowerCase()}`, quality / 100)
      
      setImageState(prev => ({
        ...prev,
        current: compressedDataUrl
      }))
    } catch (error) {
      console.error('Image compression failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }, [imageState.current, imageState.format])

  const handleCropComplete = useCallback((croppedImageUrl: string) => {
    setImageState(prev => ({
      ...prev,
      current: croppedImageUrl
    }))
    setShowCropper(false)
  }, [])

  const handleAIAutoEnhance = useCallback(async () => {
    if (!imageState.current) return
    
    setIsProcessing(true)
    try {
      // Convert data URL to file
      const response = await fetch(imageState.current)
      const blob = await response.blob()
      const file = new File([blob], 'image.png', { type: blob.type })
      
      const formData = new FormData()
      formData.append('image', file)
      formData.append('enhancementType', 'auto')
      formData.append('model', 'gemini-2.5-flash-image-preview')
      
      const enhanceResponse = await fetch('/api/enhance-image', {
        method: 'POST',
        body: formData
      })
      
      const result = await enhanceResponse.json()
      
      if (result.enhancedImage) {
        setImageState(prev => ({
          ...prev,
          current: result.enhancedImage
        }))
      }
    } catch (error) {
      console.error('AI enhancement failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }, [imageState.current])

  const handleRotateLeft = useCallback(() => {
    if (!imageState.current) return
    
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new window.Image()
    
    img.onload = () => {
      canvas.width = img.height
      canvas.height = img.width
      ctx?.translate(canvas.width, 0)
      ctx?.rotate(Math.PI / 2)
      ctx?.drawImage(img, 0, 0)
      
      const rotatedDataUrl = canvas.toDataURL()
      setImageState(prev => ({
        ...prev,
        current: rotatedDataUrl,
        width: img.height,
        height: img.width
      }))
    }
    
    img.src = imageState.current
  }, [imageState.current])

  const handleRotateRight = useCallback(() => {
    if (!imageState.current) return
    
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new window.Image()
    
    img.onload = () => {
      canvas.width = img.height
      canvas.height = img.width
      ctx?.translate(0, canvas.height)
      ctx?.rotate(-Math.PI / 2)
      ctx?.drawImage(img, 0, 0)
      
      const rotatedDataUrl = canvas.toDataURL()
      setImageState(prev => ({
        ...prev,
        current: rotatedDataUrl,
        width: img.height,
        height: img.width
      }))
    }
    
    img.src = imageState.current
  }, [imageState.current])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex overflow-hidden">
        {/* Left Drawer - 30% */}
        <div className="w-[30%] min-w-[300px] border-r bg-background overflow-y-auto">
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <ImageIcon className="mr-2 h-6 w-6" />
              Image Editor
            </h2>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="edit">Edit</TabsTrigger>
                <TabsTrigger value="export">Export</TabsTrigger>
              </TabsList>
              
              {/* Upload Tab */}
              <TabsContent value="upload" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Image
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-sm text-muted-foreground mb-4">
                        Drag and drop an image here, or click to browse
                      </p>
                      <Button 
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        className="w-full"
                      >
                        Choose File
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>
                    
                    {imageState.current && (
                      <div className="space-y-2">
                        <Label>Image Info</Label>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Format: {imageState.format}</p>
                          <p>Dimensions: {imageState.width} × {imageState.height}</p>
                          <p>Size: {Math.round(imageState.current.length * 0.75 / 1024)} KB</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Edit Tab */}
              <TabsContent value="edit" className="mt-4">
                <div className="space-y-4">
                  {/* Basic Tools */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Basic Tools
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleRotateLeft}
                          disabled={!imageState.current}
                        >
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Rotate Left
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleRotateRight}
                          disabled={!imageState.current}
                        >
                          <RotateCw className="mr-2 h-4 w-4" />
                          Rotate Right
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setShowCropper(true)}
                          disabled={!imageState.current}
                        >
                          <Crop className="mr-2 h-4 w-4" />
                          Crop Image
                        </Button>
                        <Button variant="outline" size="sm">
                          <FlipHorizontal className="mr-2 h-4 w-4" />
                          Flip H
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm">
                          <ZoomIn className="mr-2 h-4 w-4" />
                          Zoom In
                        </Button>
                        <Button variant="outline" size="sm">
                          <ZoomOut className="mr-2 h-4 w-4" />
                          Zoom Out
                        </Button>
                        <Button variant="outline" size="sm">
                          <Undo className="mr-2 h-4 w-4" />
                          Undo
                        </Button>
                        <Button variant="outline" size="sm">
                          <Redo className="mr-2 h-4 w-4" />
                          Redo
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Color Adjustments */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Palette className="mr-2 h-4 w-4" />
                        Color Adjustments
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Brightness: {settings.brightness}%</Label>
                        <Slider
                          value={[settings.brightness]}
                          onValueChange={(value) => handleSettingsChange('brightness', value[0])}
                          max={200}
                          min={0}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                      
                      <div>
                        <Label>Contrast: {settings.contrast}%</Label>
                        <Slider
                          value={[settings.contrast]}
                          onValueChange={(value) => handleSettingsChange('contrast', value[0])}
                          max={200}
                          min={0}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                      
                      <div>
                        <Label>Saturation: {settings.saturation}%</Label>
                        <Slider
                          value={[settings.saturation]}
                          onValueChange={(value) => handleSettingsChange('saturation', value[0])}
                          max={200}
                          min={0}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                      
                      <div>
                        <Label>Hue: {settings.hue}°</Label>
                        <Slider
                          value={[settings.hue]}
                          onValueChange={(value) => handleSettingsChange('hue', value[0])}
                          max={180}
                          min={-180}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                      
                      <Button 
                        onClick={resetSettings} 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                      >
                        Reset All
                      </Button>
                    </CardContent>
                  </Card>
                  
                  {/* AI Enhancement */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Wand2 className="mr-2 h-4 w-4" />
                        AI Enhancement
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        disabled={!imageState.current || isProcessing}
                        onClick={handleAIAutoEnhance}
                      >
                        <Wand2 className="mr-2 h-4 w-4" />
                        {isProcessing ? 'Enhancing...' : 'Auto Enhance'}
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full"
                        disabled={!imageState.current || isProcessing}
                      >
                        <FileImage className="mr-2 h-4 w-4" />
                        Upscale Image
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full"
                        disabled={!imageState.current || isProcessing}
                      >
                        <Crop className="mr-2 h-4 w-4" />
                        Auto Crop
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* Export Tab */}
              <TabsContent value="export" className="mt-4">
                <div className="space-y-4">
                  {/* File Format Conversion */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <FileImage className="mr-2 h-4 w-4" />
                        Format Conversion
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label>Convert to:</Label>
                        <Select onValueChange={convertFormat}>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="jpeg">JPEG</SelectItem>
                            <SelectItem value="png">PNG</SelectItem>
                            <SelectItem value="webp">WebP</SelectItem>
                            <SelectItem value="gif">GIF</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Compression */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Compression</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Quality: {settings.contrast}%</Label>
                        <Slider
                          value={[settings.contrast]}
                          onValueChange={(value) => compressImage(value[0])}
                          max={100}
                          min={10}
                          step={5}
                          className="mt-2"
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Download */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        onClick={handleDownload}
                        className="w-full"
                        disabled={!imageState.current}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Download Image
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Right Canvas Area - 70% */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Canvas</h3>
              <div className="flex items-center space-x-2">
                {imageState.current && (
                  <>
                    <span className="text-sm text-muted-foreground">
                      {imageState.width} × {imageState.height}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {imageState.format}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-center p-8 bg-muted/20">
            {imageState.current ? (
              <ImageEditor 
                imageSrc={imageState.current}
                settings={settings}
                onImageChange={(newImageSrc) => {
                  setImageState(prev => ({
                    ...prev,
                    current: newImageSrc
                  }))
                }}
              />
            ) : (
              <div className="text-center text-muted-foreground">
                <ImageIcon className="mx-auto h-24 w-24 mb-4 opacity-50" />
                <p className="text-xl mb-2">No image loaded</p>
                <p className="text-sm">Upload an image to start editing</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Image Cropper Modal */}
      {showCropper && imageState.current && (
        <ImageCropper
          imageSrc={imageState.current}
          onCropComplete={handleCropComplete}
          onCancel={() => setShowCropper(false)}
        />
      )}
    </div>
  )
}
