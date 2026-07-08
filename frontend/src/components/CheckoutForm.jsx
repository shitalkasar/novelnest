import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { ArrowLeft, CheckCircle, Package, Receipt, Phone, MapPin, User, Mail, DollarSign } from 'lucide-react';

const CheckoutForm = ({ onBack, totalAmount }) => {
  const { placeOrder } = useContext(AppContext);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });

  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState(null); // stores order details on success

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim() || 
        !formData.address.trim() || !formData.city.trim() || !formData.postalCode.trim()) {
      alert('Please fill out all fields');
      return;
    }

    setLoading(true);
    const res = await placeOrder(formData);
    setLoading(false);

    if (res.success) {
      setOrderResult(res.order);
    }
  };

  // If order was successfully completed, show success screen
  if (orderResult) {
    return (
      <div 
        className="anim-fade"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '20px 0',
          gap: '20px'
        }}
      >
        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          padding: '20px',
          borderRadius: '50%',
          color: 'var(--secondary)',
          boxShadow: '0 0 20px var(--secondary-glow)',
          animation: 'slideUp 0.4s ease'
        }}>
          <CheckCircle size={52} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff' }}>Order Confirmed!</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Thank you for shopping at NovelNest.</p>
        </div>

        {/* Invoice Summary Box */}
        <div style={{
          width: '100%',
          background: 'rgba(255, 255, 255, 0.01)',
          border: '1px solid rgba(255, 255, 255, 0.03)',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          textAlign: 'left',
          fontSize: '0.85rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '8px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Order ID:</span>
            <span style={{ fontWeight: 700, color: 'var(--primary-hover)' }}>{orderResult.orderNumber}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Payment Method:</span>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Cash On Delivery (COD)</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Deliver To:</span>
            <span style={{ fontWeight: 600, color: 'var(--text-main)', textAlign: 'right' }}>
              {orderResult.shippingDetails.fullName}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '8px', fontSize: '0.95rem' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>Total Amount Paid:</span>
            <span style={{ fontWeight: 800, color: 'var(--secondary)' }}>${orderResult.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          background: 'rgba(139, 92, 246, 0.05)',
          padding: '12px',
          borderRadius: '8px',
          border: '1px solid rgba(139, 92, 246, 0.1)',
          width: '100%',
          textAlign: 'left'
        }}>
          <Package size={20} color="var(--primary-hover)" />
          <span>Your books will be packed and shipped. Prepare cash for delivery verification!</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Back button */}
      <button 
        type="button" 
        onClick={onBack}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--primary-hover)',
          fontSize: '0.85rem',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 0',
          width: 'fit-content'
        }}
      >
        <ArrowLeft size={16} />
        Back to Cart
      </button>

      {/* Form Fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontWeight: 500 }}>
            Full Name
          </label>
          <div style={{ position: 'relative' }}>
            <User size={16} color="#6b7280" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              name="fullName"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
              className="glass-input"
              style={{ paddingLeft: '38px' }}
              required
            />
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontWeight: 500 }}>
            Email Address
          </label>
          <div style={{ position: 'relative' }}>
            <Mail size={16} color="#6b7280" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              className="glass-input"
              style={{ paddingLeft: '38px' }}
              required
            />
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontWeight: 500 }}>
            Phone Number
          </label>
          <div style={{ position: 'relative' }}>
            <Phone size={16} color="#6b7280" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="tel"
              name="phone"
              placeholder="+1 555-0199"
              value={formData.phone}
              onChange={handleChange}
              className="glass-input"
              style={{ paddingLeft: '38px' }}
              required
            />
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontWeight: 500 }}>
            Shipping Address
          </label>
          <div style={{ position: 'relative' }}>
            <MapPin size={16} color="#6b7280" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              name="address"
              placeholder="123 Main St"
              value={formData.address}
              onChange={handleChange}
              className="glass-input"
              style={{ paddingLeft: '38px' }}
              required
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontWeight: 500 }}>
              City
            </label>
            <input
              type="text"
              name="city"
              placeholder="New York"
              value={formData.city}
              onChange={handleChange}
              className="glass-input"
              required
            />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontWeight: 500 }}>
              Postal Code
            </label>
            <input
              type="text"
              name="postalCode"
              placeholder="10001"
              value={formData.postalCode}
              onChange={handleChange}
              className="glass-input"
              required
            />
          </div>
        </div>
      </div>

      {/* Payment Selection Indicator */}
      <div style={{
        background: 'rgba(16, 185, 129, 0.05)',
        border: '1px solid rgba(16, 185, 129, 0.15)',
        padding: '16px',
        borderRadius: '12px',
        marginTop: '8px'
      }}>
        <h5 style={{ color: '#ffffff', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <DollarSign size={16} color="var(--secondary)" />
          Payment Method
        </h5>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>Cash on Delivery (COD)</span>
          <span className="badge badge-instock" style={{ fontSize: '0.7rem' }}>Supported</span>
        </div>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.4 }}>
          No cards required. Hand over cash to our delivery executive when your books are dropped off.
        </p>
      </div>

      {/* Submit Button */}
      <button 
        type="submit" 
        className="btn btn-primary"
        disabled={loading}
        style={{
          width: '100%',
          height: '46px',
          fontSize: '0.95rem',
          marginTop: '12px',
          gap: '8px'
        }}
      >
        <Receipt size={16} />
        {loading ? 'Processing Order...' : `Confirm Order — $${totalAmount.toFixed(2)}`}
      </button>
    </form>
  );
};

export default CheckoutForm;
