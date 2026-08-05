import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  FilePlus,
  PackageCheck,
  Briefcase,
  FolderKanban,
  Users,
  Building2,
  FileSpreadsheet,
  ShieldAlert,
  Bell,
  Settings,
  Sliders,
  Award
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentUser, activeView, setActiveView, unreadCount } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'RECEPCION', 'SALA_EVIDENCIAS', 'ENCARGADO_SERVICIOS', 'PERITO', 'TECNICO'] },
    { id: 'recepcion', label: 'Recepción RUP', icon: FilePlus, roles: ['ADMIN', 'RECEPCION', 'ENCARGADO_SERVICIOS', 'SALA_EVIDENCIAS'] },
    { id: 'evidencias', label: 'Sala de Evidencias', icon: PackageCheck, roles: ['ADMIN', 'SALA_EVIDENCIAS', 'RECEPCION', 'PERITO', 'TECNICO'] },
    { id: 'servicios', label: 'Servicios Periciales', icon: Briefcase, roles: ['ADMIN', 'ENCARGADO_SERVICIOS'] },
    { id: 'mis_casos', label: 'Mis Casos Asignados', icon: FolderKanban, roles: ['PERITO', 'TECNICO', 'ADMIN'] },
    { id: 'reportes', label: 'Reportes y Estadísticas', icon: FileSpreadsheet, roles: ['ADMIN', 'ENCARGADO_SERVICIOS', 'RECEPCION'] },
    { id: 'usuarios', label: 'Gestión de Usuarios', icon: Users, roles: ['ADMIN'] },
    { id: 'secciones', label: 'Secciones y Servicios', icon: Sliders, roles: ['ADMIN'] },
    { id: 'oficinas', label: 'Oficinas Regionales', icon: Building2, roles: ['ADMIN'] },
    { id: 'auditoria', label: 'Auditoría e Histórico', icon: ShieldAlert, roles: ['ADMIN'] },
    { id: 'notificaciones', label: 'Notificaciones', icon: Bell, roles: ['ADMIN', 'RECEPCION', 'SALA_EVIDENCIAS', 'ENCARGADO_SERVICIOS', 'PERITO', 'TECNICO'], badge: unreadCount },
    { id: 'configuracion', label: 'Configuración / SQL', icon: Settings, roles: ['ADMIN', 'RECEPCION', 'SALA_EVIDENCIAS', 'ENCARGADO_SERVICIOS', 'PERITO', 'TECNICO'] }
  ];

  const allowedItems = navItems.filter(item => item.roles.includes(currentUser.role));

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col shrink-0 min-h-[calc(100vh-57px)] hidden md:flex">
      {/* Officer Identity Card */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-amber-400 font-bold shrink-0">
          <Award className="w-5 h-5 text-amber-400" />
        </div>
        <div className="overflow-hidden text-xs">
          <div className="font-bold text-white truncate">{currentUser.name}</div>
          <div className="text-[11px] text-slate-400 truncate">{currentUser.officeName.split(' ')[2] || 'Santa Cruz'}</div>
          <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 font-mono">
            N° Chapa: {currentUser.badgeNumber || 'IIT-001'}
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
        {allowedItems.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-all ${
                isActive
                  ? 'bg-emerald-900 text-amber-300 font-bold border-l-4 border-amber-400 shadow-md'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="ml-2 px-1.5 py-0.5 text-[10px] font-bold bg-amber-500 text-emerald-950 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-500 text-center leading-tight">
        <p className="font-semibold text-slate-400">IITCUP Regional Santa Cruz</p>
        <p>Policía Boliviana © 2026</p>
        <p className="text-emerald-500 font-mono mt-0.5">Versión PWA 1.0.0</p>
      </div>
    </aside>
  );
};
