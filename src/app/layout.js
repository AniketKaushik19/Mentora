//styles or font
import { Inter } from "next/font/google";
import "./globals.css";

//theme provider
import { ThemeProvider } from "@/components/theme-provider";

//backend utility
import { ConvexClientProvider } from "./ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { dark, shadesOfPurple } from "@clerk/themes";

//sidebar
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
//fronted
import Header from "@/components/Header";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });
export const metadata = {
  title: "Mentora Ai Content App",
  description: "Generated and created by Mentor community app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
          <ClerkProvider 
           publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
          appearance={{
             baseTheme:shadesOfPurple,
          }}>

              <ConvexClientProvider>
                 {/* <SidebarProvider> */}
                 {/* <AppSidebar /> */}
                 <Header/>
               {/* //header close  */}
               {/* <SidebarTrigger /> */}
               {/* <main className="bg-slate-900 min-h-screen text-white overflow-x-hidden">     */}
               <main className="min-h-screen bg-slate-900 text-white  overflow-x-hidden">  
                <Toaster richColors/>  
               {children}
               </main>
{/* </SidebarProvider> */}
              </ConvexClientProvider>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
