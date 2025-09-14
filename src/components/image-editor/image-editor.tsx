'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Stage, Layer, Image as KonvaImage } from 'react-konva'
import { useImage } from 'react-konva-utils'
import { cn } from '@/lib/utils'

interface EditorSettings {
  brightness: number
  contrast: number
  saturation: number
  hue: number
  blur: number
  sharpen: number
}

interface ImageEditorProps {
  imageSrc: string
  settings: EditorSettings
  onImageChange: (newImageSrc: string) => void
}

export default function ImageEditor({ imageSrc, settings, onImageChange }: ImageEditorProps) {
  const stageRef = useRef<any>(null)
  const [image] = useImage(imageSrc)
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 })
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  // Calculate canvas size based on container
  useEffect(() => {
    const updateSize = () => {
      const container = stageRef.current?.container()?.parentElement
      if (container) {
        const containerWidth = container.clientWidth - 32 // padding
        const containerHeight = container.clientHeight - 32 // padding
        
        setStageSize({
          width: Math.max(400, containerWidth),
          height: Math.max(300, containerHeight)
        })
      }
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  // Calculate image scale and position
  useEffect(() => {
    if (image) {
      const { width: imgWidth, height: imgHeight } = image
      setImageSize({ width: imgWidth, height: imgHeight })

      // Calculate scale to fit image in stage while maintaining aspect ratio
      const scaleX = stageSize.width / imgWidth
      const scaleY = stageSize.height / imgHeight
      const newScale = Math.min(scaleX, scaleY, 1) // Don't scale up beyond original size

      setScale(newScale)

      // Center the image
      const scaledWidth = imgWidth * newScale
      const scaledHeight = imgHeight * newScale
      setPosition({
        x: (stageSize.width - scaledWidth) / 2,
        y: (stageSize.height - scaledHeight) / 2
      })
    }
  }, [image, stageSize])

  // Apply filters based on settings
  const getFilters = useCallback(() => {
    const filters: string[] = []
    
    if (settings.brightness !== 100) {
      filters.push(`brightness(${settings.brightness}%)`)
    }
    
    if (settings.contrast !== 100) {
      filters.push(`contrast(${settings.contrast}%)`)
    }
    
    if (settings.saturation !== 100) {
      filters.push(`saturate(${settings.saturation}%)`)
    }
    
    if (settings.hue !== 0) {
      filters.push(`hue-rotate(${settings.hue}deg)`)
    }
    
    if (settings.blur > 0) {
      filters.push(`blur(${settings.blur}px)`)
    }
    
    return filters.join(' ')
  }, [settings])

  const handleWheel = useCallback((e: any) => {
    e.evt.preventDefault()
    
    const scaleBy = 1.1
    const stage = e.target.getStage()
    const oldScale = stage.scaleX()
    const pointer = stage.getPointerPosition()
    
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    }
    
    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy
    
    // Limit scale
    const clampedScale = Math.max(0.1, Math.min(3, newScale))
    
    stage.scale({ x: clampedScale, y: clampedScale })
    
    const newPos = {
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    }
    
    stage.position(newPos)
    stage.batchDraw()
  }, [])

  const handleDragEnd = useCallback((e: any) => {
    const stage = e.target.getStage()
    setPosition(stage.position())
  }, [])

  const exportImage = useCallback(() => {
    if (stageRef.current) {
      const dataURL = stageRef.current.toDataURL({
        mimeType: 'image/png',
        quality: 1,
        pixelRatio: 2
      })
      onImageChange(dataURL)
    }
  }, [onImageChange])

  // Export image when settings change
  useEffect(() => {
    if (image) {
      const timer = setTimeout(exportImage, 300) // Debounce
      return () => clearTimeout(timer)
    }
  }, [settings, image, exportImage])

  if (!image) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-muted-foreground">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading image...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div 
        className="border border-border rounded-lg overflow-hidden shadow-lg"
        style={{
          width: stageSize.width,
          height: stageSize.height,
          maxWidth: '100%',
          maxHeight: '100%'
        }}
      >
        <Stage
          ref={stageRef}
          width={stageSize.width}
          height={stageSize.height}
          draggable
          onWheel={handleWheel}
          onDragEnd={handleDragEnd}
          scaleX={scale}
          scaleY={scale}
          x={position.x}
          y={position.y}
        >
          <Layer>
            <KonvaImage
              image={image}
              width={imageSize.width}
              height={imageSize.height}
              filters={[]}
            />
          </Layer>
        </Stage>
        
        {/* CSS Filters Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            filter: getFilters(),
            mixBlendMode: 'normal'
          }}
        />
      </div>
    </div>
  )
}
