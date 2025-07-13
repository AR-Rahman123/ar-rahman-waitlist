import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWaitlistResponseSchema } from "@shared/schema";
import { sendWelcomeEmail, sendAdminNotification } from "./email";
import { createDatabaseBackup, exportWaitlistDataToCSV } from "./backup";

export async function registerRoutes(app: Express): Promise<Server> {
  // Submit waitlist response
  app.post("/api/waitlist", async (req, res) => {
    try {
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
      res.status(400).json({ 
        success: false, 
        message: "Failed to join waitlist. Please try again." 
      });
    }
  });

  // Get waitlist responses (admin only)
  app.get("/api/waitlist/responses", async (req, res) => {
    try {
      const responses = await storage.getWaitlistResponses();
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

  // Get analytics data
  app.get("/api/waitlist/analytics", async (req, res) => {
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
  app.delete("/api/waitlist/:id", async (req, res) => {
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
  app.post("/api/backup/create", async (req, res) => {
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

  app.post("/api/backup/export-csv", async (req, res) => {
    try {
      const csvPath = await exportWaitlistDataToCSV();
      res.json({ 
        success: true, 
        message: "CSV export created successfully", 
        csvPath: csvPath.split('/').pop() // Return just filename for security
      });
    } catch (error: any) {
      console.error("Error exporting CSV:", error);
      res.status(500).json({ success: false, message: "Failed to export CSV" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
