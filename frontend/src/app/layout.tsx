import type { Metadata } from 'next'
import Navbar from './../components/navbar/navbar.component'

import { ItemsProvider } from '@/context/items.context'

import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Itemiz',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ItemsProvider>
          <Navbar />
          {children}
        </ItemsProvider>
        </body>
    </html>
  )
}