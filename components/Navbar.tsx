'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Wallet, LogOut, Shield } from 'lucide-react'

export default function Navbar() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <nav className="bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-blue-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              VeriCred
            </h1>
          </div>

          <div className="flex items-center">
            {isConnected && address ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
                  >
                    <Wallet className="h-4 w-4 mr-2" />
                    {truncateAddress(address)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end"
                  className="bg-black/80 backdrop-blur-xl border-white/20 text-white"
                >
                  <DropdownMenuItem 
                    onClick={() => disconnect()}
                    className="hover:bg-white/10 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    disabled={isPending}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                  >
                    <Wallet className="h-4 w-4 mr-2" />
                    {isPending ? 'Connecting...' : 'Connect Wallet'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end"
                  className="bg-black/80 backdrop-blur-xl border-white/20 text-white"
                >
                  {connectors.map((connector) => (
                    <DropdownMenuItem
                      key={connector.id}
                      onClick={() => connect({ connector })}
                      className="hover:bg-white/10 cursor-pointer"
                    >
                      {connector.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}