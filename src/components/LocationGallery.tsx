import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, ExternalLink } from 'lucide-react';
import { getImageUrl } from '../lib/supabase';

export const LocationGallery: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section id="location" className="section location-section">
      <div className="container">
        <div className="grid-12">
          {/* Left Side: Contact Information Details */}
          <div className="location-details-col" style={{ gridColumn: isMobile ? '1 / -1' : '1 / span 5' }}>
            <span 
              className="label-caps" 
              style={{ color: 'var(--color-accent-gold)', marginBottom: '16px', display: 'block' }}
            >
              Visit Our Gallery
            </span>
            <h2 className="headline-md" style={{ marginBottom: '24px' }}>
              Located in the heart of Rapar
            </h2>
            <div style={{ width: '40px', height: '1px', backgroundColor: 'var(--color-accent-gold)', marginBottom: '32px' }}></div>
            
            <div className="location-info-list">
              {/* Address Item */}
              <div className="location-info-item">
                <div className="location-icon-frame">
                  <MapPin size={18} />
                </div>
                <div>
                  <h4 className="location-info-title">Address</h4>
                  <p className="location-info-text">
                    Sant Shree Trikam Saheb Marg,<br />
                    Main Bazar, Rapar,<br />
                    Gujarat 370165
                  </p>
                </div>
              </div>

              {/* Phone Item */}
              <div className="location-info-item">
                <div className="location-icon-frame">
                  <Phone size={18} />
                </div>
                <div>
                  <h4 className="location-info-title">Phone</h4>
                  <p className="location-info-text">
                    +91 88668 82947
                  </p>
                </div>
              </div>

              {/* Hours Item */}
              <div className="location-info-item">
                <div className="location-icon-frame">
                  <Clock size={18} />
                </div>
                <div>
                  <h4 className="location-info-title">Gallery Hours</h4>
                  <p className="location-info-text">
                    Monday — Saturday: 11:00 AM — 08:30 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>

              {/* Google Maps Link */}
              <a 
                href="https://share.google/px7QhvmRD6PV270nl" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '16px',
                  padding: '12px 24px',
                  backgroundColor: 'rgba(229, 197, 144, 0.1)',
                  border: '1px solid var(--color-border-subtle)',
                  color: 'var(--color-accent-gold)',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(229, 197, 144, 0.2)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(229, 197, 144, 0.1)';
                }}
              >
                <ExternalLink size={14} />
                Open in Google Maps
              </a>
            </div>
          </div>

          {/* Right Side: Shop Photo */}
          <div style={{ gridColumn: isMobile ? '1 / -1' : '6 / span 7', display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '100%',
              borderRadius: '8px',
              overflow: 'hidden',
              border: '1px solid var(--color-border-subtle)',
              position: 'relative',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)'
            }}>
              <img 
                src={getImageUrl("/shop_photo.jpg")} 
                alt="New Gayatri Jewellers — Shop Front, Main Bazar, Rapar" 
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  objectFit: 'cover'
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '16px 20px',
                background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <MapPin size={14} style={{ color: 'var(--color-accent-gold)' }} />
                <span style={{ 
                  fontSize: '13px', 
                  fontWeight: 600, 
                  color: 'var(--color-text-primary)', 
                  letterSpacing: '0.05em' 
                }}>
                  NEW GAYATRI JEWELLERS — Main Bazar, Rapar
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
