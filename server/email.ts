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
      subject: "Welcome to AR Rahman - Your Journey Begins 🤲",
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
    const ageRanges = {
      '18-25': '18-25 years old',
      '26-35': '26-35 years old', 
      '36-45': '36-45 years old',
      '46-55': '46-55 years old',
      '56+': '56+ years old'
    };

    const prayerFrequencies = {
      'daily': 'Prays 5 times daily',
      'weekly': 'Prays weekly (Jummah)',
      'occasionally': 'Prays occasionally',
      'rarely': 'Rarely prays'
    };

    const arabicLevels = {
      'fluent': 'Fluent in Arabic',
      'basic': 'Basic Arabic understanding',
      'none': 'No Arabic understanding'
    };

    const arInterestLevels = {
      'very-interested': 'Very interested in AR',
      'somewhat-interested': 'Somewhat interested in AR',
      'curious': 'Curious about AR technology',
      'not-sure': 'Not sure about AR'
    };

    const msg = {
      to: ADMIN_EMAIL,
      from: FROM_EMAIL,
      subject: `🎯 New AR Rahman Waitlist Signup - ${response.firstName} ${response.lastName}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 25px; border-radius: 12px; text-align: center; margin-bottom: 25px; box-shadow: 0 8px 20px rgba(220,38,38,0.2);">
            <h1 style="color: white; margin: 0; font-size: 26px; font-weight: 700;">🚨 New Waitlist Signup</h1>
            <p style="color: #fecaca; margin: 8px 0 0 0; font-size: 16px;">AR Rahman Admin Notification</p>
          </div>
          
          <div style="background: white; padding: 35px; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
            
            <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 20px; border-radius: 10px; margin-bottom: 30px; border-left: 4px solid #3b82f6;">
              <h2 style="color: #1e3a8a; margin-top: 0; font-size: 22px; font-weight: 600;">👤 Contact Information</h2>
              <div style="display: grid; gap: 8px;">
                <p style="margin: 5px 0; color: #374151;"><strong style="color: #1e3a8a;">Name:</strong> ${response.firstName} ${response.lastName}</p>
                <p style="margin: 5px 0; color: #374151;"><strong style="color: #1e3a8a;">Email:</strong> <a href="mailto:${response.email}" style="color: #3b82f6; text-decoration: none;">${response.email}</a></p>
                <p style="margin: 5px 0; color: #374151;"><strong style="color: #1e3a8a;">Phone:</strong> ${response.phoneNumber || 'Not provided'}</p>
                <p style="margin: 5px 0; color: #374151;"><strong style="color: #1e3a8a;">Country:</strong> ${response.country}</p>
              </div>
            </div>
            
            <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 20px; border-radius: 10px; margin-bottom: 30px; border-left: 4px solid #16a34a;">
              <h3 style="color: #15803d; margin-top: 0; font-size: 20px; font-weight: 600;">📊 Demographics & Habits</h3>
              <div style="display: grid; gap: 8px;">
                <p style="margin: 5px 0; color: #374151;"><strong style="color: #15803d;">Age Group:</strong> ${ageRanges[response.ageRange as keyof typeof ageRanges] || response.ageRange}</p>
                <p style="margin: 5px 0; color: #374151;"><strong style="color: #15803d;">Prayer Frequency:</strong> ${prayerFrequencies[response.prayerFrequency as keyof typeof prayerFrequencies] || response.prayerFrequency}</p>
                <p style="margin: 5px 0; color: #374151;"><strong style="color: #15803d;">Arabic Level:</strong> ${arabicLevels[response.arabicUnderstanding as keyof typeof arabicLevels] || response.arabicUnderstanding}</p>
                <p style="margin: 5px 0; color: #374151;"><strong style="color: #15803d;">AR Interest:</strong> ${arInterestLevels[response.arInterest as keyof typeof arInterestLevels] || response.arInterest}</p>
              </div>
            </div>
            
            <div style="background: linear-gradient(135deg, #fefdf8 0%, #fef7cd 100%); padding: 20px; border-radius: 10px; margin-bottom: 30px; border-left: 4px solid #f59e0b;">
              <h3 style="color: #92400e; margin-top: 0; font-size: 20px; font-weight: 600;">⭐ Feature Interests</h3>
              <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 10px;">
                <p style="margin: 0; color: #374151; line-height: 1.6;"><strong>Interested Features:</strong></p>
                <ul style="margin: 10px 0 0 20px; color: #374151; line-height: 1.6;">
                  ${response.interestedFeatures.map(feature => `<li style="margin-bottom: 5px;">${feature}</li>`).join('')}
                </ul>
              </div>
            </div>
            
            ${response.additionalComments ? `
              <div style="background: linear-gradient(135deg, #fdf4ff 0%, #f3e8ff 100%); padding: 20px; border-radius: 10px; margin-bottom: 30px; border-left: 4px solid #a855f7;">
                <h3 style="color: #7c2d12; margin-top: 0; font-size: 20px; font-weight: 600;">💭 Additional Comments</h3>
                <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 10px;">
                  <p style="margin: 0; color: #374151; line-height: 1.6; font-style: italic;">"${response.additionalComments}"</p>
                </div>
              </div>
            ` : ''}
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 10px; text-align: center; border: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 0; line-height: 1.5;">
                <strong>Submission Time:</strong> ${new Date(response.createdAt).toLocaleString('en-US', { 
                  weekday: 'long',
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit', 
                  minute: '2-digit',
                  timeZoneName: 'short'
                })}
              </p>
              <div style="margin-top: 15px;">
                <a href="https://www.ar-rahman.ai/admin" style="background: #1e3a8a; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; display: inline-block;">View Dashboard 📊</a>
              </div>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #9ca3af; font-size: 12px; line-height: 1.4;">
              This is an automated notification from AR Rahman waitlist system.<br>
              You can manage notification preferences in the admin dashboard.
            </p>
          </div>
        </div>
      `,
    };

    await mailService.send(msg);
    console.log(`✅ Admin notification sent for ${response.firstName} ${response.lastName} (${response.email})`);
    return true;
  } catch (error) {
    console.error('❌ Failed to send admin notification:', error);
    return false;
  }
}
