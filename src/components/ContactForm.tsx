import React, { useState, useEffect } from 'react';
import { Send, Check } from 'lucide-react';

interface ContactFormProps {
  onSubmitMessage: (msg: { name: string; email: string; phone: string; message: string }) => void;
  prefilledMessage?: string;
  setPrefilledMessage?: (msg: string) => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ onSubmitMessage, prefilledMessage, setPrefilledMessage }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (prefilledMessage) {
      setMessage(prefilledMessage);
      if (setPrefilledMessage) {
        setPrefilledMessage('');
      }
    }
  }, [prefilledMessage, setPrefilledMessage]);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    onSubmitMessage({ name, email, phone, message });

    setSubmitted(true);
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');

    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  return (
    <section id="contact" className="section" style={{ backgroundColor: 'var(--color-surface)' }}>
      <div className="container">
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span className="label-caps" style={{ color: 'var(--color-accent-gold)', marginBottom: '16px', display: 'block' }}>Private Inquiry</span>
          <h2 className="headline-md">Bespoke Consultations</h2>
          <div style={{ width: '40px', height: '1px', backgroundColor: 'var(--color-accent-gold)', margin: '20px auto 0' }}></div>
          <p className="body-lg" style={{ color: 'var(--color-text-secondary)', marginTop: '24px', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
            Book a private gallery viewing or discuss custom commission ideas with our principal craftsmen.
          </p>
        </div>

        {submitted ? (
          <div 
            style={{ 
              maxWidth: '600px', 
              margin: '0 auto', 
              padding: '48px', 
              border: '1px solid var(--color-border-subtle)', 
              textAlign: 'center', 
              backgroundColor: 'rgba(247, 240, 17, 0.03)' 
            }}
          >
            <div style={{ display: 'inline-flex', width: '48px', height: '48px', backgroundColor: 'var(--color-accent-gold)', color: '#121414', borderRadius: '50%', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <Check size={24} />
            </div>
            <h3 className="headline-sm" style={{ color: 'var(--color-accent-gold)', marginBottom: '16px' }}>Request Received</h3>
            <p className="body-md" style={{ color: 'var(--color-text-secondary)' }}>
              An advisor will reach out to you within 24 hours to coordinate your custom session.
            </p>
          </div>
        ) : (
          <form className="luxe-form" onSubmit={handleSubmit}>
            {/* Name Input */}
            <div className="luxe-input-group">
              <input 
                type="text" 
                className="luxe-input"
                placeholder=" "
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <label className="luxe-label">Full Name</label>
            </div>

            {/* Email Input */}
            <div className="luxe-input-group">
              <input 
                type="email" 
                className="luxe-input"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label className="luxe-label">Email Address</label>
            </div>

            {/* Phone Input */}
            <div className="luxe-input-group">
              <input 
                type="tel" 
                className="luxe-input"
                placeholder=" "
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <label className="luxe-label">Phone Number (Optional)</label>
            </div>

            {/* Message Input */}
            <div className="luxe-input-group">
              <textarea 
                className="luxe-input"
                rows={4}
                placeholder=" "
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                style={{ resize: 'none' }}
              />
              <label className="luxe-label">Your Message or Commission Request</label>
            </div>

            <button type="submit" className="btn-primary" style={{ alignSelf: 'center', minWidth: '220px' }}>
              Submit Request <Send size={14} />
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
