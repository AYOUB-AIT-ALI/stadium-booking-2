import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  settings: any;
}

const navItems = [
  { path: '/today', label: 'Today', icon: '📅' },
  { path: '/add-booking', label: 'Add Booking', icon: '➕' },
  { path: '/bookings', label: 'History', icon: '📋' },
  { path: '/reports', label: 'Reports', icon: '📊' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
];

function Layout({ children, settings }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      background: '#f0f4f8',
      overflow: 'hidden',
    }}>
      <aside
        style={{
          width: 240,
          minWidth: 240,
          background: 'linear-gradient(180deg, #0a2a1a 0%, #0f3d25 100%)',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          boxShadow: '2px 0 12px rgba(0,0,0,0.08)',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div style={{
          padding: '28px 20px 24px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ color: '#ffffff', fontWeight: 700, fontSize: 16, letterSpacing: '0.3px' }}>
            ⚽ Stadium Booking
          </div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 2 }}>
            Premium Edition
          </div>
        </div>

        <nav style={{ flex: 1, padding: '16px 10px', overflowY: 'auto' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  width: '100%',
                  padding: '11px 14px',
                  marginBottom: 4,
                  border: 'none',
                  borderRadius: 10,
                  background: isActive
                    ? 'rgba(16, 185, 129, 0.2)'
                    : 'transparent',
                  color: isActive ? '#10b981' : 'rgba(255,255,255,0.55)',
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 400,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backdropFilter: isActive ? 'blur(4px)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.color = '#ffffff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.55)';
                  }
                }}
              >
                <span style={{ fontSize: 18, lineHeight: 1 }}>{item.icon}</span>
                <span>{item.label}</span>
                {isActive && (
                  <span style={{
                    marginLeft: 'auto',
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#10b981',
                  }} />
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        background: '#f0f4f8',
      }}>
        <header style={{
          padding: '20px 28px 0 28px',
          background: '#f0f4f8',
          flexShrink: 0,
        }}>
          <div style={{ fontWeight: 700, fontSize: 22, color: '#0f172a' }}>
            {settings?.name || 'City Football Stadium'}
          </div>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 20, marginTop: 2 }}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </header>

        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '0 28px 28px 28px',
        }}>
          {children}
        </div>
      </main>
    </div>
  );
}

export default Layout;
