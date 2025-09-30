import React from 'react';
import { RouteObject } from 'react-router-dom';
import { Tracker } from './features/main-nav/tracker/Tracker';
import LoginForm from './features/auth/login/login';
import Form from './features/forms-scrapping/form';
import { LoadingScreen } from './features/forms-scrapping/LoadingScreen';
import Cadastro from './features/auth/cadastro/cadastro';
import FormCadastro from './features/auth/form_cadastro/form_cadastro';
import { SuccessScreen } from './features/auth/form_cadastro/SuccessScreen';
import { DashboardPage } from './features/main-nav/dash/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginRoute } from './components/LoginRoute';

export const routes: RouteObject[] = [
  { path: '/', element: <ProtectedRoute><Tracker /></ProtectedRoute> }, // Dashboard principal
  { path: '/login', element: <LoginRoute><LoginForm /></LoginRoute> },
  { path: '/dashboard', element: <ProtectedRoute><Tracker /></ProtectedRoute> },
  { path: '/form', element: <ProtectedRoute><Form /></ProtectedRoute> },
  { path: '/loading', element: <ProtectedRoute><LoadingScreen /></ProtectedRoute> },
  { path: '/success', element: <ProtectedRoute><SuccessScreen /></ProtectedRoute> },
  { path: '/metricas', element: <ProtectedRoute><DashboardPage /></ProtectedRoute> },
  { path: '/cadastro', element: <Cadastro /> },
  { path: '/form-cadastro', element: <FormCadastro /> },
];