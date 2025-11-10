"use client"
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { api } from '../../../../../convex/_generated/api';
import { useConvexQuery } from '@/hooks/use-convex-query';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useConvexMutation } from '@/hooks/use-convex-query';
import { UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { UserCheck } from 'lucide-react';
const followersPage = () => {
  const { user: currentUser } = useUser();
  const {data:currentConvexUser} = useConvexQuery(
      api.users.getCurrentUser,
      currentUser? {}:"skip"
    )

  const { data: followingUsers } = useConvexQuery(
    api.follows.getFollowingUsers,
    currentConvexUser?._id ? { followerId: currentConvexUser?._id } : "skip"
  );
    const { data: analytics, isLoading: analyticsLoading } = useConvexQuery(
      api.dashboard.getAnalytics
    );

  
  // Check if current user is following this profile
    const { data: isFollowing } = useConvexQuery(
      api.follows.isFollowing,
      currentConvexUser?._id ? { followingId: currentConvexUser._id } : "skip"
    );
    console.log(isFollowing , currentConvexUser?._id)
    // Follow mutation
    const toggleFollow = useConvexMutation(api.follows.toggleFollow);
   // Default values if no data
  const stats = analytics || {
    totalFollowers: 0,
  };
   const handleFollowToggle = async (userId) => {
    if (!currentUser) {
      toast.error("Please sign in to follow users");
      return;
    }

    try {
      await toggleFollow.mutate({ followingId: userId });
    } catch (error) {
      toast.error(error.message || "Failed to update follow status");
    }
  };
  console.log()
  return (
    <div className='m-4 p-2'>
        {followingUsers?.map((user , index)=>(
           <Card
                 className={`card-glass hover:border-purple-500/50 transition-colors p-2`}
                 key={index}
               >
              <CardContent className={"space-y-1"}>
                 <div className='grid grid-cols-2'>
                  {/* //left side  */}
                   <div className='w-50% bottom-10 flex gap-2 justify-center flex-col md:flex-row my-6 lg:justify-start md:justify-start'>
                     <Image
                     src={user?.imageUrl}
                     className="rounded-2xl h-15 w-20"
                     width={50}
                     height={50}
                     alt='user image'
                     />
                     <div className='flex flex-col'>
                      <span>{user.name}</span>
                      <span className='text-slate-500 text-xs'>{user.username}</span>
                     </div>
                    </div>
                    {/* //Right side  */}
                    <div className='space content-evenly m-3 lg:mx-10 lg:gap-4 flex flex-col'>
                      <div>
                        <span className='text-slate-500 text-sm'>Total followers:</span> <span className=''>{stats.totalFollowers}</span>     
                      </div>
                         {/* Follow Button */}
                    {currentUser && (
                      <Button
                        onClick={()=>handleFollowToggle(user._id)}
                        disabled={toggleFollow.isLoading}
                        variant={isFollowing ? "outline" : "primary"}
                        className="mb-4 my-4"
                      >
                        {!isFollowing ? (
                          <>
                            <UserCheck className="h-4 w-4 mr-2" />
                             Unfollow
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Follow
                          </>
                        )}
                      </Button>
                    )}
                   </div>
                  </div>
              </CardContent>
           </Card>
        ))}
    </div>
  )
}

export default followersPage