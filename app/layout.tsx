import './globals.css'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'Station Support App',
  description: 'Prototype for station boarding guidance',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
