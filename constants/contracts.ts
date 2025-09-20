export const CONTRACTS = {
  // Replace these with actual deployed contract addresses
  RECEIPT_NFT: {
    address: '0x1234567890123456789012345678901234567890' as const,
    abi: [
      {
        name: 'mintReceipt',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
          { name: 'productId', type: 'uint256' },
          { name: 'to', type: 'address' }
        ],
        outputs: [{ name: 'tokenId', type: 'uint256' }]
      },
      {
        name: 'hasReceipt',
        type: 'function',
        stateMutability: 'view',
        inputs: [
          { name: 'user', type: 'address' },
          { name: 'productId', type: 'uint256' }
        ],
        outputs: [{ name: '', type: 'bool' }]
      },
      {
        name: 'balanceOf',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'owner', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }]
      }
    ]
  },
  REVIEWS: {
    address: '0x0987654321098765432109876543210987654321' as const,
    abi: [
      {
        name: 'submitReview',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
          { name: 'productId', type: 'uint256' },
          { name: 'ipfsCID', type: 'string' }
        ],
        outputs: []
      },
      {
        name: 'getProductReviews',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'productId', type: 'uint256' }],
        outputs: [
          {
            name: '',
            type: 'tuple[]',
            components: [
              { name: 'reviewer', type: 'address' },
              { name: 'ipfsCID', type: 'string' },
              { name: 'timestamp', type: 'uint256' }
            ]
          }
        ]
      },
      {
        name: 'getAllReviews',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [
          {
            name: '',
            type: 'tuple[]',
            components: [
              { name: 'reviewer', type: 'address' },
              { name: 'productId', type: 'uint256' },
              { name: 'ipfsCID', type: 'string' },
              { name: 'timestamp', type: 'uint256' }
            ]
          }
        ]
      }
    ]
  }
} as const

export const SAMPLE_PRODUCTS = [
  {
    id: 1,
    name: 'Wireless Earbuds Pro',
    description: 'Premium noise-canceling wireless earbuds with 24h battery life',
    price: 199.99,
    image: 'https://images.pexels.com/photos/3394658/pexels-photo-3394658.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 2,
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracking with heart rate monitor and GPS',
    price: 299.99,
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 3,
    name: 'Mechanical Keyboard RGB',
    description: 'Gaming mechanical keyboard with customizable RGB lighting',
    price: 149.99,
    image: 'https://images.pexels.com/photos/1772123/pexels-photo-1772123.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 4,
    name: 'Portable SSD 1TB',
    description: 'Ultra-fast portable SSD with USB-C connectivity',
    price: 129.99,
    image: 'https://images.pexels.com/photos/4152505/pexels-photo-4152505.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
]