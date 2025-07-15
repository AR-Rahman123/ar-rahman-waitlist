// Unified API that works identically in both development and production
// Uses database instead of serverless-specific arrays

const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const { Pool, neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');

// Configure Neon for serverless
neonConfig.webSocketConstructor = ws;

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Database connection
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Session storage for admin auth
const authenticatedSessions = new Set();

// Admin authentication endpoints
app.post('/api/admin/login', async (req, res) => {
  const { password } = req.body;
  const correctPassword = process.env.ADMIN_PASSWORD || 'admin123';
  
  if (password === correctPassword) {
    const sessionId = Math.random().toString(36).substring(7);
    authenticatedSessions.add(sessionId);
    
    res.json({ 
      success: true, 
      sessionId,
      message: "Admin login successful" 
    });
  } else {
    res.status(401).json({ 
      success: false, 
      message: "Invalid admin password" 
    });
  }
});

app.post('/api/admin/logout', async (req, res) => {
  const sessionId = req.headers['x-session-id'];
  if (sessionId) {
    authenticatedSessions.delete(sessionId);
  }
  res.json({ 
    success: true, 
    message: "Admin logged out successfully" 
  });
});

app.get('/api/admin/status', async (req, res) => {
  const sessionId = req.headers['x-session-id'];
  const isAuthenticated = sessionId && authenticatedSessions.has(sessionId);
  
  res.json({ 
    authenticated: isAuthenticated 
  });
});

// Auth middleware
function requireAdminAuth(req, res, next) {
  const sessionId = req.headers['x-session-id'];
  
  if (!sessionId || !authenticatedSessions.has(sessionId)) {
    return res.status(401).json({ 
      success: false, 
      message: "Admin authentication required" 
    });
  }
  next();
}

// Waitlist submission endpoint - DATABASE ONLY
app.post('/api/waitlist', async (req, res) => {
  console.log('Waitlist submission received:', req.body);
  
  try {
    // Insert directly into database - no more global arrays
    const result = await pool.query(`
      INSERT INTO waitlist_responses (
        full_name, email, role, age, prayer_frequency, arabic_understanding,
        understanding_difficulty, importance, learning_struggle, current_approach,
        ar_experience, ar_interest, features, likelihood, additional_feedback,
        interview_willingness, investor_presentation, additional_comments
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING id
    `, [
      req.body.fullName, req.body.email, req.body.role, req.body.age,
      req.body.prayerFrequency, req.body.arabicUnderstanding,
      req.body.understandingDifficulty, req.body.importance,
      req.body.learningStruggle, req.body.currentApproach,
      req.body.arExperience, req.body.arInterest,
      JSON.stringify(req.body.features || []), req.body.likelihood,
      req.body.additionalFeedback, req.body.interviewWillingness,
      req.body.investorPresentation, req.body.additionalComments
    ]);
    
    console.log(`New response created with ID: ${result.rows[0].id}`);
    res.json({ success: true, message: "Successfully joined waitlist!" });
    
  } catch (error) {
    console.error('Database insert error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to join waitlist" 
    });
  }
});

// Count endpoint - DATABASE ONLY
app.get('/api/waitlist/count', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) as count FROM waitlist_responses');
    const count = parseInt(result.rows[0].count);
    
    console.log(`Database count: ${count} total responses`);
    res.json({ count });
    
  } catch (error) {
    console.error('Count query error:', error);
    res.status(500).json({ count: 0 });
  }
});

// Admin responses endpoint - DATABASE ONLY
app.get('/api/waitlist/responses', requireAdminAuth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM waitlist_responses 
      ORDER BY created_at DESC
    `);
    
    console.log(`Retrieved ${result.rows.length} responses from database`);
    res.json(result.rows);
    
  } catch (error) {
    console.error('Responses query error:', error);
    res.status(500).json([]);
  }
});

// Analytics endpoint - DATABASE ONLY
app.get('/api/waitlist/analytics', requireAdminAuth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM waitlist_responses');
    const responses = result.rows;
    const totalResponses = responses.length;
    
    // Calculate distributions from actual database data
    const ageDistribution = {};
    const prayerFrequencyDistribution = {};
    const arabicUnderstandingDistribution = {};
    const arInterestDistribution = {};
    const featuresDistribution = {};
    
    responses.forEach(r => {
      // Age distribution
      const age = r.age;
      ageDistribution[age] = (ageDistribution[age] || 0) + 1;
      
      // Prayer frequency
      const freq = r.prayer_frequency;
      prayerFrequencyDistribution[freq] = (prayerFrequencyDistribution[freq] || 0) + 1;
      
      // Arabic understanding
      const understanding = r.arabic_understanding;
      arabicUnderstandingDistribution[understanding] = (arabicUnderstandingDistribution[understanding] || 0) + 1;
      
      // AR interest
      const interest = r.ar_interest;
      arInterestDistribution[interest] = (arInterestDistribution[interest] || 0) + 1;
      
      // Features
      let features = [];
      try {
        features = typeof r.features === 'string' ? JSON.parse(r.features) : r.features || [];
      } catch (e) {
        features = [];
      }
      
      if (Array.isArray(features)) {
        features.forEach(feature => {
          featuresDistribution[feature] = (featuresDistribution[feature] || 0) + 1;
        });
      }
    });
    
    // Daily submissions
    const dailySubmissions = {};
    responses.forEach(r => {
      const date = new Date(r.created_at).toDateString();
      dailySubmissions[date] = (dailySubmissions[date] || 0) + 1;
    });
    
    const dailyData = Object.entries(dailySubmissions)
      .map(([date, count]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        submissions: count
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    res.json({
      totalResponses,
      ageDistribution,
      prayerFrequencyDistribution,
      arabicUnderstandingDistribution,
      arInterestDistribution,
      featuresDistribution,
      dailySubmissions: dailyData
    });
    
  } catch (error) {
    console.error('Analytics query error:', error);
    res.status(500).json({ totalResponses: 0 });
  }
});

// Delete endpoint - DATABASE ONLY
app.delete('/api/waitlist/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM waitlist_responses WHERE id = $1', [id]);
    
    res.json({ success: true, message: "Response deleted successfully" });
    
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete response" 
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    architecture: 'unified-database' 
  });
});

module.exports.handler = serverless(app);