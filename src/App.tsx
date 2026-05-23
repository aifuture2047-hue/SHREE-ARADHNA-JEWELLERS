import { useState, useEffect } from 'react';
import { RateTicker } from './components/RateTicker';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCatalog } from './components/ProductCatalog';
import type { Product } from './components/ProductCatalog';
import { LiveMarketDashboard } from './components/LiveMarketDashboard';
import { LocationGallery } from './components/LocationGallery';
import { ContactForm } from './components/ContactForm';
import { AdminPanel } from './components/AdminPanel';
import type { AppSettings } from './components/AdminPanel';
import { AnnouncementPopup } from './components/AnnouncementPopup';
import { WhatsAppFAB } from './components/WhatsAppFAB';
import { Award, Compass, ShieldCheck } from 'lucide-react';

interface Rates {
  gold22k: number;
  gold18k: number;
  silver: number;
  goldChange: 'up' | 'down';
  silverChange: 'up' | 'down';
}

interface Inquiry {
  id: string;
  productTitle: string;
  productCode: string;
  timestamp: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  timestamp: string;
}

// Initial mock products to seed the database (aligned with screenshot catalog highlights)
const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Aura Solitaire Ring',
    itemCode: 'SAA-4932',
    category: 'rings',
    purity: 'gold22k',
    makingCharge: 12,
    weight: 6.2,
    imageUrl: '/ring.png',
    description: 'A timeless classic, handcrafted in 22K gold featuring a brilliant round-cut solitaire diamond centerpiece, surrounded by architectural pavé settings.'
  },
  {
    id: '2',
    title: 'Royal Emerald Drop Earrings',
    itemCode: 'SAA-7712',
    category: 'earrings',
    purity: 'gold18k',
    makingCharge: 15,
    weight: 11.5,
    imageUrl: '/earrings.png',
    description: 'Bespoke chandelier earrings featuring royal Colombian pear-cut emerald drops enveloped in detailed halo-cut diamonds.'
  },
  {
    id: '3',
    title: 'Antique Silver Kada',
    itemCode: 'SAA-3109',
    category: 'bangles',
    purity: 'silver',
    makingCharge: 8,
    weight: 28.5,
    imageUrl: '/bangles.png',
    description: 'Traditional solid silver kada bangle displaying hand-forged antique engravings, rustic motifs, and vintage oxidized polish.'
  },
  {
    id: '4',
    title: 'Aura Signature Choker',
    itemCode: 'SAA-8902',
    category: 'necklaces',
    purity: 'gold22k',
    makingCharge: 14,
    weight: 42.1,
    imageUrl: '/hero_necklace.png',
    description: 'The crowning piece of the Aura of Aradhna collection, featuring floating modular gold leaves adorned with micro-brilliant diamonds.'
  }
];

// Initial mock messages
const INITIAL_MESSAGES: ContactMessage[] = [
  {
    id: 'm1',
    name: 'Aditya Birla',
    email: 'aditya.birla@outlook.com',
    phone: '+91 98210 54321',
    message: 'I am interested in scheduling a private gallery consultation next Tuesday at 3 PM to view wedding sets. Please confirm advisor availability.',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString() // 2 hours ago
  }
];

function App() {
  const [view, setView] = useState<'storefront' | 'admin'>('storefront');

  // Rates State (seed with rates matching user's screenshot)
  const [rates, setRatesState] = useState<Rates>(() => {
    const savedRates = localStorage.getItem('aradhna_rates_v3');
    if (savedRates) {
      return JSON.parse(savedRates);
    }
    return {
      gold22k: 66450, // matches screenshot
      gold18k: 54370, // standard market estimation relative to 22K
      silver: 84200,  // matches screenshot
      goldChange: 'up',
      silverChange: 'down' // matches screenshot downward trend
    };
  });

  // App Settings State (banner image & texts)
  const [settings, setSettingsState] = useState<AppSettings>(() => {
    const savedSettings = localStorage.getItem('aradhna_settings_v3');
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }
    return {
      heroBannerUrl: '/hero_banner.jpg',
      heroTitle: 'Eternal Heritage\nHandcrafted Brilliance',
      heroSubtitle: 'Welcome to Shree Aradhna Jewellers. Explore our premium collection of 22KT gold, 18KT gold, and fine silver ornaments custom-crafted for timeless luxury.',
      collectionsBridalImage: '',
      collectionsDiamondImage: '',
      collectionsSilverImage: '',
      popupAdEnabled: false,
      popupAdImage: '',
      popupAdLink: ''
    };
  });

  // Announcement popup control state
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    if (settings.popupAdEnabled && settings.popupAdImage) {
      const dismissed = sessionStorage.getItem('aradhna_popup_dismissed');
      if (!dismissed) {
        setIsPopupOpen(true);
      }
    }
  }, [settings.popupAdEnabled, settings.popupAdImage]);

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    sessionStorage.setItem('aradhna_popup_dismissed', 'true');
  };

  // Products State
  const [products, setProducts] = useState<Product[]>(() => {
    const savedProducts = localStorage.getItem('aradhna_products_v3');
    if (savedProducts) {
      return JSON.parse(savedProducts);
    }
    return INITIAL_PRODUCTS;
  });

  // WhatsApp click analytics state
  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    const savedInquiries = localStorage.getItem('aradhna_inquiries_v3');
    return savedInquiries ? JSON.parse(savedInquiries) : [];
  });

  // Contact messages state
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => {
    const savedMessages = localStorage.getItem('aradhna_messages_v3');
    return savedMessages ? JSON.parse(savedMessages) : INITIAL_MESSAGES;
  });

  // Pre-filled contact message state
  const [prefilledMessage, setPrefilledMessage] = useState('');

  // Persist rates changes
  const setRates = (newRates: Rates) => {
    setRatesState(newRates);
    localStorage.setItem('aradhna_rates_v3', JSON.stringify(newRates));
  };

  // Persist settings changes
  const setSettings = (newSettings: AppSettings) => {
    setSettingsState(newSettings);
    localStorage.setItem('aradhna_settings_v3', JSON.stringify(newSettings));
  };

  // Sync products state with localStorage
  useEffect(() => {
    localStorage.setItem('aradhna_products_v3', JSON.stringify(products));
  }, [products]);

  // Sync inquiries with localStorage
  useEffect(() => {
    localStorage.setItem('aradhna_inquiries_v3', JSON.stringify(inquiries));
  }, [inquiries]);

  // Sync messages with localStorage
  useEffect(() => {
    localStorage.setItem('aradhna_messages_v3', JSON.stringify(contactMessages));
  }, [contactMessages]);

  // Product actions (CRUD)
  const handleAddProduct = (newProd: Product) => {
    setProducts(prev => [newProd, ...prev]);
  };

  const handleUpdateProduct = (updatedProd: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProd.id ? updatedProd : p));
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm("Are you sure you want to remove this product from the catalog?")) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  // Inquiry click logger
  const handleInquireProduct = (product: Product) => {
    const newInquiry: Inquiry = {
      id: Date.now().toString(),
      productTitle: product.title,
      productCode: product.itemCode,
      timestamp: new Date().toISOString()
    };
    setInquiries(prev => [newInquiry, ...prev]);
  };

  // Contact submit logger
  const handleSubmitMessage = (msg: { name: string; email: string; phone: string; message: string }) => {
    const newMessage: ContactMessage = {
      id: Date.now().toString(),
      ...msg,
      timestamp: new Date().toISOString()
    };
    setContactMessages(prev => [newMessage, ...prev]);
  };

  // prefill consultation requests
  const handleRequestConsultation = (product: Product) => {
    setPrefilledMessage(`I am interested in scheduling a gallery consultation / video viewing for the "${product.title}" (Item Code: ${product.itemCode}). Please check availability.`);
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Live Rate Scrolling Ticker */}
      <RateTicker rates={rates} />

      {/* Navigation Header */}
      <Header currentView={view} setView={setView} />

      {/* Router / Conditional Render */}
      {view === 'storefront' ? (
        <>
          {/* Hero Banner */}
          <Hero 
            bannerUrl={settings.heroBannerUrl}
            title={settings.heroTitle}
            subtitle={settings.heroSubtitle}
          />

          {/* Live Market Dashboard Section (New UI requirement) */}
          <LiveMarketDashboard rates={rates} />

          {/* Catalog Selection (Reorganized asymmetrical layout) */}
          <ProductCatalog 
            products={products} 
            rates={rates} 
            onInquire={handleInquireProduct} 
            onRequestConsultation={handleRequestConsultation}
            collectionsBridalImage={settings.collectionsBridalImage}
            collectionsDiamondImage={settings.collectionsDiamondImage}
            collectionsSilverImage={settings.collectionsSilverImage}
          />



          {/* Heritage Section (Asymmetrical Showcase) */}
          <section id="heritage" className="section" style={{ backgroundColor: 'var(--color-surface-card)', borderTop: '1px solid rgba(255, 255, 255, 0.03)' }}>
            <div className="container">
              <div className="grid-12">
                <div style={{ gridColumn: '1 / span 5', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left' }}>
                  <span className="label-caps" style={{ color: 'var(--color-accent-gold)', marginBottom: '16px', display: 'block' }}>Our Legacy</span>
                  <h2 className="headline-md" style={{ marginBottom: '24px' }}>The Legacy of Shree Aradhna</h2>
                  <p className="body-md" style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
                    Established on the foundations of absolute trust, Shree Aradhna Jewellers stands as a beacon of artisanal mastery. Each piece is designed as a wearable sculpture, combining strict geometric precision with natural diamond cuts.
                  </p>
                  <p className="body-md" style={{ color: 'var(--color-text-secondary)' }}>
                    Our metals are ethically sourced, 100% hallmarked, and meticulously hand-forged under master supervision to ensure investment-grade quality.
                  </p>
                </div>
                
                <div style={{ gridColumn: '7 / span 6', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', padding: '24px', border: '1px solid var(--color-border-subtle)', backgroundColor: 'var(--color-background)' }}>
                    <ShieldCheck size={36} style={{ color: 'var(--color-accent-gold)', flexShrink: 0 }} />
                    <div style={{ textAlign: 'left' }}>
                      <h4 className="headline-sm" style={{ fontSize: '18px', marginBottom: '8px' }}>Guaranteed Hallmarking</h4>
                      <p className="body-md" style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>Every item carries government-approved purity hallmarks certifying pure bullion weight and carat authenticity.</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', padding: '24px', border: '1px solid var(--color-border-subtle)', backgroundColor: 'var(--color-background)' }}>
                    <Award size={36} style={{ color: 'var(--color-accent-gold)', flexShrink: 0 }} />
                    <div style={{ textAlign: 'left' }}>
                      <h4 className="headline-sm" style={{ fontSize: '18px', marginBottom: '8px' }}>Principal Artisans</h4>
                      <p className="body-md" style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>Hand-filed and hand-set by multi-generational designers who specialize in high-jewelry bridal sets and antiques.</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', padding: '24px', border: '1px solid var(--color-border-subtle)', backgroundColor: 'var(--color-background)' }}>
                    <Compass size={36} style={{ color: 'var(--color-accent-gold)', flexShrink: 0 }} />
                    <div style={{ textAlign: 'left' }}>
                      <h4 className="headline-sm" style={{ fontSize: '18px', marginBottom: '8px' }}>Bespoke Commission</h4>
                      <p className="body-md" style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>Transform family heirlooms or custom sketches into physical masterworks with our bespoke drafting services.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Location Gallery & Dark Vector Map (New UI requirement) */}
          <LocationGallery />

          {/* Luxe Contact Form */}
          <ContactForm 
            onSubmitMessage={handleSubmitMessage} 
            prefilledMessage={prefilledMessage}
            setPrefilledMessage={setPrefilledMessage}
          />

          {/* WhatsApp Floating Action FAB */}
          <WhatsAppFAB />

          {/* Announcement Popup Modal */}
          <AnnouncementPopup 
            isOpen={isPopupOpen}
            onClose={handleClosePopup}
            imageUrl={settings.popupAdImage}
            linkUrl={settings.popupAdLink}
          />

          {/* Storefront Footer */}
          <footer className="footer-sec">
            <div className="container">
              <div className="footer-grid">
                <div className="footer-brand-wrap">
                  <h3 className="headline-sm footer-title" style={{ color: 'var(--color-text-primary)' }}>SHREE ARADHNA JEWELLERS</h3>
                  <p className="body-md" style={{ color: 'var(--color-text-secondary)', fontSize: '14px', maxWidth: '360px' }}>
                    Authentic heritage, modern architectural shapes, and verified bullion assets since inception. Designed for exclusive investment and beauty.
                  </p>
                </div>
                
                <div className="footer-col">
                  <div className="footer-col-title">Navigation</div>
                  <ul className="footer-links">
                    <li><a href="#collections">Signature Collections</a></li>
                    <li><a href="#market-dashboard">Live Bullion Rates</a></li>
                    <li><a href="#heritage">Our Heritage Legacy</a></li>
                    <li><a href="#contact">Private Appointments</a></li>
                  </ul>
                </div>

                <div className="footer-col">
                  <div className="footer-col-title">Gallery Info</div>
                  <ul className="footer-links" style={{ color: 'var(--color-text-secondary)', fontSize: '13px', padding: 0 }}>
                    <li>Shop No. 2, Gold Plaza, Sector 1A</li>
                    <li>Gandhidham, Gujarat 370201</li>
                    <li>Mon — Sat: 11:00 AM — 8:30 PM</li>
                    <li>Phone: +91 96388 88170</li>
                  </ul>
                </div>
              </div>

              <div className="footer-bottom">
                <span>© Shree Aradhna Jewellers. Crafting Trust since 1995.</span>
                <span style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <a 
                    href="#admin" 
                    onClick={(e) => { e.preventDefault(); setView('admin'); }} 
                    style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', transition: 'color 0.3s' }}
                    onMouseEnter={(e) => (e.target as HTMLAnchorElement).style.color = 'var(--color-accent-gold)'}
                    onMouseLeave={(e) => (e.target as HTMLAnchorElement).style.color = 'var(--color-text-secondary)'}
                  >
                    Admin Portal
                  </a>
                  <span style={{ opacity: 0.2 }}>|</span>
                  <span>MADE BY UNNAT JAIN | ALL RIGHTS RESERVED</span>
                </span>
              </div>
            </div>
          </footer>
        </>
      ) : (
        /* Admin dashboard workspace */
        <AdminPanel 
          rates={rates}
          setRates={setRates}
          products={products}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          inquiries={inquiries}
          contactMessages={contactMessages}
          settings={settings}
          setSettings={setSettings}
        />
      )}
    </>
  );
}

export default App;
