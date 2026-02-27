import { useState, useRef, useEffect, useCallback } from 'react';
import { validateEmail, validateName, validateMessage, sanitizeInput, logError } from '../utils/validation';
import { ToastContainer } from '../components/Toast';
import { TOAST_DURATION, VALIDATION_LIMITS } from '../utils/constants';

const EMAILJS_FIELD_LIMITS = {
  NAME_MAX: 100,
  EMAIL_MAX: 254,
  MESSAGE_MAX: 10000,
};

const RATE_LIMIT_MS = 5000;

const validateEmailJSInputs = (formData) => {
  const errors = {};
  if (formData?.name && typeof formData.name === 'string' && formData.name.length > EMAILJS_FIELD_LIMITS.NAME_MAX) {
    errors.name = `Name must be ${EMAILJS_FIELD_LIMITS.NAME_MAX} characters or less for email service`;
  }
  if (formData?.email && typeof formData.email === 'string' && formData.email.length > EMAILJS_FIELD_LIMITS.EMAIL_MAX) {
    errors.email = `Email must be ${EMAILJS_FIELD_LIMITS.EMAIL_MAX} characters or less`;
  }
  if (formData?.message && typeof formData.message === 'string' && formData.message.length > EMAILJS_FIELD_LIMITS.MESSAGE_MAX) {
    errors.message = `Message must be ${EMAILJS_FIELD_LIMITS.MESSAGE_MAX} characters or less for email service`;
  }
  return errors;
};

const loadEmailJS = async () => {
  try {
    const emailjs = await import('@emailjs/browser');
    if (!emailjs?.send) {
      throw new Error('EmailJS module loaded but send function is not available');
    }
    return emailjs;
  } catch (importError) {
    const errorMsg = importError.message || '';
    if (errorMsg.includes('Failed to fetch dynamically imported module') || 
        errorMsg.includes('Cannot find module') ||
        errorMsg.includes('Failed to resolve module')) {
      throw new Error('EmailJS package not found. Please run: npm install @emailjs/browser');
    }
    if (importError instanceof TypeError && errorMsg.includes('fetch')) {
      throw new Error('Network error while loading EmailJS. Please check your connection and try again.');
    }
    throw new Error(`Failed to load EmailJS: ${errorMsg || 'Unknown error'}`);
  }
};

const submitViaEmailJS = async (formData, config) => {
  const emailjs = await loadEmailJS();
  
  if (!config?.serviceId || !config?.templateId || !config?.publicKey) {
    throw new Error('EmailJS configuration is incomplete');
  }
  
  const result = await emailjs.send(
    config.serviceId,
    config.templateId,
    {
      from_name: String(formData.name || '').substring(0, EMAILJS_FIELD_LIMITS.NAME_MAX),
      from_email: String(formData.email || '').substring(0, EMAILJS_FIELD_LIMITS.EMAIL_MAX),
      message: String(formData.message || '').substring(0, EMAILJS_FIELD_LIMITS.MESSAGE_MAX),
      to_name: String(import.meta.env.VITE_CONTACT_RECIPIENT_NAME || 'Vaibhav Sharma').substring(0, EMAILJS_FIELD_LIMITS.NAME_MAX),
    },
    config.publicKey
  );
  
  if (result.status !== 200 && result.text !== 'OK') {
    throw new Error(`EmailJS returned error: ${result.text || 'Unknown error'}`);
  }
};

const loadFormDataFromStorage = () => {
  try {
    const saved = localStorage.getItem('contactFormData');
    return saved ? JSON.parse(saved) : { name: '', email: '', message: '' };
  } catch (error) {
    logError(error, 'Failed to load form data from localStorage');
    return { name: '', email: '', message: '' };
  }
};

const saveFormDataToStorage = (formData) => {
  try {
    localStorage.setItem('contactFormData', JSON.stringify(formData));
  } catch (error) {
    logError(error, 'Failed to save form data to localStorage');
  }
};

const clearFormDataFromStorage = () => {
  try {
    localStorage.removeItem('contactFormData');
  } catch (error) {
    logError(error, 'Failed to clear form data from localStorage');
  }
};

const validateFormData = (formData) => {
  const errors = {};
  
  if (!formData.name.trim()) {
    errors.name = 'Name is required';
  } else if (!validateName(formData.name)) {
    errors.name = `Name must be between ${VALIDATION_LIMITS.NAME_MIN} and ${VALIDATION_LIMITS.NAME_MAX} characters`;
  }
  
  if (!formData.email.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (!formData.message.trim()) {
    errors.message = 'Message is required';
  } else if (!validateMessage(formData.message)) {
    errors.message = `Message must be between ${VALIDATION_LIMITS.MESSAGE_MIN} and ${VALIDATION_LIMITS.MESSAGE_MAX} characters`;
  }
  
  const emailjsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  if (emailjsServiceId) {
    const emailjsErrors = validateEmailJSInputs(formData);
    Object.assign(errors, emailjsErrors);
  }
  
  return errors;
};

const submitViaWeb3Forms = async (formData, accessKey) => {
  if (!accessKey || typeof accessKey !== 'string' || accessKey.trim() === '') {
    throw new Error('Web3Forms access key is required');
  }
  
  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      access_key: accessKey.trim(),
      subject: `New Contact Form Message from ${sanitizeInput(formData.name || '')}`,
      name: sanitizeInput(formData.name || ''),
      email: sanitizeInput(formData.email || ''),
      message: sanitizeInput(formData.message || ''),
      from_name: sanitizeInput(formData.name || ''),
    })
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const contentType = response.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    const text = await response.text();
    throw new Error(`Unexpected response format: ${text.substring(0, 100)}`);
  }
  
  const data = await response.json().catch(() => {
    throw new Error('Invalid response from form service. Please try again.');
  });
  
  if (!data.success) {
    throw new Error(data.message || 'Failed to send message');
  }
};

const submitViaCustomAPI = async (formData, apiEndpoint) => {
  if (!apiEndpoint || typeof apiEndpoint !== 'string' || apiEndpoint.trim() === '') {
    throw new Error('API endpoint is required');
  }
  
  let url;
  try {
    url = new URL(apiEndpoint);
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error('API endpoint must use HTTP or HTTPS protocol');
    }
  } catch {
    throw new Error('Invalid API endpoint URL format');
  }
  
  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: sanitizeInput(formData.name || ''),
      email: sanitizeInput(formData.email || ''),
      message: sanitizeInput(formData.message || '')
    })
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    if (response.status === 404) {
      throw new Error('API endpoint not found. Please check your VITE_CONTACT_API_URL configuration.');
    }
    throw new Error(errorData.message || `Server error: ${response.status}`);
  }
  
  return await response.json().catch(() => ({}));
};

const Contact = () => {
  const [formData, setFormData] = useState(() => loadFormDataFromStorage());
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingEmailJS, setIsLoadingEmailJS] = useState(false);
  const [toasts, setToasts] = useState([]);
  
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const messageRef = useRef(null);
  const lastSubmissionTimeRef = useRef(0);
  const fieldRefs = { name: nameRef, email: emailRef, message: messageRef };

  useEffect(() => {
    const hasData = formData.name || formData.email || formData.message;
    if (hasData) {
      saveFormDataToStorage(formData);
    }
  }, [formData]);

  const addToast = (message, type = 'success', duration = TOAST_DURATION.DEFAULT) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
    setErrors(prev => {
      if (prev[name]) {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      }
      return prev;
    });
  }, []);

  const focusFirstError = (errorKeys) => {
    requestAnimationFrame(() => {
      const firstErrorField = errorKeys[0];
      const fieldRef = fieldRefs[firstErrorField]?.current;
      if (fieldRef) {
        fieldRef.focus();
        fieldRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const now = Date.now();
    if (now - lastSubmissionTimeRef.current < RATE_LIMIT_MS) {
      const remainingSeconds = Math.ceil((RATE_LIMIT_MS - (now - lastSubmissionTimeRef.current)) / 1000);
      addToast(`Please wait ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''} before submitting again.`, 'error', TOAST_DURATION.SHORT);
      return;
    }
    
    const newErrors = validateFormData(formData);
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      focusFirstError(Object.keys(newErrors));
      return;
    }
    
    setErrors({});
    setIsSubmitting(true);
    lastSubmissionTimeRef.current = now;
    
    const sanitizedData = {
      name: sanitizeInput(formData.name),
      email: sanitizeInput(formData.email),
      message: sanitizeInput(formData.message)
    };
    
    try {
      const emailjsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const emailjsTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const emailjsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
      
      if (emailjsServiceId && emailjsTemplateId && emailjsPublicKey) {
        setIsLoadingEmailJS(true);
        try {
          await submitViaEmailJS(sanitizedData, {
            serviceId: emailjsServiceId,
            templateId: emailjsTemplateId,
            publicKey: emailjsPublicKey
          });
          addToast('Message sent successfully!', 'success');
          clearFormDataFromStorage();
        } catch (emailjsError) {
          logError(emailjsError, 'EmailJS submission failed');
          throw emailjsError;
        } finally {
          setIsLoadingEmailJS(false);
        }
      } else {
        const web3formsAccessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
        
        if (web3formsAccessKey) {
          await submitViaWeb3Forms(sanitizedData, web3formsAccessKey);
          addToast('Message sent successfully!', 'success');
          clearFormDataFromStorage();
          } else {
            const apiEndpoint = import.meta.env.VITE_CONTACT_API_URL;
            
            if (!apiEndpoint) {
              addToast('Contact form is not configured. Please set up EmailJS, Web3Forms, or a custom API endpoint.', 'error', TOAST_DURATION.LONG);
              throw new Error('Contact form is not configured');
            }
            
            const data = await submitViaCustomAPI(sanitizedData, apiEndpoint);
            addToast(data.message || 'Message sent successfully!', 'success');
            clearFormDataFromStorage();
          }
      }
      
      setFormData({ name: '', email: '', message: '' });
      setErrors({});
    } catch (error) {
      logError(error, 'Contact form submission');
      if (error instanceof TypeError && error.message.includes('fetch')) {
        addToast('Network error. Please check your connection and try again.', 'error');
      } else {
        addToast(error.message || 'Failed to send message. Please try again.', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-20">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <h2 className="text-5xl md:text-6xl font-bold mb-12 text-center pt-4">
        <span className="bg-gradient-to-r from-[#3be8b0] via-[#a5a6f6] to-[#232946] bg-clip-text text-transparent">Get In Touch</span>
      </h2>
      <form 
        onSubmit={handleSubmit} 
        className="max-w-sm mx-auto space-y-4" 
        noValidate 
        aria-label="Contact form"
        aria-live="polite"
      >
        <div>
          <label htmlFor="name" className="sr-only">Your Name</label>
          <input 
            ref={nameRef}
            type="text" 
            id="name"
            name="name"
            placeholder="Your Name" 
            value={formData.name} 
            onChange={handleChange}
            required
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
            className={`w-full px-3 py-2 bg-white/5 backdrop-blur-xl border rounded-lg focus:outline-none focus:border-[#3be8b0]/50 focus:bg-white/10 transition-all duration-300 text-[#e9e9f0] placeholder-[#a5a6f6] text-base ${
              errors.name ? 'border-red-500/50' : 'border-white/10'
            }`}
          />
          {errors.name && (
            <p id="name-error" className="mt-1 text-sm text-red-400" role="alert">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="sr-only">Your Email</label>
          <input 
            ref={emailRef}
            type="email" 
            id="email"
            name="email"
            placeholder="Your Email" 
            value={formData.email} 
            onChange={handleChange}
            required
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className={`w-full px-3 py-2 bg-white/5 backdrop-blur-xl border rounded-lg focus:outline-none focus:border-[#3be8b0]/50 focus:bg-white/10 transition-all duration-300 text-[#e9e9f0] placeholder-[#a5a6f6] text-base ${
              errors.email ? 'border-red-500/50' : 'border-white/10'
            }`}
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-sm text-red-400" role="alert">
              {errors.email}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="message" className="sr-only">Your Message</label>
          <textarea 
            ref={messageRef}
            id="message"
            name="message"
            placeholder="Your Message" 
            value={formData.message} 
            onChange={handleChange}
            rows="4" 
            required
            aria-required="true"
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? 'message-error message-counter' : 'message-counter'}
            maxLength={VALIDATION_LIMITS.MESSAGE_MAX}
            className={`w-full px-3 py-2 bg-white/5 backdrop-blur-xl border rounded-lg focus:outline-none focus:border-[#3be8b0]/50 focus:bg-white/10 transition-all duration-300 text-[#e9e9f0] placeholder-[#a5a6f6] resize-none text-base ${
              errors.message ? 'border-red-500/50' : 'border-white/10'
            }`}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.message && (
              <p id="message-error" className="text-sm text-red-400" role="alert">
                {errors.message}
              </p>
            )}
            <p 
              id="message-counter" 
              className={`text-xs ml-auto ${
                formData.message.length > VALIDATION_LIMITS.MESSAGE_MAX * 0.9 
                  ? 'text-yellow-400' 
                  : 'text-gray-400'
              }`}
              aria-live="polite"
            >
              {formData.message.length} / {VALIDATION_LIMITS.MESSAGE_MAX} characters
            </p>
          </div>
        </div>
        <button 
          type="submit" 
          disabled={isSubmitting || isLoadingEmailJS}
          aria-busy={isSubmitting || isLoadingEmailJS}
          aria-disabled={isSubmitting || isLoadingEmailJS}
          className="w-full px-6 py-3 bg-gradient-to-r from-[#3be8b0] via-[#a5a6f6] to-[#3be8b0] backdrop-blur-xl rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-[#3be8b0]/50 border border-white/20 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none focus:outline-none focus:ring-2 focus:ring-[#3be8b0] focus:ring-offset-2 focus:ring-offset-transparent"
        >
          <span className="relative z-10">
            {isLoadingEmailJS ? 'Loading email service...' : isSubmitting ? 'Sending...' : 'Send Message'}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-[#3be8b0]/30 via-[#a5a6f6]/30 to-[#3be8b0]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </form>
    </div>
  );
};

export default Contact;
