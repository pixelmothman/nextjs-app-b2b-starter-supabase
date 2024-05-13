import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google'
import './globals.css'
import NotForMobileScreen from '../components/miscelaneous/notForMobileScreen';
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'nextjs-app-b2b-starter-supabase',
  description: 'A Next.js starter for B2B SaaS applications with Supabase',
}

export default function RootLayout({ children }: {
children: ReactNode
}) {

  return (
    <html lang="en">
        <body className={`${inter.className} antialiased w-screen h-screen bg-neutral-100 overflow-hidden`}>
          <NotForMobileScreen />
          {children}
        </body>
    </html>
  )
}