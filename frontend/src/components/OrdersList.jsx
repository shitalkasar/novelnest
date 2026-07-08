import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { ShoppingBag, ChevronDown, ChevronUp, Calendar, CreditCard, User, Phone, MapPin } from 'lucide-react';

const OrdersList = () => {
  const { orders, loading, setActiveView } = useContext(AppContext);
  const [expandedOrder, setExpandedOrder] = useState(null); // stores active orderId that is expanded

  const toggleExpand = (orderId) => {
    setExpandedOrder((prev) => (prev === orderId ? null : orderId));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="badge badge-lowstock">Pending</span>;
      case 'Processing':
        return <span className="badge badge-genre" style={{ color: '#60a5fa', background: 'rgba(96, 165, 250, 0.1)', borderColor: 'rgba(96, 165, 250, 0.2)' }}>Processing</span>;
      case 'Shipped':
        return <span className="badge badge-genre" style={{ color: '#c084fc', background: 'rgba(192, 132, 252, 0.1)', borderColor: 'rgba(192, 132, 252, 0.2)' }}>Shipped</span>;
      case 'Delivered':
        return <span className="badge badge-instock">Delivered</span>;
      case 'Cancelled':
        return <span className="badge badge-outstock">Cancelled</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0', color: 'var(--text-muted)' }}>
        <p style={{ fontSize: '1.1rem' }}>Loading orders log...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 24px',
        textAlign: 'center',
        gap: '16px'
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          padding: '24px',
          borderRadius: '50%',
          color: 'var(--text-muted)'
        }}>
          <ShoppingBag size={48} />
        </div>
        <h4 style={{ fontSize: '1.25rem', fontWeight: 700 }}>No orders found</h4>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '340px', lineHeight: 1.5 }}>
          You haven't placed any orders yet. Visit the catalog, add some items to your cart, and confirm checkout!
        </p>
        <button 
          onClick={() => setActiveView('store')}
          className="btn btn-primary"
          style={{ marginTop: '12px' }}
        >
          Explore Bookstore
        </button>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '900px',
      margin: '24px auto',
      padding: '0 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '8px'
      }}>
        <div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>Orders History</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Check and track all orders submitted via Cash on Delivery
          </p>
        </div>
        <span className="badge badge-genre" style={{ padding: '6px 14px' }}>
          {orders.length} total orders
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {orders.map((order) => {
          const isExpanded = expandedOrder === order._id;
          const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });

          return (
            <div 
              key={order._id}
              className="glass-panel"
              style={{
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                overflow: 'hidden',
                transition: 'border-color 0.2s ease'
              }}
            >
              {/* Card Header Summary */}
              <div 
                onClick={() => toggleExpand(order._id)}
                style={{
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '20px',
                  cursor: 'pointer',
                  flexWrap: 'wrap',
                  userSelect: 'none',
                  background: isExpanded ? 'rgba(255,255,255,0.01)' : 'transparent'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order Number</span>
                  <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary-hover)' }}>{order.orderNumber}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Placed On</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} color="var(--primary-hover)" />
                    {formattedDate}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Amount</span>
                  <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--secondary)' }}>${order.totalAmount.toFixed(2)}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {getStatusBadge(order.status)}
                  {isExpanded ? <ChevronUp size={18} color="var(--text-muted)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                </div>
              </div>

              {/* Card Expanded Detail Panel */}
              {isExpanded && (
                <div style={{
                  padding: '24px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.04)',
                  background: 'rgba(0, 0, 0, 0.15)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '24px'
                }}>
                  {/* Delivery & Billing Address */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <h5 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                      Delivery Details
                    </h5>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <User size={14} color="var(--text-muted)" />
                        <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{order.shippingDetails.fullName}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={14} color="var(--text-muted)" />
                        <span style={{ color: 'var(--text-main)' }}>{order.shippingDetails.email}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Phone size={14} color="var(--text-muted)" />
                        <span style={{ color: 'var(--text-main)' }}>{order.shippingDetails.phone}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '4px' }}>
                        <MapPin size={14} color="var(--text-muted)" style={{ marginTop: '2px' }} />
                        <span style={{ color: 'var(--text-main)', lineHeight: 1.4 }}>
                          {order.shippingDetails.address}, {order.shippingDetails.city} - {order.shippingDetails.postalCode}
                        </span>
                      </div>
                    </div>

                    <div style={{
                      marginTop: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: 'rgba(16, 185, 129, 0.05)',
                      border: '1px solid rgba(16, 185, 129, 0.1)',
                      fontSize: '0.75rem',
                      color: 'var(--secondary)'
                    }}>
                      <CreditCard size={14} />
                      <span>COD Payment Status: Collected upon delivery</span>
                    </div>
                  </div>

                  {/* Order Items List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <h5 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                      Ordered Books ({order.items.reduce((sum, item) => sum + item.quantity, 0)})
                    </h5>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {order.items.map((item, idx) => (
                        <div 
                          key={idx}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: 'rgba(255,255,255,0.01)',
                            border: '1px solid rgba(255,255,255,0.02)',
                            padding: '10px 14px',
                            borderRadius: '8px',
                            fontSize: '0.85rem'
                          }}
                        >
                          <div style={{ minWidth: 0, flex: 1, paddingRight: '12px' }}>
                            <div style={{ fontWeight: 600, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {item.title}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                              Qty: {item.quantity} × ${item.price.toFixed(2)}
                            </div>
                          </div>
                          <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersList;
