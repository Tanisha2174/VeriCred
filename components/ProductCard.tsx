'use client'

import { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { ShoppingCart, Loader2 } from 'lucide-react'
import { CONTRACTS } from '@/constants/contracts'
import Image from 'next/image'

interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
}

interface ProductCardProps {
  product: Product
  onPurchaseSuccess?: () => void
}

export default function ProductCard({ product, onPurchaseSuccess }: ProductCardProps) {
  const { address, isConnected } = useAccount()
  const { toast } = useToast()
  const [isPurchasing, setIsPurchasing] = useState(false)

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

  const handlePurchase = async () => {
    if (!isConnected || !address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to make a purchase",
        variant: "destructive",
      })
      return
    }

    try {
      setIsPurchasing(true)
      
      toast({
        title: "Transaction pending...",
        description: `Minting Receipt NFT for ${product.name}`,
      })

      // Mint Receipt NFT
      await writeContract({
        address: CONTRACTS.RECEIPT_NFT.address,
        abi: CONTRACTS.RECEIPT_NFT.abi,
        functionName: 'mintReceipt',
        args: [BigInt(product.id), address],
      })

    } catch (error) {
      console.error('Purchase failed:', error)
      toast({
        title: "Purchase Failed",
        description: "Transaction was rejected or failed",
        variant: "destructive",
      })
      setIsPurchasing(false)
    }
  }

  // Handle transaction confirmation
  if (isConfirmed && isPurchasing) {
    setIsPurchasing(false)
    toast({
      title: "Purchase Successful! 🎉",
      description: `You can now review ${product.name}`,
      className: "bg-green-500/10 border-green-500/20 text-green-400",
    })
    onPurchaseSuccess?.()
  }

  const isLoading = isWritePending || isConfirming || isPurchasing

  return (
    <Card className="group bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-blue-400/30">
      <CardContent className="p-0">
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <Badge 
            variant="secondary" 
            className="absolute top-3 right-3 bg-black/50 text-white border-white/20"
          >
            ${product.price}
          </Badge>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            {product.description}
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0">
        <Button 
          onClick={handlePurchase}
          disabled={!isConnected || isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {isWritePending ? 'Confirming...' : isConfirming ? 'Processing...' : 'Purchasing...'}
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Simulate Purchase
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}