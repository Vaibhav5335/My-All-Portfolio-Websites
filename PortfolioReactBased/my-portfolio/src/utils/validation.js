import { VALIDATION_LIMITS } from './constants';

export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email.trim());
};

export const validateName = (name) => {
  if (!name || typeof name !== 'string') return false;
  const trimmed = name.trim();
  return trimmed.length >= VALIDATION_LIMITS.NAME_MIN && trimmed.length <= VALIDATION_LIMITS.NAME_MAX;
};

export const validateMessage = (message) => {
  if (!message || typeof message !== 'string') return false;
  const trimmed = message.trim();
  return trimmed.length >= VALIDATION_LIMITS.MESSAGE_MIN && trimmed.length <= VALIDATION_LIMITS.MESSAGE_MAX;
};

export const sanitizeInput = (input) => {
  if (input === null || input === undefined) return '';
  const inputStr = String(input);
  if (typeof document === 'undefined') {
    return inputStr
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }
  try {
    const textNode = document.createTextNode('');
    textNode.textContent = inputStr;
    return textNode.textContent || '';
  } catch {
    
    return inputStr
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }
};

export const logError = (error, context = '') => {
  if (import.meta.env.DEV) {
    console.error(`[${context}]`, error);
  }
};

export const validateImageUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return url.startsWith('/') || url.startsWith('./');
  }
};

