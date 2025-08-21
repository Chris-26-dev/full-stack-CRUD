import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// List users (newest first)
export const list = query({
  args: {},
  handler: async (ctx) => {
    // order('desc') sorts by insertion time
    return await ctx.db.query("users").order("desc").collect();
  },
});

// Create a user
export const create = mutation({
  args: {
    fullName: v.string(),
    emailAddress: v.string(),
    role: v.union(
      v.literal("admin"),
      v.literal("contributor"),
      v.literal("user")
    ),
    location: v.string(),
    createdAt: v.string(), // ISO date
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("users", args);
  },
});

// (Optional) Update a user
export const update = mutation({
  args: {
    id: v.id("users"),
    fullName: v.optional(v.string()),
    emailAddress: v.optional(v.string()),
    role: v.optional(
      v.union(
        v.literal("admin"),
        v.literal("contributor"),
        v.literal("user")
      )
    ),
    location: v.optional(v.string()),
    createdAt: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...patch }) => {
    await ctx.db.patch(id, patch);
  },
});

// Delete a user
export const remove = mutation({
  args: {
    id: v.id("users"),
  },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
