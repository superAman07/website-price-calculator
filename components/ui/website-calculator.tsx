'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { 
  Calculator, 
  Globe, 
  ChevronDown,
  Check,
  User,
  Mail,
  Phone,
  Send
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface WebsiteType {
  id: string
  name: string
  basePriceRange: { min: number; max: number }
  pricePerPage: { min: number; max: number }
}

interface PageRange {
  id: string
  name: string
  minPages: number
  maxPages: number
}

interface Feature {
  id: string
  name: string
  price: number
}

const websiteTypes: WebsiteType[] = [
  {
    id: 'brochure',
    name: 'Brochure & Portfolio Website',
    basePriceRange: { min: 1500, max: 2500 },
    pricePerPage: { min: 200, max: 350 }
  },
  {
    id: 'business',
    name: 'Business Website',
    basePriceRange: { min: 2500, max: 4000 },
    pricePerPage: { min: 300, max: 500 }
  },
  {
    id: 'ecommerce',
    name: 'E-commerce Website',
    basePriceRange: { min: 4000, max: 8000 },
    pricePerPage: { min: 400, max: 700 }
  },
  {
    id: 'blog',
    name: 'Blog & Content Website',
    basePriceRange: { min: 2000, max: 3500 },
    pricePerPage: { min: 250, max: 400 }
  },
  {
    id: 'custom',
    name: 'Custom Web Application',
    basePriceRange: { min: 8000, max: 15000 },
    pricePerPage: { min: 600, max: 1000 }
  }
]

const pageRanges: PageRange[] = [
  { id: '1-5', name: '1-5 Pages', minPages: 1, maxPages: 5 },
  { id: '6-10', name: '6-10 Pages', minPages: 6, maxPages: 10 },
  { id: '11-20', name: '11-20 Pages', minPages: 11, maxPages: 20 },
  { id: '21-50', name: '21-50 Pages', minPages: 21, maxPages: 50 },
  { id: '50+', name: '50+ Pages', minPages: 51, maxPages: 100 }
]

const seoOptions = [
  { id: 'yes', name: 'Yes' },
  { id: 'no', name: 'No' }
]

const additionalFeatures: Feature[] = [
  { id: 'crm', name: 'CRM Integration', price: 800 },
  { id: 'forms', name: 'Custom Forms', price: 300 },
  { id: 'cart', name: 'Cart Upsell (eCommerce Only)', price: 500 },
  { id: 'chat', name: 'Live Chat', price: 200 },
  { id: 'inventory', name: 'Inventory Management', price: 600 },
  { id: 'booking', name: 'Booking System', price: 400 },
  { id: 'lms', name: 'LMS (Learning Management System)', price: 1200 },
  { id: 'reviews', name: 'Review Systems', price: 250 }
]

export function WebsiteCalculator() {
  const [selectedWebsiteType, setSelectedWebsiteType] = useState('brochure')
  const [selectedPageRange, setSelectedPageRange] = useState('6-10')
  const [selectedSEO, setSelectedSEO] = useState('yes')
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [showQuoteForm, setShowQuoteForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })

  const currentWebsiteType = websiteTypes.find(type => type.id === selectedWebsiteType)!
  const currentPageRange = pageRanges.find(range => range.id === selectedPageRange)!
  const avgPages = (currentPageRange.minPages + currentPageRange.maxPages) / 2

  const calculatePriceRange = () => {
    const baseMin = currentWebsiteType.basePriceRange.min
    const baseMax = currentWebsiteType.basePriceRange.max
    const pageMin = currentWebsiteType.pricePerPage.min * avgPages
    const pageMax = currentWebsiteType.pricePerPage.max * avgPages
    
    const seoCost = selectedSEO === 'yes' ? 500 : 0
    const featuresCost = selectedFeatures.reduce((total, featureId) => {
      const feature = additionalFeatures.find(f => f.id === featureId)
      return total + (feature?.price || 0)
    }, 0)

    return {
      min: baseMin + pageMin + seoCost + featuresCost,
      max: baseMax + pageMax + seoCost + featuresCost
    }
  }

  const priceRange = calculatePriceRange()

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    )
  }

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const createPayload = () => {
    const selectedFeaturesData = selectedFeatures.map(featureId => {
      const feature = additionalFeatures.find(f => f.id === featureId)!
      return {
        id: feature.id,
        name: feature.name,
        price: feature.price
      }
    })

    return {
      websiteType: {
        id: selectedWebsiteType,
        name: currentWebsiteType.name,
        basePriceRange: currentWebsiteType.basePriceRange,
        pricePerPage: currentWebsiteType.pricePerPage
      },
      pageRange: {
        id: selectedPageRange,
        name: currentPageRange.name,
        minPages: currentPageRange.minPages,
        maxPages: currentPageRange.maxPages,
        avgPages: avgPages
      },
      seo: {
        required: selectedSEO === 'yes',
        cost: selectedSEO === 'yes' ? 500 : 0
      },
      additionalFeatures: selectedFeaturesData,
      priceRange: priceRange,
      contactInfo: formData,
      timestamp: new Date().toISOString(),
      totalFeaturesCost: selectedFeaturesData.reduce((total, feature) => total + feature.price, 0)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = createPayload()
    console.log('API Payload:', payload)
    
    // Here you can integrate with your API
    // Example: fetch('/api/quote', { method: 'POST', body: JSON.stringify(payload) })
    
    // For now, just log the payload
    alert('Quote request submitted! Check console for payload.')
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <Calculator className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold">
            Web Design <span className="gradient-text">Cost Calculator</span>
          </h1>
        </div>
        <p className="text-sm text-gray-600 max-w-lg mx-auto">
          Get an instant quote for your website project. Customize your requirements and see real-time pricing.
        </p>
      </motion.div>

      <div className="glass-effect rounded-lg p-6">
        {/* Calculator Form */}
        <div className="space-y-4">
          {/* Website Type */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <label className="block text-sm font-medium mb-2 text-gray-700">Type of Website</label>
            <div className="relative">
              <select
                value={selectedWebsiteType}
                onChange={(e) => setSelectedWebsiteType(e.target.value)}
                className="w-full p-3 bg-white border border-gray-300 rounded-md text-gray-900 appearance-none cursor-pointer focus:border-blue-500 focus:outline-none transition-colors text-sm"
              >
                {websiteTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
            </div>
          </motion.div>

          {/* Page Quantity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <label className="block text-sm font-medium mb-2 text-gray-700">Page Quantity</label>
            <div className="relative">
              <select
                value={selectedPageRange}
                onChange={(e) => setSelectedPageRange(e.target.value)}
                className="w-full p-3 bg-white border border-gray-300 rounded-md text-gray-900 appearance-none cursor-pointer focus:border-blue-500 focus:outline-none transition-colors text-sm"
              >
                {pageRanges.map((range) => (
                  <option key={range.id} value={range.id}>
                    {range.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
            </div>
          </motion.div>

          {/* SEO Required */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <label className="block text-sm font-medium mb-2 text-gray-700">SEO Required?</label>
            <div className="relative">
              <select
                value={selectedSEO}
                onChange={(e) => setSelectedSEO(e.target.value)}
                className="w-full p-3 bg-white border border-gray-300 rounded-md text-gray-900 appearance-none cursor-pointer focus:border-blue-500 focus:outline-none transition-colors text-sm"
              >
                {seoOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
            </div>
          </motion.div>

          {/* Price Display */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center py-4 border-t border-gray-200"
          >
            <div className="text-lg font-bold mb-1">
              Pricing From{' '}
              <span className="text-gray-900">${priceRange.min.toLocaleString()}</span>{' '}
              to{' '}
              <span className="text-orange-600">${priceRange.max.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500">
              Based on {currentPageRange.name} for {currentWebsiteType.name}
            </p>
            {selectedFeatures.length > 0 && (
              <p className="text-xs text-blue-600 mt-1">
                Includes {selectedFeatures.length} additional feature{selectedFeatures.length !== 1 ? 's' : ''}
              </p>
            )}
          </motion.div>

          {/* Quote Request */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="border-t border-gray-200 pt-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <input
                type="checkbox"
                id="quote-request"
                checked={showQuoteForm}
                onChange={(e) => setShowQuoteForm(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="quote-request" className="text-sm font-medium cursor-pointer text-gray-700">
                Looking for a web design quote?
              </label>
            </div>
            <p className="text-xs text-gray-500 ml-7">
              Yes, please tailor me a web design quote based on my requirements
            </p>
          </motion.div>

          {/* Expandable Quote Form */}
          <AnimatePresence>
            {showQuoteForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="border-t border-gray-200 pt-4"
              >
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Contact Information */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        First & Last Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => handleFormChange('name', e.target.value)}
                          className="w-full p-3 pl-10 bg-white border border-gray-300 rounded-md text-gray-900 focus:border-blue-500 focus:outline-none transition-colors text-sm"
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleFormChange('email', e.target.value)}
                          className="w-full p-3 pl-10 bg-white border border-gray-300 rounded-md text-gray-900 focus:border-blue-500 focus:outline-none transition-colors text-sm"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => handleFormChange('phone', e.target.value)}
                          className="w-full p-3 pl-10 bg-white border border-gray-300 rounded-md text-gray-900 focus:border-blue-500 focus:outline-none transition-colors text-sm"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Features */}
                  <div>
                    <label className="block text-sm font-medium mb-3 text-gray-700">Additional Website Features</label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {additionalFeatures.map((feature, index) => (
                        <motion.div
                          key={feature.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.6 + index * 0.02 }}
                          className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => toggleFeature(feature.id)}
                        >
                          <input
                            type="checkbox"
                            checked={selectedFeatures.includes(feature.id)}
                            onChange={() => toggleFeature(feature.id)}
                            className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          <span className="text-sm text-gray-700">{feature.name}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full button-primary group"
                  >
                    Submit
                    <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center mt-6"
      >
        <p className="text-xs text-gray-500">
          Powered by <span className="font-medium">SysconicTech</span> - Professional Web Development Services
        </p>
      </motion.div>
    </div>
  )
} 