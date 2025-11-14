"use client"
import { SignInButton, UserProfile } from '@clerk/nextjs'
import React from 'react'
import useStoreUser from '../../../hooks/use-store-user'
import { Button } from '@/components/ui/button'

function page() {
  const {isAuthenticated}=useStoreUser()
  return (
    <div className='min-h-screen  my-2 flex justify-center items-center flex-col '>
      {isAuthenticated ?<UserProfile/> :<> <h2 className='px-5  text-gray-500'>Please sign in to view your profile</h2> 
      <SignInButton>
                <Button className="my-5 px-10 py-2">
                  Sign In
                </Button>
              </SignInButton> </>
    }

    </div>
  )
}

export default page