import { MailService } from '@sendgrid/mail';
import type { WaitlistResponse } from '@shared/schema';

const mailService = new MailService();

// Initialize SendGrid with API key
const apiKey = process.env.SENDGRID_API_KEY || process.env.SENDGRID_API_KEY_ENV_VAR || "";
if (apiKey) {
  mailService.setApiKey(apiKey);
}

const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@ar-rahman.ai";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@ar-rahman.ai";

export async function sendWelcomeEmail(email: string, name: string): Promise<boolean> {
  if (!apiKey) {
    console.warn("SendGrid API key not configured, skipping email");
    return false;
  }

  try {
    const msg = {
      to: email,
      from: FROM_EMAIL,
      subject: "Welcome to AR Rahman - You're on the Waitlist! 🤲",
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1E3A8A 0%, #059669 100%); padding: 40px 20px; border-radius: 12px;">
          <div style="background: white; padding: 40px; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1E3A8A; font-size: 32px; margin: 0; font-weight: bold;">AR Rahman</h1>
              <div style="width: 60px; height: 4px; background: #D97706; margin: 10px auto;"></div>
            </div>
            
            <h2 style="color: #1F2937; font-size: 24px; margin-bottom: 20px;">Assalamu Alaikum ${name}!</h2>
            
            <p style="color: #4B5563; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              BarakAllahu feekum (بارك الله فيكم) for joining our waitlist! We're thrilled to have you as part of our community working towards revolutionizing the prayer experience through Augmented Reality.
            </p>
            
            <div style="background: #F9FAFB; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1E3A8A; font-size: 18px; margin-bottom: 15px;">What happens next?</h3>
              <ul style="color: #4B5563; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li>You'll receive exclusive updates on our development progress</li>
                <li>Early access to beta testing opportunities</li>
                <li>Invitation to provide feedback that shapes our product</li>
                <li>Special pricing when we launch</li>
              </ul>
            </div>
            
            <p style="color: #4B5563; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              We're pioneering a revolutionary approach to deepen your connection with Allah through cutting-edge Augmented Reality. Your responses will help us create an experience that truly serves the soul.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="display: inline-block; background: #1E3A8A; color: white; padding: 15px 30px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                🎯 You're part of an exclusive community of believers
              </div>
            </div>
            
            <p style="color: #6B7280; font-size: 14px; text-align: center; margin-top: 30px;">
              May Allah bless your journey towards ihsan in worship.<br>
              <strong>The AR Rahman Team</strong>
            </p>
          </div>
        </div>
      `,
    };

    await mailService.send(msg);
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

export async function sendAdminNotification(response: WaitlistResponse): Promise<boolean> {
  if (!apiKey) {
    console.warn("SendGrid API key not configured, skipping admin notification");
    return false;
  }

  try {
    const msg = {
      to: ADMIN_EMAIL,
      from: FROM_EMAIL,
      subject: `New Waitlist Signup - ${response.fullName}`,
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1E3A8A;">New Waitlist Signup</h2>
          
          <div style="background: #F9FAFB; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1F2937; margin-top: 0;">Contact Information</h3>
            <p><strong>Name:</strong> ${response.fullName}</p>
            <p><strong>Email:</strong> ${response.email}</p>
            <p><strong>Role:</strong> ${response.role || 'Not specified'}</p>
            <p><strong>Submitted:</strong> ${new Date(response.submittedAt || '').toLocaleString()}</p>
          </div>
          
          <div style="background: #F0F9FF; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1F2937; margin-top: 0;">Survey Responses</h3>
            <p><strong>Age:</strong> ${response.age || 'Not specified'}</p>
            <p><strong>Prayer Frequency:</strong> ${response.prayerFrequency || 'Not specified'}</p>
            <p><strong>Arabic Understanding:</strong> ${response.arabicUnderstanding || 'Not specified'}</p>
            <p><strong>AR Interest:</strong> ${response.arInterest || 'Not specified'}</p>
            <p><strong>Interview Willingness:</strong> ${response.interviewWillingness || 'Not specified'}</p>
            ${response.additionalFeedback ? `<p><strong>Additional Feedback:</strong> ${response.additionalFeedback}</p>` : ''}
          </div>
          
          <p style="color: #6B7280; font-size: 12px; margin-top: 30px;">
            This is an automated notification from AR Rahman waitlist system.
          </p>
        </div>
      `,
    };

    await mailService.send(msg);
    return true;
  } catch (error) {
    console.error('SendGrid admin notification error:', error);
    return false;
  }
}
