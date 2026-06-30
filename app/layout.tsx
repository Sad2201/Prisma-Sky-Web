// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export const metadata: Metadata = {
  title: 'PRISMA SKY',
  description: 'PRISMA SKY - Plataforma tecnológica premium',
  keywords: 'prisma, sky, tecnología, premium, innovación, desarrollo web, IA, automatización',
  authors: [{ name: 'PRISMA SKY' }],
  creator: 'PRISMA SKY',
  publisher: 'PRISMA SKY',
  robots: 'index, follow',
  openGraph: {
    title: 'PRISMA SKY',
    description: 'PRISMA SKY - Plataforma tecnológica premium',
    url: 'https://prismasky-web.vercel.app',
    siteName: 'PRISMA SKY',
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PRISMA SKY',
    description: 'PRISMA SKY - Plataforma tecnológica premium',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: '#050505',
  appleWebApp: {
    capable: true,
    title: 'PRISMA SKY',
    statusBarStyle: 'black-translucent',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="bg-[#050505] text-white antialiased overflow-x-hidden">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}