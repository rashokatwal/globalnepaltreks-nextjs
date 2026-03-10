// app/api/contact/route.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, country, subject, message, recaptchaToken } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, message: 'Name, email, subject, and message are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Validate reCAPTCHA token
    if (!recaptchaToken) {
      return NextResponse.json(
        { success: false, message: 'reCAPTCHA verification failed. Please try again.' },
        { status: 400 }
      );
    }

    // Verify reCAPTCHA with Google
    const recaptchaResponse = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
      }
    );

    const recaptchaData = await recaptchaResponse.json();
    
    // Check if reCAPTCHA verification was successful and score is acceptable
    const minScore = parseFloat(process.env.RECAPTCHA_MIN_SCORE || '0.5');
    
    if (!recaptchaData.success || recaptchaData.score < minScore) {
      console.warn('reCAPTCHA verification failed:', recaptchaData);
      return NextResponse.json(
        { success: false, message: 'Suspicious activity detected. Please try again.' },
        { status: 400 }
      );
    }

    // Create email transporter with Hostinger settings
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.hostinger.com',
      port: parseInt(process.env.SMTP_PORT) || 465,
      secure: process.env.SMTP_SECURE === 'true' || true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Verify SMTP connection
    await transporter.verify();

    // Email to company
    const companyMailOptions = {
      from: `"Global Nepal Treks Contact" <${process.env.SMTP_USER}>`,
      to: 'info@globalnepaltreks.com',
      replyTo: email,
      subject: `New Contact Form: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; }
            .header { background: linear-gradient(135deg, #2c3e50 0%, #1e2b37 100%); color: white; padding: 30px 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
            .header p { margin: 10px 0 0; opacity: 0.9; font-size: 16px; }
            .content { padding: 30px 20px; background: white; }
            .section-title { font-size: 18px; font-weight: 600; color: #2c3e50; margin: 25px 0 15px; padding-bottom: 8px; border-bottom: 2px solid #e67e22; }
            .info-item { background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
            .info-label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #7f8c8d; margin-bottom: 5px; }
            .info-value { font-size: 16px; font-weight: 500; color: #2c3e50; word-break: break-word; }
            .message-box { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #e67e22; }
            .message-box p { margin: 0; white-space: pre-wrap; }
            .footer { padding: 20px; text-align: center; background: #f1f3f4; color: #7f8c8d; font-size: 13px; }
            .badge { display: inline-block; background: #e67e22; color: white; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; margin-bottom: 15px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="badge">New Contact Form Submission</div>
              <h1>Global Nepal Treks</h1>
              <p>You have received a new inquiry from your website</p>
            </div>
            
            <div class="content">
              <h2 class="section-title">Contact Details</h2>
              
              <div class="info-item">
                <div class="info-label">Full Name</div>
                <div class="info-value">${name}</div>
              </div>
              
              <div class="info-item">
                <div class="info-label">Email Address</div>
                <div class="info-value">
                  <a href="mailto:${email}" style="color: #e67e22; text-decoration: none;">${email}</a>
                </div>
              </div>
              
              <div class="info-item">
                <div class="info-label">Country</div>
                <div class="info-value">${country || 'Not provided'}</div>
              </div>
              
              <div class="info-item">
                <div class="info-label">Subject</div>
                <div class="info-value">${subject}</div>
              </div>

              <h2 class="section-title">Message</h2>
              <div class="message-box">
                <p>${message.replace(/\n/g, '<br>')}</p>
              </div>
            </div>

            <div class="footer">
              <p>This inquiry was sent from the Global Nepal Treks website contact form.</p>
              <p style="margin-top: 10px;">© ${new Date().getFullYear()} Global Nepal Treks. All rights reserved.</p>
              <p style="margin-top: 15px; font-size: 11px;">
                <a href="https://globalnepaltreks.com" style="color: #7f8c8d; text-decoration: none;">globalnepaltreks.com</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Auto-reply to customer
    const customerMailOptions = {
      from: `"Global Nepal Treks" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Thank You for Contacting Global Nepal Treks',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; }
            .header { background: linear-gradient(135deg, #2c3e50 0%, #1e2b37 100%); color: white; padding: 40px 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 32px; font-weight: 600; }
            .header p { margin: 15px 0 0; opacity: 0.9; font-size: 18px; }
            .content { padding: 40px 30px; background: white; }
            .greeting { font-size: 24px; font-weight: 600; color: #2c3e50; margin-bottom: 20px; }
            .message { color: #555; margin-bottom: 30px; }
            .info-box { background: #f8f9fa; padding: 25px; border-radius: 12px; margin: 30px 0; border-left: 4px solid #e67e22; }
            .info-box h3 { color: #2c3e50; margin: 0 0 15px; font-size: 18px; }
            .info-box ul { margin: 0; padding-left: 20px; }
            .info-box li { margin-bottom: 10px; color: #555; }
            .button { display: inline-block; background: #e67e22; color: white; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-weight: 600; margin: 20px 0; transition: background 0.3s ease; }
            .button:hover { background: #d35400; }
            .social-links { margin: 30px 0; text-align: center; }
            .social-links a { display: inline-block; margin: 0 8px; color: #7f8c8d; text-decoration: none; }
            .footer { padding: 30px; text-align: center; background: #f1f3f4; color: #7f8c8d; font-size: 13px; }
            .contact-info { background: white; padding: 20px; border-radius: 8px; margin-top: 20px; }
            .contact-info p { margin: 8px 0; }
            .contact-info a { color: #e67e22; text-decoration: none; font-weight: 500; }
            .summary { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            @media (max-width: 600px) { .content { padding: 30px 20px; } }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You!</h1>
              <p>We've received your message</p>
            </div>
            
            <div class="content">
              <div class="greeting">Dear ${name},</div>
              
              <div class="message">
                <p>Thank you for reaching out to Global Nepal Treks! We're excited to help you plan your Himalayan adventure.</p>
                <p>Our team of trekking experts has received your inquiry and will get back to you within <strong>24 hours</strong> with personalized recommendations and detailed information.</p>
              </div>

              <div class="summary">
                <p><strong>Your Inquiry:</strong> ${subject}</p>
              </div>

              <div class="info-box">
                <h3>📋 What happens next?</h3>
                <ul>
                  <li><strong>Step 1:</strong> Our trekking expert reviews your requirements</li>
                  <li><strong>Step 2:</strong> We prepare a customized response based on your questions</li>
                  <li><strong>Step 3:</strong> We provide detailed information about treks that match your interests</li>
                  <li><strong>Step 4:</strong> We're available to answer any additional questions</li>
                </ul>
              </div>

              <div style="text-align: center;">
                <a href="https://globalnepaltreks.com/packages" class="button">Explore Our Trek Packages</a>
              </div>

              <div class="contact-info">
                <h3 style="color: #2c3e50; margin-top: 0;">📞 Need immediate assistance?</h3>
                <p>🇳🇵 <strong>Nepal Head Office:</strong></p>
                <p>📱 Phone/WhatsApp: <a href="https://wa.me/9779744258519">+977 9744258519</a></p>
                <p>📧 Email: <a href="mailto:info@globalnepaltreks.com">info@globalnepaltreks.com</a></p>
                <p>🕒 Office Hours: Sunday - Friday, 9:00 AM - 6:00 PM (Nepal Time)</p>
              </div>

              <div class="social-links">
                <p style="color: #7f8c8d; margin-bottom: 15px;">Connect with us on social media</p>
                <a href="https://facebook.com/globalnepaltreks">Facebook</a> •
                <a href="https://instagram.com/globalnepaltreks">Instagram</a> •
                <a href="https://twitter.com/globalnepaltreks">Twitter</a>
              </div>
            </div>

            <div class="footer">
              <p>Global Nepal Treks - Your Gateway to Himalayan Adventure</p>
              <p>Bikramshila Mahavihar, Tham Bahee Road, Kathmandu, Nepal</p>
              <p style="margin-top: 15px;">© ${new Date().getFullYear()} Global Nepal Treks. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Send both emails
    await transporter.sendMail(companyMailOptions);
    await transporter.sendMail(customerMailOptions);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Your message has been sent successfully! We\'ll get back to you within 24 hours.' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    
    let errorMessage = 'Failed to send message. Please try again later.';
    
    if (error.code === 'ECONNREFUSED') {
      errorMessage = 'Could not connect to email server. Please try again later.';
    } else if (error.code === 'EAUTH') {
      errorMessage = 'Email authentication failed. Please contact site administrator.';
    } else if (error.code === 'EENVELOPE') {
      errorMessage = 'Invalid email format. Please check your email address.';
    }
    
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}