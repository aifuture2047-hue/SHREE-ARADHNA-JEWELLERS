import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getImageUrl } from '../lib/supabase';
import logoImg from '../assets/logo.png';

interface HeroProps {
  banners?: string[];
  onExplore?: () => void;
  onMilestoneClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  banners = [],
  onMilestoneClick
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const defaultBanners = [
    '/hero_banner.jpg',
    '/hero_desktop.jpg'
  ];

  // Get active banners
  const activeBanners = banners.filter(banner => banner && banner.trim() !== '');
  const slides = activeBanners.length > 0 ? activeBanners : defaultBanners;

  const total = slides.length;

  // Auto-play slideshow timer
  useEffect(() => {
    if (total <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % total);
    }, 5000);
    return () => clearInterval(interval);
  }, [total]);

  const handlePrev = () => setCurrentSlide(prev => (prev - 1 + total) % total);
  const handleNext = () => setCurrentSlide(prev => (prev + 1) % total);

  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  if (slides.length === 0) return null;

  return (
    <section className="hero-gallery-sec">
      <div className="hero-gallery-container">
        
        {/* Left Panel: Curator Brand Plate */}
        <div className="hero-curator-side">
          <div className="hero-curator-card">
            <div className="curator-badge">
              <span className="gold-dot"></span>
              <span>CURATED EXHIBITION</span>
            </div>
            
            <div className="curator-divider"></div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
              <img 
                src={logoImg} 
                alt="New Gayatri Logo" 
                style={{ 
                  height: '100px', 
                  width: '100px', 
                  objectFit: 'contain'
                }} 
              />
              <div>
                <h2 className="curator-brand-title" style={{ margin: 0 }}>New Gayatri</h2>
                <p className="curator-brand-subtitle" style={{ margin: 0, marginTop: '4px' }}>Est. 1977 | Heritage Bullion</p>
              </div>
            </div>
            
            <p className="curator-narrative">
              Preserving ancient metal forging traditions and honest craftsmanship. Every ornament is certified BIS hallmarked to guarantee generational wealth.
            </p>
            
            <div className="curator-actions">
              <button 
                className="btn-curator primary" 
                onClick={() => handleScroll('collections')}
              >
                View Catalog
              </button>
              <button 
                className="btn-curator secondary" 
                onClick={onMilestoneClick}
              >
                Our Milestone
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel: Gold-Framed Artwork Canvas */}
        <div className="hero-art-side">
          <div className="hero-art-frame-wrapper">
            <div className="hero-art-frame">
              <div className="hero-art-inner-bezel" style={{ display: 'grid', position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
                {slides.map((slide, index) => (
                  <img
                    key={index}
                    src={getImageUrl(slide)}
                    alt={`Curated jewellery showcase ${index + 1}`}
                    className="hero-art-image"
                    style={{
                      gridArea: '1 / 1',
                      opacity: currentSlide === index ? 1 : 0,
                      transition: 'opacity 1s ease-in-out',
                      zIndex: currentSlide === index ? 2 : 1,
                      objectFit: 'contain',
                      width: '100%',
                      height: '100%',
                      display: 'block'
                    }}
                  />
                ))}
              </div>
              {/* Gold corners */}
              <div className="frame-corner top-left"></div>
              <div className="frame-corner top-right"></div>
              <div className="frame-corner bottom-left"></div>
              <div className="frame-corner bottom-right"></div>
            </div>
            <div className="hero-art-shadow"></div>
          </div>
        </div>

      </div>

      {/* Slider Left Arrow */}
      {slides.length > 1 && (
        <button
          className="hero-slider-arrow left"
          onClick={handlePrev}
          aria-label="Previous banner"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {/* Slider Right Arrow */}
      {slides.length > 1 && (
        <button
          className="hero-slider-arrow right"
          onClick={handleNext}
          aria-label="Next banner"
        >
          <ChevronRight size={24} />
        </button>
      )}

      {/* Slider Pagination Dots */}
      {slides.length > 1 && (
        <div className="hero-slider-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`hero-slider-dot ${currentSlide === index ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};
