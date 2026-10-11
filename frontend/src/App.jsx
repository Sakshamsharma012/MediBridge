import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { MedicineSearch } from './pages/MedicineSearch';
import { DonateMedicine } from './pages/DonateMedicine';
import { MapView } from './pages/MapView';
import { GenericAlternatives } from './pages/GenericAlternatives';
import { HealthcareHub } from './pages/HealthcareHub';
import { UserDashboard } from './pages/UserDashboard';
import { PharmacyDashboard } from './pages/PharmacyDashboard';
import { NgoDashboard } from './pages/NgoDashboard';
import { HospitalDashboard } from './pages/HospitalDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

export const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<Navigate to="/" replace />} />
          <Route path="/donate" element={<DonateMedicine />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/alternatives" element={<GenericAlternatives />} />
          <Route path="/healthcare" element={<HealthcareHub />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/pharmacy-dashboard" element={<PharmacyDashboard />} />
          <Route path="/ngo-dashboard" element={<NgoDashboard />} />
          <Route path="/hospital-dashboard" element={<HospitalDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};
