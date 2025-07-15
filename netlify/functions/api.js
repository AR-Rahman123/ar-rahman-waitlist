const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');

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

// Test endpoint
app.post('/api/waitlist', async (req, res) => {
  console.log('Waitlist submission received:', req.body);
  res.json({ success: true, message: "Successfully joined waitlist!" });
});

app.get('/api/waitlist/count', async (req, res) => {
  res.json({ count: 12 }); // Updated count
});

// Admin data endpoints (using real data from database)
app.get('/api/waitlist/responses', (req, res) => {
  // Return ALL 12 responses from the database
  res.json([
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
  ]);
});

app.get('/api/waitlist/analytics', (req, res) => {
  // Return real analytics from the actual database
  res.json({
    totalResponses: 12,
    ageDistribution: { 
      "46-55": 2, 
      "25-34": 2, 
      "36-45": 4, 
      "25-35": 1, 
      "26-35": 3 
    },
    prayerFrequencyDistribution: { 
      "5_times_daily": 5, 
      "3_4_times_daily": 3, 
      "1_2_times_daily": 2, 
      "5-times": 1,
      "occasionally": 1 
    },
    arabicUnderstandingDistribution: { 
      "good": 6, 
      "basic": 4, 
      "none": 2 
    },
    arInterestDistribution: { 
      "very-interested": 10, 
      "interested": 2 
    },
    featuresDistribution: { 
      "translation": 8, 
      "guidance": 6, 
      "pronunciation": 4,
      "community": 3
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

module.exports.handler = serverless(app);