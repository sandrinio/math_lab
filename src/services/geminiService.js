// geminiService.js
// Service for communicating with Gemini AI for math problem generation
// IMPORTANT: Do NOT hardcode your API key here. Set it in your environment as VUE_APP_GEMINI_API_KEY


/**
 * Generate math problems using Gemini AI
 * @param {Object} parameters - { add, sub, max, age }
 * @param {string} model - Gemini model name (e.g., 'gemini-pro', 'gemini-pro-vision')
 * @returns {Promise<Array>} Array of problem objects
 */
export async function generateProblemsWithGemini(parameters, model) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.error('Gemini API key is missing. Set VUE_APP_GEMINI_API_KEY in your environment.');
    window.alert('Gemini API key is missing. Please contact the administrator or set VUE_APP_GEMINI_API_KEY in your environment.');
    return [];
  }

  // Prepare the prompt for Gemini
  const prompt = `Generate ${parameters.add} addition and ${parameters.sub} subtraction math problems for a child aged ${parameters.age}. Each problem should use numbers up to ${parameters.max}. Return an array of objects with fields: left, right, operator ('+' or '-').`;

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const requestBody = {
    contents: [
      {
        parts: [
          { text: prompt }
        ]
      }
    ],
    generationConfig: {
      response_mime_type: 'application/json'
    }
  }

  try {
    const response = await fetch(`${apiUrl}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    const data = await response.json();
    // Try to parse the text as JSON
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('No content from Gemini');
    const problems = JSON.parse(text);
    return Array.isArray(problems) ? problems : [];
  } catch (e) {
    console.error('Gemini API error:', e);
    return [];
  }
}

// To use: set VUE_APP_GEMINI_API_KEY in your .env file or environment variables.
// Example: VUE_APP_GEMINI_API_KEY=AIza... 