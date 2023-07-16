import Providers from '@/components/Providers'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Chat from '@/components/Chat'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Wany GPT',
  description: 'Search all you want for wany',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className='dark'>
      <Providers>
        <body className={inter.className}>
          <Chat />
          {children}
        </body>
      </Providers>
    </html >
  )
}
