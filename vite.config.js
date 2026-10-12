import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const geminiApiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  return {
    plugins: [
      react(),
      {
        name: 'gemini-api-server-middleware',
        configureServer(server) {
          server.middlewares.use('/api/gemini/explain-sign', (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Method Not Allowed' }));
              return;
            }

            if (!geminiApiKey) {
              res.statusCode = 503;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ 
                error: 'Gemini API key is not configured in server environment (.env.local).' 
              }));
              return;
            }

            let body = '';
            req.on('data', (chunk) => { body += chunk; });
            req.on('end', async () => {
              try {
                const { signWord, category, question } = JSON.parse(body || '{}');
                const prompt = question 
                  ? `You are an Indian Sign Language (ISL) educational expert on the SignBridge platform. Answer this question concisely for a beginner learner about the sign '${signWord || 'General'}' (${category || 'ISL'}): ${question}`
                  : `You are an Indian Sign Language (ISL) educational coach on SignBridge. Explain the sign for '${signWord || 'Hello'}' (${category || 'General'}):
1. Handshape & Orientation: Which hand and finger shape to form.
2. Movement: Where and how the hand moves.
3. Memory Tip: A simple mnemonic to easily remember it.
Keep it encouraging, clear, and under 130 words.`;

                const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${geminiApiKey}`;
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
                  res.statusCode = 502;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ 
                    error: data.error.message || 'Google Gemini API returned an error.' 
                  }));
                  return;
                }

                const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, text }));
              } catch (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Server error processing Gemini request.' }));
              }
            });
          });
        }
      }
    ],
    server: {
      port: 5173,
      open: false,
      watch: {
        ignored: ['**/*.zip', '**/.git/**', '**/dist/**', '**/scratch/**', '**/public/**']
      }
    }
  };
});
