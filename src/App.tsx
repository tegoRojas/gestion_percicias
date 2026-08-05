import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';

import { DashboardView } from './views/DashboardView';
import { RecepcionView } from './views/RecepcionView';
import { EvidenciasView } from './views/EvidenciasView';
import { ServiciosView } from './views/ServiciosView';
import { MisCasosView } from './views/MisCasosView';
import { UsuariosView } from './views/UsuariosView';
import { SeccionesView } from './views/SeccionesView';
import { OficinasView } from './views/OficinasView';
import { ReportesView } from './views/ReportesView';
import { AuditoríaView } from './views/AuditoriaView';
import { NotificacionesView } from './views/NotificacionesView';
import { ConfiguracionView } from './views/ConfiguracionView';

const MainLayout: React.FC = () => {
  const { activeView } = useApp();

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'recepcion':
        return <RecepcionView />;
      case 'evidencias':
        return <EvidenciasView />;
      case 'servicios':
        return <ServiciosView />;
      case 'mis_casos':
        return <MisCasosView />;
      case 'usuarios':
        return <UsuariosView />;
      case 'secciones':
        return <SeccionesView />;
      case 'oficinas':
        return <OficinasView />;
      case 'reportes':
        return <ReportesView />;
      case 'auditoria':
        return <AuditoríaView />;
      case 'notificaciones':
        return <NotificacionesView />;
      case 'configuracion':
        return <ConfiguracionView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Header />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-2 sm:px-4 lg:px-6 py-4 gap-6">
        <Sidebar />

        <main className="flex-1 min-w-0 pb-20 md:pb-6">
          {renderView()}
        </main>
      </div>

      <BottomNav />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
