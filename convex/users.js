import { mutation, query } from "./_generated/server";
import {v} from "convex/values"
import {internal} from './_generated/api'


export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    // Check if we've already stored this identity before.
    // Note: If you don't want to define an index right away, you can use
    // ctx.db.query("users")
    //  .filter(q => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
    //  .unique();
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();
    if (user !== null) {
      // If we've seen this identity before but the name has changed, patch the value.
      if (user.name !== identity.name) {
        await ctx.db.patch(user._id, { name: identity.name });
      }
      return user._id;
    }
    // If it's a new identity, create a new `User`.
    return await ctx.db.insert("users", {
    name: identity.name ?? "Anonymous",
    email: identity.email ?? "not available",
    tokenIdentifier: identity.tokenIdentifier,
    imageUrl: identity.pictureUrl ?? null, // Clerk's profile image
    lastActiveAt: Date.now(),
});
  },
});

export const getCurrentUser=query({
    handler:async (ctx) => {
        const identity=await ctx.auth.getUserIdentity()
        if(!identity){
            throw new Error("Not authenticated");
        }
        const user=await ctx.db.query("users")
        .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();
      if(!user){
        throw new Error ("User not found")
      }
      return user;
    }
})

export const updateUsername=mutation({
  args:{
    username:v.string(),
  },
  handler:async(ctx,args)=>{
     const user=await ctx.runQuery(internal.users.getCurrentUser)
     const usernameRegex=/^[a-zA-Z0-9_-]+$/

     if(!usernameRegex.test(args.username)){
       throw new Error(
        "Username can only contain letters, numbers, underscore and hyphens"
       )
     }
     
     if(args.username!==user.username){
      const existingUser=await ctx.db
        .query("users")
        .withIndex("by_username",(q)=>q.eq("username",args.username))
        .unique()

        if(existingUser){
          throw new Error("Username is already taken")
        }
     }

     await ctx.db.patch(user._id,{
      username:args.username,
      lastActiveAt:Date.now(),
     })
     return user._id;
  }
})