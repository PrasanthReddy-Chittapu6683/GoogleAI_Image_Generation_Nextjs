'use client'

import React, { useState, useRef, useCallback } from 'react'
import ReactCrop, { 
  centerCrop, 
  makeAspectCrop, 
  Crop, 
  PixelCrop,
  convertToPixelCrop
} from 'react-image-crop'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Crop as CropIcon, RotateCcw } from 'lucide-react'
import 'react-image-crop/dist/ReactCrop.css'

interface ImageCropperProps {
  imageSrc: string
  onCropComplete: (croppedImageUrl: string) => void
  onCancel: () => void
}

const ASPECT_RATIOS = [
  { value: 'free', label: 'Free' },
  { value: '1:1', label: '1:1 (Square)' },
  { value: '4:3', label: '4:3 (Standard)' },
  { value: '16:9', label: '16:9 (Widescreen)' },
  { value: '3:2', label: '3:2 (Photo)' },
  { value: '2:3', label: '2:3 (Portrait)' }
]

export default function ImageCropper({ imageSrc, onCropComplete, onCancel }: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [aspectRatio, setAspectRatio] = useState<string>('free')
  const [isProcessing, setIsProcessing] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    const aspect = aspectRatio === 'free' ? undefined : parseFloat(aspectRatio)
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        aspect || 1,
        width,
        height
      ),
      width,
      height
    )
    setCrop(crop)
  }, [aspectRatio])

  const onCropChange = useCallback((crop: Crop) => {
    setCrop(crop)
  }, [])

  const onCropCompleteCallback = useCallback((crop: PixelCrop) => {
    setCompletedCrop(crop)
  }, [])

  const getCroppedImg = useCallback((
    image: HTMLImageElement,
    crop: PixelCrop,
    fileName = 'cropped-image'
  ): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        resolve('')
        return
      }

      const scaleX = image.naturalWidth / image.width
      const scaleY = image.naturalHeight / image.height

      canvas.width = crop.width
      canvas.height = crop.height

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      )

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            resolve(url)
          } else {
            resolve('')
          }
        },
        'image/png',
        1
      )
    })
  }, [])

  const handleCrop = useCallback(async () => {
    if (!imgRef.current || !completedCrop) return

    setIsProcessing(true)
    try {
      const croppedImageUrl = await getCroppedImg(imgRef.current, completedCrop)
      if (croppedImageUrl) {
        onCropComplete(croppedImageUrl)
      }
    } catch (error) {
      console.error('Crop failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }, [completedCrop, getCroppedImg, onCropComplete])

  const resetCrop = useCallback(() => {
    setCrop(undefined)
    setCompletedCrop(undefined)
    if (imgRef.current) {
      onImageLoad({ currentTarget: imgRef.current } as any)
    }
  }, [onImageLoad])

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <CropIcon className="mr-2 h-5 w-5" />
              Crop Image
            </div>
            <div className="flex items-center space-x-2">
              <Label>Aspect Ratio:</Label>
              <Select value={aspectRatio} onValueChange={setAspectRatio}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ASPECT_RATIOS.map((ratio) => (
                    <SelectItem key={ratio.value} value={ratio.value}>
                      {ratio.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative max-h-[60vh] overflow-auto">
            <ReactCrop
              crop={crop}
              onChange={onCropChange}
              onComplete={onCropCompleteCallback}
              aspect={aspectRatio === 'free' ? undefined : parseFloat(aspectRatio)}
              className="max-w-full"
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={imageSrc}
                onLoad={onImageLoad}
                className="max-w-full h-auto"
              />
            </ReactCrop>
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t">
            <Button variant="outline" onClick={resetCrop}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button 
                onClick={handleCrop} 
                disabled={!completedCrop || isProcessing}
              >
                <CropIcon className="mr-2 h-4 w-4" />
                {isProcessing ? 'Processing...' : 'Apply Crop'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
