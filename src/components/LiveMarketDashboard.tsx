import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Rates {
  gold22k: number;
  gold18k: number;
  silver: number;
  goldChange: 'up' | 'down';
  silverChange: 'up' | 'down';
  gold22kDiff?: number;
  gold22kPct?: number;
  gold18kDiff?: number;
  gold18kPct?: number;
  silverDiff?: number;
  silverPct?: number;
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

  // Calculate actual change details based on the rates history/differences
  const getChangeDetails = (metal: 'gold22k' | 'gold18k' | 'silver') => {
    const diff = (rates[`${metal}Diff` as keyof Rates] as number) ?? 0;
    const pct = (rates[`${metal}Pct` as keyof Rates] as number) ?? 0;
    const isUp = diff > 0;
    const isDown = diff < 0;
    const sign = isUp ? '+' : (isDown ? '-' : '');
    const absVal = Math.abs(diff);
    const absText = `${sign}₹${new Intl.NumberFormat('en-IN').format(absVal)}`;
    const pctText = `${sign}${Math.abs(pct).toFixed(2)}%`;
    const color = isUp ? '#518e78' : (isDown ? '#ffb4ab' : 'var(--color-accent-gold)');
    
    let path = 'M0,15 L80,15';
    if (isUp) {
      if (metal === 'gold22k') path = 'M0,20 Q20,12 40,18 T80,5';
      else if (metal === 'gold18k') path = 'M0,20 Q20,15 40,16 T80,5';
      else path = 'M0,18 Q20,8 40,14 T80,4';
    } else if (isDown) {
      if (metal === 'gold22k') path = 'M0,5 Q20,18 40,12 T80,25';
      else if (metal === 'gold18k') path = 'M0,5 Q20,16 40,15 T80,25';
      else path = 'M0,4 Q20,14 40,8 T80,22';
    }

    return { abs: absText, pct: pctText, color, path, isUp, isDown };
  };

  const g22Info = getChangeDetails('gold22k');
  const g18Info = getChangeDetails('gold18k');
  const silverInfo = getChangeDetails('silver');

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
              {g22Info.isUp && <TrendingUp size={14} />}
              {g22Info.isDown && <TrendingDown size={14} />}
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
              {g18Info.isUp && <TrendingUp size={14} />}
              {g18Info.isDown && <TrendingDown size={14} />}
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
              {silverInfo.isUp && <TrendingUp size={14} />}
              {silverInfo.isDown && <TrendingDown size={14} />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
