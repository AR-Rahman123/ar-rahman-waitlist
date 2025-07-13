/**
 * Migration Safety Guidelines and Tools
 * 
 * This file provides utilities and guidelines to prevent data loss during schema changes
 */

import { pool } from "./db";
import { createDatabaseBackup } from "./backup";

export interface MigrationPlan {
  description: string;
  backupRequired: boolean;
  reversible: boolean;
  dataLossRisk: 'none' | 'low' | 'medium' | 'high';
  steps: string[];
}

/**
 * Always call this before any schema changes
 */
export async function preMigrationSafety(migrationPlan: MigrationPlan): Promise<void> {
  console.log('\n🔒 PRE-MIGRATION SAFETY CHECK');
  console.log('================================');
  console.log(`Migration: ${migrationPlan.description}`);
  console.log(`Data Loss Risk: ${migrationPlan.dataLossRisk.toUpperCase()}`);
  console.log(`Reversible: ${migrationPlan.reversible ? 'YES' : 'NO'}`);
  
  if (migrationPlan.dataLossRisk === 'medium' || migrationPlan.dataLossRisk === 'high') {
    console.log('\n⚠️  HIGH RISK MIGRATION DETECTED');
    console.log('This migration could cause data loss!');
    
    // Always create backup for risky migrations
    console.log('📦 Creating mandatory backup...');
    const backupPath = await createDatabaseBackup();
    console.log(`✅ Backup created: ${backupPath}`);
    
    // Get current data count
    const result = await pool.query('SELECT COUNT(*) FROM waitlist_responses');
    const currentCount = result.rows[0].count;
    console.log(`📊 Current records: ${currentCount}`);
    
    if (currentCount > 0) {
      console.log('\n🛑 MANUAL CONFIRMATION REQUIRED');
      console.log('This migration will affect existing data.');
      console.log('Please ensure you have reviewed the migration plan carefully.');
      
      throw new Error('Manual confirmation required for data-affecting migration. Please review backup and confirm migration safety.');
    }
  }
  
  if (migrationPlan.backupRequired) {
    console.log('📦 Creating backup as required...');
    await createDatabaseBackup();
  }
  
  console.log('✅ Pre-migration safety check completed\n');
}

/**
 * Safe column addition - no data loss
 */
export async function safeAddColumn(tableName: string, columnDefinition: string): Promise<void> {
  const migrationPlan: MigrationPlan = {
    description: `Add column to ${tableName}`,
    backupRequired: false,
    reversible: true,
    dataLossRisk: 'none',
    steps: [`ALTER TABLE ${tableName} ADD COLUMN ${columnDefinition}`]
  };
  
  await preMigrationSafety(migrationPlan);
  await pool.query(`ALTER TABLE ${tableName} ADD COLUMN ${columnDefinition}`);
  console.log(`✅ Column added to ${tableName}`);
}

/**
 * Safe column rename - no data loss
 */
export async function safeRenameColumn(tableName: string, oldName: string, newName: string): Promise<void> {
  const migrationPlan: MigrationPlan = {
    description: `Rename column ${oldName} to ${newName} in ${tableName}`,
    backupRequired: true,
    reversible: true,
    dataLossRisk: 'low',
    steps: [`ALTER TABLE ${tableName} RENAME COLUMN ${oldName} TO ${newName}`]
  };
  
  await preMigrationSafety(migrationPlan);
  await pool.query(`ALTER TABLE ${tableName} RENAME COLUMN ${oldName} TO ${newName}`);
  console.log(`✅ Column renamed in ${tableName}: ${oldName} → ${newName}`);
}

/**
 * DANGEROUS: Drop table - high data loss risk
 */
export async function dangerousDropTable(tableName: string): Promise<void> {
  const migrationPlan: MigrationPlan = {
    description: `DROP TABLE ${tableName}`,
    backupRequired: true,
    reversible: false,
    dataLossRisk: 'high',
    steps: [`DROP TABLE IF EXISTS ${tableName}`]
  };
  
  await preMigrationSafety(migrationPlan);
  
  // This should only be called in development or with explicit user consent
  throw new Error(`BLOCKED: Dropping table ${tableName} requires manual override. Use emergency override if absolutely necessary.`);
}

/**
 * Emergency override for dangerous operations (development only)
 */
export async function emergencyDropTable(tableName: string, confirmationPhrase: string): Promise<void> {
  if (confirmationPhrase !== `I UNDERSTAND DATA WILL BE LOST: ${tableName}`) {
    throw new Error('Invalid confirmation phrase. Operation cancelled.');
  }
  
  console.log('🚨 EMERGENCY OVERRIDE ACTIVATED');
  console.log('⚠️  THIS WILL CAUSE DATA LOSS');
  
  // Create backup first
  await createDatabaseBackup();
  
  await pool.query(`DROP TABLE IF EXISTS ${tableName}`);
  console.log(`💥 Table ${tableName} has been dropped`);
}

/**
 * Guidelines for safe migrations
 */
export const MIGRATION_GUIDELINES = `
🔒 MIGRATION SAFETY GUIDELINES
==============================

✅ SAFE OPERATIONS (no data loss):
- ADD COLUMN with DEFAULT value
- CREATE new tables
- CREATE indexes
- ADD constraints (if data is compatible)

⚠️  CAUTION REQUIRED (potential data loss):
- RENAME columns
- ALTER column types
- DROP constraints
- RENAME tables

🚨 DANGEROUS OPERATIONS (high data loss risk):
- DROP columns
- DROP tables
- TRUNCATE tables
- Complex data transformations

📋 BEFORE ANY SCHEMA CHANGE:
1. Create full database backup
2. Test migration on copy of data
3. Verify rollback procedure
4. Document the change
5. Confirm with stakeholders if production data exists

🛡️  EMERGENCY PROCEDURES:
- All backups are stored in /backups directory
- Use emergency override only in development
- Never perform dangerous operations on production without explicit approval
- Always verify data integrity after migrations
`;

export function printMigrationGuidelines(): void {
  console.log(MIGRATION_GUIDELINES);
}