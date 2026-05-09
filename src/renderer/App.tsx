import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Today from './pages/Today';
import BookingHistory from './pages/BookingHistory';
import AddBooking from './pages/AddBooking';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function App() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    window.electronAPI.getSettings().then((res) => {
      if (res.success && res.data) {
        setSettings(res.data);
      }
    });
  }, []);

  return (
    <Layout settings={settings}>
      <Routes>
        <Route path="/" element={<Navigate to="/today" replace />} />
        <Route path="/today" element={<Today settings={settings} />} />
        <Route path="/bookings" element={<BookingHistory />} />
        <Route path="/add-booking" element={<AddBooking settings={settings} />} />
        <Route path="/reports" element={<Reports settings={settings} />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  );
}

export default App;
