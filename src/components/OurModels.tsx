import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getImageUrl } from '../lib/supabase';

interface ModelSlide {
  id: string;
  imageUrl: string;
}

interface OurModelsProps {
  modelImages?: string[];
}

export const OurModels: React.FC<OurModelsProps> = ({ modelImages = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Use admin-uploaded images, fallback to defaults if none
  const defaultImages = ['/model_show_1.jpg', '/model_show_2.jpg', '/model_show_3.jpg', '/model_show_4.jpg'];
  const slides: ModelSlide[] = (modelImages.length > 0 ? modelImages : defaultImages)
    .filter(url => url && url.trim() !== '')
    .map((url, i) => ({ id: String(i), imageUrl: url }));

  const total = slides.length;

  useEffect(() => {
    if (total <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % total);
    }, 5000);
    return () => clearInterval(interval);
  }, [total]);

  const handlePrev = () => setCurrentSlide(prev => (prev - 1 + total) % total);
  const handleNext = () => setCurrentSlide(prev => (prev + 1) % total);

  if (slides.length === 0) return null;

  return (
    <section className="section" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.03)', backgroundColor: 'var(--color-background)', padding: isMobile ? '60px 0' : '80px 0' }}>
      <div className="container">
        <div style={{ textAlign: 'left', marginBottom: '40px' }}>
          <span className="label-caps" style={{ color: 'var(--color-accent-gold)', marginBottom: '16px', display: 'block' }}>High Fashion</span>
          <h2 className="headline-md" style={{ margin: 0 }}>Our Models</h2>
        </div>

        <div
          style={{
            display: 'grid',
            width: '100%',
            maxWidth: '900px',
            margin: '0 auto',
            backgroundColor: 'var(--color-surface-card)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
            lineHeight: 0
          }}
        >
          {/* Images */}
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              style={{
                gridArea: '1 / 1',
                width: '100%',
                opacity: currentSlide === index ? 1 : 0,
                transition: 'opacity 1s ease-in-out',
                zIndex: currentSlide === index ? 2 : 1
              }}
            >
              <img
                src={getImageUrl(slide.imageUrl)}
                alt={`Model ${index + 1}`}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  maxHeight: '80vh',
                  aspectRatio: isMobile ? '4/5' : '16/9',
                  display: 'block', 
                  objectFit: 'cover' 
                }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
          ))}

          {/* Left Arrow */}
          {total > 1 && (
            <button
              onClick={handlePrev}
              style={{
                position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)',
                zIndex: 10, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)',
                color: '#fff', width: '40px', height: '40px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.3s ease', backdropFilter: 'blur(4px)'
              }}
              aria-label="Previous model"
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent-gold)'; e.currentTarget.style.color = 'var(--color-accent-gold)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff'; }}
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {/* Right Arrow */}
          {total > 1 && (
            <button
              onClick={handleNext}
              style={{
                position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)',
                zIndex: 10, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)',
                color: '#fff', width: '40px', height: '40px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.3s ease', backdropFilter: 'blur(4px)'
              }}
              aria-label="Next model"
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent-gold)'; e.currentTarget.style.color = 'var(--color-accent-gold)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff'; }}
            >
              <ChevronRight size={20} />
            </button>
          )}

          {/* Dots */}
          {total > 1 && (
            <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', zIndex: 10, display: 'flex', gap: '8px' }}>
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  style={{
                    width: '6px', height: '6px', borderRadius: '50%', border: 'none',
                    backgroundColor: currentSlide === index ? 'var(--color-accent-gold)' : 'rgba(255,255,255,0.3)',
                    cursor: 'pointer', padding: 0, transition: 'all 0.3s ease'
                  }}
                  aria-label={`Go to model slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
