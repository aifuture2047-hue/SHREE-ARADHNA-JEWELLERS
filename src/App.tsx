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
import { OurModels } from './components/OurModels';
import { LegacyPage } from './components/LegacyPage';
import { supabase, isSupabaseConfigured } from './lib/supabase';

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

const INITIAL_PRODUCTS: Product[] = [];
const INITIAL_MESSAGES: ContactMessage[] = [];

function App() {
  const [view, setView] = useState<'storefront' | 'admin' | 'legacy'>('storefront');

  // Rates State (seed with rates matching user's screenshot)
  const [rates, setRatesState] = useState<Rates>({
    gold22k: 66450, // matches screenshot
    gold18k: 54370, // standard market estimation relative to 22K
    silver: 84200,  // matches screenshot
    goldChange: 'up',
    silverChange: 'down' // matches screenshot downward trend
  });

  // App Settings State (banner image & texts)
  const [settings, setSettingsState] = useState<AppSettings>(() => {
    const defaultBanners: string[] = [];
    const defaultMobileBanners: string[] = [];

    return {
      heroBanners: defaultBanners,
      heroMobileBanners: defaultMobileBanners,
      heroTitle: 'Eternal Heritage\nHandcrafted Brilliance',
      heroSubtitle: 'Welcome to New Gayatri Jewellers. Explore our premium collection of 22KT gold, 18KT gold, and fine silver ornaments custom-crafted for timeless luxury.',
      collectionsBridalImage: '',
      collectionsDiamondImage: '',
      collectionsSilverImage: '',
      popupAdEnabled: false,
      popupAdImage: '',
      popupAdLink: '',
      shopPhoto: '',
      modelImages: []
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
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  // WhatsApp click analytics state
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  // Contact messages state
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(INITIAL_MESSAGES);

  // Pre-filled contact message state
  const [prefilledMessage, setPrefilledMessage] = useState('');

  // ==========================================
  // SUPABASE MAPPING HELPERS
  // ==========================================
  const mapProductFromDB = (p: any): Product => ({
    id: p.id,
    title: p.title,
    itemCode: p.item_code,
    category: p.category,
    purity: p.purity,
    makingCharge: Number(p.making_charge),
    weight: Number(p.weight),
    imageUrl: p.image_url,
    description: p.description || ''
  });

  const mapProductToDB = (p: Product) => ({
    title: p.title,
    item_code: p.itemCode,
    category: p.category,
    purity: p.purity,
    making_charge: p.makingCharge,
    weight: p.weight,
    image_url: p.imageUrl,
    description: p.description
  });

  const mapRatesFromDB = (r: any): Rates => ({
    gold22k: Number(r.gold22k),
    gold18k: Number(r.gold18k),
    silver: Number(r.silver),
    goldChange: r.gold_change,
    silverChange: r.silver_change
  });

  const mapRatesToDB = (r: Rates) => ({
    gold22k: r.gold22k,
    gold18k: r.gold18k,
    silver: r.silver,
    gold_change: r.goldChange,
    silver_change: r.silverChange
  });

  const mapSettingsFromDB = (s: any): AppSettings => ({
    heroBanners: s.hero_banners,
    heroMobileBanners: s.hero_mobile_banners,
    heroTitle: s.hero_title || '',
    heroSubtitle: s.hero_subtitle || '',
    collectionsBridalImage: s.collections_bridal_image || '',
    collectionsDiamondImage: s.collections_diamond_image || '',
    collectionsSilverImage: s.collections_silver_image || '',
    popupAdEnabled: s.popup_ad_enabled || false,
    popupAdImage: s.popup_ad_image || '',
    popupAdLink: s.popup_ad_link || '',
    shopPhoto: s.shop_photo || '',
    modelImages: s.model_images || []
  });

  const mapSettingsToDB = (s: AppSettings) => ({
    id: 'main',
    hero_banners: s.heroBanners,
    hero_mobile_banners: s.heroMobileBanners,
    hero_title: s.heroTitle,
    hero_subtitle: s.heroSubtitle,
    collections_bridal_image: s.collectionsBridalImage,
    collections_diamond_image: s.collectionsDiamondImage,
    collections_silver_image: s.collectionsSilverImage,
    popup_ad_enabled: s.popupAdEnabled,
    popup_ad_image: s.popupAdImage,
    popup_ad_link: s.popupAdLink,
    shop_photo: s.shopPhoto,
    model_images: s.modelImages || []
  });

  // ==========================================
  // SUPABASE REAL-TIME FETCH SYNC
  // ==========================================
  useEffect(() => {
    const loadData = async () => {
      if (!isSupabaseConfigured) return;

      try {
        // 1. Fetch Rates
        const { data: dbRates, error: ratesError } = await supabase
          .from('rates')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        
        if (!ratesError && dbRates) {
          setRatesState(mapRatesFromDB(dbRates));
        }

        // 2. Fetch Settings
        const { data: dbSettings, error: settingsError } = await supabase
          .from('settings')
          .select('*')
          .eq('id', 'main')
          .maybeSingle();
        
        if (!settingsError && dbSettings) {
          setSettingsState(mapSettingsFromDB(dbSettings));
        }

        // 3. Fetch Products
        const { data: dbProducts, error: productsError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (!productsError && dbProducts && dbProducts.length > 0) {
          setProducts(dbProducts.map(mapProductFromDB));
        }

        // 4. Fetch Inquiries
        const { data: dbInquiries, error: inquiriesError } = await supabase
          .from('inquiries')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (!inquiriesError && dbInquiries) {
          setInquiries(dbInquiries.map(i => ({
            id: i.id,
            productTitle: i.product_title,
            productCode: i.product_code,
            timestamp: i.created_at
          })));
        }

        // 5. Fetch Messages
        const { data: dbMessages, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (!messagesError && dbMessages) {
          setContactMessages(dbMessages.map(m => ({
            id: m.id,
            name: m.name,
            email: m.email,
            phone: m.phone || '',
            message: m.message,
            timestamp: m.created_at
          })));
        }
      } catch (err) {
        console.error('Error fetching data from Supabase:', err);
      }
    };

    loadData();
  }, []);

  // Persist rates changes
  const setRates = async (newRates: Rates) => {
    setRatesState(newRates);
    if (isSupabaseConfigured) {
      try {
        await supabase.from('rates').insert([mapRatesToDB(newRates)]);
      } catch (err) {
        console.error('Failed to sync rates to Supabase:', err);
      }
    }
  };

  // Persist settings changes
  const setSettings = async (newSettings: AppSettings) => {
    setSettingsState(newSettings);
    if (isSupabaseConfigured) {
      try {
        await supabase.from('settings').upsert(mapSettingsToDB(newSettings));
      } catch (err) {
        console.error('Failed to sync settings to Supabase:', err);
      }
    }
  };

  // Local storage hooks removed

  // Product actions (CRUD)
  const handleAddProduct = async (newProd: Product) => {
    setProducts(prev => [newProd, ...prev]);
    if (isSupabaseConfigured) {
      try {
        await supabase.from('products').insert([{
          ...mapProductToDB(newProd),
          id: newProd.id
        }]);
      } catch (err) {
        console.error('Failed to insert product to Supabase:', err);
      }
    }
  };

  const handleUpdateProduct = async (updatedProd: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProd.id ? updatedProd : p));
    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('products')
          .update(mapProductToDB(updatedProd))
          .eq('id', updatedProd.id);
      } catch (err) {
        console.error('Failed to update product in Supabase:', err);
      }
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("Are you sure you want to remove this product from the catalog?")) {
      setProducts(prev => prev.filter(p => p.id !== id));
      if (isSupabaseConfigured) {
        try {
          await supabase
            .from('products')
            .delete()
            .eq('id', id);
        } catch (err) {
          console.error('Failed to delete product in Supabase:', err);
        }
      }
    }
  };

  // Inquiry click logger
  const handleInquireProduct = async (product: Product) => {
    const newInquiry: Inquiry = {
      id: Date.now().toString(),
      productTitle: product.title,
      productCode: product.itemCode,
      timestamp: new Date().toISOString()
    };
    setInquiries(prev => [newInquiry, ...prev]);
    if (isSupabaseConfigured) {
      try {
        await supabase.from('inquiries').insert([{
          product_title: product.title,
          product_code: product.itemCode
        }]);
      } catch (err) {
        console.error('Failed to log inquiry in Supabase:', err);
      }
    }
  };

  // Contact submit logger
  const handleSubmitMessage = async (msg: { name: string; email: string; phone: string; message: string }) => {
    const newMessage: ContactMessage = {
      id: Date.now().toString(),
      ...msg,
      timestamp: new Date().toISOString()
    };
    setContactMessages(prev => [newMessage, ...prev]);
    if (isSupabaseConfigured) {
      try {
        await supabase.from('messages').insert([{
          name: msg.name,
          email: msg.email,
          phone: msg.phone,
          message: msg.message
        }]);
      } catch (err) {
        console.error('Failed to submit message to Supabase:', err);
      }
    }
  };

  // prefill consultation requests
  const handleRequestConsultation = (product: Product) => {
    setPrefilledMessage(`I am interested in scheduling a gallery consultation / video viewing for the "${product.title}" (Item Code: ${product.itemCode}). Please check availability.`);
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderFooter = () => (
    <footer className="footer-sec">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand-wrap">
            <h3 className="headline-sm footer-title" style={{ color: 'var(--color-text-primary)' }}>NEW GAYATRI JEWELLERS</h3>
            <p className="body-md" style={{ color: 'var(--color-text-secondary)', fontSize: '14px', maxWidth: '360px' }}>
              Authentic heritage, modern architectural shapes, and verified bullion assets since inception. Designed for exclusive investment and beauty.
            </p>
          </div>
          
          <div className="footer-col">
            <div className="footer-col-title">Navigation</div>
            <ul className="footer-links">
              <li><a href="#collections" onClick={(e) => { e.preventDefault(); setView('storefront'); setTimeout(() => document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' }), 50); }}>Signature Collections</a></li>
              <li><a href="#market-dashboard" onClick={(e) => { e.preventDefault(); setView('storefront'); setTimeout(() => document.getElementById('market-dashboard')?.scrollIntoView({ behavior: 'smooth' }), 50); }}>Live Bullion Rates</a></li>
              <li><a href="#legacy" onClick={(e) => { e.preventDefault(); setView('legacy'); }}>Our Legacy</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); setView('storefront'); setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 50); }}>Private Appointments</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <div className="footer-col-title">Gallery Info</div>
            <ul className="footer-links" style={{ color: 'var(--color-text-secondary)', fontSize: '13px', padding: 0 }}>
              <li>Sant Shree Trikam Saheb Marg</li>
              <li>Main Bazar, Rapar, Gujarat 370165</li>
              <li>Mon — Sat: 11:00 AM — 8:30 PM</li>
              <li>Phone: +91 88668 82947</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© New Gayatri Jewellers. Crafting Trust since 1977.</span>
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
  );

  return (
    <>
      {/* Live Rate Scrolling Ticker */}
      <RateTicker rates={rates} />

      {/* Navigation Header */}
      <Header currentView={view} setView={setView} />

      {/* Router / Conditional Render */}
      {view === 'storefront' ? (
        <>
          {/* Hero Banner Carousel */}
          <Hero 
            banners={settings.heroBanners}
          />

          {/* Live Market Dashboard Section (New UI requirement) */}
          <LiveMarketDashboard rates={rates} />

          {/* Catalog Selection (Reorganized asymmetrical layout) */}
          <ProductCatalog 
            products={products} 
            rates={rates} 
            onInquire={handleInquireProduct} 
            onRequestConsultation={handleRequestConsultation}
          />

          {/* Location Gallery & Dark Vector Map (New UI requirement) */}
          <LocationGallery shopPhoto={settings.shopPhoto} />

          {/* Luxe Contact Form */}
          <ContactForm 
            onSubmitMessage={handleSubmitMessage} 
            prefilledMessage={prefilledMessage}
            setPrefilledMessage={setPrefilledMessage}
          />

          {/* Our Models horizontal scrollable showcase */}
          <OurModels modelImages={settings.modelImages} />

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
          {renderFooter()}
        </>
      ) : view === 'legacy' ? (
        <>
          <LegacyPage setView={setView} />
          {renderFooter()}
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
