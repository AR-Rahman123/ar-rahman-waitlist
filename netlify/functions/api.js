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

// Initialize global storage if not exists
if (!global.additionalResponses) {
  global.additionalResponses = [];
}

// Dynamic count calculation - will be recalculated on each request
let currentCount = 0;

app.post('/api/waitlist', async (req, res) => {
  console.log('Waitlist submission received:', req.body);
  
  // Ensure global storage exists
  if (!global.additionalResponses) {
    global.additionalResponses = [];
  }
  
  // Calculate current count from existing data
  const allResponses = [
    ...(global.additionalResponses || []),
    ...baseResponses
  ];
  currentCount = allResponses.length + 1; // Next ID
  
  console.log(`New submission ID will be: ${currentCount} (${global.additionalResponses.length} existing new + ${baseResponses.length} base + 1)`);
  
  // Store the new submission in a simple array (in production, this would go to database)
  const newSubmission = {
    id: currentCount,
    full_name: req.body.fullName || 'New User',
    email: req.body.email || 'user@example.com',
    role: req.body.role || null,
    age: req.body.age || '25-34',
    prayer_frequency: req.body.prayerFrequency || '5_times_daily',
    arabic_understanding: req.body.arabicUnderstanding || 'basic',
    understanding_difficulty: req.body.understandingDifficulty || 'sometimes',
    importance: req.body.importance || 'important',
    learning_struggle: req.body.learningStruggle || 'finding_time',
    current_approach: req.body.currentApproach || 'apps',
    ar_experience: req.body.arExperience || 'none',
    ar_interest: req.body.arInterest || 'interested',
    features: req.body.features || [],
    likelihood: req.body.likelihood || 'likely',
    additional_feedback: req.body.additionalFeedback || '',
    interview_willingness: req.body.interviewWillingness || 'maybe',
    investor_presentation: req.body.investorPresentation || 'maybe',
    additional_comments: req.body.additionalComments || '',
    created_at: new Date().toISOString()
  };
  
  console.log('New submission stored:', JSON.stringify(newSubmission, null, 2));
  
  // Add to responses array (simulating database insert)
  if (!global.additionalResponses) {
    global.additionalResponses = [];
  }
  global.additionalResponses.unshift(newSubmission);
  
  res.json({ success: true, message: "Successfully joined waitlist!" });
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
app.get('/api/waitlist/responses', (req, res) => {
  // Combine base responses with new submissions
  const allResponses = [
    ...(global.additionalResponses || []),
    ...baseResponses
  ];
  
  res.json(allResponses);
});

app.get('/api/waitlist/analytics', (req, res) => {
  // Get all responses including new submissions
  const allResponses = [
    ...(global.additionalResponses || []),
    ...baseResponses
  ];
  
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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

module.exports.handler = serverless(app);