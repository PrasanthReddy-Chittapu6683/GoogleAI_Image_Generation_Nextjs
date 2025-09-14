'use client'

import Link from 'next/link'
import Image from 'next/image'
import { GridPattern } from '@/components/backgrounds/grid'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ArrowRight, Brain, ImageIcon, Palette, Zap, Github, Linkedin, ExternalLink } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link className="mr-6 flex items-center space-x-2" href="/">
              <Brain className="h-6 w-6" />
              <span className="hidden font-bold sm:inline-block">AI Image Studio</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <Button variant="ghost" className="md:hidden">
                <Brain className="h-6 w-6" />
              </Button>
            </div>
            <nav className="flex items-center">
              <Link href="/studio" className={buttonVariants({ variant: "default", size: "sm" })}>
                <span>Launch Studio</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex-1 flex items-center overflow-hidden">
        <GridPattern
          className={cn('[mask-image:radial-gradient(800px_circle_at_center,gray,transparent)] opacity-40')}
        />
        <div className="container px-4 md:px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500">
                AI Image Studio
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Transform your images with the power of Google's advanced AI models. 
                Generate stunning visuals with multiple AI models at your fingertips.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/studio" className={buttonVariants({ variant: "default", size: "lg", className: "text-lg px-8 py-6" })}>
                <ImageIcon className="mr-2 h-5 w-5" />
                Start Creating
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                <Brain className="mr-2 h-5 w-5" />
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">3+</div>
                <div className="text-sm text-muted-foreground">AI Models</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">∞</div>
                <div className="text-sm text-muted-foreground">Possibilities</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Free to Use</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of image generation with our cutting-edge AI technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Multiple AI Models</CardTitle>
                <CardDescription>
                  Choose from Google's latest AI models including Gemini 2.5 Flash (Banana Model), 
                  Gemini 1.5 Flash, and Gemini 1.5 Pro for different quality and speed requirements.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <ImageIcon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Image Upload & Processing</CardTitle>
                <CardDescription>
                  Upload your images and let our AI transform them according to your prompts. 
                  Support for various image formats with full-size display.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Lightning Fast</CardTitle>
                <CardDescription>
                  Generate stunning images in seconds with our optimized AI processing pipeline. 
                  Real-time preview and instant download capabilities.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Palette className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Creative Freedom</CardTitle>
                <CardDescription>
                  Express your creativity with natural language prompts. 
                  Describe any scene, style, or concept and watch it come to life.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <ArrowRight className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Easy Download</CardTitle>
                <CardDescription>
                  Download your generated images instantly. 
                  Optimized for all devices including iOS Safari and mobile browsers.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>History Tracking</CardTitle>
                <CardDescription>
                  Keep track of all your generated images with our built-in history feature. 
                  Access your creations anytime and download them again.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-4xl font-bold tracking-tight mb-4">Ready to Create?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start generating amazing images with AI today. No signup required, completely free to use.
          </p>
          <Link href="/studio" className={buttonVariants({ variant: "default", size: "lg", className: "text-lg px-8 py-6" })}>
            <ImageIcon className="mr-2 h-5 w-5" />
            Launch AI Studio
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container px-4 md:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-6 w-6 text-primary" />
                <span className="font-bold">AI Image Studio</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Transform your images with the power of Google's advanced AI models. 
                Create stunning visuals with multiple AI models at your fingertips.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Developer</h3>
              <p className="text-sm text-muted-foreground mb-2">Prasanth Reddy CV</p>
              <p className="text-sm text-muted-foreground">
                Technology specialist with 14+ years of experience in React, Next.js, 
                Angular, TypeScript, and AI/ML technologies.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <Link 
                  href="https://github.com/PrasanthReddy-Chittapu6683/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Link>
                <Link 
                  href="https://www.linkedin.com/in/prasanth-kumar-reddy-cv-385768b5" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Linkedin className="h-4 w-4 mr-2" />
                  LinkedIn
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Link>
                <Link 
                  href="https://cvpkr-portfolio.web.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Portfolio
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Link>
              </div>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 Prasanth Reddy CV. Built with Next.js, React, and Google AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
