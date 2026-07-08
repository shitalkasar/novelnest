import React from 'react';
import { Sparkles, BookOpen } from 'lucide-react';

const Hero = () => {
  return (
    <div style={{
      position: 'relative',
      margin: '24px',
      padding: '48px 32px',
      borderRadius: '24px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: '16px',
      background: 'rgba(18, 20, 36, 0.4)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      boxShadow: 'var(--shadow-lg)'
    }}>
      {/* Decorative Glow Blobs */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '20%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0) 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '15%',
        width: '350px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0) 70%)',
        filter: 'blur(50px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Hero Content */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        maxWidth: '700px'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(139, 92, 246, 0.12)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          padding: '6px 14px',
          borderRadius: '9999px',
          color: 'var(--primary-hover)',
          fontSize: '0.85rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '8px'
        }}>
          <Sparkles size={14} />
          Welcome to NovelNest E-Store
        </div>

        <h2 style={{
          fontSize: '2.8rem',
          fontWeight: 800,
          lineHeight: 1.15,
          color: '#ffffff',
          letterSpacing: '-0.03em'
        }}>
          Find Your Next Great{' '}
          <span style={{
            background: 'linear-gradient(135deg, #a78bfa 0%, #10b981 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Adventure</span> Here.
        </h2>

        <p style={{
          fontSize: '1.05rem',
          color: 'var(--text-muted)',
          lineHeight: '1.6',
          marginTop: '8px'
        }}>
          Explore our handpicked curation of bestsellers, legendary classics, mind-bending sci-fi, and inspiring biographies. Order instantly with Cash on Delivery payment.
        </p>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          marginTop: '16px',
          color: 'var(--text-muted)',
          fontSize: '0.85rem'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--secondary)' }}></span>
            Fast Delivery
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }}></span>
            Cash on Delivery Support
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)' }}></span>
            24/7 Service
          </span>
        </div>
      </div>
    </div>
  );
};

export default Hero;
