import React, { useState, useEffect } from 'react';
import { useLang } from '../context/LanguageContext';

interface Booking {
  id: string;
  bookingNumber: string;
  clientName: string;
  clientPhone: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  paid: boolean;
  status: string;
  notes?: string;
}

const inputStyle: React.CSSProperties = {
  padding: '9px 12px',
  border: '1.5px solid #e2e8f0',
  borderRadius: 10,
  fontSize: 13,
  outline: 'none',
  background: '#ffffff',
  transition: 'border-color 0.15s',
};

function BookingHistory() {
  const { t } = useLang();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const loadBookings = async () => {
    setLoading(true);
    const filters: any = {};
    if (search) filters.search = search;
    if (dateFrom) filters.dateFrom = dateFrom;
    if (dateTo) filters.dateTo = dateTo;
    const res = await window.electronAPI.getBookings(filters);
    if (res.success) {
      setBookings(res.data);
    }
    setLoading(false);
  };

  useEffect(() => { loadBookings(); }, []);

  const handleDelete = async (booking: Booking) => {
    const confirmed = await window.electronAPI.confirm(
      t('history.deleteConfirm', booking.bookingNumber)
    );
    if (!confirmed) return;
    const res = await window.electronAPI.deleteBooking(booking.id);
    if (res.success) loadBookings();
  };

  const handleDownloadReceipt = async (id: string) => {
    await window.electronAPI.downloadReceipt(id);
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { bg: string; color: string }> = {
      confirmed: { bg: '#d1fae5', color: '#059669' },
      cancelled: { bg: '#fee2e2', color: '#dc2626' },
      completed: { bg: '#f3f4f6', color: '#6b7280' },
    };
    const s = map[status] || { bg: '#f3f4f6', color: '#6b7280' };
    return (
      <span style={{
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: 9999,
        fontSize: 11,
        fontWeight: 600,
        background: s.bg,
        color: s.color,
      }}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 20, color: '#0f172a' }}>{t('history.title')}</div>
        <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{t('history.subtitle')}</div>
      </div>

      <div style={{
        display: 'flex',
        gap: 10,
        marginBottom: 18,
        alignItems: 'center',
        flexWrap: 'wrap',
        background: '#ffffff',
        padding: 16,
        borderRadius: 14,
        border: '1px solid #e8edf2',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: '#94a3b8' }}>🔍</span>
          <input
            style={{ ...inputStyle, paddingLeft: 36, width: '100%' }}
            placeholder={t('history.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={(e) => e.target.style.borderColor = '#10b981'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>
        <input
          type="date"
          style={inputStyle}
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
        />
        <input
          type="date"
          style={inputStyle}
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
        />
        <button
          onClick={loadBookings}
          style={{
            padding: '9px 20px',
            border: 'none',
            borderRadius: 10,
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#ffffff',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(16,185,129,0.25)',
          }}
        >
          {t('history.search')}
        </button>
      </div>

      <div style={{
        background: '#ffffff',
        borderRadius: 14,
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        border: '1px solid #e8edf2',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['history.colBooking', 'history.colClient', 'history.colPhone', 'history.colDate', 'history.colTime', 'history.colPrice', 'history.colStatus', 'history.colActions'].map((key) => (
                  <th key={key} style={{
                    padding: '12px 14px',
                    textAlign: 'left',
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    borderBottom: '2px solid #e2e8f0',
                  }}>{t(key)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ padding: '40px 14px', textAlign: 'center', color: '#94a3b8' }}>{t('history.loading')}</td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '40px 14px', textAlign: 'center', color: '#94a3b8' }}>{t('history.noBookings')}</td>
                </tr>
              ) : (
                bookings.map((b, idx) => (
                  <tr
                    key={b.id}
                    style={{
                      background: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#f0fdf4'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = idx % 2 === 0 ? '#ffffff' : '#f8fafc'; }}
                  >
                    <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>
                      {b.bookingNumber}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: 13, color: '#1e293b' }}>{b.clientName}</td>
                    <td style={{ padding: '12px 14px', fontSize: 13, color: '#64748b' }}>{b.clientPhone}</td>
                    <td style={{ padding: '12px 14px', fontSize: 13, color: '#475569' }}>
                      {new Date(b.date).toLocaleDateString('en-US')}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: 13, color: '#475569' }}>
                      {b.startTime} – {b.endTime}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 700, color: '#059669' }}>
                      DHs {b.price.toFixed(2)}
                    </td>
                    <td style={{ padding: '12px 14px' }}>{getStatusBadge(b.status)}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => handleDelete(b)}
                          style={{
                            padding: '7px 10px',
                            border: 'none',
                            borderRadius: 8,
                            background: '#fef2f2',
                            color: '#dc2626',
                            fontSize: 15,
                            cursor: 'pointer',
                            transition: 'all 0.1s',
                          }}
                          title={t('history.deleteTitle')}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#fee2e2'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = '#fef2f2'; }}
                        >
                          🗑️
                        </button>
                        <button
                          onClick={() => handleDownloadReceipt(b.id)}
                          style={{
                            padding: '7px 10px',
                            border: 'none',
                            borderRadius: 8,
                            background: '#f0fdf4',
                            color: '#059669',
                            fontSize: 15,
                            cursor: 'pointer',
                            transition: 'all 0.1s',
                          }}
                          title={t('history.downloadTitle')}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#d1fae5'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = '#f0fdf4'; }}
                        >
                          📄
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default BookingHistory;
