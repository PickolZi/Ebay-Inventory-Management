import type { Metadata } from 'next'
import Navbar from '../components/global/navbar/navbar.component'
import Header from '@/components/global/header/header.component'
import { UserAuthProvider } from './context/user.context'
import { SidebarProvider } from './context/sidebar.context'

import { Box } from '@mui/material'

import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Itemiz',
  description: 'Your easy to use Ebay Management Tool',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <UserAuthProvider>
      <SidebarProvider>      
        <html lang="en">
          <body className={inter.className}>
              <Header />
              <Box sx={{ my: "64px" }}>
                {children}
              </Box>
              <Navbar />
            </body>
        </html>
      </SidebarProvider>
    </UserAuthProvider>
  )
}
