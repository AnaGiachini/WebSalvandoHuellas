import React from "react"
import "../index.css"
//import Header from "../components/header"
//import Footer from "../components/footer"
//import { ThemeProvider } from "../components/theme-provider"
//import { AuthProvider } from "../components/auth/auth-provider"

export default function RootLayout({ children }) {
  return (
    <>
    {/* <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange> */}
      {/* <AuthProvider> */}
        {/* <Header /> */}
        <main className="min-h-screen">{children}</main>
        {/* <Footer /> */}
      {/* </AuthProvider> */}
    </>
  )
}



// import React from "react"
// import "../index.css"
// import Header from "../components/header"
// import Footer from "../components/footer"
// import { ThemeProvider } from "../components/theme-provider"
// import { AuthProvider } from "../components/auth/auth-provider"

// export default function RootLayout({ children }) {
//   return (
//     <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
//       <AuthProvider>
//         <Header />
//         <main className="min-h-screen">{children}</main>
//         <Footer />
//       </AuthProvider>
//     </ThemeProvider>
//   )
// }
