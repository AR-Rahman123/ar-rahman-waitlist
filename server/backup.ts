import { pool } from "./db";
import * as fs from 'fs';
import * as path from 'path';

export async function createDatabaseBackup(): Promise<string> {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `backup-${timestamp}.sql`;
    const backupPath = path.join(process.cwd(), 'backups', backupFileName);
    
    // Ensure backups directory exists
    const backupsDir = path.join(process.cwd(), 'backups');
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }

    // Get all table data
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    `);
    
    let backupSQL = '';
    
    for (const table of tablesResult.rows) {
      const tableName = table.table_name;
      
      // Get table schema
      const schemaResult = await pool.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = $1
        ORDER BY ordinal_position
      `, [tableName]);
      
      // Create table statement
      backupSQL += `-- Table: ${tableName}\n`;
      backupSQL += `DROP TABLE IF EXISTS ${tableName}_backup;\n`;
      backupSQL += `CREATE TABLE ${tableName}_backup AS SELECT * FROM ${tableName};\n\n`;
      
      // Get all data
      const dataResult = await pool.query(`SELECT * FROM ${tableName}`);
      
      if (dataResult.rows.length > 0) {
        const columns = Object.keys(dataResult.rows[0]);
        backupSQL += `-- Data for table: ${tableName}\n`;
        
        for (const row of dataResult.rows) {
          const values = columns.map(col => {
            const value = row[col];
            if (value === null) return 'NULL';
            if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
            if (Array.isArray(value)) return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
            if (value instanceof Date) return `'${value.toISOString()}'`;
            return value;
          });
          
          backupSQL += `INSERT INTO ${tableName}_backup (${columns.join(', ')}) VALUES (${values.join(', ')});\n`;
        }
        backupSQL += '\n';
      }
    }
    
    // Write backup file
    fs.writeFileSync(backupPath, backupSQL);
    
    console.log(`✅ Database backup created: ${backupPath}`);
    return backupPath;
    
  } catch (error) {
    console.error('❌ Failed to create database backup:', error);
    throw error;
  }
}

export async function exportWaitlistDataToCSV(): Promise<string> {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const csvFileName = `waitlist-export-${timestamp}.csv`;
    const csvPath = path.join(process.cwd(), 'exports', csvFileName);
    
    // Ensure exports directory exists
    const exportsDir = path.join(process.cwd(), 'exports');
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }

    // Get all waitlist data
    const result = await pool.query(`
      SELECT * FROM waitlist_responses 
      ORDER BY created_at DESC
    `);
    
    if (result.rows.length === 0) {
      throw new Error('No waitlist data to export');
    }
    
    // Create CSV content
    const headers = Object.keys(result.rows[0]);
    let csvContent = headers.join(',') + '\n';
    
    for (const row of result.rows) {
      const values = headers.map(header => {
        const value = row[header];
        if (value === null) return '';
        if (Array.isArray(value)) return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
        if (typeof value === 'string' && value.includes(',')) return `"${value.replace(/"/g, '""')}"`;
        return value;
      });
      csvContent += values.join(',') + '\n';
    }
    
    // Write CSV file
    fs.writeFileSync(csvPath, csvContent);
    
    console.log(`✅ Waitlist data exported to CSV: ${csvPath}`);
    return csvPath;
    
  } catch (error) {
    console.error('❌ Failed to export waitlist data:', error);
    throw error;
  }
}

// Auto-backup function that runs periodically
export async function autoBackup(): Promise<void> {
  try {
    await createDatabaseBackup();
    await exportWaitlistDataToCSV();
    
    // Clean up old backups (keep last 10)
    const backupsDir = path.join(process.cwd(), 'backups');
    if (fs.existsSync(backupsDir)) {
      const files = fs.readdirSync(backupsDir)
        .filter(file => file.startsWith('backup-'))
        .sort()
        .reverse();
      
      if (files.length > 10) {
        const filesToDelete = files.slice(10);
        filesToDelete.forEach(file => {
          fs.unlinkSync(path.join(backupsDir, file));
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Auto-backup failed:', error);
  }
}