import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { getImageUrl } from '../lib/supabase';

interface HeroProps {
  banners: string[];
  mobileBanners: string[];
  title: string;
  subtitle: string;
}

export const Hero: React.FC<HeroProps> = ({ 
  banners = ['/hero_desktop.jpg'], 
  mobileBanners = ['/hero_banner.jpg']
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const resolvedBanners = (isMobile && mobileBanners && mobileBanners.length > 0 ? mobileBanners : banners)
    .filter(banner => banner && banner.trim() !== '');
  const activeBanners = resolvedBanners.length > 0 ? resolvedBanners : (isMobile ? ['/mobile_hero_3.png'] : ['/hero_desktop.jpg']);

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

  return (
    <section className="hero-sec-full" style={{ position: 'relative', overflow: 'hidden', height: 'auto', minHeight: 0 }}>
      {/* Image slides — stack absolutely, fade in/out */}
      <div style={{ position: 'relative', width: '100%' }}>
        {activeBanners.map((banner, index) => (
          <div
            key={index}
            style={{
              position: index === 0 ? 'relative' : 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              opacity: currentSlide === index ? 1 : 0,
              transition: 'opacity 1.2s ease-in-out',
              zIndex: currentSlide === index ? 2 : 1,
              lineHeight: 0
            }}
          >
            <img
              src={getImageUrl(banner)}
              alt={`Hero banner ${index + 1}`}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                objectFit: 'contain'
              }}
            />
          </div>
        ))}

        {/* Dark gradient overlay for buttons readability */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: 'linear-gradient(to top, rgba(12,15,15,0.85) 0%, transparent 100%)',
          zIndex: 3,
          pointerEvents: 'none'
        }} />

        {/* CTA Buttons */}
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
            {/* Left Arrow */}
            <button
              onClick={handlePrev}
              style={{
                position: 'absolute',
                left: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 12,
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#fff',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(4px)'
              }}
              aria-label="Previous slide"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-accent-gold)';
                e.currentTarget.style.color = 'var(--color-accent-gold)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.color = '#fff';
              }}
            >
              <ChevronLeft size={24} />
            </button>

            {/* Right Arrow */}
            <button
              onClick={handleNext}
              style={{
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 12,
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#fff',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(4px)'
              }}
              aria-label="Next slide"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-accent-gold)';
                e.currentTarget.style.color = 'var(--color-accent-gold)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.color = '#fff';
              }}
            >
              <ChevronRight size={24} />
            </button>

            {/* Dots */}
            <div
              style={{
                position: 'absolute',
                bottom: '50px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 12,
                display: 'flex',
                gap: '10px'
              }}
            >
              {activeBanners.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => { e.stopPropagation(); setCurrentSlide(index); }}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    border: 'none',
                    background: currentSlide === index ? 'var(--color-accent-gold)' : 'rgba(255, 255, 255, 0.3)',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'all 0.3s ease'
                  }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Scroll indicator */}
        <div
          className="hero-scroll-down-centered"
          onClick={() => handleScroll('market-dashboard')}
          style={{ zIndex: 12, position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)' }}
        >
          <ChevronDown size={28} />
        </div>
      </div>
    </section>
  );
};
