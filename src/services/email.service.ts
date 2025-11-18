import * as nodemailer from 'nodemailer';
import { IBooking, IUser } from '../models/interfaces';

// We'll hold our transporter (the email "client") in memory.
let transporter: nodemailer.Transporter | null = null;

/**
 * Creates and returns a Nodemailer transporter using a fake Ethereal.email
 * account. This is for testing only.
 */
async function getEmailTransporter() {
  // If we already created a transporter, reuse it.
  if (transporter) {
    return transporter;
  }

  // Create a new Ethereal test account.
  // This generates a fake username and password.
  const testAccount = await nodemailer.createTestAccount();

  console.log('Ethereal test account created:');
  console.log('User: %s', testAccount.user);
  console.log('Pass: %s', testAccount.pass);

  // Create a transporter object using the Ethereal account
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  return transporter;
}

/**
 * Sends a booking confirmation email.
 */
export const sendBookingConfirmation = async (
  user: { name: string; email: string },
  booking: IBooking
) => {
  try {
    const emailTransporter = await getEmailTransporter();

    const mailOptions = {
      from: '"Hotel Awesomeness" <no-reply@hotel-awesome.com>',
      to: user.email, // The recipient's email
      subject: `Your Booking is Confirmed! (ID: ${booking.id.slice(0, 8)})`,
      html: `
        <h1>Booking Confirmed!</h1>
        <p>Hi ${user.name},</p>
        <p>Your booking at Hotel Awesomeness is confirmed.</p>
        
        <h3>Details:</h3>
        <ul>
          <li><strong>Booking ID:</strong> ${booking.id}</li>
          <li><strong>Room ID:</strong> ${booking.roomId}</li>
          <li><strong>Check-in:</strong> ${booking.startDate.toDateString()}</li>
          <li><strong>Check-out:</strong> ${booking.endDate.toDateString()}</li>
          <li><strong>Total Price:</strong> $${booking.totalPrice}</li>
        </ul>
        
        <p>We look forward to seeing you!</p>
      `,
    };

    // Send the email
    const info = await emailTransporter.sendMail(mailOptions);

    console.log('Message sent: %s', info.messageId);
    
    // This is the most important part!
    // Nodemailer will give you a URL to preview the sent email in your browser.
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
};