import { defineSchema, defineTable } from "convex/server";
import {v} from 'convex/values'

export default defineSchema({
    users:defineTable({
        name:v.string(),
        email: v.optional(v.string()),
        imageUrl:v.optional(v.string()),
        username:v.optional(v.string()),
        tokenIdentifier:v.string(),  //clerk user ID for auth
        createdAt:v.optional(v.float64(Date.now())),
        //Activity timestamps
        lastActiveAt:v.optional(v.float64(Date.now())),
    })
    .index("by_token", ["tokenIdentifier"])
    .index("by_email",["email"])  //email lookup
    .index("by_username", ["username"]) //username lookup for public profile

    .searchIndex("search_name" ,{searchField:"name"}) //user search
    .searchIndex("search_email" ,{searchField:"email"}),

    posts:defineTable({
        title:v.string(),
        content:v.string(),  //json or html
        status:v.union(v.literal("draft"),v.literal("published")),

        // Author Relationship 
        authorId:v.id("users"),
        
        //content metadata
        tags:v.array(v.string()),
        category:v.optional(v.string()), //single category 
        featuredImage:v.optional(v.string()), //imagekit url

        //timestamps
        createdAt:v.number(),
        updatedAt:v.number(),
        publishedAt:v.optional(v.number()),
        scheduledFor:v.optional(v.number()), //for scheduled publishing

        //Analystics
        viewCount:v.number(),
        likeCount:v.number(),
        
    })
    .index("by_author" , ["authorId"])
    .index("by_status",["status"])
    .index("by_published",["status","publishedAt"])
    .index("by_author_status",["authorId","status"])
    .searchIndex("search_content",{searchField:"title"}),

    comments:defineTable({
        postId:v.id("posts"),
        authorId:v.optional(v.id("users")),  //optional for annoymous comments
        authorName:v.string(),  //for Anonymous or display name
        authorEmail:v.optional(v.string()), //for anonymous comments

        content:v.string(),
        status:v.union(
            v.literal("approved"),
            v.literal("pending"),
            v.literal("rejected")
        ),
        createdAt:v.number(),

    })
      .index("by_post",["postId"])
      .index("by_post_status",["postId","status"])
      .index("by_author",["authorId"]),

    likes:defineTable({
        postId:v.id("posts"),
        userId:v.optional(v.id("users")), //Optional for anonymous likes
        createdAt:v.number(),
    })
     .index("by_post",["postId"])
     .index("by_user",["userId"])
     .index("by_post_user",["postId","userId"]) , //Prevent duplicate likes

   follows:defineTable({
      followerId:v.id("users"),  //User doing the following
      followingId:v.id("users"), //User being followed
      createdAt:v.number(),
   })
     .index("by_follower",["followerId"])
     .index("by_following",["followingId"])
     .index("by_relationship",["followerId", "followingId"]), //prevent duplicates

   dailyStats:defineTable({
    postId:v.id("posts"),
    date:v.string(), //YYYY-MM-DD for easy quering
    views:v.number(),

    createdAt:v.number(),
    updatedAt:v.number(),
   }) 
     .index("by_post",["postId"])
     .index("by_date",["date"])
     .index("by_post_date",["postId","date"]), //unique constraints

})