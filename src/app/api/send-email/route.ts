// import { NextResponse } from 'next/server';
// import nodemailer from 'nodemailer';

// export async function POST(request: Request) {
//   try {
//     const formData = await request.formData();

//     // Extract text fields and attachments
//     const data: Record<string, string> = {};
//     const attachments: { filename: string; content: Buffer }[] = [];

//     for (const [key, value] of formData.entries()) {
//       if (value instanceof File) {
//         const buffer = Buffer.from(await value.arrayBuffer());
//         attachments.push({
//           filename: value.name,
//           content: buffer,
//         });
//       } else {
//         data[key] = value as string;
//       }
//     }

//     // Validate required fields
//     if (!data.name || !data.email || !data.phone || !data.role) {
//       return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
//     }

//     // Format email body with all fields
//     let body = `New contact submission from role: ${data.role}\n\n`;
//     for (const key in data) {
//       const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'); // Human-readable
//       body += `${label}: ${data[key]}\n`;
//     }

//     // Set up Nodemailer transporter for Gmail
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     // Send email
//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: process.env.EMAIL_USER,
//       subject: `New Contact: ${data.role} - ${data.name}`,
//       text: body,
//       attachments,
//     });

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error('Error sending email:', error);
//     return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
//   }
// }

// 'import { NextResponse } from 'next/server';
// import nodemailer from 'nodemailer';

// export async function POST(request: Request) {
//   try {
//     const formData = await request.formData();

//     // Extract text fields and attachments
//     const data: Record<string, string> = {};
//     const attachments: { filename: string; content: Buffer }[] = [];

//     for (const [key, value] of formData.entries()) {
//       if (value instanceof File) {
//         const buffer = Buffer.from(await value.arrayBuffer());
//         attachments.push({
//           filename: value.name,
//           content: buffer,
//         });
//       } else {
//         data[key] = value as string;
//       }
//     }

//     // Validate required fields
//     if (!data.name || !data.email || !data.phone || !data.role) {
//       return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
//     }

//     // Format email body with all fields
//     let body = `New contact submission from role: ${data.role}\n\n`;
//     for (const key in data) {
//       const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
//       body += `${label}: ${data[key]}\n`;
//     }

//     // Set up Nodemailer transporter with hardcoded credentials for local testing
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: 'karanbhatt230803@gmail.com',
//         pass: 'tqhkxvkqwzblanjc', // Your app-specific password
//       },
//     });

//     // Send email
//     await transporter.sendMail({
//       from: 'karanbhatt230803@gmail.com',
//       to: 'karanbhatt230803@gmail.com',
//       subject: `New Contact: ${data.role} - ${data.name}`,
//       text: body,
//       attachments,
//     });

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error('Error sending email:', error);
//     return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
//   }
// }


// import { NextResponse } from 'next/server';
// import nodemailer from 'nodemailer';

// export async function POST(request: Request) {
//   // Declare headers outside the try-catch block
//   const headers = new Headers();
//   headers.set('Access-Control-Allow-Origin', 'http://localhost:3000'); // Allow your frontend origin
//   headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS'); // Allow POST and OPTIONS methods
//   headers.set('Access-Control-Allow-Headers', 'Content-Type'); // Allow specific headers

//   try {
//     // Handle preflight OPTIONS request
//     if (request.method === 'OPTIONS') {
//       return new NextResponse(null, { status: 204, headers });
//     }

//     const formData = await request.formData();

//     // Extract text fields and attachments
//     const data: Record<string, string> = {};
//     const attachments: { filename: string; content: Buffer }[] = [];

//     for (const [key, value] of formData.entries()) {
//       if (value instanceof File) {
//         const buffer = Buffer.from(await value.arrayBuffer());
//         attachments.push({
//           filename: value.name,
//           content: buffer,
//         });
//       } else {
//         data[key] = value as string;
//       }
//     }

//     // Validate required fields
//     if (!data.name || !data.email || !data.phone || !data.role) {
//       return NextResponse.json(
//         { error: 'Missing required fields' },
//         { status: 400, headers }
//       );
//     }

//     // Format email body with all fields
//     let body = `New contact submission from role: ${data.role}\n\n`;
//     for (const key in data) {
//       const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
//       body += `${label}: ${data[key]}\n`;
//     }

//     // Set up Nodemailer transporter with hardcoded credentials for local testing
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: 'karanbhatt230803@gmail.com',
//         pass: 'tqhkxvkqwzblanjc', // Your app-specific password
//       },
//     });

//     // Send email
//     await transporter.sendMail({
//       from: 'karanbhatt230803@gmail.com',
//       to: 'karanbhatt230803@gmail.com',
//       subject: `New Contact: ${data.role} - ${data.name}`,
//       text: body,
//       attachments,
//     });

//     return NextResponse.json({ success: true }, { headers });
//   } catch (error) {
//     console.error('Error sending email:', error);
//     return NextResponse.json(
//       { error: 'Failed to send email' },
//       { status: 500, headers }
//     );
//   }
// }


// import { NextResponse } from 'next/server';
// import nodemailer from 'nodemailer';

// export async function POST(request: Request) {
//   // ----------------------------------------------------------------------
//   // ISSUE 2 FIX: CORS Configuration
//   // ----------------------------------------------------------------------
//   const headers = new Headers();
  
//   // Change '*' to your specific frontend domain (e.g., 'https://clumoss.com') for better security
//   // But '*' will make it work immediately on Vercel/GitHub deployments.
//   headers.set('Access-Control-Allow-Origin', '*'); 
//   headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
//   headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

//   try {
//     // Handle preflight OPTIONS request
//     if (request.method === 'OPTIONS') {
//       return new NextResponse(null, { status: 204, headers });
//     }

//     const formData = await request.formData();

//     // Extract text fields and attachments
//     const data: Record<string, string> = {};
//     const attachments: { filename: string; content: Buffer }[] = [];

//     for (const [key, value] of formData.entries()) {
//       if (value instanceof File) {
//         const buffer = Buffer.from(await value.arrayBuffer());
//         attachments.push({
//           filename: value.name,
//           content: buffer,
//         });
//       } else {
//         data[key] = value as string;
//       }
//     }

//     // Validate required fields
//     if (!data.name || !data.email || !data.phone || !data.role) {
//       return NextResponse.json(
//         { error: 'Missing required fields' },
//         { status: 400, headers }
//       );
//     }

//     // Format email body
//     let body = `Hello ${data.name},\n\nWe have received your submission for: ${data.role}.\n\nHere are the details we received:\n`;
//     for (const key in data) {
//       const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
//       body += `${label}: ${data[key]}\n`;
//     }
//     body += `\n\nWe will get back to you shortly.\n\nBest regards,\nTeam CLUMOSS`;

//     // Set up Nodemailer transporter
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: 'karanbhatt230803@gmail.com', // Ideally, put this in process.env.GMAIL_USER
//         pass: 'tqhkxvkqwzblanjc',           // Ideally, put this in process.env.GMAIL_PASS
//       },
//     });

//     // ----------------------------------------------------------------------
//     // ISSUE 1 FIX: Send to the user (data.email)
//     // ----------------------------------------------------------------------
//     await transporter.sendMail({
//       from: '"CLUMOSS Team" <karanbhatt230803@gmail.com>', // Sender Name <Sender Email>
      
//       // Send TO the person who filled out the form
//       to: data.email, 
      
//       // OPTIONAL: Send a copy (CC) to yourself so you know someone applied
//       cc: 'karanbhatt230803@gmail.com', 

//       subject: `Received: ${data.role} Inquiry from ${data.name}`,
//       text: body,
//       attachments,
//     });

//     return NextResponse.json({ success: true }, { headers });
//   } catch (error) {
//     console.error('Error sending email:', error);
//     return NextResponse.json(
//       { error: 'Failed to send email' },
//       { status: 500, headers }
//     );
//   }
// }


import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  // 1. Allow calls from any URL (CORS fix)
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*'); 
  headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type');

  try {
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 204, headers });
    }

    const formData = await request.formData();

    // Parse Data
    const data: Record<string, string> = {};
    const attachments: { filename: string; content: Buffer }[] = [];

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        const buffer = Buffer.from(await value.arrayBuffer());
        attachments.push({
          filename: value.name,
          content: buffer,
        });
      } else {
        data[key] = value as string;
      }
    }

    if (!data.name || !data.email || !data.phone || !data.role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400, headers }
      );
    }

    // 2. Format the Email Body for YOU to read
    let body = `New Website Inquiry!\n\n`;
    body += `Role: ${data.role}\n`;
    body += `Name: ${data.name}\n`;
    body += `Email: ${data.email}\n`; // This is the client's email
    body += `Phone: ${data.phone}\n\n`;
    
    body += `--- Full Details ---\n`;
    for (const key in data) {
      if (['name', 'email', 'phone', 'role'].includes(key)) continue; // Skip already shown fields
      const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
      body += `${label}: ${data[key]}\n`;
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'karanbhatt230803@gmail.com', 
        pass: 'tqhkxvkqwzblanjc', 
      },
    });

    // 3. SEND EMAIL LOGIC (Corrected)
    await transporter.sendMail({
      from: '"CLUMOSS Website" <karanbhatt230803@gmail.com>', // Must be your authenticated email
      
      to: 'karanbhatt230803@gmail.com', // SEND TO YOURSELF
      
      replyTo: data.email, // IMPORTANT: When you click "Reply" in Gmail, it will go to the Client
      
      subject: `New Inquiry: ${data.name} (${data.role})`,
      text: body,
      attachments,
    });

    return NextResponse.json({ success: true }, { headers });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500, headers }
    );
  }
}