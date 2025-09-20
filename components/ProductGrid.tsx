'use client'

import ProductCard from './ProductCard'
import { SAMPLE_PRODUCTS } from '@/constants/contracts'

interface ProductGridProps {
  onPurchaseSuccess?: () => void
}

export default function ProductGrid({ onPurchaseSuccess }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {SAMPLE_PRODUCTS.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product}
          onPurchaseSuccess={onPurchaseSuccess}
        />
      ))}
    </div>
  )
}