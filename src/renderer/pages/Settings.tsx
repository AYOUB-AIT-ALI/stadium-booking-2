import React, { useState, useEffect } from 'react';
import { useLang } from '../context/LanguageContext';

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

function Settings() {
  const { t, lang, setLang } = useLang();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [openTime, setOpenTime] = useState('08:00');
  const [closeTime, setCloseTime] = useState('23:00');
  const [slotUnit, setSlotUnit] = useState(60);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    const res = await window.electronAPI.getSettings();
    if (res.success && res.data) {
      setName(res.data.name || '');
      setPhone(res.data.phone || '');
      setAddress(res.data.address || '');
      setOpenTime(res.data.openTime || '08:00');
      setCloseTime(res.data.closeTime || '23:00');
      setSlotUnit(res.data.slotUnit || 60);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await window.electronAPI.updateSettings({ name, phone, address, openTime, closeTime, slotUnit });
    setSaving(false);
    if (res.success) {
      alert(t('settings.saved'));
    } else {
      alert(res.error || t('settings.failed'));
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>Loading...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 700, fontSize: 20, color: '#0f172a' }}>{t('settings.title')}</div>
        <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{t('settings.subtitle')}</div>
      </div>

      <div style={{
        background: '#ffffff',
        borderRadius: 16,
        padding: 28,
        boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
        border: '1px solid #e8edf2',
      }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{
            fontSize: 15,
            fontWeight: 700,
            color: '#0f172a',
            marginBottom: 16,
            paddingBottom: 12,
            borderBottom: '1px solid #e2e8f0',
          }}>🏟️ {t('settings.stadiumInfo')}</div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>{t('settings.stadiumName')}</label>
            <input
              style={inputStyle}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={(e) => e.target.style.borderColor = '#10b981'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>{t('settings.phone')}</label>
            <input
              style={inputStyle}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onFocus={(e) => e.target.style.borderColor = '#10b981'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>{t('settings.address')}</label>
            <textarea
              style={{ ...inputStyle, resize: 'vertical', minHeight: 70, fontFamily: 'inherit' }}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onFocus={(e) => e.target.style.borderColor = '#10b981'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{
            fontSize: 15,
            fontWeight: 700,
            color: '#0f172a',
            marginBottom: 16,
            paddingBottom: 12,
            borderBottom: '1px solid #e2e8f0',
          }}>⏰ {t('settings.operatingHours')}</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            <div>
              <label style={labelStyle}>{t('settings.openTime')}</label>
              <input
                type="time"
                style={inputStyle}
                value={openTime}
                onChange={(e) => setOpenTime(e.target.value)}
              />
            </div>
            <div>
              <label style={labelStyle}>{t('settings.closeTime')}</label>
              <input
                type="time"
                style={inputStyle}
                value={closeTime}
                onChange={(e) => setCloseTime(e.target.value)}
              />
            </div>
            <div>
              <label style={labelStyle}>{t('settings.slotUnit')}</label>
              <select
                style={inputStyle}
                value={slotUnit}
                onChange={(e) => setSlotUnit(parseInt(e.target.value))}
              >
                <option value={30}>30 min</option>
                <option value={60}>60 min</option>
                <option value={90}>90 min</option>
                <option value={120}>120 min</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{
            fontSize: 15,
            fontWeight: 700,
            color: '#0f172a',
            marginBottom: 16,
            paddingBottom: 12,
            borderBottom: '1px solid #e2e8f0',
          }}>🌐 {t('settings.language')}</div>

          <div>
            <label style={labelStyle}>{t('settings.languageLabel')}</label>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setLang('en')}
                style={{
                  flex: 1,
                  padding: '11px 14px',
                  border: lang === 'en' ? '2px solid #10b981' : '1.5px solid #e2e8f0',
                  borderRadius: 10,
                  background: lang === 'en' ? '#f0fdf4' : '#ffffff',
                  color: lang === 'en' ? '#059669' : '#475569',
                  fontSize: 14,
                  fontWeight: lang === 'en' ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                🇬🇧 English
              </button>
              <button
                onClick={() => setLang('fr')}
                style={{
                  flex: 1,
                  padding: '11px 14px',
                  border: lang === 'fr' ? '2px solid #10b981' : '1.5px solid #e2e8f0',
                  borderRadius: 10,
                  background: lang === 'fr' ? '#f0fdf4' : '#ffffff',
                  color: lang === 'fr' ? '#059669' : '#475569',
                  fontSize: 14,
                  fontWeight: lang === 'fr' ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                🇫🇷 Français
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: '11px 32px',
              border: 'none',
              borderRadius: 9999,
              background: saving ? '#94a3b8' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              fontSize: 14,
              fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer',
              boxShadow: saving ? 'none' : '0 3px 10px rgba(16,185,129,0.3)',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              if (!saving) {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 5px 16px rgba(16,185,129,0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!saving) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 3px 10px rgba(16,185,129,0.3)';
              }
            }}
          >
            {saving ? t('settings.saving') : t('settings.save')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
