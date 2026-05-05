import { query } from "./_generated/server";
import { v } from "convex/values";


//Get feed
export const getFeed =query({
    args:{
        limit:v.optional(v.number()),
    },
    handler:async(ctx , args )=>{
        const limit=args.limit || 10

        const allPosts=await ctx.db
          .query("posts")
            .filter((q)=>q.eq(q.field("status"), "published"))
            .order("desc")
            .take(limit +1)

        const hasMore=allPosts.length > limit
        const feedPosts=hasMore? allPosts.slice(0,limit) : allPosts

        const postWithAuthor=await Promise.all(
            feedPosts.map(async(post)=>{
                const author=await ctx.db.get(post.authorId)
                return {
                    ...post,
                    author:author?{
                        _id:author._id,
                        name:author.name,
                        username:author.username,
                        imageUrl:author.imageUrl,
                    }: null
                }
            })
        )
        return {
            posts:postWithAuthor.filter((post)=>post.author !==null),
            hasMore,
        }
    }
})

//Get suggested users to follow
export const getSuggestedUsers = query({
    args: { limit: v.optional(v.number()) },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        const limit = args.limit || 10;

        let currentUser = null;
        let excludeUserIds = []; // Ismein wo IDs hongi jo humein nahi dikhani

        if (identity) {
            currentUser = await ctx.db
                .query("users")
                .withIndex("by_token", (q) =>
                    q.eq("tokenIdentifier", identity.tokenIdentifier)
                )
                .unique();

            if (currentUser) {
                // 1. Khud ki ID ko exclude list mein daalein
                excludeUserIds.push(currentUser._id);

                // Get users already being followed
                const follows = await ctx.db
                    .query("follows")
                    .filter((q) => q.eq(q.field("followerId"), currentUser._id))
                    .collect();

                // 2. Jinhe follow kar rakha hai unki IDs bhi exclude list mein daalein
                const followedIds = follows.map((follow) => follow.followingId);
                excludeUserIds = [...excludeUserIds, ...followedIds];
            }
        }

        // Get users who are NOT in our exclude list (Not current user and not already followed)
        const allUsers = await ctx.db
            .query("users")
            .collect();

        // Filter: excludeUserIds mein current user aur followed users dono hain
        const filteredUsers = allUsers.filter((user) => 
            !excludeUserIds.includes(user._id) && user.username
        );

        // Map data and get stats
        const suggestions = await Promise.all(
            filteredUsers.map(async (user) => {
                // Get user's published posts
                const post = await ctx.db
                    .query("posts")
                    .filter((q) =>
                        q.and(
                            q.eq(q.field("authorId"), user._id),
                            q.eq(q.field("status"), "published")
                        )
                    )
                    .collect();

                // Get follower count
                const followers = await ctx.db
                    .query("follows")
                    .filter((q) => q.eq(q.field("followingId"), user._id))
                    .collect();

                const totalViews = post.reduce((sum, p) => sum + (p.viewCount || 0), 0);
                const totalLikes = post.reduce((sum, p) => sum + (p.likeCount || 0), 0);
                const engagementScore = totalLikes + totalViews * 5 + followers.length * 10;

                return {
                    _id: user._id,
                    name: user.name,
                    username: user.username,
                    imageUrl: user.imageUrl,
                    followerCount: followers.length,
                    postCount: post.length,
                    engagementScore,
                    lastPostAt: post.length > 0 ? post[0].publishedAt : null,
                    recentPosts: post.slice(0, 2).map((p) => ({
                        _id: p._id,
                        title: p.title,
                        viewCount: p.viewCount,
                        likeCount: p.likeCount,
                    }))
                };
            })
        );
        // Sort by engagement score and activity, then apply limit
        return suggestions
            .filter((user) => user.postCount > 0) // Sirf active creators dikhayein
            .sort((a, b) => {
                const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
                const aRecent = (a.lastPostAt || 0) > oneWeekAgo;
                const bRecent = (b.lastPostAt || 0) > oneWeekAgo;

                if (aRecent && !bRecent) return -1;
                if (!aRecent && bRecent) return 1;

                return b.engagementScore - a.engagementScore;
            })
            .slice(0, limit);
    }
});

//Get trending posts (high engagement in last 7 days)
export const getTrendingPosts =query({
    args:{limit:v.optional(v.number())},
    handler:async (ctx ,args) => {
        const limit=args.limit || 10;
        const weekAgo=Date.now()-7*24*60*60*1000

        //Get recent published posts
        const recentPosts=await ctx.db
         .query("posts")
         .filter((q)=>
         q.and(
            q.eq(q.field("status") , "published"),
            q.gte(q.field("publishedAt") , weekAgo)
         ))
         .collect()

        //Calculate trending score and sort
        const trendingposts=recentPosts.map((post)=>({
            ...post ,
            trendingposts:post.viewCount+post.likeCount*3
        }))
        .sort((a,b)=>b.trendingScore - a.trendingScore)
        .slice(0,limit)

        //Add author information 
        const postWithAuthor=await Promise.all(
            trendingposts.map(async (post) => {
                const author=await ctx.db.get(post.authorId)
                return {
                    ...post,
                    author:author?{
                        _id:author._id,
                        name:author.username,
                        imageUrl:author.imageUrl
                    } : null
                }
            })
        )
        
        return postWithAuthor.filter((post)=>post.author!==null)
    }
})

