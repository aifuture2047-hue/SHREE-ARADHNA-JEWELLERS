import React from 'react';
import { X } from 'lucide-react';

interface AnnouncementPopupProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  linkUrl?: string;
}

export const AnnouncementPopup: React.FC<AnnouncementPopupProps> = ({
  isOpen,
  onClose,
  imageUrl,
  linkUrl
}) => {
  if (!isOpen || !imageUrl) return null;

  const handleImageClick = () => {
    if (linkUrl) {
      window.open(linkUrl, '_blank');
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 11000 }}>
      <div 
        className="modal-content-card" 
        style={{ 
          maxWidth: '500px', 
          gridTemplateColumns: '1fr', 
          backgroundColor: '#0c0f0f', 
          border: '1px solid var(--color-accent-gold)',
          position: 'relative'
        }}
      >
        <button 
          className="modal-close-btn" 
          onClick={onClose}
          style={{ 
            top: '16px', 
            right: '16px',
            backgroundColor: 'rgba(12,15,15,0.7)',
            borderRadius: '50%',
            padding: '4px',
            color: 'var(--color-text-primary)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ padding: '0', display: 'flex', flexDirection: 'column' }}>
          <div 
            onClick={handleImageClick}
            style={{ 
              cursor: linkUrl ? 'pointer' : 'default',
              width: '100%',
              lineHeight: 0
            }}
          >
            <img 
              src={imageUrl} 
              alt="Exclusive Announcement" 
              style={{ 
                width: '100%', 
                height: 'auto', 
                objectFit: 'contain'
              }} 
            />
          </div>
          
          <div style={{ padding: '24px', textAlign: 'center', backgroundColor: '#121414', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
            <span className="label-caps" style={{ color: 'var(--color-accent-gold)', fontSize: '10px', display: 'block', marginBottom: '8px' }}>
              Special Invitation
            </span>
            <p className="body-md" style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
              Dismiss to browse our high-jewelry collection.
            </p>
            <button 
              className="btn-primary" 
              onClick={onClose}
              style={{ marginTop: '16px', padding: '10px 24px', fontSize: '10px' }}
            >
              Continue to Gallery
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
