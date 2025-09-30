
import React from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { routes } from './routes';

function AppRoutes() {
  return useRoutes(routes);
}

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};
