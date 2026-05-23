import { useState, useEffect, useCallback } from 'react';
import { supabase } from './lib/supabase';
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

// Default values (used as fallback if database is empty)
const DEFAULT_RATES: Rates = {
  gold22k: 66450,
  gold18k: 54370,
  silver: 84200,
  goldChange: 'up',
  silverChange: 'down'
};

const DEFAULT_SETTINGS: AppSettings = {
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

function App() {
  const [view, setView] = useState<'storefront' | 'admin'>('storefront');
  const [loading, setLoading] = useState(true);

  // Rates State
  const [rates, setRatesState] = useState<Rates>(DEFAULT_RATES);

  // App Settings State
  const [settings, setSettingsState] = useState<AppSettings>(DEFAULT_SETTINGS);

  // Announcement popup control state
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Products State
  const [products, setProducts] = useState<Product[]>([]);

  // WhatsApp click analytics state
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  // Contact messages state
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);

  // Pre-filled contact message state
  const [prefilledMessage, setPrefilledMessage] = useState('');

  // Fetch all data from Supabase on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch rates
        const { data: ratesData } = await supabase
          .from('rates')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(1)
          .single();

        if (ratesData) {
          setRatesState({
            gold22k: Number(ratesData.gold22k),
            gold18k: Number(ratesData.gold18k),
            silver: Number(ratesData.silver),
            goldChange: ratesData.gold_change as 'up' | 'down',
            silverChange: ratesData.silver_change as 'up' | 'down'
          });
        }

        // Fetch products
        const { data: productsData } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (productsData && productsData.length > 0) {
          setProducts(productsData.map(p => ({
            id: p.id,
            title: p.title,
            itemCode: p.item_code,
            category: p.category,
            purity: p.purity,
            makingCharge: Number(p.making_charge),
            weight: Number(p.weight),
            imageUrl: p.image_url || '',
            description: p.description || ''
          })));
        }

        // Fetch settings
        const { data: settingsData } = await supabase
          .from('settings')
          .select('*');

        if (settingsData && settingsData.length > 0) {
          const settingsMap: Record<string, unknown> = {};
          settingsData.forEach(s => {
            settingsMap[s.key] = s.value;
          });

          const heroSettings = settingsMap.hero as Record<string, string> | undefined;
          const collectionsSettings = settingsMap.collections as Record<string, string> | undefined;
          const popupSettings = settingsMap.popup as Record<string, unknown> | undefined;

          setSettingsState({
            heroBannerUrl: heroSettings?.heroBannerUrl || DEFAULT_SETTINGS.heroBannerUrl,
            heroTitle: heroSettings?.heroTitle || DEFAULT_SETTINGS.heroTitle,
            heroSubtitle: heroSettings?.heroSubtitle || DEFAULT_SETTINGS.heroSubtitle,
            collectionsBridalImage: collectionsSettings?.collectionsBridalImage || '',
            collectionsDiamondImage: collectionsSettings?.collectionsDiamondImage || '',
            collectionsSilverImage: collectionsSettings?.collectionsSilverImage || '',
            popupAdEnabled: (popupSettings?.popupAdEnabled as boolean) || false,
            popupAdImage: (popupSettings?.popupAdImage as string) || '',
            popupAdLink: (popupSettings?.popupAdLink as string) || ''
          });
        }

        // Fetch inquiries
        const { data: inquiriesData } = await supabase
          .from('inquiries')
          .select('*')
          .order('created_at', { ascending: false });

        if (inquiriesData) {
          setInquiries(inquiriesData.map(i => ({
            id: i.id,
            productTitle: i.product_title,
            productCode: i.product_code,
            timestamp: i.created_at
          })));
        }

        // Fetch contact messages
        const { data: messagesData } = await supabase
          .from('contact_messages')
          .select('*')
          .order('created_at', { ascending: false });

        if (messagesData) {
          setContactMessages(messagesData.map(m => ({
            id: m.id,
            name: m.name,
            email: m.email,
            phone: m.phone,
            message: m.message,
            timestamp: m.created_at
          })));
        }

      } catch (error) {
        console.error('[v0] Error fetching data from Supabase:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Popup trigger
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

  // Update rates in Supabase
  const setRates = useCallback(async (newRates: Rates) => {
    setRatesState(newRates);

    try {
      // Get existing rate row
      const { data: existingRate } = await supabase
        .from('rates')
        .select('id')
        .limit(1)
        .single();

      if (existingRate) {
        await supabase
          .from('rates')
          .update({
            gold22k: newRates.gold22k,
            gold18k: newRates.gold18k,
            silver: newRates.silver,
            gold_change: newRates.goldChange,
            silver_change: newRates.silverChange,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingRate.id);
      } else {
        await supabase
          .from('rates')
          .insert({
            gold22k: newRates.gold22k,
            gold18k: newRates.gold18k,
            silver: newRates.silver,
            gold_change: newRates.goldChange,
            silver_change: newRates.silverChange
          });
      }
    } catch (error) {
      console.error('[v0] Error updating rates:', error);
    }
  }, []);

  // Update settings in Supabase
  const setSettings = useCallback(async (newSettings: AppSettings) => {
    setSettingsState(newSettings);

    try {
      // Update hero settings
      await supabase
        .from('settings')
        .upsert({
          key: 'hero',
          value: {
            heroBannerUrl: newSettings.heroBannerUrl,
            heroTitle: newSettings.heroTitle,
            heroSubtitle: newSettings.heroSubtitle
          },
          updated_at: new Date().toISOString()
        }, { onConflict: 'key' });

      // Update collections settings
      await supabase
        .from('settings')
        .upsert({
          key: 'collections',
          value: {
            collectionsBridalImage: newSettings.collectionsBridalImage,
            collectionsDiamondImage: newSettings.collectionsDiamondImage,
            collectionsSilverImage: newSettings.collectionsSilverImage
          },
          updated_at: new Date().toISOString()
        }, { onConflict: 'key' });

      // Update popup settings
      await supabase
        .from('settings')
        .upsert({
          key: 'popup',
          value: {
            popupAdEnabled: newSettings.popupAdEnabled,
            popupAdImage: newSettings.popupAdImage,
            popupAdLink: newSettings.popupAdLink
          },
          updated_at: new Date().toISOString()
        }, { onConflict: 'key' });

    } catch (error) {
      console.error('[v0] Error updating settings:', error);
    }
  }, []);

  // Product actions (CRUD) with Supabase
  const handleAddProduct = useCallback(async (newProd: Product) => {
    setProducts(prev => [newProd, ...prev]);

    try {
      await supabase
        .from('products')
        .insert({
          id: newProd.id,
          title: newProd.title,
          item_code: newProd.itemCode,
          category: newProd.category,
          purity: newProd.purity,
          making_charge: newProd.makingCharge,
          weight: newProd.weight,
          image_url: newProd.imageUrl,
          description: newProd.description
        });
    } catch (error) {
      console.error('[v0] Error adding product:', error);
    }
  }, []);

  const handleUpdateProduct = useCallback(async (updatedProd: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProd.id ? updatedProd : p));

    try {
      await supabase
        .from('products')
        .update({
          title: updatedProd.title,
          item_code: updatedProd.itemCode,
          category: updatedProd.category,
          purity: updatedProd.purity,
          making_charge: updatedProd.makingCharge,
          weight: updatedProd.weight,
          image_url: updatedProd.imageUrl,
          description: updatedProd.description,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedProd.id);
    } catch (error) {
      console.error('[v0] Error updating product:', error);
    }
  }, []);

  const handleDeleteProduct = useCallback(async (id: string) => {
    if (window.confirm("Are you sure you want to remove this product from the catalog?")) {
      setProducts(prev => prev.filter(p => p.id !== id));

      try {
        await supabase
          .from('products')
          .delete()
          .eq('id', id);
      } catch (error) {
        console.error('[v0] Error deleting product:', error);
      }
    }
  }, []);

  // Inquiry click logger - save to Supabase
  const handleInquireProduct = useCallback(async (product: Product) => {
    const newInquiry: Inquiry = {
      id: Date.now().toString(),
      productTitle: product.title,
      productCode: product.itemCode,
      timestamp: new Date().toISOString()
    };
    setInquiries(prev => [newInquiry, ...prev]);

    try {
      await supabase
        .from('inquiries')
        .insert({
          product_title: product.title,
          product_code: product.itemCode
        });
    } catch (error) {
      console.error('[v0] Error logging inquiry:', error);
    }
  }, []);

  // Contact submit logger - save to Supabase
  const handleSubmitMessage = useCallback(async (msg: { name: string; email: string; phone: string; message: string }) => {
    const newMessage: ContactMessage = {
      id: Date.now().toString(),
      ...msg,
      timestamp: new Date().toISOString()
    };
    setContactMessages(prev => [newMessage, ...prev]);

    try {
      await supabase
        .from('contact_messages')
        .insert({
          name: msg.name,
          email: msg.email,
          phone: msg.phone,
          message: msg.message
        });
    } catch (error) {
      console.error('[v0] Error submitting message:', error);
    }
  }, []);

  // prefill consultation requests
  const handleRequestConsultation = (product: Product) => {
    setPrefilledMessage(`I am interested in scheduling a gallery consultation / video viewing for the "${product.title}" (Item Code: ${product.itemCode}). Please check availability.`);
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-text-primary)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            border: '3px solid var(--color-border-subtle)',
            borderTopColor: 'var(--color-accent-gold)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p>Loading Shree Aradhna Jewellers...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

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
