// import { NextResponse } from 'next/server';
// import { google, calendar_v3 } from 'googleapis';
// import nodemailer from 'nodemailer';

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { name, email, phone, country, company, message, date, time, timezone } = body;

//     // 1️⃣ Google Auth
//     const auth = new google.auth.OAuth2(
//       process.env.GOOGLE_CLIENT_ID,
//       process.env.GOOGLE_CLIENT_SECRET
//     );
//     auth.setCredentials({
//       refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
//     });
//     const calendar = google.calendar({ version: 'v3', auth });

//     // 2️⃣ Handle timezone conversion
//     const eventStart = new Date(`${date} ${time}`);
//     const startISO = new Date(
//       eventStart.toLocaleString('en-US', { timeZone: timezone })
//     ).toISOString();
//     const endISO = new Date(new Date(startISO).getTime() + 60 * 60 * 1000).toISOString();

//     // 3️⃣ Define event
//     const event: calendar_v3.Schema$Event = {
//       summary: `Demo with ${name} (${company})`,
//       description: `Client: ${name}\nEmail: ${email}\nPhone: ${phone}\nCompany: ${company}\nMessage: ${message}`,
//       start: { dateTime: startISO, timeZone: timezone },
//       end: { dateTime: endISO, timeZone: timezone },
//       attendees: [
//         { email },
//         { email: process.env.HOST_EMAIL || '' },
//       ],
//       conferenceData: {
//         createRequest: {
//           requestId: `${Date.now()}`,
//           conferenceSolutionKey: { type: 'hangoutsMeet' },
//         },
//       },
//     };

//     // 4️⃣ Insert the event into Google Calendar
//     const insertResponse = await calendar.events.insert({
//       calendarId: 'primary',
//       requestBody: event,
//       conferenceDataVersion: 1,
//       sendUpdates: 'all',
//     });

//     // 5️⃣ Extract Google Meet link
//     const meetLink = insertResponse.data.hangoutLink || 'Meet link not generated';

//     // 6️⃣ Send confirmation emails using Nodemailer
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.SMTP_EMAIL,
//         pass: process.env.SMTP_PASS,
//       },
//     });

//     // Email to client
//     await transporter.sendMail({
//       from: process.env.SMTP_EMAIL,
//       to: email,
//       subject: '✅ Your Demo is Confirmed!',
//       html: `
//         <h2>Hi ${name},</h2>
//         <p>Thank you for scheduling a demo with us!</p>
//         <p><b>Date:</b> ${date}</p>
//         <p><b>Time:</b> ${time} (${timezone})</p>
//         <p><b>Google Meet Link:</b> <a href="${meetLink}">${meetLink}</a></p>
//         <p>We look forward to connecting with you.</p>
//       `,
//     });

//     // Email to host
//     await transporter.sendMail({
//       from: process.env.SMTP_EMAIL,
//       to: process.env.HOST_EMAIL,
//       subject: `📅 New Demo Booking: ${name}`,
//       html: `
//         <h3>New Demo Booking</h3>
//         <p><b>Name:</b> ${name}</p>
//         <p><b>Email:</b> ${email}</p>
//         <p><b>Phone:</b> ${phone}</p>
//         <p><b>Company:</b> ${company}</p>
//         <p><b>Timezone:</b> ${timezone}</p>
//         <p><a href="${meetLink}">Join Meeting</a></p>
//       `,
//     });

//     return NextResponse.json({ success: true, meetLink });
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       console.error('Error booking meeting:', error.message);
//       return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//     } else {
//       console.error('Unknown error booking meeting:', error);
//       return NextResponse.json({ success: false, error: 'Unknown error' }, { status: 500 });
//     }
//   }
// }



// import { NextResponse } from 'next/server';
// import { google, calendar_v3 } from 'googleapis';
// import nodemailer from 'nodemailer';

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { name, email, phone, country, company, message, date, time, timezone } = body;

//     // 1️⃣ Google Auth
//     const auth = new google.auth.OAuth2(
//       process.env.GOOGLE_CLIENT_ID,
//       process.env.GOOGLE_CLIENT_SECRET
//     );
//     auth.setCredentials({
//       refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
//     });
//     const calendar = google.calendar({ version: 'v3', auth });

//     // 2️⃣ Create date-time string in user's timezone
//     // The date comes as YYYY-MM-DD and time as HH:mm (24-hour format)
//     const dateTimeString = `${date}T${time}:00`;
    
//     // Create Date object in user's timezone
//     const userDateTime = new Date(dateTimeString);
    
//     // Calculate end time (1 hour later)
//     const endDateTime = new Date(userDateTime.getTime() + 60 * 60 * 1000);
    
//     // Format for Google Calendar API (ISO 8601)
//     const startISO = userDateTime.toISOString();
//     const endISO = endDateTime.toISOString();

//     console.log('Timezone Debug:', {
//       receivedTimezone: timezone,
//       receivedDate: date,
//       receivedTime: time,
//       dateTimeString,
//       startISO,
//       endISO,
//       userLocalTime: userDateTime.toLocaleString('en-US', { timeZone: timezone })
//     });

//     // 3️⃣ Define event
//     const event: calendar_v3.Schema$Event = {
//       summary: `Demo with ${name} (${company})`,
//       description: `Client: ${name}\nEmail: ${email}\nPhone: ${phone}\nCompany: ${company}\nCountry: ${country}\nTimezone: ${timezone}\nMessage: ${message}`,
//       start: { 
//         dateTime: startISO,
//         timeZone: timezone
//       },
//       end: { 
//         dateTime: endISO,
//         timeZone: timezone
//       },
//       attendees: [
//         { email },
//         { email: process.env.HOST_EMAIL || '' },
//       ],
//       conferenceData: {
//         createRequest: {
//           requestId: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
//           conferenceSolutionKey: { type: 'hangoutsMeet' },
//         },
//       },
//     };

//     // 4️⃣ Insert the event into Google Calendar
//     const insertResponse = await calendar.events.insert({
//       calendarId: 'primary',
//       requestBody: event,
//       conferenceDataVersion: 1,
//       sendUpdates: 'all',
//     });

//     // 5️⃣ Extract Google Meet link
//     const meetLink = insertResponse.data.hangoutLink || 'Meet link not generated';

//     // 6️⃣ Format date and time for emails
//     const formatDateForEmail = (isoString: string, tz: string) => {
//       return new Date(isoString).toLocaleString('en-US', {
//         timeZone: tz,
//         weekday: 'long',
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric',
//         hour: 'numeric',
//         minute: '2-digit',
//         hour12: true
//       });
//     };

//     const userLocalTime = formatDateForEmail(startISO, timezone);
    
//     // Also show time in host's timezone (adjust as needed)
//     const hostTimezone = 'Asia/Kolkata'; // Change this to your timezone
//     const hostLocalTime = formatDateForEmail(startISO, hostTimezone);

//     // 7️⃣ Send confirmation emails using Nodemailer
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.SMTP_EMAIL,
//         pass: process.env.SMTP_PASS,
//       },
//     });

//     // Email to client
//     await transporter.sendMail({
//       from: process.env.SMTP_EMAIL,
//       to: email,
//       subject: '✅ Your Demo is Confirmed!',
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2 style="color: #4f46e5;">Hi ${name},</h2>
//           <p>Thank you for scheduling a demo with us!</p>
          
//           <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
//             <h3 style="margin-top: 0; color: #1f2937;">Meeting Details</h3>
//             <p><strong>📅 Date & Time:</strong><br>${userLocalTime}</p>
//             <p><strong>🌍 Your Timezone:</strong> ${timezone}</p>
//             <p><strong>🔗 Google Meet Link:</strong><br>
//               <a href="${meetLink}" style="color: #4f46e5; text-decoration: none;">${meetLink}</a>
//             </p>
//           </div>
          
//           <p>We look forward to connecting with you!</p>
//           <p style="color: #6b7280; font-size: 14px;">
//             A calendar invitation has been sent to your email. Please check your calendar for more details.
//           </p>
//         </div>
//       `,
//     });

//     // Email to host
//     await transporter.sendMail({
//       from: process.env.SMTP_EMAIL,
//       to: process.env.HOST_EMAIL,
//       subject: `📅 New Demo Booking: ${name} from ${company}`,
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h3 style="color: #4f46e5;">New Demo Booking</h3>
          
//           <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
//             <p><strong>Name:</strong> ${name}</p>
//             <p><strong>Email:</strong> ${email}</p>
//             <p><strong>Phone:</strong> ${phone}</p>
//             <p><strong>Company:</strong> ${company}</p>
//             <p><strong>Country:</strong> ${country}</p>
//             <p><strong>Message:</strong> ${message || 'No message provided'}</p>
//           </div>
          
//           <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
//             <h4 style="margin-top: 0;">Meeting Schedule</h4>
//             <p><strong>Client's Time:</strong><br>${userLocalTime} (${timezone})</p>
//             <p><strong>Your Time:</strong><br>${hostLocalTime} (${hostTimezone})</p>
//             <p><strong>Google Meet:</strong><br>
//               <a href="${meetLink}" style="color: #4f46e5; text-decoration: none;">${meetLink}</a>
//             </p>
//           </div>
//         </div>
//       `,
//     });

//     return NextResponse.json({ 
//       success: true, 
//       meetLink,
//       scheduledTime: userLocalTime,
//       timezone: timezone
//     });
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       console.error('Error booking meeting:', error.message);
//       return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//     } else {
//       console.error('Unknown error booking meeting:', error);
//       return NextResponse.json({ success: false, error: 'Unknown error' }, { status: 500 });
//     }
//   }
// }


import { NextResponse } from 'next/server';
import { google, calendar_v3 } from 'googleapis';
import nodemailer from 'nodemailer';

// Handle CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, country, company, message, date, time, timezone } = body;

    console.log('📅 Received booking request:', { name, email, date, time, timezone });

    // Validate required fields
    if (!name || !email || !date || !time || !timezone) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
          }
        }
      );
    }

    // 1️⃣ Google Auth Setup
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    auth.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    const calendar = google.calendar({ version: 'v3', auth });

    // 2️⃣ Create date-time in user's timezone
    // Input: date="2024-11-15", time="14:00" (24-hour format)
    const dateTimeString = `${date}T${time}:00`;
    const userDateTime = new Date(dateTimeString);
    
    // Add 1 hour for end time
    const endDateTime = new Date(userDateTime.getTime() + 60 * 60 * 1000);
    
    // Convert to ISO format
    const startISO = userDateTime.toISOString();
    const endISO = endDateTime.toISOString();

    console.log('🕐 Time conversion:', {
      input: { date, time, timezone },
      dateTimeString,
      startISO,
      endISO
    });

    // 3️⃣ Create Calendar Event
    const event: calendar_v3.Schema$Event = {
      summary: `Demo with ${name} (${company || 'N/A'})`,
      description: `
Client Information:
- Name: ${name}
- Email: ${email}
- Phone: ${phone || 'Not provided'}
- Company: ${company || 'Not provided'}
- Country: ${country || 'Not provided'}
- Timezone: ${timezone}

Message:
${message || 'No message provided'}
      `.trim(),
      start: { 
        dateTime: startISO,
        timeZone: timezone
      },
      end: { 
        dateTime: endISO,
        timeZone: timezone
      },
      attendees: [
        { email: email },
        { email: process.env.HOST_EMAIL || '' },
      ],
      conferenceData: {
        createRequest: {
          requestId: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'popup', minutes: 30 }, // 30 minutes before
        ],
      },
    };

    console.log('📝 Creating calendar event...');

    // 4️⃣ Insert Event into Google Calendar
    const insertResponse = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
      conferenceDataVersion: 1,
      sendUpdates: 'all',
    });

    const meetLink = insertResponse.data.hangoutLink || 'Meet link not generated';
    const eventId = insertResponse.data.id;

    console.log('✅ Calendar event created:', { eventId, meetLink });

    // 5️⃣ Format Times for Emails
    const formatDateForEmail = (isoString: string, tz: string) => {
      try {
        return new Date(isoString).toLocaleString('en-US', {
          timeZone: tz,
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
      } catch (error) {
        console.error('Error formatting date:', error);
        return isoString;
      }
    };

    const userLocalTime = formatDateForEmail(startISO, timezone);
    const hostTimezone = 'Asia/Kolkata'; // Change to your timezone
    const hostLocalTime = formatDateForEmail(startISO, hostTimezone);

    console.log('⏰ Formatted times:', { userLocalTime, hostLocalTime });

    // 6️⃣ Send Confirmation Emails
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS,
      },
    });

    console.log('📧 Sending confirmation emails...');

    // Email to Client
    try {
      await transporter.sendMail({
        from: `"Demo Scheduler" <${process.env.SMTP_EMAIL}>`,
        to: email,
        subject: '✅ Your Demo is Confirmed!',
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Demo Confirmed!</h1>
    </div>
    
    <!-- Content -->
    <div style="padding: 30px;">
      <h2 style="color: #333; margin-top: 0;">Hi ${name}! 👋</h2>
      <p style="color: #666; font-size: 16px; line-height: 1.6;">
        Thank you for scheduling a demo with us! We're excited to show you what we can do for your business.
      </p>
      
      <!-- Meeting Details Card -->
      <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 25px 0; border-radius: 5px;">
        <h3 style="color: #333; margin-top: 0; font-size: 18px;">📅 Meeting Details</h3>
        
        <div style="margin: 15px 0;">
          <strong style="color: #667eea;">📅 Date & Time:</strong><br>
          <span style="color: #333; font-size: 16px;">${userLocalTime}</span>
        </div>
        
        <div style="margin: 15px 0;">
          <strong style="color: #667eea;">🌍 Your Timezone:</strong><br>
          <span style="color: #333;">${timezone}</span>
        </div>
        
        <div style="margin: 15px 0;">
          <strong style="color: #667eea;">🔗 Google Meet Link:</strong><br>
          <a href="${meetLink}" style="color: #667eea; text-decoration: none; word-break: break-all;">${meetLink}</a>
        </div>
      </div>
      
      <!-- CTA Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="${meetLink}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px;">
          Join Meeting 🚀
        </a>
      </div>
      
      <p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 30px;">
        💡 <strong>Tip:</strong> A calendar invitation has been sent to your email. Please add it to your calendar so you don't miss it!
      </p>
      
      <p style="color: #666; font-size: 14px; line-height: 1.6;">
        If you need to reschedule or have any questions, feel free to reply to this email.
      </p>
    </div>
    
    <!-- Footer -->
    <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
      <p style="color: #999; font-size: 12px; margin: 0;">
        Looking forward to meeting with you! 🎯
      </p>
    </div>
  </div>
</body>
</html>
        `,
      });

      console.log('✅ Client email sent');
    } catch (emailError) {
      console.error('❌ Error sending client email:', emailError);
    }

    // Email to Host
    try {
      await transporter.sendMail({
        from: `"Demo Scheduler" <${process.env.SMTP_EMAIL}>`,
        to: process.env.HOST_EMAIL,
        subject: `📅 New Demo Booking: ${name} from ${company || 'N/A'}`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px;">🆕 New Demo Booking</h1>
    </div>
    
    <!-- Content -->
    <div style="padding: 30px;">
      <h3 style="color: #333; margin-top: 0;">Client Information</h3>
      
      <!-- Client Details Card -->
      <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px;">
        <p style="margin: 10px 0;"><strong>👤 Name:</strong> ${name}</p>
        <p style="margin: 10px 0;"><strong>✉️ Email:</strong> ${email}</p>
        <p style="margin: 10px 0;"><strong>📱 Phone:</strong> ${phone || 'Not provided'}</p>
        <p style="margin: 10px 0;"><strong>🏢 Company:</strong> ${company || 'Not provided'}</p>
        <p style="margin: 10px 0;"><strong>🌍 Country:</strong> ${country || 'Not provided'}</p>
        
        ${message ? `
        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e0e0e0;">
          <strong>💬 Message:</strong><br>
          <p style="color: #666; margin: 10px 0;">${message}</p>
        </div>
        ` : ''}
      </div>
      
      <!-- Meeting Schedule Card -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; margin: 20px 0; border-radius: 5px; color: white;">
        <h3 style="margin-top: 0; color: white;">⏰ Meeting Schedule</h3>
        <p style="margin: 10px 0;">
          <strong>Client's Time:</strong><br>
          ${userLocalTime} (${timezone})
        </p>
        <p style="margin: 10px 0;">
          <strong>Your Time:</strong><br>
          ${hostLocalTime} (${hostTimezone})
        </p>
      </div>
      
      <!-- CTA Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="${meetLink}" style="display: inline-block; background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px;">
          Join Meeting 🚀
        </a>
      </div>
      
      <p style="color: #666; font-size: 14px; text-align: center;">
        Event ID: <code style="background: #f0f0f0; padding: 2px 6px; border-radius: 3px;">${eventId}</code>
      </p>
    </div>
  </div>
</body>
</html>
        `,
      });

      console.log('✅ Host email sent');
    } catch (emailError) {
      console.error('❌ Error sending host email:', emailError);
    }

    // 7️⃣ Return Success Response
    return NextResponse.json(
      { 
        success: true, 
        meetLink,
        eventId,
        scheduledTime: userLocalTime,
        timezone: timezone
      },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );

  } catch (error: unknown) {
    console.error('❌ Error booking meeting:', error);
    
    let errorMessage = 'Unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      }
    );
  }
}