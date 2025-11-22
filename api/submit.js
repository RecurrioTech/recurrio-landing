export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email_address, timestamp } = req.body;
  
  // Access the environment variable securely on the server
  const webhookUrl = process.env.MAKE_WEBHOOK_URL;

  if (!webhookUrl) {
    return res.status(500).json({ error: 'Server misconfiguration: Webhook URL missing' });
  }

  try {
    // Forward the data to Make
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email_address, timestamp }),
    });

    if (response.ok) {
      return res.status(200).json({ message: 'Success' });
    } else {
      return res.status(response.status).json({ error: 'Webhook submission failed' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}