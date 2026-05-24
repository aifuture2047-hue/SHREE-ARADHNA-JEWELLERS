import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getImageUrl } from '../lib/supabase';

interface HeroProps {
  banners: string[];
}

export const Hero: React.FC<HeroProps> = ({ 
  banners = []
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // ALWAYS use laptop/desktop banners, even on mobile
  const activeBanners = banners.filter(banner => banner && banner.trim() !== '');

  // Auto-play timer
  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % activeBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeBanners]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide(prev => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide(prev => (prev + 1) % activeBanners.length);
  };

  const handleScroll = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (activeBanners.length === 0) return null;

  return (
    <section className="hero-sec-full" style={{ position: 'relative', overflow: 'hidden', height: '100vh', backgroundColor: '#0c0f0f' }}>
      {/* Slides Container bounded to viewport height */}
      <div style={{ display: 'grid', width: '100%', height: '100%' }}>
        {activeBanners.map((banner, index) => (
          <div
            key={index}
            style={{
              gridArea: '1 / 1',
              width: '100%',
              height: '100%',
              opacity: currentSlide === index ? 1 : 0,
              transition: 'opacity 1.2s ease-in-out',
              zIndex: currentSlide === index ? 2 : 1
            }}
          >
            <img
              src={getImageUrl(banner)}
              alt={`Hero banner ${index + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                objectPosition: 'top center'
              }}
            />
          </div>
        ))}

        {/* Gradient overlay for text readability */}
        <div style={{
          gridArea: '1 / 1',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(180deg, rgba(12, 15, 15, 0.1) 0%, rgba(12, 15, 15, 0.9) 100%)',
          zIndex: 3,
          pointerEvents: 'none'
        }} />

        {/* Static Centered Actions Overlay */}
        <div className="hero-centered-content" style={{ zIndex: 10, position: 'absolute', bottom: '80px', width: '100%', left: 0 }}>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => handleScroll('collections')}>
              View Collections
            </button>
            <button className="btn-secondary" onClick={() => handleScroll('heritage')}>
              Our Legacy
            </button>
          </div>
        </div>

        {/* Slider Controls */}
        {activeBanners.length > 1 && (
          <>
            <button 
              onClick={handlePrev}
              style={{
                position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)',
                zIndex: 12, background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#fff', width: '44px', height: '44px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                transition: 'all 0.3s ease', backdropFilter: 'blur(4px)'
              }}
            >
              <ChevronLeft size={24} />
            </button>

            <button 
              onClick={handleNext}
              style={{
                position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)',
                zIndex: 12, background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#fff', width: '44px', height: '44px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                transition: 'all 0.3s ease', backdropFilter: 'blur(4px)'
              }}
            >
              <ChevronRight size={24} />
            </button>

            <div style={{ position: 'absolute', bottom: '50px', left: '50%', transform: 'translateX(-50%)', zIndex: 12, display: 'flex', gap: '10px' }}>
              {activeBanners.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => { e.stopPropagation(); setCurrentSlide(index); }}
                  style={{
                    width: '8px', height: '8px', borderRadius: '50%', border: 'none',
                    background: currentSlide === index ? 'var(--color-accent-gold)' : 'rgba(255, 255, 255, 0.3)',
                    cursor: 'pointer', padding: 0, transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
