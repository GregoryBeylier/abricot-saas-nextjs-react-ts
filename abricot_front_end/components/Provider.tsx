'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

// Fournit le client TanStack Query à toute l'application
export default function QueryProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
