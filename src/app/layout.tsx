// @@filename: src/app/layout.tsx
import '@/app/globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/components/auth/auth-provider'
import { ThemeProvider } from '@/components/theme/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
