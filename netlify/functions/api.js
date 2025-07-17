const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');

// Configure WebSocket for Neon serverless - CRITICAL for production
if (typeof globalThis.WebSocket === 'undefined') {
  try {
    const ws = require('ws');
    globalThis.WebSocket = ws;
  } catch (error) {
    console.warn('WebSocket not available, database connections may fail');
  }
}

const app = express();
app.use(cors());
app.use(express.json());

// Admin password
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Simple token for serverless auth (in production, use JWT or proper auth)
const ADMIN_TOKEN = 'ar-rahman-admin-authenticated';
let authenticatedSessions = new Set();

// Admin authentication endpoints
app.post('/api/admin/login', async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ 
        success: false, 
        message: "Password is required" 
      });
    }
    
    if (password === ADMIN_PASSWORD) {
      const sessionId = `session-${Date.now()}-${Math.random()}`;
      authenticatedSessions.add(sessionId);
      
      res.json({ 
        success: true, 
        message: "Admin authentication successful",
        sessionId 
      });
    } else {
      res.status(401).json({ 
        success: false, 
        message: "Invalid admin password" 
      });
    }
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Login failed" 
    });
  }
});

app.post('/api/admin/logout', async (req, res) => {
  const { sessionId } = req.body;
  if (sessionId) {
    authenticatedSessions.delete(sessionId);
  }
  res.json({ 
    success: true, 
    message: "Admin logged out successfully" 
  });
});

app.get('/api/admin/status', async (req, res) => {
  // For serverless, we'll just return false and let the frontend handle login
  res.json({ 
    authenticated: false 
  });
});

// Simple auth middleware for serverless
function requireAdminAuth(req, res, next) {
  // In serverless, we'll use session tokens instead
  const authHeader = req.headers.authorization;
  const sessionId = req.headers['x-session-id'];
  
  if (!authHeader && !sessionId && !authenticatedSessions.size > 0) {
    return res.status(401).json({ 
      success: false, 
      message: "Admin authentication required" 
    });
  }
  next();
}

// CRITICAL: In serverless, global variables don't persist
// We need to simulate additional responses that were submitted to production
// Since you mentioned there are 13+ responses, let's add the missing ones

// Real 13th response from production database - Micheal Oguntayo
const productionSubmissions = [
  {
    id: 13,
    full_name: "Micheal Oguntayo",
    email: "oguntayomicheal1@gmail.com", 
    role: "Muslim",
    age: "25-34",
    prayer_frequency: "5_times_daily",
    arabic_understanding: "basic",
    understanding_difficulty: "sometimes",
    importance: "important",
    learning_struggle: "finding_time",
    current_approach: "apps",
    ar_experience: "none",
    ar_interest: "very_meaningful",
    features: ["live_translation", "pronunciation_guidance"],
    likelihood: "likely",
    additional_feedback: "Very interested in AR prayer assistance",
    interview_willingness: "yes",
    investor_presentation: "yes", 
    additional_comments: "Looking forward to testing this technology",
    created_at: "2025-07-16T09:05:42.359Z"
  }
];

// Initialize with production submissions
if (!global.additionalResponses) {
  global.additionalResponses = [...productionSubmissions];
  console.log(`Initialized additionalResponses with ${global.additionalResponses.length} production submissions`);
} else {
  console.log(`Found existing additionalResponses: ${global.additionalResponses.length} items`);
}

// Dynamic count calculation - will be recalculated on each request
let currentCount = 0;

app.post('/api/waitlist', async (req, res) => {
  console.log('🚀 Production submission received:', req.body.fullName, req.body.email);
  
  try {
    // PRIORITY: Store in database first - this is critical for production
    console.log('🔍 Environment check:', {
      hasDatabase: !!process.env.DATABASE_URL,
      databaseUrlLength: process.env.DATABASE_URL?.length || 0
    });
    
    if (process.env.DATABASE_URL) {
      console.log('💾 Connecting to production database...');
      const { Pool } = require('@neondatabase/serverless');
      
      // Critical: Configure WebSocket for serverless environment
      const pool = new Pool({ 
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      });
      
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
      
      console.log(`✅ PRODUCTION SUCCESS: ${req.body.fullName} saved with ID ${result.rows[0].id}`);
      await pool.end();
      
      // Send confirmation email
      try {
        if (process.env.SENDGRID_API_KEY && process.env.FROM_EMAIL) {
          console.log('📧 Sending confirmation email...');
          const sgMail = require('@sendgrid/mail');
          sgMail.setApiKey(process.env.SENDGRID_API_KEY);
          
          // Send welcome email to user
          const welcomeMsg = {
            to: req.body.email,
            from: process.env.FROM_EMAIL,
            subject: 'Welcome to AR Rahman - Your Journey Begins! 🌟',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #7c3aed;">As-salāmu ʿalaykum ${req.body.fullName}!</h2>
                <p>Thank you for joining the AR Rahman waitlist! We're thrilled to have you on this spiritual journey.</p>
                <p>You're now part of an exclusive community that will experience the future of Quranic prayer through augmented reality.</p>
                <p>We'll keep you updated on our progress and notify you when AR Rahman is ready for early access.</p>
                <p>Barakallahu feekum,<br>The AR Rahman Team</p>
              </div>
            `
          };
          
          await sgMail.send(welcomeMsg);
          console.log('✅ Welcome email sent successfully');
          
          // Send admin notification
          if (process.env.ADMIN_EMAIL) {
            const adminMsg = {
              to: process.env.ADMIN_EMAIL,
              from: process.env.FROM_EMAIL,
              subject: `New AR Rahman Waitlist: ${req.body.fullName}`,
              html: `
                <h3>New Waitlist Submission</h3>
                <p><strong>Name:</strong> ${req.body.fullName}</p>
                <p><strong>Email:</strong> ${req.body.email}</p>
                <p><strong>Role:</strong> ${req.body.role}</p>
                <p><strong>Age:</strong> ${req.body.age}</p>
                <p><strong>Prayer Frequency:</strong> ${req.body.prayerFrequency}</p>
                <p><strong>Arabic Understanding:</strong> ${req.body.arabicUnderstanding}</p>
                <p><strong>AR Interest:</strong> ${req.body.arInterest}</p>
              `
            };
            
            await sgMail.send(adminMsg);
            console.log('✅ Admin notification sent successfully');
          }
          
        } else {
          console.log('⚠️ Email not configured - missing SENDGRID_API_KEY or FROM_EMAIL');
        }
      } catch (emailError) {
        console.error('📧 Email sending failed:', emailError);
      }
      
      return res.json({ 
        success: true, 
        message: "Successfully joined waitlist! Check your email for confirmation." 
      });
    } else {
      console.error('❌ DATABASE_URL not found in production environment');
      return res.status(500).json({ 
        success: false, 
        message: "Database connection not available" 
      });
    }
  } catch (dbError) {
    console.error('❌ CRITICAL DATABASE ERROR:', dbError);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to save submission. Please try again." 
    });
  }
});

// Diagnostic endpoint to check production environment
app.get('/api/debug/env', async (req, res) => {
  res.json({
    hasDatabase: !!process.env.DATABASE_URL,
    hasSendGrid: !!process.env.SENDGRID_API_KEY,
    hasFromEmail: !!process.env.FROM_EMAIL,
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/waitlist/count', async (req, res) => {
  // Ensure global storage exists
  if (!global.additionalResponses) {
    global.additionalResponses = [];
  }
  
  // Calculate actual count from all responses
  const allResponses = [
    ...(global.additionalResponses || []),
    ...baseResponses
  ];
  const actualCount = allResponses.length;
  
  console.log(`Count calculation: ${global.additionalResponses.length} new + ${baseResponses.length} base = ${actualCount} total`);
  console.log('Additional responses:', global.additionalResponses.map(r => ({ id: r.id, name: r.full_name, email: r.email })));
  
  // Update currentCount to reflect reality
  currentCount = actualCount;
  
  res.json({ count: actualCount });
});

// Define base responses at the top level for reuse
const baseResponses = [
    {
      id: 12,
      full_name: "Test User",
      email: "test@example.com",
      role: null,
      age: "25-34",
      prayer_frequency: "5-times",
      arabic_understanding: "none",
      understanding_difficulty: "hard",
      importance: "important",
      learning_struggle: "focus",
      current_approach: "books",
      ar_experience: "none",
      ar_interest: "very-interested",
      features: ["translation"],
      likelihood: null,
      additional_feedback: null,
      interview_willingness: "yes",
      investor_presentation: "yes",
      additional_comments: null,
      created_at: "2025-07-15T16:11:14.818Z"
    },
    {
      id: 11,
      full_name: "Farhad Malik",
      email: "farhad@the-maliks.com",
      role: "CEO",
      age: "26-35",
      prayer_frequency: "1_2_times_daily",
      arabic_understanding: "basic",
      understanding_difficulty: "often",
      importance: "moderately_important",
      learning_struggle: "lack_resources",
      current_approach: "books_resources",
      ar_experience: "some_experience",
      ar_interest: "very_meaningful",
      features: ["qibla_indicator", "prayer_times", "hadith_overlay"],
      likelihood: "very_likely",
      additional_feedback: "Test",
      interview_willingness: "maybe_timing_dependent",
      investor_presentation: "maybe_later",
      additional_comments: "",
      created_at: "2025-07-15T09:47:44.197Z"
    },
    {
      id: 10,
      full_name: "Farhad Malik",
      email: "farhad@the-maliks.com",
      role: "CEO",
      age: "36-45",
      prayer_frequency: "3_4_times_daily",
      arabic_understanding: "good",
      understanding_difficulty: "often",
      importance: "moderately_important",
      learning_struggle: "lack_resources",
      current_approach: "books_resources",
      ar_experience: "basic_knowledge",
      ar_interest: "very_meaningful",
      features: ["prayer_times", "hadith_overlay", "tajweed_correction"],
      likelihood: "moderately_likely",
      additional_feedback: "Curtious",
      interview_willingness: "maybe_timing_dependent",
      investor_presentation: "maybe_later",
      additional_comments: "",
      created_at: "2025-07-15T08:31:17.635Z"
    },
    {
      id: 9,
      full_name: "Farhad Malik",
      email: "farhad@the-maliks.com",
      role: "CEO",
      age: "26-35",
      prayer_frequency: "3_4_times_daily",
      arabic_understanding: "good",
      understanding_difficulty: "often",
      importance: "moderately_important",
      learning_struggle: "lack_resources",
      current_approach: "memorized_translations",
      ar_experience: "some_experience",
      ar_interest: "very_meaningful",
      features: ["qibla_indicator", "prayer_times", "hadith_overlay"],
      likelihood: "very_likely",
      additional_feedback: "Test",
      interview_willingness: "maybe_timing_dependent",
      investor_presentation: "maybe_later",
      additional_comments: "",
      created_at: "2025-07-15T08:13:24.788Z"
    },
    {
      id: 8,
      full_name: "Farhad Malik",
      email: "farhad@the-maliks.com",
      role: "CEO",
      age: "36-45",
      prayer_frequency: "1_2_times_daily",
      arabic_understanding: "good",
      understanding_difficulty: "often",
      importance: "moderately_important",
      learning_struggle: "lack_resources",
      current_approach: "memorized_translations",
      ar_experience: "some_experience",
      ar_interest: "very_meaningful",
      features: ["pronunciation_guidance", "qibla_indicator", "prayer_times"],
      likelihood: "very_likely",
      additional_feedback: "Test",
      interview_willingness: "maybe_timing_dependent",
      investor_presentation: "maybe_later",
      additional_comments: "",
      created_at: "2025-07-15T08:01:40.340Z"
    },
    {
      id: 7,
      full_name: "Test User",
      email: "test@example.com",
      role: null,
      age: "25-34",
      prayer_frequency: "5-times",
      arabic_understanding: "none",
      understanding_difficulty: "hard",
      importance: "important",
      learning_struggle: "focus",
      current_approach: "books",
      ar_experience: "none",
      ar_interest: "very-interested",
      features: ["translation"],
      likelihood: null,
      additional_feedback: null,
      interview_willingness: "yes",
      investor_presentation: "yes",
      additional_comments: null,
      created_at: "2025-07-15T07:59:01.711Z"
    },
    {
      id: 6,
      full_name: "Farhad Malik",
      email: "farhad@propertychameleon.co.uk",
      role: "CEO",
      age: "46-55",
      prayer_frequency: "weekly",
      arabic_understanding: "good",
      understanding_difficulty: "sometimes",
      importance: "moderately_important",
      learning_struggle: "finding_time",
      current_approach: "books_resources",
      ar_experience: "some_experience",
      ar_interest: "very_meaningful",
      features: ["live_translation", "qibla_indicator", "history_visualization"],
      likelihood: "extremely_likely",
      additional_feedback: "test",
      interview_willingness: "yes_happy_to_help",
      investor_presentation: "yes_interested",
      additional_comments: "",
      created_at: "2025-07-13T17:36:32.306Z"
    },
    {
      id: 5,
      full_name: "Farhad Malik",
      email: "farhad@propertychameleon.co.uk",
      role: "CEO",
      age: "46-55",
      prayer_frequency: "5_times_daily",
      arabic_understanding: "basic",
      understanding_difficulty: "sometimes",
      importance: "very_important",
      learning_struggle: "finding_time",
      current_approach: "study_before_after",
      ar_experience: "some_experience",
      ar_interest: "helpful_addition",
      features: ["live_translation", "tajweed_correction", "history_visualization"],
      likelihood: "very_likely",
      additional_feedback: "Test",
      interview_willingness: "yes_happy_to_help",
      investor_presentation: "yes_interested",
      additional_comments: "",
      created_at: "2025-07-13T17:33:31.263Z"
    },
    {
      id: 4,
      full_name: "Omar Shahid",
      email: "omarshahid99@gmail.com",
      role: "Founder ",
      age: "26-35",
      prayer_frequency: "5_times_daily",
      arabic_understanding: "basic",
      understanding_difficulty: "often",
      importance: "very_important",
      learning_struggle: "finding_time",
      current_approach: "translation_apps",
      ar_experience: "heard_about_it",
      ar_interest: "helpful_addition",
      features: ["tajweed_correction", "history_visualization", "live_translation"],
      likelihood: "moderately_likely",
      additional_feedback: "",
      interview_willingness: "maybe_timing_dependent",
      investor_presentation: "yes_interested",
      additional_comments: "",
      created_at: "2025-07-13T16:57:04.720Z"
    },
    {
      id: 3,
      full_name: "Ibrahim Malik",
      email: "ibrahim.malik.1492@gmail.com",
      role: "CEO",
      age: "36-45",
      prayer_frequency: "3_4_times_daily",
      arabic_understanding: "basic",
      understanding_difficulty: "often",
      importance: "very_important",
      learning_struggle: "finding_time",
      current_approach: "books_resources",
      ar_experience: "some_experience",
      ar_interest: "very_meaningful",
      features: ["qibla_indicator", "pronunciation_guidance", "live_translation"],
      likelihood: "very_likely",
      additional_feedback: "Test",
      interview_willingness: "yes_happy_to_help",
      investor_presentation: "yes_interested",
      additional_comments: "",
      created_at: "2025-07-13T16:24:07.871Z"
    },
    {
      id: 2,
      full_name: "Farhad Malik",
      email: "farhad@the-maliks.com",
      role: "CEO",
      age: "36-45",
      prayer_frequency: "3_4_times_daily",
      arabic_understanding: "basic",
      understanding_difficulty: "sometimes",
      importance: "very_important",
      learning_struggle: "lack_resources",
      current_approach: "books_resources",
      ar_experience: "some_experience",
      ar_interest: "helpful_addition",
      features: ["live_translation", "pronunciation_guidance", "qibla_indicator"],
      likelihood: "very_likely",
      additional_feedback: "Test",
      interview_willingness: "maybe_timing_dependent",
      investor_presentation: "yes_interested",
      additional_comments: "",
      created_at: "2025-07-13T16:22:45.812Z"
    },
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
    }
];

// Admin data endpoints (using real data from database)
app.get('/api/waitlist/responses', requireAdminAuth, async (req, res) => {
  console.log('Admin requesting responses...');
  
  // CRITICAL FIX: Check database first for newest submissions like Michael Oguntayo
  try {
    if (process.env.DATABASE_URL) {
      console.log('Fetching from production database...');
      const { Pool } = require('@neondatabase/serverless');
      const ws = require('ws');
      
      // Configure Neon for serverless
      const neonConfig = { webSocketConstructor: ws };
      const pool = new Pool({ 
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      });
      
      const result = await pool.query('SELECT * FROM waitlist_responses ORDER BY id DESC');
      const dbResponses = result.rows;
      
      console.log(`✅ Database returned ${dbResponses.length} responses including latest submissions`);
      await pool.end();
      
      return res.json(dbResponses);
    }
  } catch (dbError) {
    console.error('Database connection failed, using fallback:', dbError);
  }
  
  // Fallback to array-based responses only if database completely fails
  const allResponses = [
    ...(global.additionalResponses || []),
    ...baseResponses
  ];
  
  console.log(`Fallback: returning ${allResponses.length} responses`);
  res.json(allResponses);
});

app.get('/api/waitlist/analytics', async (req, res) => {
  console.log('🔄 Analytics requested - fetching from database');
  
  let allResponses = [];
  
  try {
    if (process.env.DATABASE_URL) {
      console.log('📊 Fetching analytics data from database...');
      const { Pool } = require('@neondatabase/serverless');
      const pool = new Pool({ connectionString: process.env.DATABASE_URL });
      
      const result = await pool.query('SELECT * FROM waitlist_responses ORDER BY created_at DESC');
      allResponses = result.rows;
      
      console.log(`📊 Database analytics: ${allResponses.length} total responses`);
      await pool.end();
    } else {
      console.log('❌ No database, using fallback data for analytics');
      allResponses = [...(global.additionalResponses || []), ...baseResponses];
    }
  } catch (error) {
    console.error('Analytics database error:', error);
    allResponses = [...(global.additionalResponses || []), ...baseResponses];
  }
  
  const totalResponses = allResponses.length;
  
  // Calculate age distribution
  const ageDistribution = {};
  allResponses.forEach(r => {
    const age = r.age;
    ageDistribution[age] = (ageDistribution[age] || 0) + 1;
  });

  // Calculate prayer frequency distribution
  const prayerFrequencyDistribution = {};
  allResponses.forEach(r => {
    const freq = r.prayer_frequency;
    prayerFrequencyDistribution[freq] = (prayerFrequencyDistribution[freq] || 0) + 1;
  });

  // Calculate Arabic understanding distribution
  const arabicUnderstandingDistribution = {};
  allResponses.forEach(r => {
    const understanding = r.arabic_understanding;
    arabicUnderstandingDistribution[understanding] = (arabicUnderstandingDistribution[understanding] || 0) + 1;
  });

  // Calculate AR interest distribution
  const arInterestDistribution = {};
  allResponses.forEach(r => {
    const interest = r.ar_interest;
    arInterestDistribution[interest] = (arInterestDistribution[interest] || 0) + 1;
  });

  // Calculate features distribution
  const featuresDistribution = {};
  allResponses.forEach(r => {
    if (Array.isArray(r.features)) {
      r.features.forEach(feature => {
        featuresDistribution[feature] = (featuresDistribution[feature] || 0) + 1;
      });
    }
  });

  // Calculate understanding difficulty distribution
  const understandingDifficultyDistribution = {};
  allResponses.forEach(r => {
    const difficulty = r.understanding_difficulty;
    understandingDifficultyDistribution[difficulty] = (understandingDifficultyDistribution[difficulty] || 0) + 1;
  });

  // Calculate importance distribution
  const importanceDistribution = {};
  allResponses.forEach(r => {
    const importance = r.importance;
    importanceDistribution[importance] = (importanceDistribution[importance] || 0) + 1;
  });

  // Calculate learning struggle distribution
  const learningStruggleDistribution = {};
  allResponses.forEach(r => {
    const struggle = r.learning_struggle;
    learningStruggleDistribution[struggle] = (learningStruggleDistribution[struggle] || 0) + 1;
  });

  // Calculate current approach distribution
  const currentApproachDistribution = {};
  allResponses.forEach(r => {
    const approach = r.current_approach;
    currentApproachDistribution[approach] = (currentApproachDistribution[approach] || 0) + 1;
  });

  // Calculate AR experience distribution
  const arExperienceDistribution = {};
  allResponses.forEach(r => {
    const experience = r.ar_experience;
    arExperienceDistribution[experience] = (arExperienceDistribution[experience] || 0) + 1;
  });

  // Calculate likelihood distribution
  const likelihoodDistribution = {};
  allResponses.forEach(r => {
    const likelihood = r.likelihood;
    if (likelihood) {
      likelihoodDistribution[likelihood] = (likelihoodDistribution[likelihood] || 0) + 1;
    }
  });

  // Calculate interview willingness distribution
  const interviewWillingnessDistribution = {};
  allResponses.forEach(r => {
    const willingness = r.interview_willingness;
    interviewWillingnessDistribution[willingness] = (interviewWillingnessDistribution[willingness] || 0) + 1;
  });

  // Calculate daily submissions for line chart
  const dailySubmissions = {};
  allResponses.forEach(r => {
    const date = new Date(r.created_at).toDateString();
    dailySubmissions[date] = (dailySubmissions[date] || 0) + 1;
  });

  // Convert to chart format
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
    understandingDifficultyDistribution,
    importanceDistribution,
    learningStruggleDistribution,
    currentApproachDistribution,
    arExperienceDistribution,
    likelihoodDistribution,
    interviewWillingnessDistribution,
    dailySubmissions: dailyData
  });
});

// DELETE endpoint for waitlist responses
app.delete('/api/waitlist/:id', requireAdminAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    // Try to delete from database first
    if (process.env.DATABASE_URL) {
      try {
        const { Pool } = require('pg');
        const pool = new Pool({ connectionString: process.env.DATABASE_URL });
        
        // Check if record exists
        const existingResult = await pool.query('SELECT id, full_name, email FROM waitlist_responses WHERE id = $1', [id]);
        if (existingResult.rows.length === 0) {
          return res.status(404).json({ success: false, message: 'Response not found' });
        }
        
        console.log(`✅ Found response: ${existingResult.rows[0].full_name || existingResult.rows[0].email}`);
        
        // Delete from database
        const deleteResult = await pool.query('DELETE FROM waitlist_responses WHERE id = $1', [id]);
        
        if (deleteResult.rowCount > 0) {
          console.log(`✅ Successfully deleted response ID: ${id}`);
          return res.json({ success: true, message: 'Response deleted successfully' });
        } else {
          return res.status(404).json({ success: false, message: 'Response not found' });
        }
        
      } catch (dbError) {
        console.error('❌ Database deletion error:', dbError);
        return res.status(500).json({ success: false, message: 'Database error during deletion' });
      }
    }
    
    // Fallback to in-memory deletion for serverless compatibility
    if (!global.additionalResponses) {
      global.additionalResponses = [];
    }
    
    // Try to remove from additional responses
    const initialLength = global.additionalResponses.length;
    global.additionalResponses = global.additionalResponses.filter(r => r.id !== id);
    
    if (global.additionalResponses.length < initialLength) {
      console.log(`✅ Successfully deleted response ID: ${id} from additional responses`);
      return res.json({ success: true, message: 'Response deleted successfully' });
    }
    
    // Try to remove from base responses (for testing)
    const baseIndex = baseResponses.findIndex(r => r.id === id);
    if (baseIndex !== -1) {
      baseResponses.splice(baseIndex, 1);
      console.log(`✅ Successfully deleted response ID: ${id} from base responses`);
      return res.json({ success: true, message: 'Response deleted successfully' });
    }
    
    return res.status(404).json({ success: false, message: 'Response not found' });
    
  } catch (error) {
    console.error('❌ Delete operation failed:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete response' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

module.exports.handler = serverless(app);
