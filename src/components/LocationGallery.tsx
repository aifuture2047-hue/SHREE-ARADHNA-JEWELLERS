import React from 'react';
import { MapPin, Phone, Clock } from 'lucide-react';

export const LocationGallery: React.FC = () => {
  return (
    <section id="location" className="section location-section">
      <div className="container">
        <div className="grid-12">
          {/* Left Side: Contact Information Details */}
          <div className="location-details-col" style={{ gridColumn: '1 / span 5' }}>
            <span 
              className="label-caps" 
              style={{ color: 'var(--color-accent-gold)', marginBottom: '16px', display: 'block' }}
            >
              Visit Our Gallery
            </span>
            <h2 className="headline-md" style={{ marginBottom: '24px' }}>
              Located in the heart of Gandhidham
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
                    Shop No. 2, Gold Plaza, Sector 1A,<br />
                    Main Bazar, Near Gandhidham Town Hall,<br />
                    Gandhidham, Gujarat 370201
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
                    +91 96388 88170
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
            </div>
          </div>

          {/* Right Side: High-End Stylized Dark Vector Map */}
          <div style={{ gridColumn: '6 / span 7', display: 'flex', alignItems: 'center' }}>
            <div className="location-map-card">
              {/* Grid Background */}
              <div className="map-grid-bg"></div>

              {/* Stylized Vector Roads & Blocks */}
              <div className="map-road vertical" style={{ left: '48%', opacity: 0.7 }}></div>
              <div className="map-road horizontal" style={{ top: '48%', opacity: 0.7 }}></div>
              <div className="map-road horizontal" style={{ top: '20%', height: '12px', opacity: 0.4 }}></div>
              <div className="map-road vertical" style={{ left: '15%', width: '12px', opacity: 0.4 }}></div>
              <div className="map-road vertical" style={{ left: '80%', width: '12px', opacity: 0.4 }}></div>

              {/* Decorative Blocks / Buildings */}
              <div style={{ position: 'absolute', top: '10%', left: '25%', width: '80px', height: '60px', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)' }}></div>
              <div style={{ position: 'absolute', top: '55%', left: '5%', width: '120px', height: '100px', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)' }}></div>
              <div style={{ position: 'absolute', top: '60%', left: '60%', width: '90px', height: '120px', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)' }}></div>
              
              {/* Water Body (Simulated Lake/River) */}
              <div className="map-water" style={{ top: '5%', left: '65%', width: '180px', height: '120px' }}></div>

              {/* Pulsing Marker Pin */}
              <div className="map-marker-pin" style={{ top: '48%', left: '48%' }}>
                <div className="map-pin-pulse"></div>
                <div className="map-label-card">
                  <div className="map-label-name">Shree Aradhna Jewellers</div>
                  <div className="map-label-sub">Choksi Bazar</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
