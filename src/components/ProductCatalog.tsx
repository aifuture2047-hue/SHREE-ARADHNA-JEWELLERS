import React, { useState } from 'react';
import { X, MessageCircle } from 'lucide-react';
import { getImageUrl } from '../lib/supabase';

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
  rates: _rates, 
  onInquire, 
  onRequestConsultation
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAll, setShowAll] = useState(false);

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    setShowAll(false);
  };



  const getPurityLabel = (purity: 'gold22k' | 'gold18k' | 'silver') => {
    if (purity === 'gold22k') return '22K Gold';
    if (purity === 'gold18k') return '18K Gold';
    return 'Fine Silver';
  };



  const categories = [
    { id: 'all', name: 'All Collections' },
    { id: 'rings', name: 'Rings' },
    { id: 'necklaces', name: 'Necklaces' },
    { id: 'mangalsutra', name: 'Mangalsutras' },
    { id: 'earrings', name: 'Earrings' },
    { id: 'bangles', name: 'Bangles & Bracelets' }
  ];

  // Filter products for the detailed browser catalog below
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());

  const handleWhatsAppInquiry = (product: Product) => {
    onInquire(product);
    const phoneNumber = '918866882947'; // Official contact phone number
    const text = encodeURIComponent(
      `Hello New Gayatri Jewellers, I am interested in inquiring about the following piece from your collection:\n\n` +
      `Product: ${product.title}\n` +
      `Code: ${product.itemCode}\n` +
      `Weight: ${product.weight}g\n` +
      `Purity: ${getPurityLabel(product.purity)}\n` +
      `Making Charge: ${product.makingCharge}%\n\n` +
      `Please let me know its availability and the process to schedule an appointment. Thank you.`
    );
    window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${text}`, '_blank');
  };

  return (
    <section id="collections" className="section" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.03)' }}>
      <div className="container">
        
        {/* ==========================================
           ALL PRODUCTS BROWSER CATALOG
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
              onClick={() => handleCategoryChange(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Product Cards */}
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-secondary)' }}>
            <p className="body-lg">New designs are currently being added.</p>
          </div>
        ) : selectedCategory === 'all' ? (
          /* All Collections View: Show 5 products, rest on clicking View More */
          <div>
            <div className="products-grid">
              {(showAll ? products : products.slice(0, 5)).map(product => (
                <div 
                  className="product-card" 
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="product-image-container">
                    <img 
                      src={getImageUrl(product.imageUrl)} 
                      alt={product.title} 
                      className="product-image"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600';
                      }}
                    />
                  </div>
                  <div className="product-category">{getPurityLabel(product.purity)}</div>
                  <h3 className="product-title">{product.title}</h3>
                  <div className="product-specs-summary" style={{ marginTop: '10px', fontSize: '11px', color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left', borderTop: '1px solid rgba(229,197,144,0.08)', paddingTop: '10px' }}>
                    <div><span style={{ color: 'var(--color-accent-gold)' }}>Weight:</span> {product.weight.toFixed(2)}g</div>
                    <div><span style={{ color: 'var(--color-accent-gold)' }}>Making:</span> {product.makingCharge}%</div>
                    <div><span style={{ color: 'var(--color-accent-gold)' }}>Purity:</span> {product.purity === 'gold22k' ? '22K Gold' : product.purity === 'gold18k' ? '18K Gold' : 'Fine Silver'}</div>
                  </div>
                </div>
              ))}
            </div>

            {products.length > 5 && (
              <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <button 
                  className="btn-curator primary" 
                  onClick={() => {
                    if (!showAll) {
                      setShowAll(true);
                    } else {
                      setShowAll(false);
                      document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  style={{ minWidth: '180px' }}
                >
                  {showAll ? 'View Less' : `View More Designs (${products.length - 5} +)`}
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Single Selected Category View */
          <div>
            {filteredProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-secondary)' }}>
                <p className="body-lg">No designs in this category currently.</p>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {(showAll ? filteredProducts : filteredProducts.slice(0, 3)).map(product => {
                    return (
                      <div 
                        className="product-card" 
                        key={product.id}
                        onClick={() => setSelectedProduct(product)}
                      >
                        <div className="product-image-container">
                          <img 
                            src={getImageUrl(product.imageUrl)} 
                            alt={product.title} 
                            className="product-image"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600';
                            }}
                          />
                        </div>
                        <div className="product-category">{getPurityLabel(product.purity)}</div>
                        <h3 className="product-title">{product.title}</h3>
                        <div className="product-specs-summary" style={{ marginTop: '10px', fontSize: '11px', color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left', borderTop: '1px solid rgba(229,197,144,0.08)', paddingTop: '10px' }}>
                          <div><span style={{ color: 'var(--color-accent-gold)' }}>Weight:</span> {product.weight.toFixed(2)}g</div>
                          <div><span style={{ color: 'var(--color-accent-gold)' }}>Making:</span> {product.makingCharge}%</div>
                          <div><span style={{ color: 'var(--color-accent-gold)' }}>Purity:</span> {product.purity === 'gold22k' ? '22K Gold' : product.purity === 'gold18k' ? '18K Gold' : 'Fine Silver'}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filteredProducts.length > 3 && (
                  <div style={{ textAlign: 'center', marginTop: '40px' }}>
                    <button 
                      className="btn-curator primary" 
                      onClick={() => {
                        if (!showAll) {
                          setShowAll(true);
                        } else {
                          setShowAll(false);
                          document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      style={{ minWidth: '180px' }}
                    >
                      {showAll ? 'View Less' : `View More Designs (${filteredProducts.length - 3} +)`}
                    </button>
                  </div>
                )}
              </>
            )}
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
                src={getImageUrl(selectedProduct.imageUrl)} 
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

              <p className="modal-description" style={{ marginTop: '24px', marginBottom: '24px' }}>
                {selectedProduct.description || "A masterfully handcrafted heirloom piece from our signature range, carrying the certificate of authenticity and hallmarking of New Gayatri Jewellers."}
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
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
