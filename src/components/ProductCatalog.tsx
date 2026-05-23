import React, { useState } from 'react';
import { X, MessageCircle, ArrowRight } from 'lucide-react';

export interface Product {
  id: string;
  title: string;
  category: string;
  weight: number;
  purity: 'gold22k' | 'gold18k' | 'silver';
  makingCharge: number;
  description: string;
  imageUrl: string;
  itemCode: string;
}

interface Rates {
  gold22k: number;
  gold18k: number;
  silver: number;
}

interface ProductCatalogProps {
  products: Product[];
  rates: Rates;
  onInquire: (product: Product) => void;
  onRequestConsultation?: (product: Product) => void;
  collectionsBridalImage?: string;
  collectionsDiamondImage?: string;
  collectionsSilverImage?: string;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ 
  products, 
  rates, 
  onInquire, 
  onRequestConsultation,
  collectionsBridalImage,
  collectionsDiamondImage,
  collectionsSilverImage
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Dynamic Price Calculation
  const getPriceBreakdown = (product: Product) => {
    let ratePerGram = 0;
    if (product.purity === 'gold22k') {
      ratePerGram = rates.gold22k / 10;
    } else if (product.purity === 'gold18k') {
      ratePerGram = rates.gold18k / 10;
    } else if (product.purity === 'silver') {
      ratePerGram = rates.silver / 1000;
    }
    const baseValue = product.weight * ratePerGram;
    const makingCharges = baseValue * (product.makingCharge / 100);
    const subtotal = baseValue + makingCharges;
    const gst = subtotal * 0.03;
    const total = subtotal + gst;

    return {
      baseValue: Math.round(baseValue),
      makingCharges: Math.round(makingCharges),
      gst: Math.round(gst),
      total: Math.round(total)
    };
  };

  const calculatePrice = (product: Product) => {
    return getPriceBreakdown(product).total;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getPurityLabel = (purity: 'gold22k' | 'gold18k' | 'silver') => {
    if (purity === 'gold22k') return '22K Gold';
    if (purity === 'gold18k') return '18K Gold';
    return 'Fine Silver';
  };

  // Find products to map into our asymmetrical hero cards (based on their codes/keywords or position)
  const getHighlightProduct = (key: 'bridal' | 'diamond' | 'silver') => {
    if (key === 'bridal') {
      // Find the choker necklace or fallback to first necklace, or default first item
      return products.find(p => p.itemCode === 'SAA-8902' || p.category === 'necklaces') || products[0];
    } else if (key === 'diamond') {
      // Find the ring or fallback
      return products.find(p => p.itemCode === 'SAA-4932' || p.category === 'rings') || products[0];
    } else {
      // Find silver bangles or fallback
      return products.find(p => p.itemCode === 'SAA-3109' || p.category === 'bangles' || p.purity === 'silver') || products[0];
    }
  };

  const bridalProduct = getHighlightProduct('bridal');
  const diamondProduct = getHighlightProduct('diamond');
  const silverProduct = getHighlightProduct('silver');

  const bridalImage = collectionsBridalImage || bridalProduct?.imageUrl || '/hero_necklace.png';
  const diamondImage = collectionsDiamondImage || diamondProduct?.imageUrl || '/ring.png';
  const silverImage = collectionsSilverImage || silverProduct?.imageUrl || '/bangles.png';

  const categories = [
    { id: 'all', name: 'All Collections' },
    { id: 'rings', name: 'Rings' },
    { id: 'necklaces', name: 'Necklaces' },
    { id: 'earrings', name: 'Earrings' },
    { id: 'bangles', name: 'Bangles & Bracelets' }
  ];

  // Filter products for the detailed browser catalog below
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());

  const handleWhatsAppInquiry = (product: Product) => {
    onInquire(product);
    const phoneNumber = '919638888170'; // Official contact phone number
    const text = encodeURIComponent(
      `Hello Shree Aradhna Jewellers, I am interested in inquiring about the following piece from your collection:\n\n` +
      `Product: ${product.title}\n` +
      `Code: ${product.itemCode}\n` +
      `Weight: ${product.weight}g\n` +
      `Purity: ${getPurityLabel(product.purity)}\n` +
      `Making Charge: ${product.makingCharge}%\n` +
      `Estimated Price: ${formatCurrency(calculatePrice(product))} (Incl. 3% GST)\n\n` +
      `Please let me know its availability and the process to schedule an appointment. Thank you.`
    );
    window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${text}`, '_blank');
  };

  return (
    <section id="collections" className="section" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.03)' }}>
      <div className="container">
        
        {/* ==========================================
           SECTION 1: THE COLLECTIONS ASYMMETRICAL GRID
           ========================================== */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 className="headline-md" style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>The Collections</h2>
          <div style={{ width: '60px', height: '1px', backgroundColor: 'var(--color-accent-gold)', margin: '16px auto 0' }}></div>
        </div>

        <div className="collections-asym-grid" style={{ marginBottom: '120px' }}>
          {/* Left Column: Big Bridal Showcase Card */}
          {bridalProduct && (
            <div className="collections-left-col" onClick={() => setSelectedProduct(bridalProduct)}>
              <div className="asym-card large">
                <img 
                  src={bridalImage} 
                  alt={bridalProduct?.title || "Bridal Heritage"} 
                  className="asym-image"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/hero_necklace.png';
                  }}
                />
                <div className="asym-overlay">
                  <span className="asym-tag">Pure Gold Traditions</span>
                  <h3 className="asym-title">Bridal Heritage</h3>
                  <span className="asym-link">
                    Take our collection <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Right Column: Two Stacked Showcase Cards */}
          <div className="collections-right-col">
            {/* Top: Diamond Rings */}
            {diamondProduct && (
              <div onClick={() => setSelectedProduct(diamondProduct)}>
                <div className="asym-card small">
                  <img 
                    src={diamondImage} 
                    alt={diamondProduct?.title || "Diamond Radiance"} 
                    className="asym-image"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/ring.png';
                    }}
                  />
                  <div className="asym-overlay">
                    <span className="asym-tag">Fine Diamond Rings</span>
                    <h3 className="asym-title">Diamond Radiance</h3>
                    <span className="asym-link">
                      Take out <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom: Antique Silver / Bangles */}
            {silverProduct && (
              <div onClick={() => setSelectedProduct(silverProduct)}>
                <div className="asym-card small">
                  <img 
                    src={silverImage} 
                    alt={silverProduct?.title || "Antique Silver"} 
                    className="asym-image"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/bangles.png';
                    }}
                  />
                  <div className="asym-overlay">
                    <span className="asym-tag">Traditional Ornaments</span>
                    <h3 className="asym-title">{silverProduct.purity === 'silver' ? 'Antique Silver' : 'Heritage Bangles'}</h3>
                    <span className="asym-link">
                      Take out <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ==========================================
           SECTION 2: ALL PRODUCTS BROWSER CATALOG
           ========================================== */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="label-caps" style={{ color: 'var(--color-accent-gold)', marginBottom: '12px', display: 'block' }}>Exclusive Gallery Curation</span>
          <h3 className="headline-sm">Browse Catalog</h3>
          <div style={{ width: '40px', height: '1px', backgroundColor: 'var(--color-accent-gold)', margin: '16px auto 0' }}></div>
        </div>

        {/* Category Tabs */}
        <div className="filter-tabs-container">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`filter-tab ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Product Cards */}
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-secondary)' }}>
            <p className="body-lg">New designs are currently being added.</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map(product => {
              const price = calculatePrice(product);
              return (
                <div 
                  className="product-card" 
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="product-image-container">
                    <img 
                      src={product.imageUrl} 
                      alt={product.title} 
                      className="product-image"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600';
                      }}
                    />
                  </div>
                  <div className="product-category">{getPurityLabel(product.purity)}</div>
                  <h3 className="product-title">{product.title}</h3>
                  <div className="product-price">
                    {formatCurrency(price)}*
                    <span className="label-caps" style={{ fontSize: '9px', color: 'var(--color-text-secondary)', letterSpacing: '0.05em', fontWeight: 'normal', display: 'block', marginTop: '4px' }}>
                      (Incl. 3% GST)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedProduct(null)}>
              <X size={24} />
            </button>
            
            {/* Modal Image */}
            <div className="modal-image-wrap">
              <img 
                src={selectedProduct.imageUrl} 
                alt={selectedProduct.title} 
                className="modal-image"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600';
                }}
              />
            </div>

            {/* Modal Specifications */}
            <div className="modal-details-wrap">
              <span className="modal-category label-caps">{selectedProduct.itemCode}</span>
              <h2 className="headline-md modal-title" style={{ fontSize: '28px', marginBottom: '16px' }}>{selectedProduct.title}</h2>
              
              {/* Luxury Metrics Grid */}
              <div className="spec-metrics-grid">
                <div className="spec-metric-card">
                  <div className="spec-metric-label">Net Weight</div>
                  <div className="spec-metric-value">{selectedProduct.weight.toFixed(2)} g</div>
                </div>
                <div className="spec-metric-card">
                  <div className="spec-metric-label">Making Charge</div>
                  <div className="spec-metric-value">{selectedProduct.makingCharge}%</div>
                </div>
                <div className="spec-metric-card">
                  <div className="spec-metric-label">Metal Purity</div>
                  <div className="spec-metric-value" style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>
                    {selectedProduct.purity === 'gold22k' ? '22K Gold' : selectedProduct.purity === 'gold18k' ? '18K Gold' : 'Fine Silver'}
                  </div>
                </div>
              </div>

              {/* Dynamic Price Breakdown Receipt */}
              {(() => {
                const breakdown = getPriceBreakdown(selectedProduct);
                const ratePerGram = selectedProduct.purity === 'gold22k' 
                  ? rates.gold22k / 10 
                  : selectedProduct.purity === 'gold18k' 
                  ? rates.gold18k / 10 
                  : rates.silver / 1000;
                
                return (
                  <div className="luxury-receipt-breakdown">
                    <span className="label-caps" style={{ color: 'var(--color-accent-gold)', display: 'block', marginBottom: '16px', fontSize: '10px' }}>
                      Investment Price Breakdown
                    </span>
                    
                    <div className="luxury-receipt-row">
                      <span>Metal Value ({selectedProduct.weight.toFixed(2)}g):</span>
                      <span style={{ color: 'var(--color-text-primary)' }}>{formatCurrency(breakdown.baseValue)}</span>
                    </div>
                    
                    <div className="luxury-receipt-row">
                      <span>Making Charges ({selectedProduct.makingCharge}%):</span>
                      <span style={{ color: 'var(--color-text-primary)' }}>{formatCurrency(breakdown.makingCharges)}</span>
                    </div>
                    
                    <div className="luxury-receipt-row">
                      <span>GST (3%):</span>
                      <span style={{ color: 'var(--color-text-primary)' }}>{formatCurrency(breakdown.gst)}</span>
                    </div>
                    
                    <div className="luxury-receipt-row total-row">
                      <span>Estimated Total Price:</span>
                      <span>{formatCurrency(breakdown.total)}*</span>
                    </div>

                    <span className="transparency-note">
                      Calculated at daily rate of ₹{ratePerGram.toLocaleString('en-IN')}/gram for {selectedProduct.purity === 'gold22k' ? '22K Gold' : selectedProduct.purity === 'gold18k' ? '18K Gold' : 'Silver'}.
                    </span>
                  </div>
                );
              })()}

              <p className="modal-description" style={{ marginTop: 0, marginBottom: '24px' }}>
                {selectedProduct.description || "A masterfully handcrafted heirloom piece from our signature range, carrying the certificate of authenticity and hallmarking of Shree Aradhna Jewellers."}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button 
                  className="btn-primary" 
                  onClick={() => handleWhatsAppInquiry(selectedProduct)}
                  style={{ width: '100%', gap: '10px' }}
                >
                  <MessageCircle size={18} /> Inquire on WhatsApp
                </button>

                {onRequestConsultation && (
                  <button 
                    className="btn-secondary" 
                    onClick={() => {
                      if (onRequestConsultation) {
                        onRequestConsultation(selectedProduct);
                      }
                    }}
                    style={{ width: '100%', border: '1px solid rgba(229, 197, 144, 0.3)', color: 'var(--color-accent-gold)' }}
                  >
                    Request Video Call Consultation
                  </button>
                )}
              </div>
              
              <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textAlign: 'center', marginTop: '16px', display: 'block' }}>
                * Prices calculated dynamically with today's live bullion rates.
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
