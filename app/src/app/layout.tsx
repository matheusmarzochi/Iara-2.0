import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";
import { ThemeProvider } from "~/components/theme/provider";
import { SeoJsonLd } from '~/components/seo-jsonls';
import "./globals.css";
import { Toaster } from "~/components/ui/sonner";

// eslint-disable-next-line react-refresh/only-export-components
export const metadata = {
  title: {
    default: 'Iara • Fit for Purpose (F4P) para UX Research',
    template: '%s | Iara',
  },
  description:
    'Iara aplica o método Fit for Purpose (F4P) para revelar o que realmente motiva seus usuários.',
  alternates: {
    canonical: 'https://iara.one',
    languages: {
      'en': 'https://iara.one/en',
      'pt-BR': 'https://iara.one',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://iara.one',
    siteName: 'Iara',
    images: [
      {
        url: 'https://iara.one/favicon/web-app-manifest-512x512.png',
        width: 512,
        height: 512,
        alt: 'Dashboard da Iara exibindo Fitness Box Score',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@IaraOne',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      localization={ptBR}
      afterSignOutUrl="/"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
    >
      <html lang="pt-BR" suppressHydrationWarning>
        <head>
          <link
            rel="icon"
            type="image/png"
            href="/favicon/favicon-96x96.png"
            sizes="96x96"
          />
          <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
          <link rel="shortcut icon" href="/favicon/favicon.ico" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/favicon/apple-touch-icon.png"
          />
          <meta name="apple-mobile-web-app-title" content="Iara" />
          <link rel="manifest" href="/favicon/site.webmanifest" />
        </head>
        <body className="dark:bg-sky-950">
          <SeoJsonLd />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
