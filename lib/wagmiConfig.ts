'use client'

import { createConfig, http } from 'wagmi'
import { sepolia, mainnet } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

// Simple Wagmi config without AppKit to avoid 403 errors
export const wagmiConfig = createConfig({
  chains: [sepolia, mainnet],
  connectors: [
    injected(),
    // Only include WalletConnect if we have a valid project ID
    ...(process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID && 
        process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID !== 'your_project_id_here' 
      ? [walletConnect({
          projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
        })]
      : []
    ),
  ],
  transports: {
    [sepolia.id]: http(),
    [mainnet.id]: http(),
  },
})

export const SUPPORTED_CHAINS = [sepolia, mainnet]