import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import App from './App';
import "./styles/theme.css";
import Login from './routes/Login';
import Dashboard from "./routes/Dashboard";
import UsersManagementPage from './routes/UsersManagement';
import Materials from './routes/Materials';
import MaterialsLots from './routes/MaterialsLots';
import Semiacabado from './routes/Semiacabado';
import SemiacabadoLotes from './routes/SemiacabadoLotes';
import SemiacabadoOrdemProducao from './routes/SemiacabadoOrdemProducao';

import ProtectedRoute from './components/ProtectedRoute';
import NotFoundPage from './routes/NotFoundPage';
import NotAuthorizedPage from './routes/NotAuthorizedPage';
import Acabados from './routes/Acabados';
import OtherRegistrationsPage from './routes/OtherRegistrations';
import AcabadoOrdemProducao from './routes/AcabadoOrdemProducao';
import AcabadoLotes from './routes/AcabadoLotes';
import AboutDevelopers from './routes/Home';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Login />} />
          <Route path="login" element={<Login />} />
          <Route path="nao-autorizado" element={<NotAuthorizedPage />} />
          <Route element={<ProtectedRoute allowedRoles={['admin', 'operator']} />}>
            <Route path="painel" element={<Dashboard />} />
            <Route path="materials" element={<Materials />} />
            <Route path="materials-lots" element={<MaterialsLots />} />
            <Route path="semiacabados" element={<Semiacabado />} />
            <Route path="semiacabados-lots" element={<SemiacabadoLotes />} />
            <Route path="semiacabados-orders" element={<SemiacabadoOrdemProducao />} />
            <Route path="acabados" element={<Acabados />} />
            <Route path="acabados-orders" element={<AcabadoOrdemProducao />} />
            <Route path="acabados-lots" element={<AcabadoLotes />} />
            <Route path="outros-cadastros" element={<OtherRegistrationsPage />} />
            <Route path="devs" element={<AboutDevelopers />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="users-management" element={<UsersManagementPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <ToastContainer position="bottom-right" autoClose={2000} newestOnTop />
    </Router>
  </StrictMode>
);
