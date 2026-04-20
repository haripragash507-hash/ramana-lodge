require('dotenv').config();
const express = require('express');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Twilio Config
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const adminNumber = process.env.ADMIN_PHONE_NUMBER;

app.post('/api/send-sms', async (req, res) => {
  const { guestPhone, guestName, roomName, bookingId } = req.body;

  try {
    // Note: Twilio requires exact E.164 formatting for phone numbers (+1234567890)
    // We'll normalize the guest phone roughly or just try to send it if it already matches format.
    let formattedGuestPhone = guestPhone;
    if (!guestPhone.startsWith('+')) {
      formattedGuestPhone = '+' + guestPhone;
    }

    const guestMessage = `Hi ${guestName}, your booking for ${roomName} is successful. ID: ${bookingId}. Our room manager will contact you shortly. Thank you!`;
    const adminMessage = `New Booking Alert: ${guestName} booked ${roomName}. ID: ${bookingId}`;

    console.log('Sending message to guest:', formattedGuestPhone);
    let guestError = null;
    try {
      await client.messages.create({
        body: guestMessage,
        from: twilioNumber,
        to: formattedGuestPhone
      });
    } catch (e) {
      guestError = e.message;
      console.error('Guest Twilio Error:', guestError);
    }

    console.log('Sending message to admin:', adminNumber);
    try {
      await client.messages.create({
        body: adminMessage,
        from: twilioNumber,
        to: adminNumber
      });
    } catch (e) {
      console.error('Admin Twilio Error:', e.message);
    }

    if (guestError) {
      return res.status(200).json({ success: false, error: guestError });
    }

    res.status(200).json({ success: true, message: 'SMS dispatched successfully' });
  } catch (error) {
    console.error('Twilio Error:', error.message);
    // Even if it fails, we shouldn't crash the frontend payment flow so we just return a status 200 with error log
    res.status(200).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Twilio Active: Sender Number is ${twilioNumber}`);
});
