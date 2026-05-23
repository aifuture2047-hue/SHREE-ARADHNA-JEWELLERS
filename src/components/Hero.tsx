import React from 'react';
import { ChevronDown } from 'lucide-react';

interface HeroProps {
  bannerUrl: string;
  title: string;
  subtitle: string;
}

export const Hero: React.FC<HeroProps> = ({ 
  bannerUrl = '/hero_banner.jpg', 
  title = 'Eternal Heritage\nHandcrafted Brilliance', 
  subtitle = 'Welcome to Shree Aradhna Jewellers.' 
}) => {
  const handleScroll = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      className="hero-sec-full"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(12, 15, 15, 0.1) 0%, rgba(12, 15, 15, 0.9) 100%), url(${bannerUrl})`
      }}
    >
      <div className="hero-centered-content">
        <span 
          className="label-caps" 
          style={{ color: 'var(--color-accent-gold)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.22em', marginBottom: '24px' }}
        >
          Signature High Craftsmanship
        </span>
        
        <h2 className="display-lg hero-title" style={{ color: 'var(--color-text-primary)', marginBottom: '24px', whiteSpace: 'pre-wrap' }}>
          {title}
        </h2>
        
        <p 
          className="body-lg" 
          style={{ color: 'var(--color-text-secondary)', fontSize: '15px', lineHeight: '1.75', maxWidth: '640px', marginBottom: '40px', fontWeight: 300 }}
        >
          {subtitle}
        </p>
        
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={() => handleScroll('collections')}>
            View Collections
          </button>
          <button className="btn-secondary" onClick={() => handleScroll('heritage')}>
            Our Legacy
          </button>
        </div>
      </div>

      {/* Bouncing scroll indicator */}
      <div className="hero-scroll-down-centered" onClick={() => handleScroll('market-dashboard')}>
        <ChevronDown size={28} />
      </div>
    </section>
  );
};
