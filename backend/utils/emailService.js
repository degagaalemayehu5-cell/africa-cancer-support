import dotenv from 'dotenv';
import { TransactionalEmailsApi, SendSmtpEmail } from '@getbrevo/brevo';

dotenv.config();

let apiInstance = null;

const getApiInstance = () => {
  if (!apiInstance && process.env.BREVO_API_KEY) {
    apiInstance = new TransactionalEmailsApi();
    apiInstance.setApiKey(0, process.env.BREVO_API_KEY);
    console.log('✅ Brevo configured successfully');
  }
  return apiInstance;
};

export const sendWelcomeEmail = async (userEmail, userName) => {
  console.log(`📧 Sending welcome email to: ${userEmail}`);
  
  try {
    const api = getApiInstance();
    
    if (!api || !process.env.BREVO_API_KEY) {
      throw new Error('Brevo API key not configured');
    }

    const sendSmtpEmail = new SendSmtpEmail();
    
    sendSmtpEmail.subject = 'Welcome to Cancer Support Africa! 🌍 Together We Fight Cancer';
    sendSmtpEmail.htmlContent = `
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
              <strong>💡 Did you know?</strong> Early detection increases cancer survival rates by up to 90% in Africa.
            </div>
            
            <h3>What's Next?</h3>
            <ul class="checklist">
              <li>Our team will verify your ID within 24-48 hours</li>
              <li>You'll receive updates about upcoming campaigns</li>
              <li>Join our volunteer training sessions</li>
              <li>Start making an impact in your community</li>
            </ul>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'https://africa-cancer-support.onrender.com'}" class="button">Visit Our Website</a>
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
    `;
    
    sendSmtpEmail.sender = { 
      name: "Cancer Support Africa", 
      email: process.env.BREVO_FROM_EMAIL || 'africacancersupport@gmail.com' 
    };
    sendSmtpEmail.to = [{ email: userEmail, name: userName }];
    
    const response = await api.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Welcome email sent via Brevo to:', userEmail);
    return { success: true, messageId: response.messageId };
    
  } catch (error) {
    console.error('❌ Brevo email failed:', error.message);
    console.error('Error details:', error.response?.body || error);
    return { success: false, error: error.message };
  }
};

export const sendDonationReceipt = async (userEmail, userName, amount, currency) => {
  console.log(`📧 Sending donation receipt to: ${userEmail}`);
  
  try {
    const api = getApiInstance();
    
    if (!api || !process.env.BREVO_API_KEY) {
      throw new Error('Brevo API key not configured');
    }

    const sendSmtpEmail = new SendSmtpEmail();
    
    sendSmtpEmail.subject = 'Donation Receipt - Thank You! 🎗️';
    sendSmtpEmail.htmlContent = `
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
          .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px; }
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
              <a href="${process.env.FRONTEND_URL || 'https://africa-cancer-support.onrender.com'}" class="button">View Your Impact</a>
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
    `;
    
    sendSmtpEmail.sender = { 
      name: "Cancer Support Africa", 
      email: process.env.BREVO_FROM_EMAIL || 'africacancersupport@gmail.com' 
    };
    sendSmtpEmail.to = [{ email: userEmail, name: userName }];
    
    const response = await api.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Donation receipt sent via Brevo to:', userEmail);
    return { success: true, messageId: response.messageId };
    
  } catch (error) {
    console.error('❌ Donation receipt failed:', error.message);
    return { success: false, error: error.message };
  }
};

export const testEmailConfig = async () => {
  try {
    const api = getApiInstance();
    
    if (!api || !process.env.BREVO_API_KEY) {
      throw new Error('Brevo API key not configured');
    }
    
    console.log('✅ Brevo is ready to send emails');
    return true;
  } catch (error) {
    console.error('❌ Brevo error:', error.message);
    return false;
  }
};