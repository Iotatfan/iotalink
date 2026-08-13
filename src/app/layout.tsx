import type { Metadata } from 'next'
import '../index.css'

export const metadata: Metadata = {
  title: 'Iotalink | URL Shortener',
  description: 'Shorten your links in seconds with Iotalink.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
    <html lang="en">
      <body>{children}</body>
    </html>

    )
}
