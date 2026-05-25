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

  // Get the single active banner
  const activeBanners = banners.filter(banner => banner && banner.trim() !== '');
  const bannerImage = activeBanners.length > 0 ? activeBanners[0] : defaultBanners[0];

  const handleScroll = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-billboard-sec">
      <div className="hero-billboard-container">
        {/* Main Image Frame with Ambient Glow */}
        <div className="hero-billboard-frame">
          <img
            src={getImageUrl(bannerImage)}
            alt="New Gayatri Jewellers Homepage Showcase"
            className="hero-billboard-image"
          />
          <div className="hero-billboard-glow"></div>
        </div>

        {/* Minimal Bottom Actions Overlay */}
        <div className="hero-billboard-overlay">
          <div className="hero-billboard-actions">
            <button 
              className="btn-billboard-action primary" 
              onClick={() => handleScroll('collections')}
            >
              View Collections
            </button>
            <button 
              className="btn-billboard-action secondary" 
              onClick={() => handleScroll('heritage')}
            >
              Our Legacy
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
