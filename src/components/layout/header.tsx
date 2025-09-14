'use client'

import Link from 'next/link'
import { Brain } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button, buttonVariants } from '@/components/ui/button'

interface HeaderProps {
  showCta?: boolean
}

export function Header({ showCta = true }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <Brain className="h-6 w-6" />
            <span className="font-bold">AI Image Studio</span>
          </Link>
          <nav className="flex items-center space-x-4 text-sm font-medium">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              Home
            </Link>
            <Link href="/studio" className="text-muted-foreground hover:text-foreground">
              Studio
            </Link>
            <Link href="/usage" className="text-muted-foreground hover:text-foreground">
              Usage & Billing
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <ThemeToggle />
          {showCta && (
            <Link href="/studio" className={buttonVariants({ variant: "default", size: "sm" })}>
              <span>Launch Studio</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
