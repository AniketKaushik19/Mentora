import { defineSchema, defineTable } from "convex/server";
import {v} from 'convex/values'

export default defineSchema({
    users:defineTable({
        name:v.string(),
        email: v.optional(v.string()),
        imageUrl:v.optional(v.string()),
        username:v.optional(v.string()),
        tokenIdentifier:v.string(),  //clerk user ID for auth

        //Activity timestamps
        lastActiveAt:v.optional(v.float64(Date.now())),
    })
    .index("by_token", ["tokenIdentifier"])
    .index("by_email",["email"])  //email lookup
    .index("by_username", ["username"]) //username lookup for public profile

    .searchIndex("search_name" ,{searchField:"name"}) //user search
    .searchIndex("search_email" ,{searchField:"email"}),

})