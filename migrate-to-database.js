// Migration script to move from serverless arrays to proper database
// This will ensure seamless portability between Replit and Netlify

const { Pool } = require('@neondatabase/serverless');
const ws = require('ws');

// Configure for Neon database
const neonConfig = { webSocketConstructor: ws };

// Database connection
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  neonConfig 
});

// Base responses that are currently hardcoded in serverless function
const baseResponses = [
  {
    id: 1,
    full_name: "Test User Complete",
    email: "test2@example.com",
    role: "Engineer",
    age: "25-35",
    prayer_frequency: "5_times_daily",
    arabic_understanding: "basic",
    understanding_difficulty: "sometimes",
    importance: "very_important",
    learning_struggle: "understanding_arabic",
    current_approach: "translation_apps",
    ar_experience: "basic_knowledge",
    ar_interest: "very_meaningful",
    features: ["live_translation", "pronunciation_guidance"],
    likelihood: "very_likely",
    additional_feedback: "This sounds amazing!",
    interview_willingness: "yes_happy_to_help",
    investor_presentation: "yes_interested",
    additional_comments: null,
    created_at: "2025-07-13T16:18:36.303Z"
  },
  // ... additional base responses would be added here
];

async function migrateToDatabase() {
  console.log('Starting migration to unified database architecture...');
  
  try {
    // Check if responses already exist in database
    const existingCount = await pool.query('SELECT COUNT(*) FROM waitlist_responses');
    console.log(`Found ${existingCount.rows[0].count} existing responses in database`);
    
    // If we have fewer than expected, migrate the hardcoded ones
    if (existingCount.rows[0].count < baseResponses.length) {
      console.log('Migrating hardcoded responses to database...');
      
      for (const response of baseResponses) {
        await pool.query(`
          INSERT INTO waitlist_responses (
            full_name, email, role, age, prayer_frequency, arabic_understanding,
            understanding_difficulty, importance, learning_struggle, current_approach,
            ar_experience, ar_interest, features, likelihood, additional_feedback,
            interview_willingness, investor_presentation, additional_comments, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
          ON CONFLICT (email, created_at) DO NOTHING
        `, [
          response.full_name, response.email, response.role, response.age,
          response.prayer_frequency, response.arabic_understanding,
          response.understanding_difficulty, response.importance,
          response.learning_struggle, response.current_approach,
          response.ar_experience, response.ar_interest,
          JSON.stringify(response.features), response.likelihood,
          response.additional_feedback, response.interview_willingness,
          response.investor_presentation, response.additional_comments,
          response.created_at
        ]);
      }
      
      console.log('Migration completed successfully');
    }
    
    // Verify final count
    const finalCount = await pool.query('SELECT COUNT(*) FROM waitlist_responses');
    console.log(`Database now contains ${finalCount.rows[0].count} total responses`);
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await pool.end();
  }
}

module.exports = { migrateToDatabase };