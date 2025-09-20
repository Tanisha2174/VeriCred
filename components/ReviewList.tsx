'use client'

import { useState, useEffect } from 'react'
import { useReadContract } from 'wagmi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Star, MessageSquare, Clock } from 'lucide-react'
import { CONTRACTS, SAMPLE_PRODUCTS } from '@/constants/contracts'
import { IPFSClient, type ReviewData } from '@/lib/ipfsClient'

interface ReviewWithData {
  reviewer: string
  productId: number
  ipfsCID: string
  timestamp: number
  reviewData?: ReviewData | null
  productName?: string
}

export default function ReviewList() {
  const [reviews, setReviews] = useState<ReviewWithData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Read all reviews from contract
  const { data: contractReviews, refetch } = useReadContract({
    address: CONTRACTS.REVIEWS.address,
    abi: CONTRACTS.REVIEWS.abi,
    functionName: 'getAllReviews',
    query: {
      enabled: true,
    },
  })

  useEffect(() => {
    const loadReviews = async () => {
      if (!contractReviews) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      const ipfsClient = IPFSClient.getInstance()
      const reviewsWithData: ReviewWithData[] = []

      for (const review of contractReviews as any[]) {
        try {
          const reviewData = await ipfsClient.getReview(review.ipfsCID)
          const product = SAMPLE_PRODUCTS.find(p => p.id === Number(review.productId))
          
          reviewsWithData.push({
            reviewer: review.reviewer,
            productId: Number(review.productId),
            ipfsCID: review.ipfsCID,
            timestamp: Number(review.timestamp),
            reviewData,
            productName: product?.name
          })
        } catch (error) {
          console.error('Failed to load review data:', error)
        }
      }

      // Sort by timestamp (newest first)
      reviewsWithData.sort((a, b) => b.timestamp - a.timestamp)
      setReviews(reviewsWithData)
      setIsLoading(false)
    }

    loadReviews()
  }, [contractReviews])

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-600'
            }`}
          />
        ))}
      </div>
    )
  }

  if (isLoading) {
    return (
      <Card className="bg-white/5 backdrop-blur-xl border-white/10">
        <CardContent className="p-8 text-center">
          <div className="animate-spin h-8 w-8 border-2 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading verified reviews...</p>
        </CardContent>
      </Card>
    )
  }

  if (reviews.length === 0) {
    return (
      <Card className="bg-white/5 backdrop-blur-xl border-white/10">
        <CardContent className="p-8 text-center">
          <MessageSquare className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No Reviews Yet</h3>
          <p className="text-gray-400">
            Be the first to purchase a product and write a verified review!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-blue-400" />
          Latest Verified Reviews ({reviews.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {reviews.map((review, index) => (
            <div 
              key={`${review.ipfsCID}-${index}`}
              className="p-6 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600">
                    <AvatarFallback className="text-white font-semibold">
                      {review.reviewer.slice(2, 4).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-white">
                        {truncateAddress(review.reviewer)}
                      </span>
                      <Badge 
                        variant="outline" 
                        className="border-green-500/30 text-green-400 text-xs"
                      >
                        Verified Purchase
                      </Badge>
                    </div>
                    {review.productName && (
                      <p className="text-sm text-gray-400">{review.productName}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>{formatTime(review.reviewData?.timestamp || review.timestamp * 1000)}</span>
                </div>
              </div>

              {review.reviewData && (
                <>
                  <div className="flex items-center space-x-3 mb-3">
                    {renderStars(review.reviewData.rating)}
                    <span className="text-yellow-400 font-semibold">
                      {review.reviewData.rating}/5
                    </span>
                  </div>
                  
                  <p className="text-gray-300 leading-relaxed">
                    {review.reviewData.text}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}