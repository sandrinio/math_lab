// cookieStorage.js
// Utility for storing and retrieving homework session data in cookies using an AI-compatible schema

// Set a cookie
export function setSessionCookie(session, name = 'mathLabSession', days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(JSON.stringify(session))}; expires=${expires}; path=/`;
}

// Get a cookie
export function getSessionCookie(name = 'mathLabSession') {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    try {
      return JSON.parse(decodeURIComponent(parts.pop().split(';').shift()));
    } catch (e) {
      return null;
    }
  }
  return null;
}

// Remove a cookie
export function removeSessionCookie(name = 'mathLabSession') {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

// Set selected Gemini model in cookie
export function setSelectedGeminiModel(model, days = 30) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `selectedGeminiModel=${encodeURIComponent(model)}; expires=${expires}; path=/`;
}

// Get selected Gemini model from cookie
export function getSelectedGeminiModel() {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; selectedGeminiModel=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop().split(';').shift());
  }
  return null;
}

// Remove selected Gemini model cookie
export function removeSelectedGeminiModel() {
  document.cookie = `selectedGeminiModel=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
} 