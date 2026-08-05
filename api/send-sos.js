import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { latitude, longitude, contactNumber } = req.body;
  const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;

  try {
    await client.messages.create({
      body: `EMERGENCY SOS ALERT! SheGuard-X alert. I need help. My location: ${mapsLink}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: contactNumber
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}