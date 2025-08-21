import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    fullName: v.string(),
    emailAddress: v.string(),
    // keep data simple in the DB; turn it into badges/icons in the UI later
    role: v.union(
      v.literal("admin"),
      v.literal("contributor"),
      v.literal("user")
    ),
    location: v.string(),       // e.g. "New York, USA"
    createdAt: v.string(),      // ISO date string: "2025-01-05"
  })
    .index("by_email", ["emailAddress"])
    .index("by_createdAt", ["createdAt"]),
});
