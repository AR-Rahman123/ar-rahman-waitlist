import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWaitlistResponseSchema } from "@shared/schema";
import { sendWelcomeEmail, sendAdminNotification } from "./email";
import { createDatabaseBackup, exportWaitlistDataToCSV } from "./backup";
import { verifyAdminPassword, requireAdminAuth } from "./adminAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Admin authentication routes
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { password } = req.body;
      
      if (!password) {
        return res.status(400).json({ 
          success: false, 
          message: "Password is required" 
        });
      }
      
      if (verifyAdminPassword(password)) {
        (req.session as any).isAdminAuthenticated = true;
        res.json({ 
          success: true, 
          message: "Admin authentication successful" 
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

  app.post("/api/admin/logout", async (req, res) => {
    (req.session as any).isAdminAuthenticated = false;
    res.json({ 
      success: true, 
      message: "Admin logged out successfully" 
    });
  });

  app.get("/api/admin/status", async (req, res) => {
    res.json({ 
      authenticated: (req.session as any)?.isAdminAuthenticated === true 
    });
  });

  // Submit waitlist response
  app.post("/api/waitlist", async (req, res) => {
    try {
      console.log("Received waitlist data:", JSON.stringify(req.body, null, 2));
      const validatedData = insertWaitlistResponseSchema.parse(req.body);
      
      const response = await storage.createWaitlistResponse(validatedData);
      
      // Create automatic backup after each submission
      createDatabaseBackup()
        .then(backupPath => {
          console.log(`✅ Auto-backup created: ${backupPath}`);
        })
        .catch(error => {
          console.error(`❌ Auto-backup failed:`, error);
        });
      
      // Send welcome email to user (async, don't block response)
      sendWelcomeEmail(response.email, response.fullName)
        .then(success => {
          if (success) {
            console.log(`✅ Welcome email sent to ${response.email}`);
          } else {
            console.log(`❌ Failed to send welcome email to ${response.email}`);
          }
        })
        .catch(error => {
          console.error(`❌ Welcome email error for ${response.email}:`, error);
        });
      
      // Send admin notification (async, don't block response)
      sendAdminNotification(response)
        .then(success => {
          if (success) {
            console.log(`✅ Admin notification sent for ${response.fullName}`);
          } else {
            console.log(`❌ Failed to send admin notification for ${response.fullName}`);
          }
        })
        .catch(error => {
          console.error(`❌ Admin notification error for ${response.firstName} ${response.lastName}:`, error);
        });
      
      res.json({ success: true, message: "Successfully joined waitlist! Check your email for confirmation." });
    } catch (error) {
      console.error("Error creating waitlist response:", error);
      if (error.name === 'ZodError') {
        console.error("Validation errors:", error.errors);
      }
      res.status(400).json({ 
        success: false, 
        message: "Failed to join waitlist. Please try again." 
      });
    }
  });

  // Get all waitlist responses (admin only)
  app.get("/api/waitlist/responses", requireAdminAuth, async (req, res) => {
    try {
      const responses = await storage.getWaitlistResponses();
      console.log(`🔍 Admin requesting responses: Found ${responses.length} total responses`);
      console.log(`🔍 Session check: ${req.session ? 'Session exists' : 'No session'}, Auth: ${req.session?.isAdminAuthenticated ? 'Authenticated' : 'Not authenticated'}`);
      console.log(`🔍 Response IDs being sent: [${responses.map(r => r.id).join(', ')}]`);
      console.log(`🔍 First response: ${JSON.stringify(responses[0], null, 2)}`);
      
      // Force bypass browser cache with aggressive headers
      res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'ETag': 'W/"' + Date.now() + '"',
        'Last-Modified': new Date().toUTCString(),
        'Access-Control-Allow-Credentials': 'true'
      });
      
      // Log the exact JSON being sent
      const responseJson = JSON.stringify(responses);
      console.log(`🔍 JSON response length: ${responseJson.length} characters`);
      console.log(`🔍 Response contains ${responses.length} items`);
      
      res.json(responses);
    } catch (error) {
      console.error("Error fetching waitlist responses:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch responses" 
      });
    }
  });

  // Get waitlist count
  app.get("/api/waitlist/count", async (req, res) => {
    try {
      const count = await storage.getWaitlistResponsesCount();
      res.json({ count });
    } catch (error) {
      console.error("Error fetching waitlist count:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch count" 
      });
    }
  });

  // Get analytics data (admin only)
  app.get("/api/waitlist/analytics", requireAdminAuth, async (req, res) => {
    try {
      const analytics = await storage.getWaitlistAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch analytics" 
      });
    }
  });

  // Delete waitlist response
  app.delete("/api/waitlist/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid ID" 
        });
      }

      const success = await storage.deleteWaitlistResponse(id);
      if (success) {
        res.json({ success: true, message: "Response deleted successfully" });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "Failed to delete response" 
        });
      }
    } catch (error) {
      console.error("Error deleting waitlist response:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to delete response" 
      });
    }
  });

  // Manual backup endpoints
  app.post("/api/backup/create", requireAdminAuth, async (req, res) => {
    try {
      const backupPath = await createDatabaseBackup();
      res.json({ 
        success: true, 
        message: "Backup created successfully", 
        backupPath: backupPath.split('/').pop() // Return just filename for security
      });
    } catch (error: any) {
      console.error("Error creating backup:", error);
      res.status(500).json({ success: false, message: "Failed to create backup" });
    }
  });

  app.get("/api/backup/export-csv", requireAdminAuth, async (req, res) => {
    try {
      const responses = await storage.getWaitlistResponses();
      
      // Generate CSV content
      const headers = [
        'ID', 'Full Name', 'Email', 'Role', 'Age', 'Prayer Frequency', 
        'Arabic Understanding', 'Understanding Difficulty', 'Importance',
        'Learning Struggle', 'Current Approach', 'AR Experience', 'AR Interest',
        'Features', 'Likelihood', 'Additional Feedback', 'Interview Willingness',
        'Investor Presentation', 'Additional Comments', 'Created At'
      ];
      
      const csvContent = [
        headers.join(','),
        ...responses.map(r => [
          r.id,
          `"${r.full_name || r.fullName || ''}"`,
          `"${r.email || ''}"`,
          `"${r.role || ''}"`,
          `"${r.age || ''}"`,
          `"${r.prayer_frequency || r.prayerFrequency || ''}"`,
          `"${r.arabic_understanding || r.arabicUnderstanding || ''}"`,
          `"${r.understanding_difficulty || r.understandingDifficulty || ''}"`,
          `"${r.importance || ''}"`,
          `"${r.learning_struggle || r.learningStruggle || ''}"`,
          `"${r.current_approach || r.currentApproach || ''}"`,
          `"${r.ar_experience || r.arExperience || ''}"`,
          `"${r.ar_interest || r.arInterest || ''}"`,
          `"${Array.isArray(r.features) ? r.features.join('; ') : r.features || ''}"`,
          `"${r.likelihood || ''}"`,
          `"${r.additional_feedback || r.additionalFeedback || ''}"`,
          `"${r.interview_willingness || r.interviewWillingness || ''}"`,
          `"${r.investor_presentation || r.investorPresentation || ''}"`,
          `"${r.additional_comments || r.additionalComments || ''}"`,
          `"${r.created_at || r.createdAt || ''}"`
        ].join(','))
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=waitlist-responses.csv');
      res.send(csvContent);
    } catch (error: any) {
      console.error("Error exporting CSV:", error);
      res.status(500).json({ success: false, message: "Failed to export CSV" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
