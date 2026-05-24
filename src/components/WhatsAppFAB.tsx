import React from 'react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppFAB: React.FC = () => {
  const handleWhatsAppClick = () => {
    const phoneNumber = '918866882947'; // Official contact phone number
    const text = encodeURIComponent(
      "Hello New Gayatri Jewellers, I would like to inquire about your custom designs and heritage collections."
    );
    window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${text}`, '_blank');
  };

  return (
    <button 
      className="whatsapp-fab" 
      onClick={handleWhatsAppClick}
      aria-label="Contact on WhatsApp"
    >
      <MessageCircle size={26} />
    </button>
  );
};
