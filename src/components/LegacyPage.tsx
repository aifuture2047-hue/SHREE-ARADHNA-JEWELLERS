import React, { useEffect, useState } from 'react';
import { ShieldCheck, Award, Sparkles, BookOpen, Clock } from 'lucide-react';
import { getImageUrl } from '../lib/supabase';

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
    description: 'Merged generations of local Karigars (principal artisans) directly into our workspace. Began creating our signature handcrafted antique bridal sets.',
    icon: <Award size={20} />
  },
  {
    year: '2015',
    title: 'Modern Architectural Patterns',
    description: 'Blended geometric structural styling with luxury diamond cuts. Redefined daily wear gold chains and solitaire settings for modern tastes.',
    icon: <Sparkles size={20} />
  },
  {
    year: '2026',
    title: 'The Digital Patron Gallery',
    description: 'Extended physical gallery features into a dynamic virtual workspace, enabling secure custom catalog requests while maintaining 100% hallmarked security.',
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
          backgroundImage: `linear-gradient(180deg, rgba(12, 15, 15, 0.4) 0%, rgba(12, 15, 15, 0.95) 100%), url(${getImageUrl('/hero_desktop.jpg')})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: isMobile ? '300px' : '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="label-caps" style={{ color: 'var(--color-accent-gold)', fontSize: '11px', letterSpacing: '0.25em', display: 'block', marginBottom: '16px' }}>
            Our Roots & Milestones
          </span>
          <h1 className="display-lg" style={{ color: 'var(--color-text-primary)', marginBottom: '16px' }}>
            The Legacy of New Gayatri
          </h1>
          <p className="body-lg" style={{ color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '15px', fontWeight: 300 }}>
            Crafting certified bullion wealth and bespoke bridal assets since 1977.
          </p>
        </div>
      </section>

      {/* Core Principles & Founding Story */}
      <section className="section" style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="grid-12" style={{ gap: isMobile ? '32px' : '48px' }}>
            <div style={{ gridColumn: isMobile ? '1 / -1' : '1 / span 6', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span className="label-caps" style={{ color: 'var(--color-accent-gold)', marginBottom: '16px', display: 'block' }}>Since 1977</span>
              <h2 className="headline-md" style={{ marginBottom: '24px' }}>A Commitment to Pure Gold</h2>
              <p className="body-md" style={{ color: 'var(--color-text-secondary)', marginBottom: '20px', lineHeight: '1.8' }}>
                New Gayatri Jewellers is founded on Kutch's rich jewelry legacy. Deeply integrated with families for generations, we understand that jewelry is more than an accessory—it represents a family heirloom and a verified bullion asset.
              </p>
              <p className="body-md" style={{ color: 'var(--color-text-secondary)', lineHeight: '1.8' }}>
                Every gram of gold leaving our counters carries official government certification, representing pure investable quality combined with master-class artistic shaping.
              </p>
            </div>
            
            <div style={{ gridColumn: isMobile ? '1 / -1' : '7 / span 6', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '24px' }}>
              <div style={{ border: '1px solid var(--color-border-subtle)', padding: isMobile ? '24px' : '32px', backgroundColor: 'var(--color-surface-card)', display: 'flex', gap: '20px', alignItems: 'flex-start', textAlign: 'left' }}>
                <ShieldCheck size={36} style={{ color: 'var(--color-accent-gold)', flexShrink: 0 }} />
                <div>
                  <h4 className="headline-sm" style={{ fontSize: '18px', marginBottom: '8px' }}>Government Hallmarking</h4>
                  <p className="body-md" style={{ color: 'var(--color-text-secondary)', fontSize: '14px', margin: 0 }}>
                    We verify every ornament weight, metal carat, and diamond profile. BIS hallmarked gold and certified solitaires ensure complete financial safety.
                  </p>
                </div>
              </div>

              <div style={{ border: '1px solid var(--color-border-subtle)', padding: '32px', backgroundColor: 'var(--color-surface-card)', display: 'flex', gap: '20px', alignItems: 'flex-start', textAlign: 'left' }}>
                <Award size={36} style={{ color: 'var(--color-accent-gold)', flexShrink: 0 }} />
                <div>
                  <h4 className="headline-sm" style={{ fontSize: '18px', marginBottom: '8px' }}>Principal Artisans</h4>
                  <p className="body-md" style={{ color: 'var(--color-text-secondary)', fontSize: '14px', margin: 0 }}>
                    Our master Karigars hand-forge antiques and custom bridal sets, preserving heritage metal carving techniques while integrating modern shapes.
                  </p>
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
            <span className="label-caps" style={{ color: 'var(--color-accent-gold)', display: 'block', marginBottom: '16px' }}>Our History</span>
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
