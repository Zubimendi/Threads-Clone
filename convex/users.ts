import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";
export const getUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const createUsers = internalMutation({
  args: {
    email: v.string(),
    clerkId: v.string(),
    imageUrl: v.optional(v.string()),
    first_name: v.optional(v.string()),
    last_name: v.optional(v.string()),
    username: v.union(v.string(), v.null()),
    bio: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
    followersCount: v.number(),
  },
  handler: async (ctx, args) => {
    console.log("Created Users", args);
    const userId = await ctx.db.insert("users", {
      ...args,
      username: args.username || `${args.first_name} ${args.last_name}`,
    });

    return userId;
  },
});

export const getUserByClerkId = query({
  args: {
    clerkId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .unique();
  },
});

export const getUserById = query({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId)
  },
});
