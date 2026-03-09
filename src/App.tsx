import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ModuleA from './pages/ModuleA';
import ModuleB from './pages/ModuleB';
import ModuleC from './pages/ModuleC';
import AdminReview from './pages/AdminReview';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="module-a" element={<ModuleA />} />
          <Route path="module-b" element={<ModuleB />} />
          <Route path="module-c" element={<ModuleC />} />
          <Route path="admin/review" element={<AdminReview />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
