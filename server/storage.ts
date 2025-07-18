import { users, waitlistResponses, type User, type InsertUser, type WaitlistResponse, type InsertWaitlistResponse } from "@shared/schema";
import { db } from "./db";
import { eq, count } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createWaitlistResponse(response: InsertWaitlistResponse): Promise<WaitlistResponse>;
  getWaitlistResponses(): Promise<WaitlistResponse[]>;
  getWaitlistResponsesCount(): Promise<number>;
  deleteWaitlistResponse(id: number): Promise<boolean>;
  getWaitlistAnalytics(): Promise<{
    totalResponses: number;
    ageDistribution: Record<string, number>;
    prayerFrequencyDistribution: Record<string, number>;
    arabicUnderstandingDistribution: Record<string, number>;
    arInterestDistribution: Record<string, number>;
    featuresDistribution: Record<string, number>;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createWaitlistResponse(response: InsertWaitlistResponse): Promise<WaitlistResponse> {
    const [waitlistResponse] = await db
      .insert(waitlistResponses)
      .values(response)
      .returning();
    return waitlistResponse;
  }

  async getWaitlistResponses(): Promise<WaitlistResponse[]> {
    try {
      console.log("🔍 Using direct SQL query to bypass schema issues...");
      const pool = (await import("./db")).pool;
      const result = await pool.query("SELECT * FROM waitlist_responses ORDER BY id DESC");
      console.log(`🔍 Raw query returned ${result.rows.length} rows`);
      return result.rows as WaitlistResponse[];
    } catch (error) {
      console.error("Database query error:", error);
      throw error;
    }
  }

  async getWaitlistResponsesCount(): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(waitlistResponses);
    return result.count;
  }

  async deleteWaitlistResponse(id: number): Promise<boolean> {
    try {
      console.log(`🗑️ Attempting to delete waitlist response with ID: ${id}`);
      
      // First, check if the response exists
      const existing = await db
        .select()
        .from(waitlistResponses)
        .where(eq(waitlistResponses.id, id))
        .limit(1);
      
      if (existing.length === 0) {
        console.log(`❌ No waitlist response found with ID: ${id}`);
        return false;
      }
      
      console.log(`✅ Found response: ${existing[0].fullName || existing[0].email}`);
      
      // Now delete it
      const result = await db
        .delete(waitlistResponses)
        .where(eq(waitlistResponses.id, id));
      
      console.log(`🗑️ Delete result:`, result);
      
      // Verify deletion
      const verifyDeleted = await db
        .select()
        .from(waitlistResponses)
        .where(eq(waitlistResponses.id, id))
        .limit(1);
      
      const success = verifyDeleted.length === 0;
      console.log(`✅ Deletion ${success ? 'successful' : 'failed'} for ID: ${id}`);
      
      return success;
    } catch (error) {
      console.error("Error deleting waitlist response:", error);
      return false;
    }
  }

  async getWaitlistAnalytics(): Promise<{
    totalResponses: number;
    ageDistribution: Record<string, number>;
    prayerFrequencyDistribution: Record<string, number>;
    arabicUnderstandingDistribution: Record<string, number>;
    arInterestDistribution: Record<string, number>;
    featuresDistribution: Record<string, number>;
  }> {
    const responses = await this.getWaitlistResponses();
    const totalResponses = responses.length;

    const ageDistribution: Record<string, number> = {};
    const prayerFrequencyDistribution: Record<string, number> = {};
    const arabicUnderstandingDistribution: Record<string, number> = {};
    const arInterestDistribution: Record<string, number> = {};
    const featuresDistribution: Record<string, number> = {};

    responses.forEach(response => {
      // Age distribution
      if (response.age) {
        ageDistribution[response.age] = (ageDistribution[response.age] || 0) + 1;
      }

      // Prayer frequency distribution  
      if (response.prayerFrequency) {
        prayerFrequencyDistribution[response.prayerFrequency] = 
          (prayerFrequencyDistribution[response.prayerFrequency] || 0) + 1;
      }

      // Arabic understanding distribution
      if (response.arabicUnderstanding) {
        arabicUnderstandingDistribution[response.arabicUnderstanding] = 
          (arabicUnderstandingDistribution[response.arabicUnderstanding] || 0) + 1;
      }

      // AR interest distribution  
      if (response.arInterest) {
        arInterestDistribution[response.arInterest] = 
          (arInterestDistribution[response.arInterest] || 0) + 1;
      }

      // Features distribution
      if (response.features && Array.isArray(response.features)) {
        response.features.forEach((feature: string) => {
          featuresDistribution[feature] = (featuresDistribution[feature] || 0) + 1;
        });
      }
    });

    return {
      totalResponses,
      ageDistribution,
      prayerFrequencyDistribution,
      arabicUnderstandingDistribution,
      arInterestDistribution,
      featuresDistribution
    };
  }
}

export const storage = new DatabaseStorage();
