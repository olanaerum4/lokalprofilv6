import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'LokalProfil – Automatisk SMS-oppfølging', template: '%s | LokalProfil' },
  description: 'Send automatiske SMS-påminnelser og få Google-anmeldelser. For frisører, barberer, massasjeterapeuter og personlige trenere i Norge. 7 dager gratis.',
  keywords: 'SMS påminnelse norsk, timebestilling SMS, frisør SMS system, Google anmeldelse automatisk, no-show redusere',
  authors: [{ name: 'LokalProfil' }],
  creator: 'LokalProfil',
  metadataBase: new URL('https://lokalprofilv6.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'nb_NO',
    siteName: 'LokalProfil',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#16a34a" />
      </head>
      <body>{children}</body>
    </html>
  )
}
