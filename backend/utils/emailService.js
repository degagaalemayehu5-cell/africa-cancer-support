import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const sendWelcomeEmail = async (userEmail, userName) => {
  console.log(`📧 Sending welcome email to: ${userEmail}`);
  
  try {
    if (!process.env.BREVO_API_KEY) {
      throw new Error('Brevo API key not configured');
    }

    const response = await axios.post('https://api.brevo.com/v3/smtp/email', {
      sender: {
        name: 'Cancer Support Africa',
        email: 'africacancersupport@gmail.com'
      },
      to: [{
        email: userEmail,
        name: userName
      }],
      subject: 'Welcome to Cancer Support Africa! 🌍 Together We Fight Cancer',
      htmlContent: `
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
      textContent: `
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
    }, {
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    console.log('✅ Welcome email sent via Brevo to:', userEmail);
    return { success: true, messageId: response.data.messageId };
    
  } catch (error) {
    console.error('❌ Brevo email failed:', error.response?.data || error.message);
    return { success: false, error: error.response?.data?.message || error.message };
  }
};

export const sendDonationReceipt = async (userEmail, userName, amount, currency) => {
  console.log(`📧 Sending donation receipt to: ${userEmail}`);
  
  try {
    if (!process.env.BREVO_API_KEY) {
      throw new Error('Brevo API key not configured');
    }

    const response = await axios.post('https://api.brevo.com/v3/smtp/email', {
      sender: {
        name: 'Cancer Support Africa',
        email: 'africacancersupport@gmail.com'
      },
      to: [{
        email: userEmail,
        name: userName
      }],
      subject: 'Donation Receipt - Thank You! 🎗️',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 30px; text-align: center;">
            <h1>Thank You, ${userName}!</h1>
            <p>Your generosity saves lives</p>
          </div>
          <div style="padding: 30px;">
            <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3>Donation Receipt</h3>
              <p><strong>Amount:</strong> ${amount} ${currency}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
              <p><strong>Receipt Number:</strong> ${Date.now()}</p>
            </div>
            
            <p>Your contribution will directly help cancer patients receive medical treatments, transportation, and nutritional support.</p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.FRONTEND_URL || 'https://africa-cancer-support.onrender.com'}" style="display: inline-block; padding: 12px 30px; background: #059669; color: white; text-decoration: none; border-radius: 5px;">View Your Impact</a>
            </div>
            
            <p>Thank you for being a part of this life-changing mission.</p>
            <p>Warm regards,<br><strong>Cancer Support Africa Team</strong></p>
          </div>
        </div>
      `,
      textContent: `
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
    }, {
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    console.log('✅ Donation receipt sent via Brevo to:', userEmail);
    return { success: true, messageId: response.data.messageId };
    
  } catch (error) {
    console.error('❌ Donation receipt failed:', error.response?.data || error.message);
    return { success: false, error: error.response?.data?.message || error.message };
  }
};

export const testEmailConfig = async () => {
  try {
    if (!process.env.BREVO_API_KEY) {
      throw new Error('Brevo API key not configured');
    }
    console.log('✅ Brevo API is ready to send real emails');
    return true;
  } catch (error) {
    console.error('❌ Brevo error:', error.message);
    return false;
  }
};