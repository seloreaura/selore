import React from 'react';
import { Navbar } from '../navbar/Navbar';
import './dashboard.css';

export const DashboardPage: React.FC = () => {
  React.useEffect(() => {
    document.title = 'Métricas - Selore';
  }, []);

  return (
    <div className="tkr-root" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #3977F2 0%, #FFD600 100%)', color: '#fff' }}>
      <Navbar />
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
      }}>
        <h1 style={{ fontSize: 64, fontWeight: 900, letterSpacing: 2, marginBottom: 24 }}>DASHBOARD</h1>
        <p style={{ fontSize: 28, fontWeight: 400, background: 'rgba(0,0,0,0.15)', padding: 24, borderRadius: 16 }}>
          Você está na tela de métricas!<br />
          Troque de aba para ver a diferença visual.
        </p>
        <div style={{ marginTop: 40, fontSize: 20, fontWeight: 300 }}>
          <span role="img" aria-label="gráfico">📊</span> Aqui você pode exibir gráficos, KPIs ou qualquer informação analítica.
        </div>
      </div>
    </div>
  );
};
