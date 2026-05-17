import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';

interface TodayProps {
  settings: any;
}

interface Slot {
  start: string;
  end: string;
  status: string;
  bookedBy?: string;
  price?: number;
  bookingId?: string;
}

function Today({ settings }: TodayProps) {
  const navigate = useNavigate();
  const { t } = useLang();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const selectedDate = new Date().toISOString().slice(0, 10);

  const loadSlots = useCallback(async () => {
    setLoading(true);
    const res = await window.electronAPI.getSlotsForDate(selectedDate);
    if (res.success) {
      setSlots(res.data);
    }
    setLoading(false);
  }, [selectedDate]);

  useEffect(() => {
    loadSlots();
    const timer = setInterval(loadSlots, 60000);
    return () => clearInterval(timer);
  }, [loadSlots]);

  const handleBookNow = (start: string, end: string) => {
    navigate('/add-booking', { state: { prefillDate: selectedDate, prefillStart: start, prefillEnd: end } });
  };

  const bookedSlots = slots.filter((s) => s.status === 'booked');
  const totalSlots = slots.length;
  const occupancy = totalSlots > 0 ? Math.round((bookedSlots.length / totalSlots) * 100) : 0;
  const totalRevenue = bookedSlots.reduce((sum, s) => sum + (s.price || 0), 0);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'booked': return '🔴';
      case 'expired': return '⏳';
      default: return '🟢';
    }
  };

  const getCardStyle = (status: string): React.CSSProperties => {
    const base: React.CSSProperties = {
      borderRadius: 14,
      padding: '18px 20px',
      transition: 'all 0.2s ease',
      cursor: status === 'available' ? 'pointer' : 'default',
    };

    switch (status) {
      case 'booked':
        return {
          ...base,
          background: 'linear-gradient(135deg, #fef2f2 0%, #fff5f5 100%)',
          border: '1px solid #fecaca',
          boxShadow: '0 2px 8px rgba(239,68,68,0.08)',
        };
      case 'expired':
        return {
          ...base,
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          border: '1px solid #e2e8f0',
          opacity: 0.75,
        };
      default:
        return {
          ...base,
          background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
          border: '1px solid #bbf7d0',
          boxShadow: '0 2px 8px rgba(16,185,129,0.08)',
        };
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 20, color: '#0f172a' }}>{t('today.title')}</div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 14,
        marginBottom: 24,
      }}>
        {[
          { label: `📋 ${t('today.bookingsToday')}`, value: bookedSlots.length, color: '#0f172a' },
          { label: `💰 ${t('today.revenueToday')}`, value: `DHs ${totalRevenue.toFixed(2)}`, color: '#059669' },
          { label: `📈 ${t('today.occupancy')}`, value: `${occupancy}%`, color: '#2563eb' },
        ].map((card, i) => (
          <div
            key={i}
            style={{
              background: '#ffffff',
              borderRadius: 14,
              padding: '18px 20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              border: '1px solid #e8edf2',
            }}
          >
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>{card.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: card.color }}>{card.value}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8', fontSize: 14 }}>
          {t('today.loading')}
        </div>
      ) : slots.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8', fontSize: 14 }}>
          {t('today.noSlots')}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 12,
        }}>
          {slots.map((slot, i) => (
            <div
              key={i}
              style={getCardStyle(slot.status)}
              onClick={() => slot.status === 'available' && handleBookNow(slot.start, slot.end)}
              onMouseEnter={(e) => {
                if (slot.status === 'available') {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(16,185,129,0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (slot.status === 'available') {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(16,185,129,0.08)';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16 }}>{getStatusIcon(slot.status)}</span>
                  <span style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>
                    {slot.start} – {slot.end}
                  </span>
                </div>
                {slot.status === 'available' && (
                  <span style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: '#ffffff',
                    background: '#10b981',
                    padding: '3px 10px',
                    borderRadius: 9999,
                  }}>
                    {t('today.available')}
                  </span>
                )}
                {slot.status === 'booked' && (
                  <span style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: '#ffffff',
                    background: '#ef4444',
                    padding: '3px 10px',
                    borderRadius: 9999,
                  }}>
                    {t('today.booked')}
                  </span>
                )}
                {slot.status === 'expired' && (
                  <span style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: '#94a3b8',
                    background: '#e2e8f0',
                    padding: '3px 10px',
                    borderRadius: 9999,
                  }}>
                    {t('today.expired')}
                  </span>
                )}
              </div>

              {slot.status === 'booked' && slot.bookedBy && (
                <div style={{ fontSize: 13, color: '#7f1d1d', marginBottom: 4 }}>
                  👤 {slot.bookedBy}
                </div>
              )}
              {slot.status === 'booked' && slot.price !== undefined && (
                <div style={{ fontSize: 15, fontWeight: 700, color: '#059669' }}>
                  DHs {slot.price.toFixed(2)}
                </div>
              )}

              {slot.status === 'available' && (
                <div style={{ marginTop: 8 }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookNow(slot.start, slot.end);
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: 9999,
                      padding: '8px 18px',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(16,185,129,0.3)',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.03)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(16,185,129,0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(16,185,129,0.3)';
                    }}
                  >
                    {t('today.bookNow')}
                  </button>
                </div>
              )}

              {slot.status === 'expired' && (
                <div style={{ fontSize: 11, color: '#94a3b8', fontStyle: 'italic', marginTop: 4 }}>
                    {t('today.slotPassed')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Today;
