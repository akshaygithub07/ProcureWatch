import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { VendorDashboard } from './pages/VendorDashboard'
import Register from './pages/Register.tsx';
import { BuyerDashboard } from './pages/BuyerDashboard';
import { CitizenDashboard } from './pages/CitizenDashboard.tsx';
import HomePage from './pages/HomePage.tsx';
import { AuditorDashboard } from './pages/AuditorDashboard.tsx';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path="/vendor" element={<VendorDashboard />} />
        <Route path="/register" element={<Register />}/>
        <Route path="/buyer" element={<BuyerDashboard />}/>
        <Route path="/citizen" element={<CitizenDashboard />}/>
        <Route path="/auditor" element={<AuditorDashboard />} />

      </Routes>
      
    </Router>
  );
};

export default App;
