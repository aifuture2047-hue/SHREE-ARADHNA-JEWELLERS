import React from 'react';
import { getImageUrl } from '../lib/supabase';

interface HeroProps {
  banners?: string[];
  onExplore?: () => void;
  onMilestoneClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  banners = [],
  onMilestoneClick
}) => {
  const defaultBanners = [
    '/hero_banner.jpg',
    '/hero_desktop.jpg'
  ];

  // Get the single active banner image
  const activeBanners = banners.filter(banner => banner && banner.trim() !== '');
  const bannerImage = activeBanners.length > 0 ? activeBanners[0] : defaultBanners[0];

  const handleScroll = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
            
            <h2 className="curator-brand-title">New Gayatri</h2>
            <p className="curator-brand-subtitle">Est. 1977 | Heritage Bullion</p>
            
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
              <div className="hero-art-inner-bezel">
                <img
                  src={getImageUrl(bannerImage)}
                  alt="Curated jewellery showcase"
                  className="hero-art-image"
                />
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
    </section>
  );
};
