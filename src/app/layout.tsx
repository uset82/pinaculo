import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Numerólogo - Descubre Tus Números Sagrados',
  description: 'Cálculos avanzados de numerología para la comunidad peruana. Descubre tu camino de vida, destino y propósito espiritual.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
          {children}
        </div>
      </body>
    </html>
  )
}
