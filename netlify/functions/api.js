const { createServer } = require('http');
const express = require('express');
const cors = require('cors');
const { neonConfig } = require('@neondatabase/serverless');
const { Pool } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-serverless');
const { eq, sql } = require('drizzle-orm');
const { pgTable, serial, varchar, text, timestamp } = require('drizzle-orm/pg-core');

// Configure Neon
neonConfig.webSocketConstructor = require('ws');

// Database schema
const waitlistResponses = pgTable("waitlist_responses", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  age: varchar("age", { length: 20 }).notNull(),
  prayerFrequency: varchar("prayer_frequency", { length: 50 }).notNull(),
  arabicUnderstanding: varchar("arabic_understanding", { length: 50 }).notNull(),
  understandingDifficulty: varchar("understanding_difficulty", { length: 50 }).notNull(),
  importance: varchar("importance", { length: 50 }).notNull(),
  learningStruggle: varchar("learning_struggle", { length: 50 }).notNull(),
  currentApproach: varchar("current_approach", { length: 50 }).notNull(),
  arExperience: varchar("ar_experience", { length: 50 }).notNull(),
  arInterest: varchar("ar_interest", { length: 50 }).notNull(),
  features: text("features").array(),
  likelihood: varchar("likelihood", { length: 50 }),
  additionalFeedback: text("additional_feedback"),
  interviewWillingness: varchar("interview_willingness", { length: 50 }).notNull(),
  investorPresentation: varchar("investor_presentation", { length: 50 }).notNull(),
  additionalComments: text("additional_comments"),
  createdAt: timestamp("created_at").defaultNow(),
});

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

// Routes
app.post('/api/waitlist', async (req, res) => {
  try {
    console.log('Received waitlist submission:', req.body);
    
    const [response] = await db
      .insert(waitlistResponses)
      .values({
        fullName: req.body.fullName,
        email: req.body.email,
        age: req.body.age,
        prayerFrequency: req.body.prayerFrequency,
        arabicUnderstanding: req.body.arabicUnderstanding,
        understandingDifficulty: req.body.understandingDifficulty,
        importance: req.body.importance,
        learningStruggle: req.body.learningStruggle,
        currentApproach: req.body.currentApproach,
        arExperience: req.body.arExperience,
        arInterest: req.body.arInterest,
        features: req.body.features,
        likelihood: req.body.likelihood,
        additionalFeedback: req.body.additionalFeedback,
        interviewWillingness: req.body.interviewWillingness,
        investorPresentation: req.body.investorPresentation,
        additionalComments: req.body.additionalComments,
      })
      .returning();

    console.log('Successfully created waitlist response:', response);
    res.json({ success: true, message: "Successfully joined waitlist!" });
  } catch (error) {
    console.error('Error creating waitlist response:', error);
    res.status(500).json({ error: 'Failed to join waitlist', message: error.message });
  }
});

app.get('/api/waitlist/count', async (req, res) => {
  try {
    const [result] = await db
      .select({ count: sql`count(*)` })
      .from(waitlistResponses);
    res.json({ count: parseInt(result.count) });
  } catch (error) {
    console.error('Error getting waitlist count:', error);
    res.status(500).json({ error: 'Failed to get count', message: error.message });
  }
});

// For serverless
const serverless = require('serverless-http');
module.exports.handler = serverless(app);