import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a transporter using Ethereal (free test email service)
// No configuration needed - it just works!
let transporter = null;

const getTransporter = async () => {
  if (!transporter) {
    // Create a test account at https://ethereal.email (or use this one)
    // You can also generate your own at https://ethereal.email
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: 'emilia.hickle27@ethereal.email',
        pass: 'YnQ6K76Qj6GNkXw5j3'
      }
    });
    console.log('✅ Email transporter created (Ethereal)');
  }
  return transporter;
};

export const sendWelcomeEmail = async (userEmail, userName) => {
  console.log(`📧 Sending welcome email to: ${userEmail}`);
  
  try {
    const transporter = await getTransporter();

    const info = await transporter.sendMail({
      from: '"Cancer Support Africa" <noreply@cancersupport.africa>',
      to: userEmail,
      subject: 'Welcome to Cancer Support Africa! 🌍 Together We Fight Cancer',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1>Welcome, ${userName}!</h1>
            <p>Thank you for joining our mission</p>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #dc2626;">Together, We Fight Cancer in Africa 🎗️</h2>
            <p>Your commitment to helping cancer patients across Africa is truly inspiring.</p>
            
            <div style="background: #fee2e2; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <strong>💡 Did you know?</strong> Early detection increases cancer survival rates by up to 90% in Africa.
            </div>
            
            <h3>What's Next?</h3>
            <ul>
              <li>✓ Our team will verify your ID within 24-48 hours</li>
              <li>✓ You'll receive updates about upcoming campaigns</li>
              <li>✓ Start making an impact in your community</li>
            </ul>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.FRONTEND_URL || 'https://africa-cancer-support.onrender.com'}" style="display: inline-block; padding: 12px 30px; background: #dc2626; color: white; text-decoration: none; border-radius: 5px;">Visit Our Website</a>
            </div>
            
            <p>Best regards,<br><strong>Cancer Support Africa Team</strong></p>
          </div>
        </div>
      `,
      text: `
Welcome to Cancer Support Africa, ${userName}!

Thank you for joining our mission to fight cancer in Africa.

What's Next?
- Our team will verify your ID within 24-48 hours
- You'll receive updates about upcoming campaigns
- Start making an impact in your community

Visit our website: ${process.env.FRONTEND_URL || 'https://africa-cancer-support.onrender.com'}

Best regards,
Cancer Support Africa Team
      `
    });

    console.log('✅ Welcome email sent via Ethereal to:', userEmail);
    console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
    
    return { 
      success: true, 
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info)
    };
    
  } catch (error) {
    console.error('❌ Email failed:', error.message);
    return { success: false, error: error.message };
  }
};

export const sendDonationReceipt = async (userEmail, userName, amount, currency) => {
  console.log(`📧 Sending donation receipt to: ${userEmail}`);
  
  try {
    const transporter = await getTransporter();

    const info = await transporter.sendMail({
      from: '"Cancer Support Africa" <noreply@cancersupport.africa>',
      to: userEmail,
      subject: 'Donation Receipt - Thank You! 🎗️',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1>Thank You, ${userName}!</h1>
            <p>Your generosity saves lives</p>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3>Donation Receipt</h3>
              <p><strong>Amount:</strong> ${amount} ${currency}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
              <p><strong>Receipt Number:</strong> ${Date.now()}</p>
            </div>
            
            <p>Your contribution will directly help cancer patients receive medical treatments, transportation, and nutritional support.</p>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'https://africa-cancer-support.onrender.com'}" style="display: inline-block; padding: 12px 30px; background: #059669; color: white; text-decoration: none; border-radius: 5px;">View Your Impact</a>
            </div>
            
            <p>Thank you for being a part of this life-changing mission.</p>
            <p>Warm regards,<br><strong>Cancer Support Africa Team</strong></p>
          </div>
        </div>
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
    });

    console.log('✅ Donation receipt sent via Ethereal to:', userEmail);
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('❌ Donation receipt failed:', error.message);
    return { success: false, error: error.message };
  }
};

export const testEmailConfig = async () => {
  try {
    const transporter = await getTransporter();
    await transporter.verify();
    console.log('✅ Email service is ready');
    return true;
  } catch (error) {
    console.error('❌ Email error:', error.message);
    return false;
  }
};