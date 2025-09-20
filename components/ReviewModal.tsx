'use client'

import { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Star, Loader2, Upload } from 'lucide-react'
import { CONTRACTS } from '@/constants/contracts'
import { IPFSClient, type ReviewData } from '@/lib/ipfsClient'

interface EligibleProduct {
  id: number
  name: string
  price: number
  image: string
}

interface ReviewModalProps {
  product: EligibleProduct
  isOpen: boolean
  onClose: () => void
  onReviewSubmitted: () => void
}

export default function ReviewModal({ 
  product, 
  isOpen, 
  onClose, 
  onReviewSubmitted 
}: ReviewModalProps) {
  const { address } = useAccount()
  const { toast } = useToast()
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('')

  const { 
    writeContract, 
    data: hash,
    isPending: isWritePending 
  } = useWriteContract()

  const { 
    isLoading: isConfirming,
    isSuccess: isConfirmed 
  } = useWaitForTransactionReceipt({
    hash,
  })

  const handleStarClick = (star: number) => {
    setRating(star)
  }

  const handleSubmit = async () => {
    if (!address) return
    
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a star rating",
        variant: "destructive",
      })
      return
    }

    if (!reviewText.trim()) {
      toast({
        title: "Review Text Required", 
        description: "Please write your review",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      setUploadStatus('Uploading to IPFS...')

      // Upload review to IPFS
      const reviewData: ReviewData = {
        rating,
        text: reviewText.trim(),
        timestamp: Date.now(),
        productId: product.id.toString()
      }

      const ipfsClient = IPFSClient.getInstance()
      const ipfsCID = await ipfsClient.uploadReview(reviewData)

      setUploadStatus('Submitting to blockchain...')

      // Submit review to smart contract
      await writeContract({
        address: CONTRACTS.REVIEWS.address,
        abi: CONTRACTS.REVIEWS.abi,
        functionName: 'submitReview',
        args: [BigInt(product.id), ipfsCID],
      })

      toast({
        title: "Review Submitted!",
        description: "Your review is being processed on the blockchain",
      })

    } catch (error) {
      console.error('Review submission failed:', error)
      toast({
        title: "Submission Failed",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      setUploadStatus('')
    }
  }

  // Handle transaction confirmation
  if (isConfirmed && isSubmitting) {
    setIsSubmitting(false)
    setUploadStatus('')
    toast({
      title: "Review Published! 🎉",
      description: "Your verified review is now live on the blockchain",
      className: "bg-green-500/10 border-green-500/20 text-green-400",
    })
    
    // Reset form
    setRating(0)
    setReviewText('')
    
    onReviewSubmitted()
  }

  const isLoading = isWritePending || isConfirming || isSubmitting

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/90 backdrop-blur-xl border-white/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Review {product.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Star Rating */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Rating</Label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  className="p-1 hover:scale-110 transition-transform"
                  disabled={isLoading}
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= rating 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-500 hover:text-yellow-400'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Review Text */}
          <div className="space-y-2">
            <Label htmlFor="review-text" className="text-sm font-medium">
              Your Review
            </Label>
            <Textarea
              id="review-text"
              placeholder="Share your experience with this product..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[120px] resize-none"
              disabled={isLoading}
            />
          </div>

          {/* Upload Status */}
          {uploadStatus && (
            <div className="flex items-center space-x-2 text-blue-400">
              <Upload className="h-4 w-4 animate-pulse" />
              <span className="text-sm">{uploadStatus}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || rating === 0 || !reviewText.trim()}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isWritePending ? 'Confirming...' : isConfirming ? 'Publishing...' : 'Uploading...'}
                </>
              ) : (
                'Submit Review'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}