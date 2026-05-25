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

  // Get the single active banner image
  const activeBanners = banners.filter(banner => banner && banner.trim() !== '');
  const bannerImage = activeBanners.length > 0 ? activeBanners[0] : defaultBanners[0];

  return (
    <section className="hero-banner-clean">
      <img
        src={getImageUrl(bannerImage)}
        alt="New Gayatri Jewellers"
        className="hero-banner-img"
      />
    </section>
  );
};
