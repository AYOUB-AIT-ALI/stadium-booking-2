import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useLang } from '../context/LanguageContext';

interface ReportsProps {
  settings: any;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

const cardStyle: React.CSSProperties = {
  background: '#ffffff',
  borderRadius: 14,
  padding: 20,
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  border: '1px solid #e8edf2',
};

function Reports({ settings }: ReportsProps) {
  const { t } = useLang();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, [year, month]);

  const loadReport = async () => {
    setLoading(true);
    try {
      const res = await window.electronAPI.getMonthlyReport(year, month);
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Report error:', err);
    }
    setLoading(false);
  };

  const monthNames = lang === 'fr'
    ? ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
    : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8', fontSize: 14 }}>{t('history.loading')}</div>;
  }

  if (!data) {
    return <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8', fontSize: 14 }}>{t('reports.noData')}</div>;
  }

  const topClientsData = data.topClients?.map((c: any) => ({ name: c.name, value: c.count })) || [];
  const popularSlotsData = data.popularSlots?.map((s: any) => ({ name: `${s.slot}`, value: s.count })) || [];

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 20, color: '#0f172a' }}>{t('reports.title')}</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <select
          value={month}
          onChange={(e) => setMonth(parseInt(e.target.value))}
          style={{
            padding: '9px 14px',
            border: '1.5px solid #e2e8f0',
            borderRadius: 10,
            fontSize: 13,
            outline: 'none',
            background: '#ffffff',
          }}
        >
          {monthNames.map((name, i) => (
            <option key={i} value={i + 1}>{name}</option>
          ))}
        </select>
        <select
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          style={{
            padding: '9px 14px',
            border: '1.5px solid #e2e8f0',
            borderRadius: 10,
            fontSize: 13,
            outline: 'none',
            background: '#ffffff',
          }}
        >
          {[year - 2, year - 1, year, year + 1].map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 18 }}>
        <div style={cardStyle}>
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>{t('reports.totalRevenue')}</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#059669' }}>
            DHs {data.totalRevenue?.toFixed(2) || '0.00'}
          </div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>{t('reports.totalBookings')}</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#0f172a' }}>{data.totalBookings || 0}</div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>{t('reports.uniqueClients')}</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#2563eb' }}>{data.uniqueClients || 0}</div>
        </div>
      </div>

      <div style={{ ...cardStyle, marginBottom: 18 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>{t('reports.dailyRevenue')}</div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.dailyRevenue || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value: number) => [`${value.toFixed(2)} DHs`, t('reports.revenue')]} />
            <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
        <div style={cardStyle}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>{t('reports.topClients')}</div>
          {topClientsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={topClientsData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {topClientsData.map((_: any, i: number) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8', fontSize: 13 }}>{t('reports.noData')}</div>
          )}
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>{t('reports.popularSlots')}</div>
          {popularSlotsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={popularSlotsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8', fontSize: 13 }}>{t('reports.noData')}</div>
          )}
        </div>
      </div>

      <div style={cardStyle}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>{t('reports.allBookings')}</div>
        {data.bookings?.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0' }}>{t('history.colBooking')}</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0' }}>{t('history.colClient')}</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0' }}>{t('history.colDate')}</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0' }}>{t('history.colTime')}</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0' }}>{t('history.colPrice')}</th>
              </tr>
            </thead>
            <tbody>
              {data.bookings.map((b: any, idx: number) => (
                <tr key={b.id} style={{ background: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                  <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{b.bookingNumber}</td>
                  <td style={{ padding: '10px 12px', fontSize: 13, color: '#1e293b' }}>{b.clientName}</td>
                  <td style={{ padding: '10px 12px', fontSize: 13, color: '#475569' }}>{new Date(b.date).toLocaleDateString()}</td>
                  <td style={{ padding: '10px 12px', fontSize: 13, color: '#475569' }}>{b.startTime} – {b.endTime}</td>
                  <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 700, color: '#059669' }}>DHs {b.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8', fontSize: 13 }}>{t('reports.noData')}</div>
        )}
      </div>
    </div>
  );
}

export default Reports;
