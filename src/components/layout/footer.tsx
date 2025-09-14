'use client'

import Link from 'next/link'
import { Brain, Github, Linkedin, ExternalLink } from 'lucide-react'

export function Footer() {
  return (
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
            <div className="flex flex-col space-y-2">
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
  )
}
