import { createTransport } from 'nodemailer'

class Email {
    to: string;
    from: string;
    subject: string;
    text: string;
    html?: string;
    url?: string;
    token?: string;
    userName?: string;

    constructor(user: any, url?: string, token?: string, subject?: string, text?: string) {
        this.to = user.email;
        this.from = 'testingemail0051@gmail.com';
        this.subject = subject || 'Reset your password';
        this.text = text || `Click on the link to reset your password: ${url}`;
        this.url = url;
        this.token = token;
        this.userName = user.name || user.firstName || 'User'; // Flexible user name
    }

    // Beautiful HTML template for password reset
    private createPasswordResetTemplate(): string {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; line-height: 1.6;">
    
    <!-- Main Container -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8fafc; padding: 40px 0;">
        <tr>
            <td align="center">
                
                <!-- Email Container -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07); overflow: hidden;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 40px 30px 40px; text-align: center;">
                            <div style="background-color: rgba(255, 255, 255, 0.1); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px auto; display: flex; align-items: center; justify-content: center; border: 2px solid rgba(255, 255, 255, 0.2);">
                                <div style="width: 40px; height: 40px; background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K'); background-size: contain; background-repeat: no-repeat; background-position: center;"></div>
                            </div>
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.02em;">Password Reset</h1>
                            <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px; font-weight: 400;">Secure your account with a new password</p>
                        </td>
                    </tr>

                    <!-- Body Content -->
                    <tr>
                        <td style="padding: 40px 40px 30px 40px;">
                            
                            <!-- Greeting -->
                            <h2 style="color: #1a202c; margin: 0 0 16px 0; font-size: 24px; font-weight: 600;">
                                Hello ${this.userName}! 👋
                            </h2>

                            <!-- Main Message -->
                            <p style="color: #4a5568; margin: 0 0 24px 0; font-size: 16px; line-height: 1.6;">
                                We received a request to reset your password. No worries, it happens to the best of us! Click the button below to create a new password.
                            </p>

                            <!-- CTA Button -->
                            <div style="text-align: center; margin: 32px 0;">
                                <a href="${this.url}" 
                                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                                          color: #ffffff; 
                                          text-decoration: none; 
                                          padding: 16px 32px; 
                                          border-radius: 8px; 
                                          font-weight: 600; 
                                          font-size: 16px; 
                                          display: inline-block;
                                          box-shadow: 0 4px 14px 0 rgba(102, 126, 234, 0.4);
                                          transition: all 0.3s ease;">
                                    🔐 Reset My Password
                                </a>
                            </div>

                            <!-- Alternative Link -->
                            <div style="background-color: #f7fafc; border-radius: 8px; padding: 20px; margin: 24px 0;">
                                <p style="color: #4a5568; margin: 0 0 12px 0; font-size: 14px; font-weight: 500;">
                                    Button not working? Copy and paste this link into your browser:
                                </p>
                                <p style="color: #667eea; margin: 0; font-size: 14px; word-break: break-all; font-family: 'Courier New', monospace; background-color: #edf2f7; padding: 8px; border-radius: 4px;">
                                    ${this.url}
                                </p>
                            </div>

                            <!-- Security Notice -->
                            <div style="border-left: 4px solid #f6ad55; background-color: #fffbf0; padding: 16px; margin: 24px 0; border-radius: 0 8px 8px 0;">
                                <p style="color: #744210; margin: 0; font-size: 14px; line-height: 1.5;">
                                    ⚠️ <strong>Security Notice:</strong> This link will expire in 1 hour for your security. If you didn't request this reset, please ignore this email and your password will remain unchanged.
                                </p>
                            </div>

                            <!-- Help Section -->
                            <div style="margin: 32px 0 0 0; padding: 20px 0; border-top: 1px solid #e2e8f0;">
                                <p style="color: #718096; margin: 0 0 8px 0; font-size: 14px;">
                                    Need help? We're here for you!
                                </p>
                                <p style="color: #718096; margin: 0; font-size: 14px;">
                                    Contact our support team at 
                                    <a href="mailto:support@yourapp.com" style="color: #667eea; text-decoration: none; font-weight: 500;">
                                        support@yourapp.com
                                    </a>
                                </p>
                            </div>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f7fafc; padding: 30px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
                            
                            <!-- Company Info -->
                            <div style="margin-bottom: 20px;">
                                <h3 style="color: #2d3748; margin: 0 0 8px 0; font-size: 18px; font-weight: 600;">Your App Name</h3>
                                <p style="color: #718096; margin: 0; font-size: 14px;">
                                    Making your digital life easier, one feature at a time.
                                </p>
                            </div>

                            <!-- Social Links (Optional) -->
                            <div style="margin: 20px 0;">
                                <a href="#" style="text-decoration: none; margin: 0 10px; display: inline-block;">
                                    <div style="width: 40px; height: 40px; background-color: #667eea; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 16px;">
                                        f
                                    </div>
                                </a>
                                <a href="#" style="text-decoration: none; margin: 0 10px; display: inline-block;">
                                    <div style="width: 40px; height: 40px; background-color: #1da1f2; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 16px;">
                                        T
                                    </div>
                                </a>
                            </div>

                            <!-- Fine Print -->
                            <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 20px;">
                                <p style="color: #a0aec0; margin: 0 0 8px 0; font-size: 12px; line-height: 1.4;">
                                    This email was sent to ${this.to} because you requested a password reset.
                                </p>
                                <p style="color: #a0aec0; margin: 0; font-size: 12px; line-height: 1.4;">
                                    © 2024 Your App Name. All rights reserved. 
                                    <br>
                                    123 App Street, Tech City, TC 12345
                                </p>
                            </div>

                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>
</html>
        `;
    }

    // Welcome email template
    private createWelcomeTemplate(): string {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome!</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
    
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8fafc; padding: 40px 0;">
        <tr>
            <td align="center">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
                            <div style="font-size: 48px; margin-bottom: 16px;">🎉</div>
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Welcome to Your App!</h1>
                            <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px;">We're excited to have you on board</p>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="color: #1a202c; margin: 0 0 16px 0; font-size: 24px; font-weight: 600;">
                                Hi ${this.userName}! 🚀
                            </h2>
                            <p style="color: #4a5568; margin: 0 0 24px 0; font-size: 16px; line-height: 1.6;">
                                Thank you for joining us! Your account has been created successfully. Get started by exploring our features and making the most of your experience.
                            </p>
                            <div style="text-align: center; margin: 32px 0;">
                                <a href="${this.url}" style="background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">
                                    Get Started Now
                                </a>
                            </div>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>

</body>
</html>
        `;
    }

    // Method to send password reset email
    async sendPasswordReset() {
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject: this.subject,
            text: this.text,
            html: this.createPasswordResetTemplate()
        };

        await createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_EMAIL,
                pass: process.env.GMAIL_APP_PASSWORD
            }
        }).sendMail(mailOptions);
    }

    // Method to send welcome email
    async sendWelcome() {
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject: 'Welcome to Your App! 🎉',
            text: `Welcome ${this.userName}! Thanks for joining us.`,
            html: this.createWelcomeTemplate()
        };

        await createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_EMAIL,
                pass: process.env.GMAIL_APP_PASSWORD 
            }
        }).sendMail(mailOptions);
    }

    // Generic send method (maintains backward compatibility)
    async send() {
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject: this.subject,
            text: this.text,
            html: this.createPasswordResetTemplate() // Default to password reset template
        };

        await createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_EMAIL,
                pass: process.env.GMAIL_APP_PASSWORD 
            }
        }).sendMail(mailOptions);
    }
}   

export default Email;