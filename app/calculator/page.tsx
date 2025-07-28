'use client'

import { WebsiteCalculator } from '@/components/ui/website-calculator'
import { Navigation } from '@/components/ui/navigation'
import { FloatingElements } from '@/components/ui/floating-elements'

export default function CalculatorPage() {
  return (
    <div className="min-h-screen relative">
      <Navigation />
      <FloatingElements />
      
      <div className="pt-20">
        <WebsiteCalculator />
      </div>
    </div>
  )
} 