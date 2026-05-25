import React from 'react';
import { getImageUrl } from '../lib/supabase';

interface HeroProps {
  banners?: string[];
  onExplore?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  banners = []
}) => {
  const defaultBanners = [
    '/hero_banner.jpg',
    '/hero_desktop.jpg'
  ];

  // Get the first banner image
  const activeBanners = banners.filter(banner => banner && banner.trim() !== '');
  const bannerImage = activeBanners.length > 0 ? activeBanners[0] : defaultBanners[0];

  const handleScroll = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-editorial-sec">
      <div className="hero-editorial-container">
        {/* Left Side: Brand Intro & Typography */}
        <div className="hero-editorial-text">
          <div className="hero-editorial-badge">
            <span className="gold-line"></span>
            <span className="badge-text">ESTABLISHED 1977</span>
            <span className="gold-line"></span>
          </div>
          
          <h1 className="hero-editorial-title">
            Eternal Heritage, <br />
            <span className="gold-text">Handcrafted Brilliance.</span>
          </h1>
          
          <p className="hero-editorial-subtitle">
            Indulge in the finest selection of gold, diamond, and silver jewellery. Every masterpiece is crafted with absolute purity and curated to reflect your legacy.
          </p>
          
          <div className="hero-editorial-actions">
            <button 
              className="btn-primary-luxe" 
              onClick={() => handleScroll('collections')}
            >
              View Collections
            </button>
            <button 
              className="btn-secondary-luxe" 
              onClick={() => handleScroll('heritage')}
            >
              Our Legacy
            </button>
          </div>
        </div>

        {/* Right Side: Gold-framed Single Banner Image */}
        <div className="hero-editorial-visual">
          <div className="hero-image-frame">
            <div className="hero-image-inner-border">
              <img
                src={getImageUrl(bannerImage)}
                alt="New Gayatri Jewellers Heritage Exhibition"
                className="hero-single-image"
              />
            </div>
            {/* Elegant absolute gold corner accents for the frame */}
            <div className="frame-corner top-left"></div>
            <div className="frame-corner top-right"></div>
            <div className="frame-corner bottom-left"></div>
            <div className="frame-corner bottom-right"></div>
          </div>
        </div>
      </div>

      {/* Modern animated vertical scroll indicator */}
      <div className="hero-scroll-indicator" onClick={() => handleScroll('collections')}>
        <span className="scroll-text">EXPLORE WORKSPACE</span>
        <div className="scroll-line-container">
          <span className="scroll-line-active"></span>
        </div>
      </div>
    </section>
  );
};
