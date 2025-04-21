// src/app/layout.tsx

import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import Nav from "@modules/layout/templates/nav"
import Footer from "@modules/layout/templates/footer"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: "Gmorkl Store – Wearable Art from Cologne",
  description: "Limited edition wearable art designed by Masha Rodigina. Based in Cologne, shipping worldwide.",
  keywords: ["gmorkl", "wearable art", "Cologne fashion", "limited edition", "Masha Rodigina"],
  openGraph: {
    title: "Gmorkl Store – Wearable Art from Cologne",
    description: "Explore unique collections by Masha Rodigina.",
    url: "https://gmorkl.de",
    siteName: "Gmorkl Store",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Gmorkl Wearable Art",
      },
    ],
    locale: "en_US",
    type: "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <head>
        {/* Пре-загрузка шрифта для корректного рендеринга */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <title>GMORKL STORE</title>

        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-7JL5RF98QY"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-7JL5RF98QY', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body className="m-0 p-0 font-sans tracking-wide text-base antialiased bg-white text-[#111827]">
        <Nav />
        {/* 👇 убрали лишние стили и отступы у main */}
        <main className="m-0 p-0">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
