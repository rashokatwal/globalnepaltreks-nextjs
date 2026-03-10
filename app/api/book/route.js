// app/api/book/route.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      // Personal Information
      fullName, email, phone, nationality, passportNumber, dateOfBirth,
      
      // Trek Details
      trekName, startDate, endDate, numberOfTrekkers, accommodationType, mealPlan,
      
      // Requirements
      fitnessLevel, previousExperience, medicalConditions, dietaryRequirements,
      
      // Emergency Contact
      emergencyName, emergencyPhone, emergencyRelationship,
      
      // Additional
      specialRequests, howDidYouHear,
      
      // reCAPTCHA token
      recaptchaToken 
    } = body;

    // Validate required fields
    if (!fullName || !email || !phone || !nationality || !trekName || !startDate || !endDate) {
      return NextResponse.json(
        { success: false, message: 'Please fill in all required fields' },
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

    // --- reCAPTCHA v3 verification ---
    if (!recaptchaToken) {
      console.warn('Missing reCAPTCHA token');
      return NextResponse.json(
        { success: false, message: 'Security verification failed. Please try again.' },
        { status: 400 }
      );
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) {
      console.error('RECAPTCHA_SECRET_KEY is not set in environment');
      return NextResponse.json(
        { success: false, message: 'Server configuration error.' },
        { status: 500 }
      );
    }

    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;

    const recaptchaResponse = await fetch(verificationUrl, { method: 'POST' });
    const recaptchaData = await recaptchaResponse.json();

    // Log the full response for debugging (remove in production)
    console.log('reCAPTCHA verification response:', recaptchaData);

    // Check success flag
    if (!recaptchaData.success) {
      console.warn('reCAPTCHA failed with error codes:', recaptchaData['error-codes']);
      return NextResponse.json(
        { success: false, message: 'Security verification failed. Please try again.' },
        { status: 400 }
      );
    }

    // For v3, check the score (0.0 to 1.0)
    const MIN_SCORE = 0.5; // Adjust this threshold as needed
    if (recaptchaData.score < MIN_SCORE) {
      console.warn(`reCAPTCHA score too low: ${recaptchaData.score}`);
      return NextResponse.json(
        { success: false, message: 'Suspicious activity detected. Please try again.' },
        { status: 400 }
      );
    }
    // --- end reCAPTCHA ---

    // Create email transporter (adjust SMTP settings as needed)
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

    // Calculate trek duration
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    // Email to company (bookings@)
    const companyMailOptions = {
      from: `"Global Nepal Treks Bookings" <${process.env.SMTP_USER}>`,
      to: 'bookings@globalnepaltreks.com',
      cc: 'info@globalnepaltreks.com',
      replyTo: email,
      subject: `New Trek Booking Request: ${fullName} - ${trekName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; }
            .header { background: linear-gradient(135deg, #2c3e50 0%, #1e2b37 100%); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; background: white; }
            .section-title { color: #2c3e50; border-bottom: 2px solid #e67e22; padding-bottom: 8px; margin: 25px 0 15px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
            .info-item { background: #f8f9fa; padding: 12px; border-radius: 5px; }
            .info-label { font-size: 12px; color: #7f8c8d; text-transform: uppercase; }
            .info-value { font-size: 16px; color: #2c3e50; font-weight: 500; }
            .message-box { background: #f8f9fa; padding: 20px; border-left: 4px solid #e67e22; margin: 20px 0; }
            .footer { padding: 20px; text-align: center; background: #f1f3f4; color: #7f8c8d; font-size: 12px; }
            .urgent { background: #fff3cd; border: 1px solid #ffeeba; color: #856404; padding: 10px; border-radius: 5px; margin-bottom: 20px; }
            @media (max-width: 600px) { .info-grid { grid-template-columns: 1fr; } }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Booking Request</h1>
              <p>A new trek booking has been submitted</p>
            </div>
            
            <div class="content">
              <div class="urgent">
                <strong>⏰ Requires attention within 24 hours</strong>
              </div>

              <h2 class="section-title">Personal Information</h2>
              <div class="info-grid">
                <div class="info-item"><div class="info-label">Full Name</div><div class="info-value">${fullName}</div></div>
                <div class="info-item"><div class="info-label">Email</div><div class="info-value">${email}</div></div>
                <div class="info-item"><div class="info-label">Phone</div><div class="info-value">${phone}</div></div>
                <div class="info-item"><div class="info-label">Nationality</div><div class="info-value">${nationality}</div></div>
                ${passportNumber ? `<div class="info-item"><div class="info-label">Passport</div><div class="info-value">${passportNumber}</div></div>` : ''}
                ${dateOfBirth ? `<div class="info-item"><div class="info-label">Date of Birth</div><div class="info-value">${dateOfBirth}</div></div>` : ''}
              </div>

              <h2 class="section-title">Trek Details</h2>
              <div class="info-grid">
                <div class="info-item"><div class="info-label">Trek Name</div><div class="info-value">${trekName}</div></div>
                <div class="info-item"><div class="info-label">Duration</div><div class="info-value">${durationDays} days</div></div>
                <div class="info-item"><div class="info-label">Start Date</div><div class="info-value">${new Date(startDate).toLocaleDateString()}</div></div>
                <div class="info-item"><div class="info-label">End Date</div><div class="info-value">${new Date(endDate).toLocaleDateString()}</div></div>
                <div class="info-item"><div class="info-label">Number of Trekkers</div><div class="info-value">${numberOfTrekkers}</div></div>
                <div class="info-item"><div class="info-label">Accommodation</div><div class="info-value">${accommodationType}</div></div>
                <div class="info-item"><div class="info-label">Meal Plan</div><div class="info-value">${mealPlan}</div></div>
              </div>

              <h2 class="section-title">Requirements</h2>
              <div class="info-grid">
                <div class="info-item"><div class="info-label">Fitness Level</div><div class="info-value">${fitnessLevel}</div></div>
                <div class="info-item"><div class="info-label">Dietary Needs</div><div class="info-value">${dietaryRequirements || 'None'}</div></div>
              </div>
              
              ${previousExperience ? `
              <div class="message-box">
                <strong>Previous Experience:</strong>
                <p>${previousExperience}</p>
              </div>
              ` : ''}
              
              ${medicalConditions ? `
              <div class="message-box" style="border-left-color: #dc3545;">
                <strong style="color: #dc3545;">Medical Conditions:</strong>
                <p>${medicalConditions}</p>
              </div>
              ` : ''}

              <h2 class="section-title">Emergency Contact</h2>
              <div class="info-grid">
                <div class="info-item"><div class="info-label">Name</div><div class="info-value">${emergencyName || 'Not provided'}</div></div>
                <div class="info-item"><div class="info-label">Phone</div><div class="info-value">${emergencyPhone || 'Not provided'}</div></div>
                <div class="info-item"><div class="info-label">Relationship</div><div class="info-value">${emergencyRelationship || 'Not provided'}</div></div>
              </div>

              ${specialRequests ? `
              <h2 class="section-title">Special Requests</h2>
              <div class="message-box">
                <p>${specialRequests}</p>
              </div>
              ` : ''}

              <div class="info-item" style="margin-top: 20px;">
                <div class="info-label">How did they hear about us?</div>
                <div class="info-value">${howDidYouHear || 'Not specified'}</div>
              </div>
            </div>

            <div class="footer">
              <p>This booking request was submitted from the Global Nepal Treks website.</p>
              <p>Please contact the customer within 24 hours to confirm availability.</p>
              <p style="margin-top: 10px;">© ${new Date().getFullYear()} Global Nepal Treks</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Auto-reply to customer
    const customerMailOptions = {
      from: `"Global Nepal Treks Bookings" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Thank You for Your Booking Request - Global Nepal Treks',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; }
            .header { background: linear-gradient(135deg, #2c3e50 0%, #1e2b37 100%); color: white; padding: 40px; text-align: center; }
            .content { padding: 40px; background: white; }
            .greeting { font-size: 24px; color: #2c3e50; margin-bottom: 20px; }
            .info-box { background: #f8f9fa; padding: 25px; border-left: 4px solid #e67e22; margin: 30px 0; }
            .button { display: inline-block; background: #e67e22; color: white; text-decoration: none; padding: 12px 30px; border-radius: 5px; margin: 20px 0; }
            .footer { padding: 20px; text-align: center; background: #f1f3f4; color: #7f8c8d; font-size: 12px; }
            .summary { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Booking Request Received!</h1>
              <p>We're excited to help you plan your adventure</p>
            </div>
            
            <div class="content">
              <div class="greeting">Dear ${fullName},</div>
              
              <p>Thank you for choosing Global Nepal Treks! We have received your booking request for:</p>
              
              <div class="summary">
                <p><strong>Trek:</strong> ${trekName}</p>
                <p><strong>Dates:</strong> ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}</p>
                <p><strong>Number of Trekkers:</strong> ${numberOfTrekkers}</p>
              </div>
              
              <div class="info-box">
                <h3 style="margin-top: 0;">📋 What happens next?</h3>
                <ol style="margin-bottom: 0;">
                  <li>Our trekking expert will review your requirements within 24 hours</li>
                  <li>We'll check availability for your preferred dates</li>
                  <li>You'll receive a detailed confirmation with payment instructions</li>
                  <li>We'll provide pre-trek preparation information and packing lists</li>
                </ol>
              </div>
              
              <p>If you have any immediate questions or need to modify your booking request, please contact us:</p>
              
              <p style="background: #f8f9fa; padding: 15px; border-radius: 5px;">
                📱 WhatsApp: <a href="https://wa.me/9779744258519" style="color: #e67e22;">+977 9744258519</a><br>
                📧 Email: <a href="mailto:bookings@globalnepaltreks.com" style="color: #e67e22;">bookings@globalnepaltreks.com</a><br>
                🕒 Office Hours: Sun-Fri, 9 AM - 6 PM (Nepal Time)
              </p>
              
              <div style="text-align: center;">
                <a href="https://globalnepaltreks.com" class="button">Visit Our Website</a>
              </div>
            </div>
            
            <div class="footer">
              <p>Global Nepal Treks - Your Gateway to Himalayan Adventure</p>
              <p>Bikramshila Mahavihar, Tham Bahee Road, Kathmandu, Nepal</p>
              <p style="margin-top: 10px;">© ${new Date().getFullYear()} Global Nepal Treks</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Send emails
    await transporter.sendMail(companyMailOptions);
    await transporter.sendMail(customerMailOptions);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Booking request submitted successfully! We\'ll contact you within 24 hours.' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Booking form error:', error);
    
    let errorMessage = 'Failed to submit booking. Please try again later.';
    
    if (error.code === 'ECONNREFUSED') {
      errorMessage = 'Could not connect to email server. Please try again later.';
    } else if (error.code === 'EAUTH') {
      errorMessage = 'Email authentication failed. Please contact site administrator.';
    }
    
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}