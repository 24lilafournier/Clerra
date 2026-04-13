export default async function handler(req, res) {
  // Autorise uniquement POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Vérifie API key
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: 'Missing API key' });
    }

    // Appel Anthropic
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body)
    });

    // 🔴 Gestion erreur API
    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: 'Anthropic error',
        details: errorText
      });
    }

    const data = await response.json();

    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({
      error: 'Server error',
      details: error.message
    });
  }
}
