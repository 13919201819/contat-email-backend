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

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Extract text fields and attachments
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

    // Validate required fields
    if (!data.name || !data.email || !data.phone || !data.role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Format email body with all fields
    let body = `New contact submission from role: ${data.role}\n\n`;
    for (const key in data) {
      const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
      body += `${label}: ${data[key]}\n`;
    }

    // Set up Nodemailer transporter with hardcoded credentials for local testing
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'karanbhatt230803@gmail.com',
        pass: 'tqhkxvkqwzblanjc', // Your app-specific password
      },
    });

    // Send email
    await transporter.sendMail({
      from: 'karanbhatt230803@gmail.com',
      to: 'karanbhatt230803@gmail.com',
      subject: `New Contact: ${data.role} - ${data.name}`,
      text: body,
      attachments,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}