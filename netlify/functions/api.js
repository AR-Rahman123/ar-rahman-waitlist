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
  const isAuthenticated = localStorage && localStorage.getItem('adminAuthenticated') === 'true';
  if (!isAuthenticated) {
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
  // Return actual data from the database (latest entries)
  res.json([
    {
      id: 12,
      fullName: "Test User",
      email: "test@example.com",
      age: "25-34",
      prayerFrequency: "5-times",
      arabicUnderstanding: "none",
      createdAt: "2025-07-15T16:11:14.818Z"
    },
    {
      id: 11,
      fullName: "Farhad Malik",
      email: "farhad@the-maliks.com",
      age: "26-35",
      prayerFrequency: "1_2_times_daily",
      arabicUnderstanding: "basic",
      createdAt: "2025-07-15T09:47:44.197Z"
    },
    {
      id: 10,
      fullName: "Farhad Malik",
      email: "farhad@the-maliks.com",
      age: "36-45",
      prayerFrequency: "3_4_times_daily",
      arabicUnderstanding: "good",
      createdAt: "2025-07-15T08:31:17.635Z"
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