import React, { useState, useEffect } from 'react';
import { useLang } from '../context/LanguageContext';

interface ReportsProps {
  settings: any;
}

function Reports({ settings }: ReportsProps) {
  const { t, lang } = useLang();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const now = new Date();
        const res = await window.electronAPI.getMonthlyReport(now.getFullYear(), now.getMonth() + 1);
        if (res.success) setData(res.data);
        else setError(res.error || 'Failed');
      } catch (err: any) {
        setError(err.message || 'Error');
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>Loading...</div>;
  if (error) return <div style={{ padding: 60, textAlign: 'center', color: '#dc2626' }}>Error: {error}</div>;
  if (!data) return <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>No data</div>;

  return (
    <div>
      <div style={{ marginBottom: 20, fontWeight: 700, fontSize: 20, color: '#0f172a' }}>
        {t('reports.title')}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 18 }}>
        <div style={{ background: '#fff', borderRadius: 14, padding: 20, border: '1px solid #e8edf2' }}>
          <div style={{ fontSize: 12, color: '#64748b' }}>{t('reports.totalRevenue')}</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#059669' }}>DHs {data.totalRevenue?.toFixed(2)}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 14, padding: 20, border: '1px solid #e8edf2' }}>
          <div style={{ fontSize: 12, color: '#64748b' }}>{t('reports.totalBookings')}</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#0f172a' }}>{data.totalBookings}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 14, padding: 20, border: '1px solid #e8edf2' }}>
          <div style={{ fontSize: 12, color: '#64748b' }}>{t('reports.uniqueClients')}</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#2563eb' }}>{data.uniqueClients}</div>
        </div>
      </div>
      <div style={{ background: '#fff', borderRadius: 14, padding: 20, border: '1px solid #e8edf2' }}>
        <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>{t('reports.dailyRevenue')}</div>
        {(data.dailyRevenue || []).length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>{t('reports.noData')}</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={th}>Date</th>
                <th style={th}>Revenue (DHs)</th>
              </tr>
            </thead>
            <tbody>
              {data.dailyRevenue.map((d: any, i: number) => (
                <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                  <td style={td}>{d.date}</td>
                  <td style={td}>{d.revenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const th: React.CSSProperties = {
  padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700,
  color: '#64748b', textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0',
};
const td: React.CSSProperties = {
  padding: '10px 12px', fontSize: 13, color: '#475569',
};

export default Reports;
