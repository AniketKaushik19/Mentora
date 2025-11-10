import { internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const toggleFollow = mutation({
    args:{followingId:v.id("users")},
    handler:async (ctx , args) => {
        const follower=await ctx.runQuery(internal.users.getCurrentUser)
        console.log(follower.id , args.id )
        if(follower._id=== args.followingId){
            return  new Error("You cannot follow yourself")
        }

        //Check if already following
        const existingFollow =await ctx.db
          .query("follows")
          .filter((q)=>
          q.and(
            q.eq(q.field("followerId"),follower._id)
          )).unique()

       if(existingFollow){
        //Unfollow
        await ctx.db.delete(existingFollow._id);
        return {following : false}
       }
       else{
        //follow 
        await ctx.db.insert("follows",{
            followerId:follower._id,
            followingId:args.followingId,
            createdAt:Date.now(),
        })
        return {following:true}
       }
    }
})

//check if current user is following a specific user
export const isFollowing = query({
    args:{followingId:v.optional(v.id("users"))},
    handler:async (ctx, args) => {
        const follower=await ctx.runQuery(internal.users.getCurrentUser)
        const follow=await ctx.db
         .query("follows")
         .filter((q)=>
          q.and(
            q.eq(q.field("followerId"),follower._id),
            q.eq(q.field("followingId"),args.followingId)
          ) 
        ).unique()

        return !!follow
    }
})

//Get follower count for a user
export const getFollowerCount =query({
    args:{userId:v.id("users")},
    handler:async(ctx,args)=>{
        const follows=await ctx.db
          .query("follows")
          .filter((q)=>q.eq(q.field("followingId"),args.userId))
          .collect()
        return follows.length
    }
})

//follower information
export const getFollowingUsers = query({
  args: {
    followerId: v.id("users"),   
  },
  handler: async (ctx, args) => {
    const followDocs = await ctx.db
      .query("follows")
      .filter((q) => q.eq(q.field("followerId"), args.followerId))
      .collect();

    const followingIds = followDocs.map((doc) => doc.followingId);

    const users = await Promise.all(
      followingIds.map((id) => ctx.db.get(id))
    );

    return users.filter(Boolean); // remove nulls if any user was deleted
  },
});