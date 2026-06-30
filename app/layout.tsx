// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PRISMA SKY',
  description: 'PRISMA SKY - Plataforma tecnológica premium',
  keywords: 'prisma, sky, tecnología, premium, innovación',
  authors: [{ name: 'PRISMA SKY' }],
  creator: 'PRISMA SKY',
  publisher: 'PRISMA SKY',
  robots: 'index, follow',
  openGraph: {
    title: 'PRISMA SKY',
    description: 'PRISMA SKY - Plataforma tecnológica premium',
    url: 'https://prismasky.com',
    siteName: 'PRISMA SKY',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PRISMA SKY',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PRISMA SKY',
    description: 'PRISMA SKY - Plataforma tecnológica premium',
    images: ['/twitter-image.jpg'],
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
  formatDetection: {
    telephone: false,
  },
  alternates: {
    canonical: 'https://prismasky.com',
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
      </body>
    </html>
  )
}