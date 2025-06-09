import { Inter } from 'next/font/google'
import './globals.css'
import type { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoRoute 2026 - Logística Sostenible',
  description: 'Plataforma SaaS de optimización logística sostenible para empresas que buscan reducir su huella de carbono',
  keywords: ['logística', 'sostenibilidad', 'optimización', 'rutas', 'carbono'],
  authors: [{ name: 'EcoRoute Team' }],
  creator: 'EcoRoute Team',
  publisher: 'EcoRoute Inc.',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: 'EcoRoute 2026 - Logística Sostenible',
    description: 'Optimiza tus rutas logísticas y reduce tu huella de carbono',
    siteName: 'EcoRoute 2026',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EcoRoute 2026 - Logística Sostenible',
    description: 'Optimiza tus rutas logísticas y reduce tu huella de carbono',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  )
} 