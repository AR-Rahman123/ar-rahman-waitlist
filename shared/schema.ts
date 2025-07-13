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
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  role: text("role"),
  age: text("age").notNull(),
  prayerFrequency: text("prayer_frequency").notNull(),
  arabicUnderstanding: text("arabic_understanding").notNull(),
  understandingDifficulty: text("understanding_difficulty").notNull(),
  importance: text("importance").notNull(),
  learningStruggle: text("learning_struggle").notNull(),
  currentApproach: text("current_approach").notNull(),
  arExperience: text("ar_experience").notNull(),
  arInterest: text("ar_interest").notNull(),
  features: jsonb("features").notNull(), // Array of selected features
  likelihood: text("likelihood"),
  additionalFeedback: text("additional_feedback"),
  interviewWillingness: text("interview_willingness").notNull(),
  investorPresentation: text("investor_presentation").notNull(),
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
