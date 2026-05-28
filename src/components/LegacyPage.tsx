import React, { useEffect, useState } from 'react';
import { Award, Sparkles, BookOpen, Clock } from 'lucide-react';
import { getImageUrl } from '../lib/supabase';
import logoImg from '../assets/logo.png';

interface LegacyPageProps {
  setView: (view: 'storefront' | 'admin' | 'legacy') => void;
}

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const TIMELINE: TimelineItem[] = [
  {
    year: '1977',
    title: 'The Genesis of Trust',
    description: 'Founded in Main Bazar, Rapar, Gujarat. Built on a singular mission: to deliver absolute metal purity and honest craftsmanship to families across Kutch.',
    icon: <BookOpen size={20} />
  },
  {
    year: '2005',
    title: 'Artisan Integration',
    description: 'Began hosting exclusive master-craftsmen design summits in Rapar to forge heritage gold shapes locally.',
    icon: <Sparkles size={20} />
  },
  {
    year: '2015',
    title: 'Digital Transparency & Bullion',
    description: 'Pioneered immediate public bullion ledger pricing on-site, solidifying our promise of 100% certified hallmarked purity.',
    icon: <Award size={20} />
  },
  {
    year: '2023',
    title: 'The Modern Era',
    description: 'Inaugurated our multi-level architectural luxury gallery showroom in Rapar, setting a state-of-the-art benchmark for luxury retail in Kutch.',
    icon: <Clock size={20} />
  }
];

export const LegacyPage: React.FC<LegacyPageProps> = ({ setView }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* Legacy Page Header Banner */}
      <section 
        style={{
          backgroundImage: 'linear-gradient(180deg, #0f1212 0%, #070909 100%)',
          borderBottom: '1px solid rgba(229, 197, 144, 0.05)',
          height: isMobile ? '240px' : '320px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        <div className="container" style={{ textAlign: 'center' }}>
          <img 
            src={logoImg} 
            alt="New Gayatri Jewellers Logo" 
            style={{ 
              height: '70px', 
              width: '70px', 
              objectFit: 'cover', 
              borderRadius: '50%', 
              border: '1.5px solid var(--color-accent-gold)',
              backgroundColor: '#fff',
              padding: '3px',
              marginBottom: '20px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
            }} 
          />
          <span className="label-caps" style={{ color: 'var(--color-accent-gold)', fontSize: '11px', letterSpacing: '0.25em', display: 'block', marginBottom: '16px' }}>
            OUR ROOTS & TIMELINE
          </span>
          <h1 className="display-lg" style={{ color: 'var(--color-text-primary)', marginBottom: '16px' }}>
            The Legacy of New Gayatri
          </h1>
          <p className="body-lg" style={{ color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '15px', fontWeight: 300 }}>
            Crafting certified bullion wealth and bespoke bridal assets since 1977.
          </p>
        </div>
      </section>

      {/* Core narrative & portrait sketch of founder */}
      <section className="section" style={{ padding: '80px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
        <div className="container">
          <div className="grid-12" style={{ gap: isMobile ? '40px' : '60px', alignItems: 'center' }}>
            
            {/* Left Column: Portrait Sketch (Full Visible) */}
            <div style={{ gridColumn: isMobile ? '1 / -1' : '1 / span 5', display: 'flex', justifyContent: 'center' }}>
              <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '380px',
                border: '1px solid var(--color-border-subtle)',
                padding: '12px',
                backgroundColor: 'var(--color-surface-card)',
                boxShadow: '0 15px 30px rgba(0,0,0,0.5)'
              }}>
                <div style={{ border: '1px solid rgba(229, 197, 144, 0.2)', overflow: 'hidden' }}>
                  <img
                    src={getImageUrl('/founder_portrait.jpg')}
                    alt="Founder of New Gayatri Jewellers"
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                      objectFit: 'contain',
                      backgroundColor: '#ffffff', // Clean white background to fit the paper sketch
                      filter: 'contrast(1.05)'
                    }}
                  />
                </div>
                {/* Elegant corner accents */}
                <div className="frame-corner top-left" style={{ top: '6px', left: '6px' }}></div>
                <div className="frame-corner top-right" style={{ top: '6px', right: '6px' }}></div>
                <div className="frame-corner bottom-left" style={{ bottom: '6px', left: '6px' }}></div>
                <div className="frame-corner bottom-right" style={{ bottom: '6px', right: '6px' }}></div>
              </div>
            </div>

            {/* Right Column: Narrative & Stats */}
            <div style={{ gridColumn: isMobile ? '1 / -1' : '6 / span 7', textAlign: 'left' }}>
              <span className="label-caps" style={{ color: 'var(--color-accent-gold)', marginBottom: '16px', display: 'block', letterSpacing: '0.2em' }}>SINCE 1977</span>
              <h2 className="headline-md" style={{ marginBottom: '24px', fontSize: '32px', color: 'var(--color-text-primary)' }}>
                A Legacy Built on <br />
                <span className="gold-text" style={{ color: 'var(--color-accent-gold)', fontStyle: 'italic', fontFamily: 'var(--font-serif)', fontWeight: 400 }}>Trust & Beauty</span>
              </h2>
              
              <p className="body-md" style={{ color: 'var(--color-text-secondary)', marginBottom: '20px', lineHeight: '1.8', fontSize: '15px', fontWeight: 300 }}>
                At New Gayatri Jewellers, we believe jewellery is not just worn — it is lived. Since 1977, our name has been synonymous with artistry, integrity, and timeless grace. From a single showroom to four thriving stores across India, our journey is a story of love for craft and devotion to our customers.
              </p>
              
              <p className="body-md" style={{ color: 'var(--color-text-secondary)', marginBottom: '40px', lineHeight: '1.8', fontSize: '15px', fontWeight: 300 }}>
                Every piece that leaves our workshop carries the soul of our master artisans — craftsmen who have honed their skills across generations, blending ancient Jadau traditions with the elegance of contemporary design.
              </p>

              {/* Stats Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '24px',
                borderTop: '1px solid rgba(229, 197, 144, 0.1)',
                paddingTop: '32px'
              }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '32px', fontFamily: 'var(--font-serif)', color: 'var(--color-accent-gold)', fontWeight: 600 }}>25+</div>
                  <div style={{ fontSize: '11px', fontFamily: 'var(--font-sans)', color: 'var(--color-text-secondary)', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '4px' }}>Years Excellence</div>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '32px', fontFamily: 'var(--font-serif)', color: 'var(--color-accent-gold)', fontWeight: 600 }}>5+</div>
                  <div style={{ fontSize: '11px', fontFamily: 'var(--font-sans)', color: 'var(--color-text-secondary)', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '4px' }}>Thousand+ Customers</div>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '32px', fontFamily: 'var(--font-serif)', color: 'var(--color-accent-gold)', fontWeight: 600 }}>1+</div>
                  <div style={{ fontSize: '11px', fontFamily: 'var(--font-sans)', color: 'var(--color-text-secondary)', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '4px' }}>Store Location</div>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '32px', fontFamily: 'var(--font-serif)', color: 'var(--color-accent-gold)', fontWeight: 600 }}>100%</div>
                  <div style={{ fontSize: '11px', fontFamily: 'var(--font-sans)', color: 'var(--color-text-secondary)', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '4px' }}>BIS Certified</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Historical Milestones Timeline */}
      <section className="section" style={{ backgroundColor: 'var(--color-surface-card)', borderTop: '1px solid rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.03)', padding: '100px 0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span className="label-caps" style={{ color: 'var(--color-accent-gold)', display: 'block', marginBottom: '16px' }}>OUR HISTORY</span>
            <h2 className="headline-md" style={{ margin: 0 }}>Milestones of Success</h2>
          </div>

          <div style={{ position: 'relative', paddingLeft: '40px', marginLeft: isMobile ? '20px' : '0', borderLeft: '2px solid var(--color-border-subtle)', textAlign: 'left' }}>
            {TIMELINE.map((item, index) => (
              <div key={index} style={{ position: 'relative', marginBottom: '60px' }}>
                {/* Timeline node */}
                <div 
                  style={{ 
                    position: 'absolute', 
                    left: '-62px', 
                    top: '0', 
                    width: '42px', 
                    height: '42px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--color-background)', 
                    border: '2px solid var(--color-accent-gold)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'var(--color-accent-gold)',
                    zIndex: 2
                  }}
                >
                  {item.icon}
                </div>

                {/* Timeline content */}
                <div>
                  <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-accent-gold)', display: 'block', marginBottom: '4px' }}>
                    {item.year}
                  </span>
                  <h4 className="headline-sm" style={{ fontSize: '18px', color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                    {item.title}
                  </h4>
                  <p className="body-md" style={{ color: 'var(--color-text-secondary)', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legacy Call to Action */}
      <section className="section" style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="container">
          <h3 className="headline-md" style={{ marginBottom: '24px' }}>Discover the Gayatri Collection</h3>
          <p className="body-md" style={{ color: 'var(--color-text-secondary)', maxWidth: '500px', margin: '0 auto 40px', fontSize: '14px' }}>
            Explore our curated catalog of investment-grade gold ornaments and diamond pieces.
          </p>
          <button className="btn-primary" onClick={() => setView('storefront')}>
            Explore Our Catalog
          </button>
        </div>
      </section>
    </div>
  );
};
