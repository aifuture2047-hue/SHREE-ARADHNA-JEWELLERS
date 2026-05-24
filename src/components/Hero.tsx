import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getImageUrl } from '../lib/supabase';

interface HeroProps {
  banners?: string[];
  mobileBanners?: string[];
  onExplore?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  banners = [],
  mobileBanners = []
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const defaultBanners = [
    '/hero_banner.jpg',
    '/hero_banner_2.jpg'
  ];
  
  const defaultMobileBanners = [
    '/mobile_hero_1.jpg',
    '/mobile_hero_2.jpg'
  ];

  const sourceBanners = isMobile && mobileBanners.length > 0 && mobileBanners.some(b => b.trim() !== '')
    ? mobileBanners
    : (banners.length > 0 && banners.some(b => b.trim() !== '') ? banners : (isMobile ? defaultMobileBanners : defaultBanners));

  const activeBanners = sourceBanners.filter(banner => banner && banner.trim() !== '');

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
              zIndex: currentSlide === index ? 2 : 1
            }}
          >
            <img
              src={getImageUrl(banner)}
              alt={`Hero banner ${index + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
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

      </div>
    </section>
  );
};
