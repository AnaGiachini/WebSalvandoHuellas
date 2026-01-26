import ThemeProvider from "../components/ThemeProvider";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AuthProvider } from "../components/auth/AuthProvider";
import Toaster from "../components/ui/Toaster";

export default function RootLayout({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}
