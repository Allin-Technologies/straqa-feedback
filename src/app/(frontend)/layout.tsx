import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { draftMode } from 'next/headers'
import localFont from 'next/font/local'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

const plusJakartaSans = localFont({
  src: [
    {
      path: './fonts/PlusJakartaSans[wght].ttf',
      weight: '200 800',
      style: 'normal',
    },
    // italics
    {
      path: './fonts/PlusJakartaSans-Italic[wght].ttf',
      weight: '200 800',
      style: 'italic',
    },
  ],
  variable: '--font-plus-jakarta-sans',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body
        className={cn(
          'font-plus-jakarta-sans antialiased w-screen overflow-x-hidden',
          plusJakartaSans.variable,
        )}
      >
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />
          {children}
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  title: 'Straqa',
  description: 'Ticket experience made easy',
  authors: [{ name: 'All-in Technologies', url: 'lifewithallin.com' }],
  creator: 'All-in Technologies',
  publisher: 'All-in Technologies',
  twitter: {
    card: 'summary_large_image',
    creator: '@straqa',
  },
}
