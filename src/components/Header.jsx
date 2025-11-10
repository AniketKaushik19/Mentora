"use client"
import React, { useEffect } from 'react'
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Button } from './ui/button'
import { Authenticated , Unauthenticated } from 'convex/react'
import useStoreUser from '../../hooks/use-store-user'
import { BarLoader} from "react-spinners"
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard } from 'lucide-react'
 const Header = () => {
  const { isLoading, isAuthenticated } = useStoreUser();
  const path=usePathname()
  const router=useRouter()
  //Hide header on public profile and post pages (but not on feed)
  
  
  //Redirect authenticated users from landing page to feed
  useEffect(()=>{
    if(!isLoading && isAuthenticated && path==="/"){
      router.push("/")
    }
  },[isLoading , isAuthenticated , path ])
  if(path!=="/" && path!=="/feed" && path.split("/").length>=2){ 
    return null
  }
  return (
    <header className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-3xl px-4 ${(path==="/" || path==="/feed" || path==="/community")?"visible":"hidden"}`}>
        <div className='backdrop-blur-md bg-white/10 border border-white/20 rounded-full px-4 sm:px-6 md:px-8 py-3 flex items-center justify-between gap-2'>
        <Link href={isAuthenticated?"/":"/"} className='shrink-0'>
          {/* <Image
            src="/logo.png"
            alt="create.logo"
            width={96}
            height={32}
            className='h-8 sm:h-10 w-auto object-contain'
          /> */}
           <span className='bg-linear-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text font-semibold text-2xl '>Mentora</span>
        </Link>

        {path==="/" && (
          <div className='hidden lg:flex space-x-6 flex-1 justify-center'>
            <Link href="#features"
                  className='text-white font-medium transition-all duration-300 hover:text-purple-300 cursor-pointer'
            >
               Features
            </Link>
            <Link href="/community"
                  className='text-white font-medium transition-all duration-300 hover:text-purple-300 cursor-pointer'
            >
               Community
            </Link>
            {/* <Link 
               href="testimonials"
               className='text-white font-medium transition-all duration-300 hover:text-purple-300 cursor-pointer'
            >
             Testimonials
            </Link> */}
          </div>
        )}

      <div className='flex items-center gap-2 sm:gap-3 shrink-0'>
        <Authenticated>
           <Link href={"/community/dashboard"}>
              <Button variant={"outline"} className={"sm:flex md:flex cursor-pointer"} size={"sm"}>
                 <LayoutDashboard className='h-4 w-4'/>
                 <span className='hidden md:inline ml-2  '>Dashboard</span>
              </Button>
           </Link>
           <UserButton />
        </Authenticated>
        <Unauthenticated>
              <SignInButton>
                <Button size="sm" variant={"ghost"}>
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton>
                 <Button variant={"primary"} size={"sm"} className={"whitespace-nowrap"}>
                    Get Started
                 </Button>
              </SignUpButton>
              
            </Unauthenticated>
      </div>   

            {isLoading && (
              <div className='fixed bottom-0 left-0 w-full z-40 flex justify-center'>
                <BarLoader width={"95%"} color="#D8B4FE"/>
              </div>
            )}
      </div>
    </header>
  )
}

export default Header