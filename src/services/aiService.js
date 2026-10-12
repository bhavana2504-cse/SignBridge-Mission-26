/**
 * SignBridge - Client-side AI Service
 * Communicates strictly with our local server-side proxy (/api/gemini/explain-sign).
 * The GEMINI_API_KEY is never exposed to the client or browser network logs.
 */

export const aiService = {
  /**
   * Request an educational explanation of an ISL sign
   * @param {string} signWord 
   * @param {string} category 
   * @param {string} [question] 
   * @returns {Promise<{ success: boolean, text?: string, error?: string }>}
   */
  async explainSign(signWord, category, question = null) {
    try {
      const response = await fetch('/api/gemini/explain-sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signWord, category, question })
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `Server responded with status ${response.status}`
        };
      }

      return {
        success: true,
        text: data.text
      };
    } catch (err) {
      console.warn('[SignBridge AI Service] Offline or connection error:', err);
      return {
        success: false,
        error: 'Unable to reach the SignBridge AI server. Please check your local connection.'
      };
    }
  }
};

export default aiService;
