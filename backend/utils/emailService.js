import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

let transporter = null;

const createTransporter = () => {
  if (!transporter) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('⚠️ Email not configured. Email sending disabled.');
      return null;
    }

    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    
    transporter.verify((error, success) => {
      if (error) {
        console.error('❌ Email transporter error:', error.message);
      } else {
        console.log('✅ Email transporter ready (Gmail)');
        console.log('📧 Sending from:', process.env.EMAIL_USER);
      }
    });
  }
  return transporter;
};

export const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      console.warn('⚠️ Email not configured. Skipping welcome email.');
      return { success: false, message: 'Email not configured' };
    }

    const mailOptions = {
      from: `"Cancer Support Africa" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: 'Welcome to Cancer Support Africa! 🌍 Together We Fight Cancer',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Cancer Support Africa</title>
          <style>
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: #fff;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #dc2626, #ef4444);
              color: white;
              padding: 40px 30px;
              text-align: center;
            }
            .content {
              padding: 40px 30px;
              background: #f9fafb;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background: #dc2626;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
              font-weight: bold;
            }
            .footer {
              background: #1f2937;
              color: #9ca3af;
              padding: 20px;
              text-align: center;
              font-size: 12px;
            }
            .info-box {
              background: #fee2e2;
              padding: 15px;
              border-radius: 8px;
              margin: 20px 0;
              border-left: 4px solid #dc2626;
            }
            h1 { margin: 0; font-size: 28px; }
            h2 { color: #dc2626; font-size: 22px; margin-top: 0; }
            .checklist { list-style: none; padding: 0; }
            .checklist li { margin: 12px 0; padding-left: 25px; position: relative; }
            .checklist li:before { 
              content: "✓"; 
              color: #10b981; 
              font-weight: bold; 
              position: absolute;
              left: 0;
              font-size: 18px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome, ${userName}!</h1>
              <p style="font-size: 18px; opacity: 0.9;">Thank you for joining our mission</p>
            </div>
            <div class="content">
              <h2>Together, We Fight Cancer in Africa 🎗️</h2>
              <p>Your commitment to helping cancer patients across Africa is truly inspiring. We're excited to have you on board!</p>
              
              <div class="info-box">
                <strong>💡 Did you know?</strong> Early detection increases cancer survival rates by up to 90% in Africa. Your support helps us educate communities about early detection.
              </div>
              
              <h3>What's Next?</h3>
              <ul class="checklist">
                <li>Our team will verify your ID within 24-48 hours</li>
                <li>You'll receive updates about upcoming campaigns</li>
                <li>Join our volunteer training sessions</li>
                <li>Start making an impact in your community</li>
              </ul>
              
              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" class="button">Visit Our Website</a>
              </div>
              
              <p style="margin-top: 30px;">If you have any questions, feel free to reply to this email.</p>
              <p>Best regards,<br><strong>Cancer Support Africa Team</strong></p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Cancer Support Africa. All rights reserved.</p>
              <p>Together we fight cancer. Together we save lives.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Welcome to Cancer Support Africa, ${userName}!

Thank you for joining our mission to fight cancer in Africa. Your commitment to helping cancer patients is truly inspiring.

💡 Did you know? Early detection increases cancer survival rates by up to 90% in Africa.

What's Next?
- Our team will verify your ID within 24-48 hours
- You'll receive updates about upcoming campaigns
- Join our volunteer training sessions
- Start making an impact in your community

Visit our website: ${process.env.FRONTEND_URL || 'http://localhost:5173'}

Together, we fight cancer. Together, we save lives.

Best regards,
Cancer Support Africa Team
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent to:', userEmail);
    console.log('📧 Message ID:', info.messageId);
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    return { success: false, error: error.message };
  }
};

export const sendDonationReceipt = async (userEmail, userName, amount, currency) => {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      console.warn('⚠️ Email not configured. Skipping donation receipt.');
      return { success: false, message: 'Email not configured' };
    }

    const mailOptions = {
      from: `"Cancer Support Africa" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: 'Donation Receipt - Thank You! 🎗️',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Donation Receipt</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 10px; overflow: hidden; }
            .header { background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 40px 30px; text-align: center; }
            .content { padding: 40px 30px; background: #f9fafb; }
            .receipt { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid #e5e7eb; }
            .button { display: inline-block; padding: 12px 30px; background: #059669; color: white; text-decoration: none; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You, ${userName}!</h1>
              <p style="font-size: 18px;">Your generosity saves lives</p>
            </div>
            <div class="content">
              <div class="receipt">
                <h3>Donation Receipt</h3>
                <p><strong>Amount:</strong> ${amount} ${currency}</p>
                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                <p><strong>Receipt Number:</strong> ${Date.now()}</p>
              </div>
              
              <p>Your contribution will directly help cancer patients receive medical treatments, transportation, and nutritional support.</p>
              
              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" class="button">View Your Impact</a>
              </div>
              
              <p>Thank you for being a part of this life-changing mission.</p>
              <p>Warm regards,<br><strong>Cancer Support Africa Team</strong></p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Cancer Support Africa. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Thank You, ${userName}!

Donation Receipt
Amount: ${amount} ${currency}
Date: ${new Date().toLocaleDateString()}
Receipt Number: ${Date.now()}

Your contribution will directly help cancer patients receive medical treatments, transportation, and nutritional support.

Thank you for being a part of this life-changing mission.

Warm regards,
Cancer Support Africa Team
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Donation receipt sent to:', userEmail);
    return { success: true };
    
  } catch (error) {
    console.error('❌ Donation receipt email failed:', error.message);
    return { success: false, error: error.message };
  }
};

export const testEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      throw new Error('Transporter not created');
    }
    
    await transporter.verify();
    console.log('✅ Email service configured successfully!');
    return true;
  } catch (error) {
    console.error('❌ Email configuration error:', error.message);
    return false;
  }
};