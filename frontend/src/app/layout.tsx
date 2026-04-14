import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NexaPanel — Dashboard',
  description: 'Admin dashboard built with Next.js + Node.js + MySQL',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
