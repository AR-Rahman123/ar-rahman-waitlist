import crypto from 'crypto';

// Simple admin authentication middleware
// Default password for demo - change ADMIN_PASSWORD environment variable in production
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function verifyAdminPassword(password: string): boolean {
  return hashPassword(password) === hashPassword(ADMIN_PASSWORD);
}

export function isAdminAuthenticated(req: any): boolean {
  const isAuth = (req.session as any)?.adminAuthenticated === true;
  console.log('Admin auth check:', { sessionId: req.session?.id, isAuth });
  return isAuth;
}

export function requireAdminAuth(req: any, res: any, next: any) {
  if (!isAdminAuthenticated(req)) {
    return res.status(401).json({ 
      success: false, 
      message: "Admin authentication required" 
    });
  }
  next();
}