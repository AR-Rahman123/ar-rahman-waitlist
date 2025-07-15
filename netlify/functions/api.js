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

// Test endpoint
app.post('/api/waitlist', async (req, res) => {
  console.log('Waitlist submission received:', req.body);
  res.json({ success: true, message: "Successfully joined waitlist!" });
});

app.get('/api/waitlist/count', async (req, res) => {
  res.json({ count: 11 });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

module.exports.handler = serverless(app);