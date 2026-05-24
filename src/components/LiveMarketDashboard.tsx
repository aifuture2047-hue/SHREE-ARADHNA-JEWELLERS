import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Rates {
  gold22k: number;
  gold18k: number;
  silver: number;
  goldChange: 'up' | 'down';
  silverChange: 'up' | 'down';
}

interface LiveMarketDashboardProps {
  rates: Rates;
}

export const LiveMarketDashboard: React.FC<LiveMarketDashboardProps> = ({ rates }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Mock fluctuation values based on the rate direction
  const getChangeDetails = (metal: 'gold22k' | 'gold18k' | 'silver', direction: 'up' | 'down') => {
    if (metal === 'gold22k') {
      return direction === 'up' 
        ? { abs: '+₹380', pct: '+0.57%', color: '#518e78', path: 'M0,20 Q20,12 40,18 T80,5' }
        : { abs: '-₹290', pct: '-0.43%', color: '#ffb4ab', path: 'M0,5 Q20,18 40,12 T80,25' };
    } else if (metal === 'gold18k') {
      return direction === 'up'
        ? { abs: '+₹310', pct: '+0.56%', color: '#518e78', path: 'M0,20 Q20,15 40,16 T80,5' }
        : { abs: '-₹240', pct: '-0.43%', color: '#ffb4ab', path: 'M0,5 Q20,16 40,15 T80,25' };
    } else {
      return direction === 'up'
        ? { abs: '+₹850', pct: '+1.02%', color: '#518e78', path: 'M0,18 Q20,8 40,14 T80,4' }
        : { abs: '-₹620', pct: '-0.73%', color: '#ffb4ab', path: 'M0,4 Q20,14 40,8 T80,22' };
    }
  };

  const g22Info = getChangeDetails('gold22k', rates.goldChange);
  const g18Info = getChangeDetails('gold18k', rates.goldChange);
  const silverInfo = getChangeDetails('silver', rates.silverChange);

  return (
    <section id="market-dashboard" className="section market-section">
      <div className="container">
        {/* Header */}
        <div className="market-header">
          <div>
            <span className="label-caps" style={{ color: 'var(--color-accent-gold)', marginBottom: '12px', display: 'block' }}>Real-time Rates</span>
            <h2 className="headline-md" style={{ marginBottom: '8px' }}>Live Market Dashboard</h2>
            <p className="body-md" style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
              Real-time gold and silver rates from the Choksi Bazar market.
            </p>
          </div>
          
          <div className="market-indicator label-caps">
            <span className="indicator-dot"></span>
            LIVE UPDATES ACTIVE
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="market-grid">
          {/* Card 1: Gold 22K */}
          <div className="market-card">
            {/* Sparkline Graphic */}
            <div className="market-sparkline-wrap">
              <svg width="80" height="30" viewBox="0 0 80 30">
                <path 
                  d={g22Info.path} 
                  className="sparkline-path"
                  stroke={g22Info.color}
                />
              </svg>
            </div>
            
            <div className="market-card-title label-caps">Gold 22K (10g)</div>
            <div className="market-card-value">
              {formatCurrency(rates.gold22k)} <span>/10g</span>
            </div>
            <div className="market-card-change" style={{ color: g22Info.color }}>
              <span>{g22Info.abs} ({g22Info.pct})</span>
              {rates.goldChange === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            </div>
          </div>

          {/* Card 2: Gold 18K */}
          <div className="market-card">
            {/* Sparkline Graphic */}
            <div className="market-sparkline-wrap">
              <svg width="80" height="30" viewBox="0 0 80 30">
                <path 
                  d={g18Info.path} 
                  className="sparkline-path"
                  stroke={g18Info.color}
                />
              </svg>
            </div>
            
            <div className="market-card-title label-caps">Gold 18K (10g)</div>
            <div className="market-card-value">
              {formatCurrency(rates.gold18k)} <span>/10g</span>
            </div>
            <div className="market-card-change" style={{ color: g18Info.color }}>
              <span>{g18Info.abs} ({g18Info.pct})</span>
              {rates.goldChange === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            </div>
          </div>

          {/* Card 3: Silver */}
          <div className="market-card">
            {/* Sparkline Graphic */}
            <div className="market-sparkline-wrap">
              <svg width="80" height="30" viewBox="0 0 80 30">
                <path 
                  d={silverInfo.path} 
                  className="sparkline-path"
                  stroke={silverInfo.color}
                />
              </svg>
            </div>
            
            <div className="market-card-title label-caps">Silver (1kg)</div>
            <div className="market-card-value">
              {formatCurrency(rates.silver)} <span>/1kg</span>
            </div>
            <div className="market-card-change" style={{ color: silverInfo.color }}>
              <span>{silverInfo.abs} ({silverInfo.pct})</span>
              {rates.silverChange === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
