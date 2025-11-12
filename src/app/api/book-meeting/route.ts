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



import { NextResponse } from 'next/server';
import { google, calendar_v3 } from 'googleapis';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, country, company, message, date, time, timezone } = body;

    // 1️⃣ Google Auth
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    auth.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });
    const calendar = google.calendar({ version: 'v3', auth });

    // 2️⃣ Create date-time string in user's timezone
    // The date comes as YYYY-MM-DD and time as HH:mm (24-hour format)
    const dateTimeString = `${date}T${time}:00`;
    
    // Create Date object in user's timezone
    const userDateTime = new Date(dateTimeString);
    
    // Calculate end time (1 hour later)
    const endDateTime = new Date(userDateTime.getTime() + 60 * 60 * 1000);
    
    // Format for Google Calendar API (ISO 8601)
    const startISO = userDateTime.toISOString();
    const endISO = endDateTime.toISOString();

    console.log('Timezone Debug:', {
      receivedTimezone: timezone,
      receivedDate: date,
      receivedTime: time,
      dateTimeString,
      startISO,
      endISO,
      userLocalTime: userDateTime.toLocaleString('en-US', { timeZone: timezone })
    });

    // 3️⃣ Define event
    const event: calendar_v3.Schema$Event = {
      summary: `Demo with ${name} (${company})`,
      description: `Client: ${name}\nEmail: ${email}\nPhone: ${phone}\nCompany: ${company}\nCountry: ${country}\nTimezone: ${timezone}\nMessage: ${message}`,
      start: { 
        dateTime: startISO,
        timeZone: timezone
      },
      end: { 
        dateTime: endISO,
        timeZone: timezone
      },
      attendees: [
        { email },
        { email: process.env.HOST_EMAIL || '' },
      ],
      conferenceData: {
        createRequest: {
          requestId: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
    };

    // 4️⃣ Insert the event into Google Calendar
    const insertResponse = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
      conferenceDataVersion: 1,
      sendUpdates: 'all',
    });

    // 5️⃣ Extract Google Meet link
    const meetLink = insertResponse.data.hangoutLink || 'Meet link not generated';

    // 6️⃣ Format date and time for emails
    const formatDateForEmail = (isoString: string, tz: string) => {
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
    };

    const userLocalTime = formatDateForEmail(startISO, timezone);
    
    // Also show time in host's timezone (adjust as needed)
    const hostTimezone = 'Asia/Kolkata'; // Change this to your timezone
    const hostLocalTime = formatDateForEmail(startISO, hostTimezone);

    // 7️⃣ Send confirmation emails using Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email to client
    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: '✅ Your Demo is Confirmed!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">Hi ${name},</h2>
          <p>Thank you for scheduling a demo with us!</p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1f2937;">Meeting Details</h3>
            <p><strong>📅 Date & Time:</strong><br>${userLocalTime}</p>
            <p><strong>🌍 Your Timezone:</strong> ${timezone}</p>
            <p><strong>🔗 Google Meet Link:</strong><br>
              <a href="${meetLink}" style="color: #4f46e5; text-decoration: none;">${meetLink}</a>
            </p>
          </div>
          
          <p>We look forward to connecting with you!</p>
          <p style="color: #6b7280; font-size: 14px;">
            A calendar invitation has been sent to your email. Please check your calendar for more details.
          </p>
        </div>
      `,
    });

    // Email to host
    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: process.env.HOST_EMAIL,
      subject: `📅 New Demo Booking: ${name} from ${company}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h3 style="color: #4f46e5;">New Demo Booking</h3>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Company:</strong> ${company}</p>
            <p><strong>Country:</strong> ${country}</p>
            <p><strong>Message:</strong> ${message || 'No message provided'}</p>
          </div>
          
          <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-top: 0;">Meeting Schedule</h4>
            <p><strong>Client's Time:</strong><br>${userLocalTime} (${timezone})</p>
            <p><strong>Your Time:</strong><br>${hostLocalTime} (${hostTimezone})</p>
            <p><strong>Google Meet:</strong><br>
              <a href="${meetLink}" style="color: #4f46e5; text-decoration: none;">${meetLink}</a>
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ 
      success: true, 
      meetLink,
      scheduledTime: userLocalTime,
      timezone: timezone
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error booking meeting:', error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    } else {
      console.error('Unknown error booking meeting:', error);
      return NextResponse.json({ success: false, error: 'Unknown error' }, { status: 500 });
    }
  }
}