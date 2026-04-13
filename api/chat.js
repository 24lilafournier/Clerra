export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({
        content: [{ text: "Erreur : clé API manquante." }]
      });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(200).json({
        content: [{ text: "Erreur API Anthropic : " + err }]
      });
    }

    const data = await response.json();

    // 🔴 NORMALISATION (clé)
    const text =
      data?.content?.[0]?.text ||
      "Réponse vide.";

    return res.status(200).json({
      content: [{ text }]
    });

  } catch (error) {
    return res.status(200).json({
      content: [{ text: "Erreur serveur : " + error.message }]
    });
  }
}
