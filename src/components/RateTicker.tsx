import React from 'react';

interface Rates {
  gold22k: number;
  gold18k: number;
  silver: number;
  goldChange: 'up' | 'down';
  silverChange: 'up' | 'down';
}

interface RateTickerProps {
  rates: Rates;
}

export const RateTicker: React.FC<RateTickerProps> = ({ rates }) => {
  // Format numbers to Indian Rupees
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const tickerItems = [
    { name: 'GOLD 22K (10g)', value: formatCurrency(rates.gold22k), change: rates.goldChange },
    { name: 'GOLD 18K (10g)', value: formatCurrency(rates.gold18k), change: rates.goldChange },
    { name: 'SILVER (1kg)', value: formatCurrency(rates.silver), change: rates.silverChange },
    { name: 'STORE STATUS', value: 'OPEN FOR BOOKINGS', change: 'up' as const },
    { name: 'SECURE DELIVERY', value: 'INSURED SHIPPING NATIONWIDE', change: 'up' as const }
  ];

  // Repeat items to fill space for seamless loop animation
  const repeatedItems = [...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems];

  return (
    <div className="rate-ticker-wrap">
      <div className="rate-ticker-content label-caps">
        {repeatedItems.map((item, index) => (
          <div className="rate-item" key={index}>
            <span>{item.name}:</span>
            <span style={{ color: 'var(--color-text-primary)' }}>{item.value}</span>
            <span className={item.change === 'up' ? 'rate-up' : 'rate-down'}>
              {item.change === 'up' ? '▲' : '▼'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
