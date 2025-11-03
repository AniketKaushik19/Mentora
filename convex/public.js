import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

//Get published posts by username (for public profile)
export const getPublishedPostsByUsername=query({
    args:{
        username:v.string(),
        limit:v.optional(v.number())
    },
    handler:async (ctx , args) => {
        //First get the user by username
        const user=await ctx.db
          .query("users")
          .filter((q)=>q.eq(q.field("username"),args.username))
          .unique()
        if(!user){
            return {post:[] , hasMore:false}
        }

        //Get published posts by this user
        let query=ctx.db
          .query("posts")
          .filter((q)=>
         q.and(
            q.eq(q.field("authorId") , user._id),
            q.eq(q.field("status"),"published")
         ))
         .order("desc")
        
        const limit=args.limit || 10
        const posts=await query.take(limit+1)

        const hasMore=posts.length>limit;
        const finalPosts=hasMore?posts.slice(0,limit):posts

        const postWithAuthor=await Promise.all(
            finalPosts.map(async(post)=>({
                ...post, 
                author:{
                    _id:user._id,
                    name:user.name,
                    username:user.username,
                    imageUrl:user.imageUrl
                }
            }))
        )
        return {
            posts:postWithAuthor,
            hasMore,
        }
    }

})

//Get a single published post by username and post ID 
export const getPublishedPost=query({
    args:{
        username:v.string(),
        postId:v.id("posts"),
    },
    handler:async(ctx,args)=>{
        //Get the user by username
        const user=await ctx.db
          .query("users")
          .filter((q)=>q.eq(q.field("username"),args.username))
          .unique()

        if(!user){
            return null;
        }

        const post=await ctx.db.get(args.postId)

        if(!post){
            return null
        }
        
        //Verify the post belongs to this user and is published
        if(post.authorId!==user._id || post.status!=="published"){
            return null
        }

        return {
            ...post,
            author:{
                _id:user._id,
                name:user.name,
                username:user.username,
                imageUrl:user.imageUrl,
            }
        }
    }
})

//Increment view count for a post 
export const incrementviewCount=mutation({
    args:{postId:v.id("posts")},
    handler:async (ctx,args) => {
        const post=await ctx.db.get(args.postId)

        if(!post || post.status!=="published"){
            return;
        }

        //Update view count 
        await ctx.db.patch(args.postId,{
            viewCount:post.viewCount+1,
        })

        const today=new Date().toISOString().split("T")[0]; //YYYY-MM-DD

        //check if we already have stats for today
        const existingStats=await ctx.db 
          .query("dailyStats")
          .filter((q)=>
         q.and(
            q.eq(q.field("postId"),args.postId),
            q.eq(q.field("date"),today)
         )).unique()

         if(existingStats){
            //Update existing stats
            await ctx.db.patch(existingStats._id,{
                views:existingStats.views+1,
                 updatedAt:Date.now(),
            })
         } else{
            //Create new daily stats entry
            await ctx.db.insert("dailyStats",{
                postId:args.postId,
                date:today,
                views:1,
                createdAt:Date.now(),
                updatedAt:Date.now(),
            })
         }
        return {success:true}
    }
})

  