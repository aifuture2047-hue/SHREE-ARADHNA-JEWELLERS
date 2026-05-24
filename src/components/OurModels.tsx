import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getImageUrl } from '../lib/supabase';

interface ModelSlide {
  id: string;
  name: string;
  collection: string;
  imageUrl: string;
  description: string;
}

const MODELS: ModelSlide[] = [
  {
    id: 'm1',
    name: 'Royal Heritage Collection',
    collection: 'Bridal Artistry',
    imageUrl: '/model_show_1.jpg',
    description: 'Bespoke 22K gold chokers and traditional temple necklaces, hand-filed to capture legacy beauty.'
  },
  {
    id: 'm2',
    name: 'Aura Premium Chokers',
    collection: 'High Craftsmanship',
    imageUrl: '/model_show_2.jpg',
    description: 'Artisanal gold leaf layers showcasing precise pavé layouts and traditional Kutch engravings.'
  },
  {
    id: 'm3',
    name: 'A Lifetime of Love',
    collection: 'Traditional Ornaments',
    imageUrl: '/model_show_3.jpg',
    description: 'Finely carved solid gold cuffs and handcrafted rings highlighting investment-grade bullion assets.'
  },
  {
    id: 'm4',
    name: 'Signature Geometric Sets',
    collection: 'Modern Luxury',
    imageUrl: '/model_show_4.jpg',
    description: 'Gold necklaces featuring detailed peacock loops, custom emerald layers, and brilliant diamond lines.'
  }
];

export const OurModels: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Viewport resize listener
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-play loop
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % MODELS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setCurrentSlide(prev => (prev - 1 + MODELS.length) % MODELS.length);
  };

  const handleNext = () => {
    setCurrentSlide(prev => (prev + 1) % MODELS.length);
  };

  return (
    <section className="section" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.03)', backgroundColor: 'var(--color-background)', padding: isMobile ? '60px 0' : '80px 0' }}>
      <div className="container">
        <div style={{ textAlign: 'left', marginBottom: '40px' }}>
          <span className="label-caps" style={{ color: 'var(--color-accent-gold)', marginBottom: '16px', display: 'block' }}>High Fashion</span>
          <h2 className="headline-md" style={{ margin: 0 }}>Our Models</h2>
        </div>

        {/* Slideshow Display Section */}
        <div 
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '900px',
            margin: '0 auto',
            height: isMobile ? '400px' : '560px',
            backgroundColor: 'var(--color-surface-card)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)'
          }}
          className="models-slideshow"
        >
          {/* Sliding/Fading Image View */}
          <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
            {MODELS.map((model, index) => (
              <div
                key={model.id}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${getImageUrl(model.imageUrl)})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  opacity: currentSlide === index ? 1 : 0,
                  transition: 'opacity 1s ease-in-out',
                  zIndex: currentSlide === index ? 2 : 1
                }}
              />
            ))}
          </div>

          {/* Overlay Navigation controls (Buttons & Dots) */}
          
          {/* Left Arrow */}
          <button 
            onClick={handlePrev}
            style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#fff',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(4px)'
            }}
            aria-label="Previous model"
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent-gold)'; e.currentTarget.style.color = 'var(--color-accent-gold)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.color = '#fff'; }}
          >
            <ChevronLeft size={20} />
          </button>

          {/* Right Arrow */}
          <button 
            onClick={handleNext}
            style={{
              position: 'absolute',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#fff',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(4px)'
            }}
            aria-label="Next model"
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent-gold)'; e.currentTarget.style.color = 'var(--color-accent-gold)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.color = '#fff'; }}
          >
            <ChevronRight size={20} />
          </button>

          {/* Indicators / Dots */}
          <div 
            style={{
              position: 'absolute',
              bottom: '24px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 10,
              display: 'flex',
              gap: '8px'
            }}
          >
            {MODELS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: currentSlide === index ? 'var(--color-accent-gold)' : 'rgba(255, 255, 255, 0.3)',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.3s ease'
                }}
                aria-label={`Go to model slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

