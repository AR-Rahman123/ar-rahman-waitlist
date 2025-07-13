import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const waitlistResponses = pgTable("waitlist_responses", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number"),
  country: text("country").notNull(),
  ageRange: text("age_range").notNull(),
  prayerFrequency: text("prayer_frequency").notNull(),
  arabicUnderstanding: text("arabic_understanding").notNull(),
  arInterest: text("ar_interest").notNull(),
  interestedFeatures: jsonb("interested_features").notNull(), // Array of selected features
  additionalComments: text("additional_comments"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertWaitlistResponseSchema = createInsertSchema(waitlistResponses).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type WaitlistResponse = typeof waitlistResponses.$inferSelect;
export type InsertWaitlistResponse = z.infer<typeof insertWaitlistResponseSchema>;
