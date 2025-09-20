'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MessageSquarePlus, Package } from 'lucide-react'
import { CONTRACTS, SAMPLE_PRODUCTS } from '@/constants/contracts'
import ReviewModal from './ReviewModal'

interface EligibleProduct {
  id: number
  name: string
  price: number
  image: string
}

interface MyReviewsProps {
  refreshTrigger?: number
}

export default function MyReviews({ refreshTrigger }: MyReviewsProps) {
  const { address, isConnected } = useAccount()
  const [eligibleProducts, setEligibleProducts] = useState<EligibleProduct[]>([])
  const [selectedProduct, setSelectedProduct] = useState<EligibleProduct | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // For demo purposes, we'll simulate checking NFT ownership
  // In production, you'd query the actual contract
  const { data: nftBalance, refetch } = useReadContract({
    address: CONTRACTS.RECEIPT_NFT.address,
    abi: CONTRACTS.RECEIPT_NFT.abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  useEffect(() => {
    // Simulate eligible products for demo
    // In production, check each product individually with hasReceipt function
    if (isConnected && nftBalance && Number(nftBalance) > 0) {
      // For demo, show first 2 products as eligible after any purchase
      setEligibleProducts(SAMPLE_PRODUCTS.slice(0, 2))
    } else {
      setEligibleProducts([])
    }
  }, [isConnected, nftBalance, refreshTrigger])

  const handleReviewClick = (product: EligibleProduct) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleReviewSubmitted = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
    refetch() // Refresh the data
  }

  if (!isConnected) {
    return null
  }

  if (eligibleProducts.length === 0) {
    return (
      <Card className="bg-white/5 backdrop-blur-xl border-white/10">
        <CardContent className="p-8 text-center">
          <Package className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No Reviewable Products</h3>
          <p className="text-gray-400">
            Purchase a product first to unlock the ability to write verified reviews.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="bg-white/5 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <MessageSquarePlus className="h-5 w-5 mr-2 text-blue-400" />
            My Reviewable Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {eligibleProducts.map((product) => (
              <div 
                key={product.id}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{product.name}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="border-green-500/30 text-green-400">
                        Verified Purchase
                      </Badge>
                      <span className="text-sm text-gray-400">${product.price}</span>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => handleReviewClick(product)}
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                >
                  <MessageSquarePlus className="h-4 w-4 mr-2" />
                  Write Review
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedProduct && (
        <ReviewModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}
    </>
  )
}