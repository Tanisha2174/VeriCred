import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'VeriCred - Decentralized Review Platform',
  description: 'Blockchain-powered product reviews with verified purchases',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-br from-gray-900 via-black to-gray-800 min-h-screen text-white`}>
        {children}
      </body>
    </html>
  )
}