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
  age: text("age"),
  prayerFrequency: text("prayer_frequency"),
  arabicUnderstanding: text("arabic_understanding"),
  understandingDifficulty: text("understanding_difficulty"),
  importance: text("importance"),
  learningStruggle: text("learning_struggle"),
  arInterest: text("ar_interest"),
  features: jsonb("features"), // Array of selected features
  likelihood: text("likelihood"),
  additionalFeedback: text("additional_feedback"),
  interviewWillingness: text("interview_willingness"),
  investorPresentation: text("investor_presentation"),
  submittedAt: timestamp("submitted_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertWaitlistResponseSchema = createInsertSchema(waitlistResponses).omit({
  id: true,
  submittedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type WaitlistResponse = typeof waitlistResponses.$inferSelect;
export type InsertWaitlistResponse = z.infer<typeof insertWaitlistResponseSchema>;
