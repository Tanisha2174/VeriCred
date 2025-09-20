'use client'

import { useState } from 'react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { wagmiConfig } from '@/lib/wagmiConfig'
import { Toaster } from '@/components/ui/sonner'
import Navbar from '@/components/Navbar'
import ProductGrid from '@/components/ProductGrid'
import MyReviews from '@/components/MyReviews'
import ReviewList from '@/components/ReviewList'

const queryClient = new QueryClient()

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handlePurchaseSuccess = () => {
    // Trigger refresh of eligible products
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
          <Navbar />
          
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
            {/* Hero Section */}
            <div className="text-center space-y-4 py-12">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Decentralized Reviews
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Purchase products, mint Receipt NFTs, and write verified reviews on the blockchain. 
                Only real customers can review with VeriCred.
              </p>
            </div>

            {/* Featured Products */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white">Featured Products</h2>
                <div className="h-1 flex-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full ml-6"></div>
              </div>
              <ProductGrid onPurchaseSuccess={handlePurchaseSuccess} />
            </section>

            {/* My Reviewable Products */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white">My Reviewable Products</h2>
                <div className="h-1 flex-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full ml-6"></div>
              </div>
              <MyReviews refreshTrigger={refreshTrigger} />
            </section>

            {/* Latest Reviews */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white">Latest Verified Reviews</h2>
                <div className="h-1 flex-1 bg-gradient-to-r from-pink-500/20 to-blue-500/20 rounded-full ml-6"></div>
              </div>
              <ReviewList />
            </section>
          </main>

          {/* Background Elements */}
          <div className="fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl"></div>
          </div>

          <Toaster 
            theme="dark"
            className="bg-black/90 backdrop-blur-xl border-white/20"
          />
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  )
}