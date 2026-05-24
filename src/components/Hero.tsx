import React, { useState, useEffect } from 'react';
import { getImageUrl } from '../lib/supabase';

interface HeroProps {
  banners?: string[];
  onExplore?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  banners = []
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const defaultBanners = [
    '/hero_banner.jpg',
    '/hero_banner_2.jpg'
  ];

  const sourceBanners = banners.length > 0 && banners.some(b => b.trim() !== '') ? banners : defaultBanners;
  const activeBanners = sourceBanners.filter(banner => banner && banner.trim() !== '');

  // Auto-play timer
  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % activeBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeBanners]);

  const handleScroll = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (activeBanners.length === 0) return null;

  return (
    <section className="hero-sec-full" style={{ position: 'relative', overflow: 'hidden', height: 'calc(100vh - 116px)', backgroundColor: '#0c0f0f' }}>
      {/* Slides Container bounded to viewport height minus header */}
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
              zIndex: currentSlide === index ? 2 : 1,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#0c0f0f' // Clean solid dark background
            }}
          >
            {/* Sharp Foreground Image */}
            <img
              src={getImageUrl(banner)}
              alt={`Hero banner ${index + 1}`}
              style={{
                width: '100%',
                height: '100%',
                maxWidth: '1000px', // Prevent it from getting absurdly wide on huge screens if they use landscape
                objectFit: 'contain',
                display: 'block',
                objectPosition: 'center center',
                position: 'relative',
                zIndex: 1
              }}
            />
          </div>
        ))}

        {/* Minimal Gradient for text readability at the very bottom */}
        <div style={{
          gridArea: '1 / 1',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(180deg, rgba(12, 15, 15, 0) 50%, rgba(12, 15, 15, 0.95) 100%)',
          zIndex: 3,
          pointerEvents: 'none'
        }} />

        {/* Clean Centered Actions */}
        <div className="hero-centered-content" style={{ zIndex: 10, position: 'absolute', bottom: '60px', width: '100%', left: 0 }}>
          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => handleScroll('collections')} style={{ minWidth: '160px', padding: '12px 28px', fontSize: '13px', letterSpacing: '1px', textTransform: 'uppercase', border: '1px solid var(--color-accent-gold)' }}>
              View Collections
            </button>
            <button className="btn-secondary" onClick={() => handleScroll('heritage')} style={{ minWidth: '160px', padding: '12px 28px', fontSize: '13px', letterSpacing: '1px', textTransform: 'uppercase', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}>
              Our Legacy
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
