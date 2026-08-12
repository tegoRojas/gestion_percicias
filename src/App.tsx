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
import { RevisionTecnicaView } from './views/RevisionTecnicaView';
import { ControlCalidadView } from './views/ControlCalidadView';
import { AgendaView } from './views/AgendaView';

import { LoginView } from './views/LoginView';
import { ROLE_ALLOWED_VIEWS } from './types';
import { ShieldAlert } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeView, setActiveView, currentUser, isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <LoginView />;
  }

  const allowedViews = ROLE_ALLOWED_VIEWS[currentUser.role] || ['dashboard'];

  const renderView = () => {
    if (!allowedViews.includes(activeView)) {
      return (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-red-200 dark:border-red-900 shadow-lg text-center space-y-4 max-w-xl mx-auto my-12">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto border border-red-200 dark:border-red-800">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Acceso No Autorizado</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Su rol actual de <strong className="text-amber-600 dark:text-amber-400 font-bold">{currentUser.role}</strong> no tiene permisos asignados para ingresar al módulo de <strong className="capitalize">{activeView}</strong>.
            </p>
          </div>
          <button
            onClick={() => setActiveView(allowedViews[0] || 'dashboard')}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
          >
            Ir a Mi Módulo Principal ({allowedViews[0].toUpperCase()})
          </button>
        </div>
      );
    }

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
      case 'agenda':
        return <AgendaView />;
      case 'revision_tecnica':
        return <RevisionTecnicaView />;
      case 'control_calidad':
        return <ControlCalidadView />;
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
