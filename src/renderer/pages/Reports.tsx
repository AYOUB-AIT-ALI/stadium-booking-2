import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Spin, Empty, Select } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface ReportsProps {
  settings: any;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

function Reports({ settings }: ReportsProps) {
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
    const res = await window.electronAPI.getMonthlyReport(year, month);
    if (res.success) {
      setData(res.data);
    }
    setLoading(false);
  };

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  if (loading) {
    return <div className="text-center py-20"><Spin size="large" /></div>;
  }

  if (!data) {
    return <Empty description="No data available" />;
  }

  const topClientsData = data.topClients.map((c: any) => ({ name: c.name, value: c.count }));
  const popularSlotsData = data.popularSlots.map((s: any) => ({ name: `${s.slot}`, value: s.count }));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold text-slate-800 mr-auto">Monthly Reports</h2>
        <select
          value={month}
          onChange={(e) => setMonth(parseInt(e.target.value))}
          className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm"
        >
          {monthNames.map((name, i) => (
            <option key={i} value={i + 1}>{name}</option>
          ))}
        </select>
        <select
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm"
        >
          {[year - 2, year - 1, year, year + 1].map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title="Total Revenue" value={data.totalRevenue} suffix="DHs" precision={2} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Total Bookings" value={data.totalBookings} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Unique Clients" value={data.uniqueClients} />
          </Card>
        </Col>
      </Row>

      <Card title="Daily Revenue">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.dailyRevenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value: number) => [`${value.toFixed(2)} DHs`, 'Revenue']} />
            <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="Top Clients">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={topClientsData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {topClientsData.map((_: any, i: number) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Popular Time Slots">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={popularSlotsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Card title="All Bookings">
        <Table
          dataSource={data.bookings}
          columns={[
            { title: 'Booking #', dataIndex: 'bookingNumber', key: 'bookingNumber' },
            { title: 'Client', dataIndex: 'clientName', key: 'clientName' },
            { title: 'Date', dataIndex: 'date', key: 'date', render: (v: string) => new Date(v).toLocaleDateString() },
            { title: 'Time', key: 'time', render: (_: any, r: any) => `${r.startTime} - ${r.endTime}` },
            { title: 'Amount', key: 'price', render: (_: any, r: any) => `${r.price.toFixed(2)} DHs` },
          ]}
          rowKey="id"
          size="small"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}

export default Reports;
