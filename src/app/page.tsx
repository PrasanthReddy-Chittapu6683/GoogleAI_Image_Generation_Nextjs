import Link from 'next/link'
import { GridPattern } from '@/components/backgrounds/grid'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function HomePage() {
  return (
    <div className="p-6 flex-1 flex flex-col">
      <section className="flex-1 flex items-center overflow-hidden relative">
        <GridPattern
          className={cn('[mask-image:radial-gradient(500px_circle_at_center,gray,transparent)] opacity-80 my-auto')}
        />
        <div className="container px-4 md:px-6 relative">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-5xl py-2 font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Image Editor Studio
            </h1>

            <Link href="/studio" className={buttonVariants({ variant: 'default', size: 'lg' })}>
              Go to Studio
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
