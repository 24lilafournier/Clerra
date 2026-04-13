export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 🔒 on reconstruit proprement la requête
    const { model, messages, system, max_tokens } = req.body;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model || 'claude-3-5-sonnet-20240620',
        max_tokens: max_tokens || 1000,
        system: system || '',
        messages: messages || []
      })
    });

    const data = await response.json();

    // 🔍 DEBUG CRITIQUE
    console.log("STATUS:", response.status);
    console.log("ANTHROPIC RESPONSE:", JSON.stringify(data, null, 2));

    // ❌ si erreur API → on la renvoie clairement
    if (!response.ok || data.error) {
      return res.status(500).json({
        error: data?.error?.message || 'Anthropic error',
        full: data
      });
    }

    // ✅ sécurité parsing
    if (!data.content || !data.content.length) {
      return res.status(500).json({
        error: 'Empty response from Anthropic',
        full: data
      });
    }

    // ✅ réponse clean
    return res.status(200).json(data);

  } catch (error) {
    console.error("SERVER ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
}
