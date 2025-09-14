import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Image Editor Studio',
  description: 'AI-powered photo editing application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="antialiased min-h-screen h-screen" style={{ colorScheme: 'dark' }} data-theme={'dark'}>
      <body className={`${inter.className} min-h-screen h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  )
}
