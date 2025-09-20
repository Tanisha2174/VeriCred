'use client'

export interface ReviewData {
  rating: number
  text: string
  timestamp: number
  productId: string
}

// Simple IPFS simulation for hackathon - in production, use actual IPFS
export class IPFSClient {
  private static instance: IPFSClient
  private storage: Map<string, ReviewData> = new Map()

  static getInstance(): IPFSClient {
    if (!IPFSClient.instance) {
      IPFSClient.instance = new IPFSClient()
    }
    return IPFSClient.instance
  }

  async uploadReview(reviewData: ReviewData): Promise<string> {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Generate mock CID
    const cid = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
    
    // Store locally for demo
    this.storage.set(cid, reviewData)
    
    return cid
  }

  async getReview(cid: string): Promise<ReviewData | null> {
    // Simulate fetch delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return this.storage.get(cid) || null
  }

  // For production, implement actual IPFS upload
  // async uploadToIPFS(data: ReviewData): Promise<string> {
  //   const client = await Client.create()
  //   const result = await client.uploadJSON(data)
  //   return result.toString()
  // }
}