import type { Metadata } from 'next'
import './globals.css'
import { Geist } from 'next/font/google'
import { cn } from '@/lib/utils'
import QueryProvider from '../components/Provider'
import ScrollReset from '../components/ScrollReset'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Abricot',
  description: 'SaaS de gestion de projet collaboratif',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={cn('font-sans', geist.variable)}>
      <body className="min-h-full flex flex-col w-full max-w-full overflow-x-hidden">
        <QueryProvider>
          <ScrollReset />
          {children}
        </QueryProvider>
      </body>
    </html>
  )
}
