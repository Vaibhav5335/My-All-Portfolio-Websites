export const validateEmailJSEnv = () => {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  const missing = [];
  if (!serviceId || serviceId === 'your_service_id_here') {
    missing.push('VITE_EMAILJS_SERVICE_ID');
  }
  if (!templateId || templateId === 'your_template_id_here') {
    missing.push('VITE_EMAILJS_TEMPLATE_ID');
  }
  if (!publicKey || publicKey === 'your_public_key_here') {
    missing.push('VITE_EMAILJS_PUBLIC_KEY');
  }

  return {
    isValid: missing.length === 0,
    missing,
  };
};

export const validateEnvironment = () => {
  if (import.meta.env.DEV) {
    const emailjsValidation = validateEmailJSEnv();
    if (!emailjsValidation.isValid) {
      console.warn(
        '⚠️ EmailJS environment variables are missing or have placeholder values:',
        emailjsValidation.missing.join(', ')
      );
      console.warn('Contact form may not work properly. Configure EmailJS environment variables: VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY');
    }

    const web3formsKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
    const customApi = import.meta.env.VITE_CONTACT_API_URL;

    if (!emailjsValidation.isValid && !web3formsKey && !customApi) {
      console.warn(
        '⚠️ No contact form service configured. Please set up EmailJS, Web3Forms, or a custom API endpoint.'
      );
    }
  }
};

