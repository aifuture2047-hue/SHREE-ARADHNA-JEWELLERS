import React, { useState } from 'react';
import { 
  Lock, LayoutDashboard, Coins, Tag, MessageCircle, Mail, 
  Plus, Edit, Trash, Check, X, ShieldAlert, LogOut, TrendingUp, TrendingDown,
  Settings as SettingsIcon
} from 'lucide-react';
import type { Product } from './ProductCatalog';
import { uploadImage, isSupabaseConfigured } from '../lib/supabase';

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

export interface AppSettings {
  heroBanners: string[];
  heroMobileBanners: string[];
  heroTitle: string;
  heroSubtitle: string;
  collectionsBridalImage: string;
  collectionsDiamondImage: string;
  collectionsSilverImage: string;
  popupAdEnabled: boolean;
  popupAdImage: string;
  popupAdLink: string;
  heroBannerUrl?: string; // legacy support
  heroMobileBannerUrl?: string; // legacy support
  shopPhoto?: string;
  modelImages?: string[];
}

interface AdminPanelProps {
  rates: Rates;
  setRates: (rates: Rates) => void;
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  inquiries: Inquiry[];
  contactMessages: ContactMessage[];
  settings: AppSettings;
  setSettings: (settings: AppSettings) => void;
}

// Pre-computed SHA-256 hashes of valid passcodes
const VALID_HASHES = [
  '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', // hash 1
  'a0fe286ab0b8ea40618cb8aed498bfebe8a82bb3c39cefaa62e2fd85b736b155'  // hash 2
];

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Monthly upload limit
const MONTHLY_UPLOAD_LIMIT = 30;

function getMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function getMonthlyUploadCount(): number {
  const key = `aradhna_uploads_${getMonthKey()}`;
  return parseInt(localStorage.getItem(key) || '0', 10);
}

function incrementMonthlyUploadCount(): void {
  const key = `aradhna_uploads_${getMonthKey()}`;
  const current = getMonthlyUploadCount();
  localStorage.setItem(key, String(current + 1));
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  rates,
  setRates,
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  inquiries,
  contactMessages,
  settings,
  setSettings
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('admin_authenticated') === 'true';
  });
  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'rates' | 'inventory' | 'inquiries' | 'messages' | 'settings'>('overview');
  const [uploadingState, setUploadingState] = useState<Record<string, boolean>>({});

  // Bullion form state
  const [gold22kInput, setGold22kInput] = useState(rates.gold22k);
  const [gold18kInput, setGold18kInput] = useState(rates.gold18k);
  const [silverInput, setSilverInput] = useState(rates.silver);
  const [goldChangeInput, setGoldChangeInput] = useState<'up' | 'down'>(rates.goldChange);
  const [silverChangeInput, setSilverChangeInput] = useState<'up' | 'down'>(rates.silverChange);
  const [ratesUpdatedMsg, setRatesUpdatedMsg] = useState(false);

  // App settings form state
  const [settingsBanners, setSettingsBanners] = useState<string[]>(() => {
    const arr = [...(settings?.heroBanners || [])];
    while (arr.length < 4) {
      arr.push(arr.length === 0 ? settings?.heroBannerUrl || '/hero_desktop.jpg' : '');
    }
    return arr;
  });
  const [settingsMobileBanners, setSettingsMobileBanners] = useState<string[]>(() => {
    const arr = [...(settings?.heroMobileBanners || [])];
    while (arr.length < 4) {
      arr.push(arr.length === 0 ? settings?.heroMobileBannerUrl || '/hero_banner.jpg' : '');
    }
    return arr;
  });
  const [settingsTitle, setSettingsTitle] = useState(settings?.heroTitle || 'Eternal Heritage\nHandcrafted Brilliance');
  const [settingsSubtitle, setSettingsSubtitle] = useState(settings?.heroSubtitle || '');

  const updateBannerAtIndex = (index: number, value: string) => {
    setSettingsBanners(prev => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const updateMobileBannerAtIndex = (index: number, value: string) => {
    setSettingsMobileBanners(prev => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };
  
  // Collections overrides state
  const [settingsCollectionsBridal, setSettingsCollectionsBridal] = useState(settings?.collectionsBridalImage || '');
  const [settingsCollectionsDiamond, setSettingsCollectionsDiamond] = useState(settings?.collectionsDiamondImage || '');
  const [settingsCollectionsSilver, setSettingsCollectionsSilver] = useState(settings?.collectionsSilverImage || '');
  const [settingsShopPhoto, setSettingsShopPhoto] = useState(settings?.shopPhoto || '');
  const [settingsModelImages, setSettingsModelImages] = useState<string[]>(settings?.modelImages || []);

  // Popup ad state
  const [settingsPopupAdEnabled, setSettingsPopupAdEnabled] = useState(settings?.popupAdEnabled || false);
  const [settingsPopupAdImage, setSettingsPopupAdImage] = useState(settings?.popupAdImage || '');
  const [settingsPopupAdLink, setSettingsPopupAdLink] = useState(settings?.popupAdLink || '');
  
  const [settingsUpdatedMsg, setSettingsUpdatedMsg] = useState(false);

  // Monthly upload quota
  const [monthlyUploads, setMonthlyUploads] = useState(getMonthlyUploadCount());
  const uploadsRemaining = MONTHLY_UPLOAD_LIMIT - monthlyUploads;
  const isUploadLimitReached = uploadsRemaining <= 0;

  // Product CRUD modal state
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Product form state
  const [prodTitle, setProdTitle] = useState('');
  const [prodCode, setProdCode] = useState('');
  const [prodCategory, setProdCategory] = useState('rings');
  const [prodPurity, setProdPurity] = useState<'gold22k' | 'gold18k' | 'silver'>('gold22k');
  const [prodMakingCharge, setProdMakingCharge] = useState<number>(12);
  const [prodWeight, setProdWeight] = useState(5);
  const [prodImage, setProdImage] = useState('');
  const [prodDesc, setProdDesc] = useState('');

  const processAndUploadFile = (
    file: File,
    maxWidth: number,
    maxHeight: number,
    folder: string,
    onSuccess: (url: string) => void,
    uploadKey: string
  ) => {
    setUploadingState(prev => ({ ...prev, [uploadKey]: true }));
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(async (blob) => {
            if (!blob) {
              setUploadingState(prev => ({ ...prev, [uploadKey]: false }));
              return;
            }
            const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
            if (isSupabaseConfigured) {
              try {
                const ext = file.name.split('.').pop() || 'jpg';
                const path = `${folder}/${Date.now()}-${Math.floor(Math.random() * 10000)}.${ext}`;
                const publicUrl = await uploadImage(blob, path);
                onSuccess(publicUrl);
              } catch (err) {
                console.error('Supabase storage upload failed:', err);
                alert('Supabase storage upload failed. Saving as local base64. Ensure you created a public bucket named "gallery".');
                onSuccess(dataUrl);
              } finally {
                setUploadingState(prev => ({ ...prev, [uploadKey]: false }));
              }
            } else {
              onSuccess(dataUrl);
              setUploadingState(prev => ({ ...prev, [uploadKey]: false }));
            }
          }, 'image/jpeg', 0.7);
        } else {
          setUploadingState(prev => ({ ...prev, [uploadKey]: false }));
        }
      };
      img.onerror = () => {
        setUploadingState(prev => ({ ...prev, [uploadKey]: false }));
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      setUploadingState(prev => ({ ...prev, [uploadKey]: false }));
    };
    reader.readAsDataURL(file);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processAndUploadFile(file, 500, 500, 'products', setProdImage, 'product');
    }
  };

  const handleBannerFileChangeAtIndex = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processAndUploadFile(
        file,
        1200,
        800,
        'banners',
        (url) => updateBannerAtIndex(index, url),
        `banner-${index}`
      );
    }
  };

  const handleMobileBannerFileChangeAtIndex = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processAndUploadFile(
        file,
        800,
        1200,
        'banners_mobile',
        (url) => updateMobileBannerAtIndex(index, url),
        `mobile-banner-${index}`
      );
    }
  };

  const handleCollectionsBridalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processAndUploadFile(file, 800, 800, 'collections', setSettingsCollectionsBridal, 'bridal');
    }
  };

  const handleCollectionsDiamondFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processAndUploadFile(file, 800, 800, 'collections', setSettingsCollectionsDiamond, 'diamond');
    }
  };

  const handleCollectionsSilverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processAndUploadFile(file, 800, 800, 'collections', setSettingsCollectionsSilver, 'silver');
    }
  };

  const handlePopupAdFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processAndUploadFile(file, 800, 800, 'announcement', setSettingsPopupAdImage, 'popup');
    }
  };

  const handleShopPhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processAndUploadFile(file, 1200, 800, 'shop', setSettingsShopPhoto, 'shopphoto');
    }
  };

  const handleModelImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const idx = settingsModelImages.length;
      processAndUploadFile(file, 1200, 1600, 'models', (url) => {
        setSettingsModelImages(prev => [...prev, url]);
      }, `model-${idx}`);
    }
  };

  const handleRemoveModelImage = (index: number) => {
    setSettingsModelImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettings({
      heroBanners: settingsBanners,
      heroMobileBanners: settingsMobileBanners,
      heroTitle: settingsTitle,
      heroSubtitle: settingsSubtitle,
      collectionsBridalImage: settingsCollectionsBridal,
      collectionsDiamondImage: settingsCollectionsDiamond,
      collectionsSilverImage: settingsCollectionsSilver,
      popupAdEnabled: settingsPopupAdEnabled,
      popupAdImage: settingsPopupAdImage,
      popupAdLink: settingsPopupAdLink,
      heroBannerUrl: settingsBanners[0],
      heroMobileBannerUrl: settingsMobileBanners[0],
      shopPhoto: settingsShopPhoto,
      modelImages: settingsModelImages
    });
    setSettingsUpdatedMsg(true);
    setTimeout(() => setSettingsUpdatedMsg(false), 3000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const hash = await sha256(passcode);
    if (VALID_HASHES.includes(hash)) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid Administrator Passcode.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
  };

  const handleSaveRates = (e: React.FormEvent) => {
    e.preventDefault();
    setRates({
      gold22k: Number(gold22kInput),
      gold18k: Number(gold18kInput),
      silver: Number(silverInput),
      goldChange: goldChangeInput,
      silverChange: silverChangeInput
    });
    setRatesUpdatedMsg(true);
    setTimeout(() => setRatesUpdatedMsg(false), 3000);
  };

  const openAddProduct = () => {
    if (isUploadLimitReached) return;
    setEditingProduct(null);
    setProdTitle('');
    setProdCode('SAA-' + Math.floor(1000 + Math.random() * 9000));
    setProdCategory('rings');
    setProdPurity('gold22k');
    setProdMakingCharge(12);
    setProdWeight(5);
    setProdImage('');
    setProdDesc('');
    setShowProductModal(true);
  };

  const openEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProdTitle(prod.title);
    setProdCode(prod.itemCode);
    setProdCategory(prod.category);
    setProdPurity(prod.purity);
    setProdMakingCharge(prod.makingCharge);
    setProdWeight(prod.weight);
    setProdImage(prod.imageUrl);
    setProdDesc(prod.description);
    setShowProductModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodTitle || !prodCode || !prodWeight) return;

    const targetImage = prodImage || '/ring.png'; // default fallback

    const prodData: Product = {
      id: editingProduct ? editingProduct.id : Date.now().toString(),
      title: prodTitle,
      itemCode: prodCode,
      category: prodCategory,
      purity: prodPurity,
      makingCharge: Number(prodMakingCharge),
      weight: Number(prodWeight),
      imageUrl: targetImage,
      description: prodDesc
    };

    if (editingProduct) {
      onUpdateProduct(prodData);
    } else {
      if (isUploadLimitReached) return;
      onAddProduct(prodData);
      incrementMonthlyUploadCount();
      setMonthlyUploads(getMonthlyUploadCount());
    }
    
    setShowProductModal(false);
  };

  // Login view
  if (!isAuthenticated) {
    return (
      <div className="admin-login-card">
        <div style={{ display: 'inline-flex', width: '48px', height: '48px', backgroundColor: 'rgba(247, 240, 17, 0.1)', color: 'var(--color-accent-gold)', borderRadius: '50%', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
          <Lock size={20} />
        </div>
        <h2 className="headline-sm" style={{ marginBottom: '8px' }}>Security Access Required</h2>
        <p className="body-md" style={{ color: 'var(--color-text-secondary)', marginBottom: '32px' }}>
          Please authenticate to enter the New Gayatri workspace.
        </p>

        {loginError && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-error)', backgroundColor: 'rgba(255, 180, 171, 0.1)', padding: '12px', marginBottom: '24px', fontSize: '13px' }}>
            <ShieldAlert size={16} />
            <span>{loginError}</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="input-group">
            <label className="form-label">Passcode</label>
            <input 
              type="password" 
              className="form-input" 
              style={{ textAlign: 'center', letterSpacing: '0.3em' }}
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            Unlock Dashboard
          </button>
        </form>
        
        <span style={{ display: 'block', fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '24px' }}>
          Contact administrator for access credentials.
        </span>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Sidebar navigation */}
      <aside className="admin-sidebar">
        <div style={{ padding: '0 32px 32px', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="label-caps" style={{ color: 'var(--color-text-primary)' }}>Workspace Menu</span>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }} title="Log Out">
            <LogOut size={16} />
          </button>
        </div>
        
        <button 
          className={`admin-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <LayoutDashboard size={16} /> Overview
        </button>

        <button 
          className={`admin-nav-item ${activeTab === 'rates' ? 'active' : ''}`}
          onClick={() => setActiveTab('rates')}
        >
          <Coins size={16} /> Live Rates
        </button>

        <button 
          className={`admin-nav-item ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          <Tag size={16} /> Inventory
        </button>

        <button 
          className={`admin-nav-item ${activeTab === 'inquiries' ? 'active' : ''}`}
          onClick={() => setActiveTab('inquiries')}
        >
          <MessageCircle size={16} /> WhatsApp Log
        </button>

        <button 
          className={`admin-nav-item ${activeTab === 'messages' ? 'active' : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          <Mail size={16} /> Client Messages
        </button>

        <button 
          className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <SettingsIcon size={16} /> Banners & Text
        </button>
      </aside>

      {/* Workspace main content */}
      <main className="admin-content">
        {/* Tab 1: Overview Dashboard */}
        {activeTab === 'overview' && (
          <div>
            <h2 className="headline-sm" style={{ marginBottom: '32px' }}>Overview Dashboard</h2>
            
            <div className="admin-stat-grid">
              <div className="admin-stat-card">
                <div className="admin-stat-title">Catalog Size</div>
                <div className="admin-stat-value">{products.length} Products</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-title">WhatsApp Inquiries</div>
                <div className="admin-stat-value">{inquiries.length} Clicks</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-title">Customer Messages</div>
                <div className="admin-stat-value">{contactMessages.length} Submissions</div>
              </div>
              <div className="admin-stat-card" style={{ borderColor: isUploadLimitReached ? 'var(--color-error)' : 'var(--color-accent-gold)' }}>
                <div className="admin-stat-title">Monthly Upload Quota</div>
                <div className="admin-stat-value" style={{ color: isUploadLimitReached ? 'var(--color-error)' : 'var(--color-accent-gold)' }}>
                  {monthlyUploads} / {MONTHLY_UPLOAD_LIMIT}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                  {isUploadLimitReached ? 'Limit reached — resets next month' : `${uploadsRemaining} uploads remaining`}
                </div>
              </div>
            </div>

            <div className="calc-card" style={{ maxWidth: '100%', margin: 0 }}>
              <h3 className="headline-sm" style={{ marginBottom: '24px' }}>Active Rates Summary</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
                <div style={{ flex: 1, minWidth: '150px' }}>
                  <div className="label-caps" style={{ color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Gold 22K (10g)</div>
                  <div style={{ fontSize: '24px', fontWeight: 600, color: 'var(--color-accent-gold)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    ₹{rates.gold22k.toLocaleString('en-IN')}
                    {rates.goldChange === 'up' ? <TrendingUp size={18} style={{ color: '#518e78' }} /> : <TrendingDown size={18} style={{ color: '#ffb4ab' }} />}
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: '150px' }}>
                  <div className="label-caps" style={{ color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Gold 18K (10g)</div>
                  <div style={{ fontSize: '24px', fontWeight: 600, color: 'var(--color-accent-gold)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    ₹{rates.gold18k.toLocaleString('en-IN')}
                    {rates.goldChange === 'up' ? <TrendingUp size={18} style={{ color: '#518e78' }} /> : <TrendingDown size={18} style={{ color: '#ffb4ab' }} />}
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: '150px' }}>
                  <div className="label-caps" style={{ color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Silver (1kg)</div>
                  <div style={{ fontSize: '24px', fontWeight: 600, color: 'var(--color-accent-gold)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    ₹{rates.silver.toLocaleString('en-IN')}
                    {rates.silverChange === 'up' ? <TrendingUp size={18} style={{ color: '#518e78' }} /> : <TrendingDown size={18} style={{ color: '#ffb4ab' }} />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Bullion Rates Editor */}
        {activeTab === 'rates' && (
          <div>
            <h2 className="headline-sm" style={{ marginBottom: '32px' }}>Live Bullion Rates</h2>

            {ratesUpdatedMsg && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#121414', backgroundColor: 'var(--color-accent-gold)', padding: '12px', marginBottom: '24px', fontSize: '14px', fontWeight: 600 }}>
                <Check size={18} />
                <span>Live rates updated successfully. Changes are now visible across the storefront.</span>
              </div>
            )}

            <form onSubmit={handleSaveRates} className="calc-card" style={{ maxWidth: '600px', margin: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="calc-grid" style={{ marginTop: 0 }}>
                  <div className="input-group">
                    <label className="form-label">Gold 22K Rate (per 10g)</label>
                    <input 
                      type="number" 
                      className="form-input"
                      value={gold22kInput}
                      onChange={(e) => setGold22kInput(Number(e.target.value))}
                      required 
                    />
                  </div>
                  <div className="input-group">
                    <label className="form-label">Gold 18K Rate (per 10g)</label>
                    <input 
                      type="number" 
                      className="form-input"
                      value={gold18kInput}
                      onChange={(e) => setGold18kInput(Number(e.target.value))}
                      required 
                    />
                  </div>
                </div>

                <div className="calc-grid" style={{ marginTop: 0 }}>
                  <div className="input-group">
                    <label className="form-label">Gold Price Trend</label>
                    <select 
                      className="form-select"
                      value={goldChangeInput}
                      onChange={(e) => setGoldChangeInput(e.target.value as any)}
                    >
                      <option value="up">Trending Up (▲)</option>
                      <option value="down">Trending Down (▼)</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label className="form-label">Silver Rate (per 1kg)</label>
                    <input 
                      type="number" 
                      className="form-input"
                      value={silverInput}
                      onChange={(e) => setSilverInput(Number(e.target.value))}
                      required 
                    />
                  </div>
                </div>

                <div className="calc-grid" style={{ marginTop: 0 }}>
                  <div className="input-group">
                    <label className="form-label">Silver Price Trend</label>
                    <select 
                      className="form-select"
                      value={silverChangeInput}
                      onChange={(e) => setSilverChangeInput(e.target.value as any)}
                    >
                      <option value="up">Trending Up (▲)</option>
                      <option value="down">Trending Down (▼)</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}></div>
                </div>

                <button type="submit" className="btn-primary" style={{ marginTop: '16px' }}>
                  Update Storefront Rates
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 3: Inventory CRUD */}
        {activeTab === 'inventory' && (
          <div>
            <div className="admin-toolbar">
              <h2 className="headline-sm">Product Inventory</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  padding: '6px 14px',
                  borderRadius: '20px',
                  backgroundColor: isUploadLimitReached ? 'rgba(255,180,171,0.15)' : 'rgba(247,240,17,0.1)',
                  color: isUploadLimitReached ? 'var(--color-error)' : 'var(--color-accent-gold)',
                  whiteSpace: 'nowrap'
                }}>
                  {monthlyUploads}/{MONTHLY_UPLOAD_LIMIT} this month
                </span>
                <button
                  className="btn-primary"
                  onClick={openAddProduct}
                  disabled={isUploadLimitReached}
                  style={isUploadLimitReached ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
                  title={isUploadLimitReached ? 'Monthly upload limit reached (30/month). Resets next month.' : 'Add a new product'}
                >
                  <Plus size={16} /> Add Product
                </button>
              </div>
            </div>
            {isUploadLimitReached && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                color: 'var(--color-error)',
                backgroundColor: 'rgba(255,180,171,0.08)',
                padding: '12px 16px', marginBottom: '20px',
                fontSize: '13px', borderRadius: '8px'
              }}>
                <ShieldAlert size={16} />
                <span>Monthly upload limit reached (<strong>{MONTHLY_UPLOAD_LIMIT} designs/month</strong>). You can still edit or delete existing products. The counter resets on the 1st of next month.</span>
              </div>
            )}

            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Metal</th>
                    <th>Weight</th>
                    <th>Making Charge</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(prod => (
                    <tr key={prod.id}>
                      <td>
                        <img 
                          src={prod.imageUrl} 
                          alt="" 
                          style={{ width: '40px', height: '40px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.05)' }} 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=100';
                          }}
                        />
                      </td>
                      <td><code>{prod.itemCode}</code></td>
                      <td style={{ fontWeight: 500 }}>{prod.title}</td>
                      <td><span className="badge">{prod.category}</span></td>
                      <td>
                        <span className={`badge ${prod.purity.includes('gold') ? 'gold' : 'silver'}`}>
                          {prod.purity === 'gold22k' ? '22K Gold' : prod.purity === 'gold18k' ? '18K Gold' : 'Silver'}
                        </span>
                      </td>
                      <td>{prod.weight} g</td>
                      <td>{prod.makingCharge}%</td>
                      <td>
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <button 
                            onClick={() => openEditProduct(prod)}
                            style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => onDeleteProduct(prod.id)}
                            style={{ background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer' }}
                            title="Delete"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: WhatsApp Inquiries */}
        {activeTab === 'inquiries' && (
          <div>
            <h2 className="headline-sm" style={{ marginBottom: '32px' }}>WhatsApp Click Analytics</h2>
            
            {inquiries.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-secondary)', border: '1px dashed rgba(255,255,255,0.05)' }}>
                No inquiry clicks registered yet.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Product</th>
                      <th>Code</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.map(inq => (
                      <tr key={inq.id}>
                        <td style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
                          {new Date(inq.timestamp).toLocaleString()}
                        </td>
                        <td style={{ fontWeight: 500 }}>{inq.productTitle}</td>
                        <td><code>{inq.productCode}</code></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Client Messages */}
        {activeTab === 'messages' && (
          <div>
            <h2 className="headline-sm" style={{ marginBottom: '32px' }}>Bespoke Inquiry Messages</h2>

            {contactMessages.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-secondary)', border: '1px dashed rgba(255,255,255,0.05)' }}>
                No messages received yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {contactMessages.map(msg => (
                  <div key={msg.id} className="calc-card" style={{ maxWidth: '100%', margin: 0, padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px', marginBottom: '16px' }}>
                      <div>
                        <strong style={{ fontSize: '16px', color: 'var(--color-text-primary)' }}>{msg.name}</strong>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                          {msg.email} {msg.phone ? `| ${msg.phone}` : ''}
                        </div>
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--color-accent-gold)' }}>
                        {new Date(msg.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p style={{ fontSize: '14px', whiteSpace: 'pre-wrap', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                      {msg.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 6: App Settings */}
        {activeTab === 'settings' && (
          <div>
            <h2 className="headline-sm" style={{ marginBottom: '32px' }}>Banners & Headline Settings</h2>

            {settingsUpdatedMsg && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#121414', backgroundColor: 'var(--color-accent-gold)', padding: '12px', marginBottom: '24px', fontSize: '14px', fontWeight: 600 }}>
                <Check size={18} />
                <span>Homepage settings updated successfully.</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="calc-card" style={{ maxWidth: '700px', margin: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="input-group">
                  <label className="form-label">Hero Banner Title</label>
                  <textarea 
                    className="form-input" 
                    rows={2}
                    value={settingsTitle}
                    onChange={(e) => setSettingsTitle(e.target.value)}
                    placeholder="Enter main hero title..."
                    style={{ resize: 'vertical', fontFamily: 'var(--font-serif)', fontSize: '20px' }}
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="form-label">Hero Banner Subtitle</label>
                  <textarea 
                    className="form-input" 
                    rows={3}
                    value={settingsSubtitle}
                    onChange={(e) => setSettingsSubtitle(e.target.value)}
                    placeholder="Enter hero subtitle description..."
                    style={{ resize: 'vertical' }}
                    required
                  />
                </div>

                {/* Desktop Banners Section */}
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '24px', marginBottom: '24px' }}>
                  <h3 className="headline-sm" style={{ fontSize: '16px', color: 'var(--color-accent-gold)', marginBottom: '16px' }}>Desktop Hero Banner Slides (4 Images)</h3>
                  {[0, 1, 2, 3].map(idx => (
                    <div key={idx} style={{ marginBottom: '20px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-secondary)', minWidth: '60px' }}>Slide {idx + 1}</span>
                      
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleBannerFileChangeAtIndex(idx)}
                        style={{ display: 'none' }}
                        id={`desktop-banner-file-${idx}`}
                      />
                      <label htmlFor={`desktop-banner-file-${idx}`} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '10px', height: 'auto', border: '1px solid var(--color-border-subtle)', cursor: 'pointer' }}>
                        {uploadingState[`banner-${idx}`] ? 'Uploading...' : 'Upload File'}
                      </label>
                      
                      <input 
                        type="text" 
                        className="form-input" 
                        style={{ flex: 1, minWidth: '200px', padding: '6px 12px', fontSize: '13px' }}
                        value={settingsBanners[idx]}
                        onChange={(e) => updateBannerAtIndex(idx, e.target.value)}
                        placeholder={`e.g. /hero_desktop.jpg or paste URL`}
                      />

                      {settingsBanners[idx] && (
                        <div style={{ width: '50px', height: '40px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <img src={settingsBanners[idx]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Mobile Banners Section */}
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '24px', marginBottom: '24px' }}>
                  <h3 className="headline-sm" style={{ fontSize: '16px', color: 'var(--color-accent-gold)', marginBottom: '16px' }}>Mobile Hero Banner Slides (4 Images)</h3>
                  {[0, 1, 2, 3].map(idx => (
                    <div key={idx} style={{ marginBottom: '20px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-secondary)', minWidth: '60px' }}>Slide {idx + 1}</span>
                      
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleMobileBannerFileChangeAtIndex(idx)}
                        style={{ display: 'none' }}
                        id={`mobile-banner-file-${idx}`}
                      />
                      <label htmlFor={`mobile-banner-file-${idx}`} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '10px', height: 'auto', border: '1px solid var(--color-border-subtle)', cursor: 'pointer' }}>
                        {uploadingState[`mobile-banner-${idx}`] ? 'Uploading...' : 'Upload File'}
                      </label>
                      
                      <input 
                        type="text" 
                        className="form-input" 
                        style={{ flex: 1, minWidth: '200px', padding: '6px 12px', fontSize: '13px' }}
                        value={settingsMobileBanners[idx]}
                        onChange={(e) => updateMobileBannerAtIndex(idx, e.target.value)}
                        placeholder={`e.g. /hero_banner.jpg or paste URL`}
                      />

                      {settingsMobileBanners[idx] && (
                        <div style={{ width: '50px', height: '40px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <img src={settingsMobileBanners[idx]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Section: Collections Overrides */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px', marginTop: '12px' }}>
                  <h3 className="headline-sm" style={{ fontSize: '16px', color: 'var(--color-accent-gold)', marginBottom: '16px' }}>Collections Showcase Overrides</h3>
                  
                  {/* Bridal Card Override */}
                  <div style={{ marginBottom: '20px' }}>
                    <label className="form-label" style={{ display: 'block', marginBottom: '8px' }}>Bridal Highlight Image</label>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleCollectionsBridalFileChange}
                        style={{ display: 'none' }}
                        id="bridal-file"
                      />
                      <label htmlFor="bridal-file" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '10px', height: 'auto', border: '1px solid var(--color-border-subtle)', cursor: 'pointer' }}>
                        {uploadingState['bridal'] ? 'Uploading...' : 'Upload Bridal File'}
                      </label>
                      <input 
                        type="text" 
                        className="form-input" 
                        style={{ flex: 1, minWidth: '200px', padding: '6px 0', fontSize: '13px' }}
                        value={settingsCollectionsBridal}
                        onChange={(e) => setSettingsCollectionsBridal(e.target.value)}
                        placeholder="Or paste URL / /hero_necklace.png"
                      />
                      {settingsCollectionsBridal && (
                        <img src={settingsCollectionsBridal} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }} />
                      )}
                    </div>
                  </div>

                  {/* Diamond Card Override */}
                  <div style={{ marginBottom: '20px' }}>
                    <label className="form-label" style={{ display: 'block', marginBottom: '8px' }}>Diamond Highlight Image</label>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleCollectionsDiamondFileChange}
                        style={{ display: 'none' }}
                        id="diamond-file"
                      />
                      <label htmlFor="diamond-file" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '10px', height: 'auto', border: '1px solid var(--color-border-subtle)', cursor: 'pointer' }}>
                        {uploadingState['diamond'] ? 'Uploading...' : 'Upload Diamond File'}
                      </label>
                      <input 
                        type="text" 
                        className="form-input" 
                        style={{ flex: 1, minWidth: '200px', padding: '6px 0', fontSize: '13px' }}
                        value={settingsCollectionsDiamond}
                        onChange={(e) => setSettingsCollectionsDiamond(e.target.value)}
                        placeholder="Or paste URL / /ring.png"
                      />
                      {settingsCollectionsDiamond && (
                        <img src={settingsCollectionsDiamond} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }} />
                      )}
                    </div>
                  </div>

                  {/* Silver Card Override */}
                  <div style={{ marginBottom: '20px' }}>
                    <label className="form-label" style={{ display: 'block', marginBottom: '8px' }}>Silver Highlight Image</label>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleCollectionsSilverFileChange}
                        style={{ display: 'none' }}
                        id="silver-file"
                      />
                      <label htmlFor="silver-file" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '10px', height: 'auto', border: '1px solid var(--color-border-subtle)', cursor: 'pointer' }}>
                        {uploadingState['silver'] ? 'Uploading...' : 'Upload Silver File'}
                      </label>
                      <input 
                        type="text" 
                        className="form-input" 
                        style={{ flex: 1, minWidth: '200px', padding: '6px 0', fontSize: '13px' }}
                        value={settingsCollectionsSilver}
                        onChange={(e) => setSettingsCollectionsSilver(e.target.value)}
                        placeholder="Or paste URL / /bangles.png"
                      />
                      {settingsCollectionsSilver && (
                        <img src={settingsCollectionsSilver} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }} />
                      )}
                    </div>
                  </div>
                </div>

                {/* Section: Promotional Popup */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px', marginTop: '12px' }}>
                  <h3 className="headline-sm" style={{ fontSize: '16px', color: 'var(--color-accent-gold)', marginBottom: '16px' }}>Storefront Announcement Popup</h3>
                  
                  {/* Enable Switch */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                    <input 
                      type="checkbox" 
                      id="popup-enabled"
                      checked={settingsPopupAdEnabled}
                      onChange={(e) => setSettingsPopupAdEnabled(e.target.checked)}
                      style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--color-accent-gold)' }}
                    />
                    <label htmlFor="popup-enabled" style={{ cursor: 'pointer', fontSize: '13px', color: 'var(--color-text-primary)' }}>
                      Enable Announcement Popup on home load
                    </label>
                  </div>

                  {/* Popup Image Upload */}
                  <div style={{ marginBottom: '20px' }}>
                    <label className="form-label" style={{ display: 'block', marginBottom: '8px' }}>Popup Ad Image Banner</label>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handlePopupAdFileChange}
                        style={{ display: 'none' }}
                        id="popup-file"
                      />
                      <label htmlFor="popup-file" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '10px', height: 'auto', border: '1px solid var(--color-border-subtle)', cursor: 'pointer' }}>
                        {uploadingState['popup'] ? 'Uploading...' : 'Upload Popup Image'}
                      </label>
                      <input 
                        type="text" 
                        className="form-input" 
                        style={{ flex: 1, minWidth: '200px', padding: '6px 0', fontSize: '13px' }}
                        value={settingsPopupAdImage}
                        onChange={(e) => setSettingsPopupAdImage(e.target.value)}
                        placeholder="Or paste image URL"
                      />
                      {settingsPopupAdImage && (
                        <img src={settingsPopupAdImage} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }} />
                      )}
                    </div>
                  </div>

                  {/* Redirect Link */}
                  <div className="input-group" style={{ marginBottom: '24px' }}>
                    <label className="form-label">Redirect Link URL (Optional)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={settingsPopupAdLink}
                      onChange={(e) => setSettingsPopupAdLink(e.target.value)}
                      placeholder="e.g. #collections or https://wa.me/..."
                    />
                  </div>
                </div>

                {/* Section: Shop Front Photo */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px', marginTop: '12px' }}>
                  <h3 className="headline-sm" style={{ fontSize: '16px', color: 'var(--color-accent-gold)', marginBottom: '16px' }}>Shop Front Gallery Image</h3>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <label className="form-label" style={{ display: 'block', marginBottom: '8px' }}>Storefront Photo {uploadingState['shopphoto'] && <span style={{ color: 'var(--color-accent-gold)' }}>(Uploading...)</span>}</label>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleShopPhotoFileChange}
                        style={{ display: 'none' }}
                        id="shopphoto-file"
                      />
                      <label htmlFor="shopphoto-file" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '10px', height: 'auto', border: '1px solid var(--color-border-subtle)', cursor: 'pointer' }}>
                        {uploadingState['shopphoto'] ? 'Uploading...' : 'Upload Shop Photo'}
                      </label>
                      <input 
                        type="text" 
                        className="form-input" 
                        style={{ flex: 1, minWidth: '200px', padding: '6px 12px', fontSize: '13px' }}
                        value={settingsShopPhoto}
                        onChange={(e) => setSettingsShopPhoto(e.target.value)}
                        placeholder="Or paste URL / /shop_photo.jpg"
                      />
                      {settingsShopPhoto && (
                        <div style={{ width: '50px', height: '40px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <img src={settingsShopPhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section: Our Models Images */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px', marginTop: '12px' }}>
                  <h3 className="headline-sm" style={{ fontSize: '16px', color: 'var(--color-accent-gold)', marginBottom: '8px' }}>Our Models Slideshow</h3>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>Upload model/showcase photos for the "Our Models" section on the homepage. Supports multiple images.</p>

                  {/* Upload button */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleModelImageFileChange}
                      style={{ display: 'none' }}
                      id="model-image-file"
                    />
                    <label htmlFor="model-image-file" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '10px', height: 'auto', border: '1px solid var(--color-border-subtle)', cursor: 'pointer' }}>
                      {uploadingState[`model-${settingsModelImages.length}`] ? 'Uploading...' : '+ Add Model Image'}
                    </label>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{settingsModelImages.length} image(s) uploaded</span>
                  </div>

                  {/* Thumbnails */}
                  {settingsModelImages.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      {settingsModelImages.map((url, idx) => (
                        <div key={idx} style={{ position: 'relative', width: '70px', height: '70px' }}>
                          <img
                            src={url}
                            alt={`Model ${idx + 1}`}
                            style={{ width: '70px', height: '70px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px' }}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveModelImage(idx)}
                            style={{
                              position: 'absolute', top: '-6px', right: '-6px',
                              width: '18px', height: '18px', borderRadius: '50%',
                              background: 'var(--color-error)', border: 'none',
                              color: '#fff', fontSize: '10px', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              lineHeight: 1, padding: 0
                            }}
                            title="Remove"
                          >✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button type="submit" className="btn-primary" style={{ marginTop: '16px' }}>
                  Save Homepage Settings
                </button>

              </div>
            </form>
          </div>
        )}
      </main>

      {/* Product Add/Edit Modal */}
      {showProductModal && (
        <div className="modal-overlay" onClick={() => setShowProductModal(false)}>
          <div className="modal-content-card" style={{ maxWidth: '600px', gridTemplateColumns: '1fr' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowProductModal(false)}>
              <X size={24} />
            </button>
            
            <div className="modal-details-wrap" style={{ padding: '40px' }}>
              <h3 className="headline-sm" style={{ marginBottom: '24px' }}>
                {editingProduct ? 'Edit Product Details' : 'Add New Product'}
              </h3>

              <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="calc-grid" style={{ marginTop: 0 }}>
                  <div className="input-group">
                    <label className="form-label">Product Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={prodTitle}
                      onChange={(e) => setProdTitle(e.target.value)}
                      placeholder="e.g. Aura Diamond Loop"
                      required
                    />
                  </div>
                  
                  <div className="input-group">
                    <label className="form-label">Item Code</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={prodCode}
                      onChange={(e) => setProdCode(e.target.value)}
                      placeholder="e.g. SAA-1090"
                      required
                    />
                  </div>
                </div>

                <div className="calc-grid" style={{ marginTop: 0 }}>
                  <div className="input-group">
                    <label className="form-label">Category</label>
                    <select 
                      className="form-select"
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value)}
                    >
                      <option value="rings">Rings</option>
                      <option value="necklaces">Necklaces</option>
                      <option value="earrings">Earrings</option>
                      <option value="bangles">Bangles & Bracelets</option>
                    </select>
                  </div>
                  
                  <div className="input-group">
                    <label className="form-label">Metal & Purity</label>
                    <select 
                      className="form-select"
                      value={prodPurity}
                      onChange={(e) => setProdPurity(e.target.value as any)}
                    >
                      <option value="gold22k">Gold 22K</option>
                      <option value="gold18k">Gold 18K</option>
                      <option value="silver">Silver</option>
                    </select>
                  </div>
                </div>

                <div className="calc-grid" style={{ marginTop: 0 }}>
                  <div className="input-group">
                    <label className="form-label">Weight (Grams)</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      min="0.01" 
                      step="0.01"
                      value={prodWeight}
                      onChange={(e) => setProdWeight(Number(e.target.value))}
                      required
                    />
                  </div>
                  
                  <div className="input-group">
                    <label className="form-label">Making Charge (%)</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      min="0" 
                      step="0.1"
                      value={prodMakingCharge}
                      onChange={(e) => setProdMakingCharge(Number(e.target.value))}
                      required
                    />
                  </div>
                </div>

                <div className="calc-grid" style={{ marginTop: 0 }}>
                  <div className="input-group">
                    <label className="form-label">Upload Image File {uploadingState.product && <span style={{ color: 'var(--color-accent-gold)' }}>(Uploading...)</span>}</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      className="form-input" 
                      onChange={handleImageFileChange}
                      style={{ padding: '8px 0', border: 'none', borderBottom: '1px solid var(--color-border-ivory)', height: 'auto', background: 'none' }}
                    />
                  </div>
                  
                  <div className="input-group">
                    <label className="form-label">Or Paste Image URL / Path</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={prodImage}
                      onChange={(e) => setProdImage(e.target.value)}
                      placeholder="e.g. /ring.png or base64 data"
                    />
                  </div>
                  
                  <div className="input-group" style={{ justifyContent: 'center' }}>
                    {prodImage && (
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span className="form-label" style={{ margin: 0 }}>Preview:</span>
                        <img 
                          src={prodImage} 
                          alt="" 
                          style={{ width: '48px', height: '48px', objectFit: 'cover', border: '1px solid var(--color-border-subtle)' }} 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=100';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="input-group">
                  <label className="form-label">Description (Optional)</label>
                  <textarea 
                    className="form-input" 
                    rows={3}
                    value={prodDesc}
                    onChange={(e) => setProdDesc(e.target.value)}
                    placeholder="Enter short description of craftsmanship..."
                    style={{ resize: 'none' }}
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ marginTop: '12px' }}>
                  {editingProduct ? 'Save Changes' : 'Create Catalog Product'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
