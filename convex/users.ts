import {
  internalMutation,
  mutation,
  query,
  QueryCtx,
} from "./_generated/server";
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
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

export const updateUser = mutation({
  args: {
    _id: v.id("users"),
    bio: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
    imageUrl: v.optional(v.id("_storage")),
    pushToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await getCurrentUserOrThrow(ctx);
    return await ctx.db.patch(args._id, args);
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    await getCurrentUserOrThrow(ctx);
    await ctx.storage.generateUploadUrl();
  },
});

// IDENTITY CHECK
export const current = query({
  args: {},
  handler: async (ctx) => {
    return getCurrentUser(ctx);
  },
});

export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  handler: async (ctx, { clerkUserId }) => {
    const user = await userByExternalId(ctx, clerkUserId);

    if (user !== null) {
      await ctx.db.delete(user._id);
    } else {
      console.warn(`User with clerkUserId ${clerkUserId} not found`);
    }
  },
});

export const getCurrentUserOrThrow = async (ctx: QueryCtx) => {
  const userRecord = await getCurrentUser(ctx);
  if (userRecord === null) throw new Error("User not found");
  return userRecord;
};

export const getCurrentUser = async (ctx: QueryCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) return null;

  return await userByExternalId(ctx, identity.subject);
};

const userByExternalId = async (ctx: QueryCtx, externalId: string) => {
  return await ctx.db
    .query("users")
    .withIndex("byClerkId", (q) => q.eq("clerkId", externalId))
    .unique();
};

export const getUserByUsername = query({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("username"), args.username))
      .unique();
  },
});
