import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import logoImg from '../assets/logo.png';

interface HeaderProps {
  currentView: 'storefront' | 'admin' | 'legacy';
  setView: (view: 'storefront' | 'admin' | 'legacy') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (elementId: string) => {
    setMobileMenuOpen(false);
    
    if (currentView !== 'storefront') {
      setView('storefront');
      setTimeout(() => {
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="header-sec">
      <div className="container header-container">
        {/* Left Side: Navigation Links (Minimal caps sans-serif) */}
        <nav className="header-nav" aria-label="Main Navigation">
          {currentView === 'storefront' ? (
            <>
              <a href="#collections" onClick={(e) => { e.preventDefault(); handleNavClick('collections'); }}>Collections</a>
              <a href="#market-dashboard" onClick={(e) => { e.preventDefault(); handleNavClick('market-dashboard'); }}>Live Rates</a>
              <a href="#legacy" onClick={(e) => { e.preventDefault(); setView('legacy'); }}>Our Legacy</a>
              <a href="#contact" onClick={(e) => { e.preventDefault(); handleNavClick('contact'); }}>Consultation</a>
            </>
          ) : (
            <button 
              onClick={() => setView('storefront')} 
              className="btn-secondary"
              style={{ padding: '6px 14px', fontSize: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              ← Back to Gallery
            </button>
          )}
        </nav>

        {/* Center: Brand Identity Logo (Single line elegant serif) */}
        <div className="header-brand">
          <a 
            href="/" 
            onClick={(e) => { e.preventDefault(); setView('storefront'); }} 
            className="header-brand-link"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
          >
            <img 
              src={logoImg} 
              alt="New Gayatri Jewellers Logo" 
              style={{ 
                height: '80px', 
                width: '80px', 
                objectFit: 'contain'
              }} 
            />
            <span className="brand-title-serif">New Gayatri Jewellers</span>
          </a>
        </div>

        {/* Right Side: Rates + Mock Shop Icons */}
        <div className="header-actions">
          {currentView === 'admin' && (
            <span className="label-caps" style={{ color: 'var(--color-accent-gold)', fontSize: '10px' }}>
              Admin active
            </span>
          )}

          {/* Shopping Bag Icon (Mock SVG aligned with screenshot) */}
          <button className="header-action-icon-btn" aria-label="Shopping Bag">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </button>

          {/* User Account Icon (Mock SVG aligned with screenshot) */}
          <button className="header-action-icon-btn" aria-label="Account">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-nav-overlay">
          {currentView === 'storefront' ? (
            <>
              <a href="#collections" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); handleNavClick('collections'); }}>Collections</a>
              <a href="#contact" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); handleNavClick('contact'); }}>Bespoke</a>
              <a href="#legacy" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); setView('legacy'); }}>Our Legacy</a>
            </>
          ) : (
            <>
              <a href="#store" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); setView('storefront'); }}>Back to Gallery</a>
              <span className="mobile-nav-link" style={{ color: 'var(--color-accent-gold)' }}>{currentView === 'admin' ? 'Admin Mode Active' : 'Legacy Mode Active'}</span>
            </>
          )}
        </div>
      )}
    </header>
  );
};
