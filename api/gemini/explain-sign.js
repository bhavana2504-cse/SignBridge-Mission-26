export default async function handler(req, res) {
  // Set CORS headers for API calls
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    return res.status(503).json({
      error: 'Gemini API key is not configured in Vercel environment variables.'
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { signWord, category, question } = body;
    const prompt = question 
      ? `You are an Indian Sign Language (ISL) educational expert on the SignBridge platform. Answer this question concisely for a beginner learner about the sign '${signWord || 'General'}' (${category || 'ISL'}): ${question}`
      : `You are an Indian Sign Language (ISL) educational coach on SignBridge. Explain the sign for '${signWord || 'Hello'}' (${category || 'General'}):
1. Handshape & Orientation: Which hand and finger shape to form.
2. Movement: Where and how the hand moves.
3. Memory Tip: A simple mnemonic to easily remember it.
Keep it encouraging, clear, and under 130 words.`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;
    const apiRes = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 300, temperature: 0.3 }
      })
    });

    const data = await apiRes.json();
    if (data.error) {
      return res.status(502).json({
        error: data.error.message || 'Google Gemini API returned an error.'
      });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
    return res.status(200).json({ success: true, text });
  } catch (err) {
    return res.status(500).json({ error: 'Server error processing Gemini request.' });
  }
}
