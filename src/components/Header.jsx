"use client"
import React, { useEffect, useState } from 'react'
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Button } from './ui/button'
import { Authenticated, Unauthenticated } from 'convex/react'
import useStoreUser from '../../hooks/use-store-user'
import { BarLoader } from "react-spinners"
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Moon, Sun, Sparkles } from 'lucide-react'
import { useTheme } from "next-themes"

const Header = () => {
  const { isLoading, isAuthenticated } = useStoreUser();
  const { theme, setTheme } = useTheme()
  const path = usePathname()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!isLoading && isAuthenticated && path === "/") {
      router.push("/")
    }
  }, [isLoading, isAuthenticated, path, router])

  const isVisible = (
    path === "/ai-tools" || 
    path === "/" || 
    path === "/feed" || 
    path === "/community" 
  );

  return (
    <header className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-4xl px-4 transition-all duration-500 ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0 pointer-events-none"}`}>
      <div className='backdrop-blur-xl bg-white/70 dark:bg-black/40 border border-black/5 dark:border-white/10 rounded-full px-4 py-2 flex items-center justify-between shadow-2xl shadow-black/5 dark:shadow-purple-500/10'>
        
        {/* Logo */}
        <Link href="/" className='shrink-0 pl-2'>
          <div className='flex items-center gap-2 group'>
             <span className="text-2xl font-black tracking-tighter bg-linear-to-tr from-purple-500 via-purple-400 to-blue-500 bg-clip-text text-transparent drop-shadow-sm">
    Mentora
  </span>
          </div>
        </Link>

        {/* Navigation - Desktop */}
        {(path === "/" || path === '/community' || path === '/ai-tools') && (
          <nav className='hidden lg:flex items-center bg-black/5 dark:bg-white/5 rounded-full px-1 py-1 mx-4'>
            {[
              { name: 'Community', href: '/community' },
              { name: 'Courses', href: '/ai-powered-learning' },
              { name: 'AI Tools', href: '/ai-tools' }
            ].map((link) => (
              <Link 
                key={link.name}
                href={link.href}
                className={`px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                  path === link.href 
                  ? 'bg-white dark:bg-slate-800 text-primary shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        )}

        {/* Actions */}
        <div className='flex items-center gap-2 shrink-0'>
          
          {/* Theme Toggle Button */}
          {/* {mounted && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full w-9 h-9 hover:bg-black/5 dark:hover:bg-white/5"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-[1.1rem] w-[1.1rem] text-amber-400 rotate-0 scale-100 transition-all" />
              ) : (
                <Moon className="h-[1.1rem] w-[1.1rem] text-slate-700 rotate-0 scale-100 transition-all" />
              )}
            </Button>
          )} */}

          <Authenticated>
            <Link href={"/community/dashboard"}>
              <Button variant="outline" size="sm" className="hidden md:flex rounded-full border-black/10 dark:border-white/10 font-bold text-xs uppercase">
                <LayoutDashboard className='h-3.5 w-3.5 mr-2'/>
                Dashboard
              </Button>
            </Link>
            <div className='scale-90 hover:scale-100 transition-transform'>
              <UserButton appearance={{ elements: { userButtonAvatarBox: "rounded-full" }}} />
            </div>
          </Authenticated>

          <Unauthenticated>
            <SignInButton mode="modal">
              <Button size="sm" variant="ghost" className="text-xs font-bold uppercase tracking-wider">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button variant="primary" size="sm" className="rounded-full px-5 text-xs font-bold uppercase tracking-wider shadow-lg shadow-primary/20">
                Join Now
              </Button>
            </SignUpButton>
          </Unauthenticated>
        </div>   

        {isLoading && (
          <div className='fixed bottom-0 left-0 w-full z-40'>
            <BarLoader width={"100%"} color="oklch(0.70 0.12 250)" />
          </div>
        )}
      </div>
    </header>
  )
}

export default Header