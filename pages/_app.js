import '../styles/globals.css'
import { ThemeProvider } from 'next-themes'

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider 
      attribute="data-theme" 
      defaultTheme="dark" 
      enableSystem
      disableTransitionOnChange
    >
      <div className="aurora-bg" />
      <div className="noise-overlay" />
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
