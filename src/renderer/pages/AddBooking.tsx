import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';

interface AddBookingProps {
  settings: any;
}

interface Slot {
  start: string;
  end: string;
  status: string;
  bookedBy?: string;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  border: '1.5px solid #e2e8f0',
  borderRadius: 10,
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
  background: '#ffffff',
  transition: 'border-color 0.15s',
};

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: '#334155',
  marginBottom: 6,
  display: 'block',
};

function AddBooking({ settings }: AddBookingProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLang();
  const prefill = (location.state as any) || {};

  const [clientName, setClientName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState(prefill.prefillDate || new Date().toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState(prefill.prefillStart || '');
  const [endTime, setEndTime] = useState(prefill.prefillEnd || '');
  const [price, setPrice] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSlots();
  }, [date]);

  useEffect(() => {
    if (startTime) {
      const slot = slots.find((s) => s.start === startTime);
      if (slot) setEndTime(slot.end);
    }
  }, [startTime, slots]);

  const loadSlots = async () => {
    const res = await window.electronAPI.getSlotsForDate(date);
    if (res.success) setSlots(res.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!clientName || !phone || !date || !startTime) {
      setError(t('addBooking.requiredFields'));
      return;
    }
    setLoading(true);
    const res = await window.electronAPI.createBooking({
      clientName,
      clientPhone: phone,
      date,
      startTime,
      endTime,
      price,
      paid,
      notes,
    });
    setLoading(false);
    if (res.success) {
      navigate('/today');
    } else {
      setError(res.error || 'Failed to create booking.');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 700, fontSize: 20, color: '#0f172a' }}>{t('addBooking.title')}</div>
        <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{t('addBooking.subtitle')}</div>
      </div>

      <div style={{
        background: '#ffffff',
        borderRadius: 16,
        padding: 28,
        boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
        border: '1px solid #e8edf2',
      }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>👤 {t('addBooking.clientName')} *</label>
            <input
              style={inputStyle}
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder={t('addBooking.placeholderClient')}
              onFocus={(e) => e.target.style.borderColor = '#10b981'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>📞 {t('addBooking.phone')} *</label>
            <input
              style={inputStyle}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t('addBooking.placeholderPhone')}
              onFocus={(e) => e.target.style.borderColor = '#10b981'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>📅 {t('addBooking.date')} *</label>
            <input
              type="date"
              style={inputStyle}
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setStartTime('');
                setEndTime('');
              }}
              onFocus={(e) => e.target.style.borderColor = '#10b981'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>⏰ {t('addBooking.startTime')} *</label>
            <select
              style={{ ...inputStyle, appearance: 'none', background: '#ffffff' }}
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              onFocus={(e) => e.target.style.borderColor = '#10b981'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            >
              <option value="">{t('addBooking.selectStart')}</option>
              {slots.map((slot, i) => (
                <option
                  key={i}
                  value={slot.start}
                  disabled={slot.status === 'booked' || slot.status === 'expired'}
                >
                  {slot.start} {slot.status === 'booked' ? `– ${t('addBooking.bookedBy')} ${slot.bookedBy}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>🔚 {t('addBooking.endTime')}</label>
            <input
              style={{ ...inputStyle, background: '#f8fafc', color: '#64748b', cursor: 'default' }}
              value={endTime}
              readOnly
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>💰 {t('addBooking.price')} *</label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: 14,
                color: '#64748b',
                fontWeight: 600,
              }}>DHs</span>
              <input
                type="number"
                step="0.01"
                style={{ ...inputStyle, paddingLeft: 48 }}
                value={price || ''}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>📝 {t('addBooking.notes')}</label>
            <textarea
              style={{ ...inputStyle, resize: 'vertical', minHeight: 80, fontFamily: 'inherit' }}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('addBooking.placeholderNotes')}
              onFocus={(e) => e.target.style.borderColor = '#10b981'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '8px 0' }}>
              <div style={{
                width: 20,
                height: 20,
                borderRadius: 5,
                border: paid ? '2px solid #10b981' : '2px solid #cbd5e1',
                background: paid ? '#10b981' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s',
              }}>
                {paid && <span style={{ color: '#ffffff', fontSize: 12, fontWeight: 700 }}>✓</span>}
              </div>
              <input
                type="checkbox"
                checked={paid}
                onChange={(e) => setPaid(e.target.checked)}
                style={{ display: 'none' }}
              />
              <span style={{ fontSize: 14, color: '#334155', fontWeight: 500 }}>{t('addBooking.markAsPaid')}</span>
            </label>
          </div>

          {error && (
            <div style={{
              color: '#dc2626',
              fontSize: 13,
              marginBottom: 16,
              padding: '10px 14px',
              background: '#fef2f2',
              borderRadius: 8,
              border: '1px solid #fecaca',
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button
              type="button"
              onClick={() => navigate('/today')}
              style={{
                padding: '11px 24px',
                border: '1.5px solid #e2e8f0',
                borderRadius: 9999,
                background: '#ffffff',
                color: '#475569',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; }}
            >
              {t('addBooking.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '11px 28px',
                border: 'none',
                borderRadius: 9999,
                background: loading ? '#94a3b8' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                fontSize: 14,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 3px 10px rgba(16,185,129,0.3)',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 5px 16px rgba(16,185,129,0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 3px 10px rgba(16,185,129,0.3)';
                }
              }}
            >
              {loading ? t('addBooking.creating') : t('addBooking.create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBooking;
