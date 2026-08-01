import { Resend } from 'resend';
import { logger } from './logger';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.EMAIL_FROM || 'noreply@lecturerouter.com';
const APP_NAME = 'LectureRouter';

// Email verification
export async function sendVerificationEmail(
  to: string,
  firstName: string,
  verificationUrl: string
): Promise<void> {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Verify your ${APP_NAME} account`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">${APP_NAME}</h1>
            </div>
            
            <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin-top: 0;">Hi ${firstName},</h2>
              
              <p>Thanks for signing up for ${APP_NAME}! To get started, please verify your email address by clicking the button below:</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                          color: white; 
                          padding: 14px 28px; 
                          text-decoration: none; 
                          border-radius: 6px; 
                          display: inline-block;
                          font-weight: bold;">
                  Verify Email Address
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
              <p style="color: #667eea; word-break: break-all; font-size: 12px;">${verificationUrl}</p>
              
              <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
              
              <p style="color: #999; font-size: 12px; margin: 0;">
                If you didn't create an account with ${APP_NAME}, you can safely ignore this email.
              </p>
            </div>
          </body>
        </html>
      `,
    });

    logger.info('Verification email sent', { to, firstName });
  } catch (error) {
    logger.error('Failed to send verification email', error, { to });
    throw error;
  }
}

// Password reset
export async function sendPasswordResetEmail(
  to: string,
  firstName: string,
  resetUrl: string
): Promise<void> {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Reset your ${APP_NAME} password`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">${APP_NAME}</h1>
            </div>
            
            <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin-top: 0;">Hi ${firstName},</h2>
              
              <p>We received a request to reset your password. Click the button below to create a new password:</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                          color: white; 
                          padding: 14px 28px; 
                          text-decoration: none; 
                          border-radius: 6px; 
                          display: inline-block;
                          font-weight: bold;">
                  Reset Password
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
              <p style="color: #667eea; word-break: break-all; font-size: 12px;">${resetUrl}</p>
              
              <p style="background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0;">
                <strong>⚠️ Security Notice:</strong> This link will expire in 1 hour.
              </p>
              
              <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
              
              <p style="color: #999; font-size: 12px; margin: 0;">
                If you didn't request a password reset, please ignore this email or contact support if you have concerns.
              </p>
            </div>
          </body>
        </html>
      `,
    });

    logger.info('Password reset email sent', { to, firstName });
  } catch (error) {
    logger.error('Failed to send password reset email', error, { to });
    throw error;
  }
}

// Welcome email
export async function sendWelcomeEmail(to: string, firstName: string): Promise<void> {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Welcome to ${APP_NAME}!`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">Welcome to ${APP_NAME}!</h1>
            </div>
            
            <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin-top: 0;">Hi ${firstName}! 👋</h2>
              
              <p>Your email has been verified and your account is now active!</p>
              
              <p>With ${APP_NAME}, you can:</p>
              <ul style="color: #666;">
                <li>🔍 Search thousands of academic materials from top sources worldwide</li>
                <li>📚 Bookmark your favorite lectures and resources</li>
                <li>🎓 Access materials from leading universities and platforms</li>
                <li>⚡ Get real-time updates on new materials</li>
              </ul>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                          color: white; 
                          padding: 14px 28px; 
                          text-decoration: none; 
                          border-radius: 6px; 
                          display: inline-block;
                          font-weight: bold;">
                  Go to Dashboard
                </a>
              </div>
              
              <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
              
              <p style="color: #999; font-size: 12px; margin: 0;">
                Need help? Visit our <a href="${process.env.NEXT_PUBLIC_APP_URL}/help" style="color: #667eea;">Help Center</a> or contact support.
              </p>
            </div>
          </body>
        </html>
      `,
    });

    logger.info('Welcome email sent', { to, firstName });
  } catch (error) {
    logger.error('Failed to send welcome email', error, { to });
    // Don't throw - welcome email is not critical
  }
}

// Subscription notification
export async function sendSubscriptionEmail(
  to: string,
  firstName: string,
  plan: string,
  action: 'activated' | 'upgraded' | 'downgraded' | 'cancelled'
): Promise<void> {
  const actionMessages = {
    activated: `Your ${plan} subscription has been activated!`,
    upgraded: `You've been upgraded to the ${plan} plan!`,
    downgraded: `Your subscription has been changed to the ${plan} plan.`,
    cancelled: `Your ${plan} subscription has been cancelled.`,
  };

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `${APP_NAME} Subscription Update`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">${APP_NAME}</h1>
            </div>
            
            <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin-top: 0;">Hi ${firstName},</h2>
              
              <p style="font-size: 16px;"><strong>${actionMessages[action]}</strong></p>
              
              <p>You can manage your subscription anytime from your account settings.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/settings/subscription" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                          color: white; 
                          padding: 14px 28px; 
                          text-decoration: none; 
                          border-radius: 6px; 
                          display: inline-block;
                          font-weight: bold;">
                  Manage Subscription
                </a>
              </div>
              
              <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
              
              <p style="color: #999; font-size: 12px; margin: 0;">
                Questions? Contact us at <a href="mailto:support@lecturerouter.com" style="color: #667eea;">support@lecturerouter.com</a>
              </p>
            </div>
          </body>
        </html>
      `,
    });

    logger.info('Subscription email sent', { to, firstName, plan, action });
  } catch (error) {
    logger.error('Failed to send subscription email', error, { to });
  }
}

// Generic notification email
export async function sendNotificationEmail(
  to: string,
  firstName: string,
  subject: string,
  message: string
): Promise<void> {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `${APP_NAME} - ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">${APP_NAME}</h1>
            </div>
            
            <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin-top: 0;">Hi ${firstName},</h2>
              
              <div style="color: #666;">
                ${message}
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                          color: white; 
                          padding: 14px 28px; 
                          text-decoration: none; 
                          border-radius: 6px; 
                          display: inline-block;
                          font-weight: bold;">
                  Go to Dashboard
                </a>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    logger.info('Notification email sent', { to, subject });
  } catch (error) {
    logger.error('Failed to send notification email', error, { to });
  }
}
