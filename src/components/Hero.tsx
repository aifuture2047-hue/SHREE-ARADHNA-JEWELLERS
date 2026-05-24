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
    }, 5000); // Changes slide every 5 seconds
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
    <section className="hero-sec-full" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Slides Container */}
      {activeBanners.map((banner, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `linear-gradient(180deg, rgba(12, 15, 15, 0.1) 0%, rgba(12, 15, 15, 0.9) 100%), url(${getImageUrl(banner)})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: currentSlide === index ? 1 : 0,
            transition: 'opacity 1.2s ease-in-out',
            zIndex: 1
          }}
        />
      ))}

      {/* Static Centered Actions Overlay */}
      <div className="hero-centered-content" style={{ zIndex: 10, position: 'relative' }}>
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
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)';
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
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)';
            }}
          >
            <ChevronRight size={24} />
          </button>

          {/* Indicators / Dots */}
          <div 
            style={{
              position: 'absolute',
              bottom: '90px',
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

      {/* Bouncing scroll indicator */}
      <div className="hero-scroll-down-centered" onClick={() => handleScroll('market-dashboard')} style={{ zIndex: 12 }}>
        <ChevronDown size={28} />
      </div>
    </section>
  );
};
