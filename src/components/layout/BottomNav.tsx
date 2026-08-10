import React from 'react';
import { useApp } from '../../context/AppContext';
import { ROLE_ALLOWED_VIEWS } from '../../types';
import {
  LayoutDashboard,
  FilePlus,
  PackageCheck,
  Briefcase,
  FolderKanban,
  FileSpreadsheet,
  Bell
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentUser, activeView, setActiveView, unreadCount } = useApp();

  const allItems = [
    { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard },
    { id: 'recepcion', label: 'RUP', icon: FilePlus },
    { id: 'servicios', label: 'Servicios', icon: Briefcase },
    { id: 'mis_casos', label: 'Mis Casos', icon: FolderKanban },
    { id: 'evidencias', label: 'Evidencias', icon: PackageCheck },
    { id: 'reportes', label: 'Reportes', icon: FileSpreadsheet },
    { id: 'notificaciones', label: 'Alertas', icon: Bell, badge: unreadCount }
  ];

  const allowedViews = ROLE_ALLOWED_VIEWS[currentUser.role] || ['dashboard'];
  const items = allItems.filter(item => allowedViews.includes(item.id)).slice(0, 5);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950 text-slate-300 border-t border-slate-800 backdrop-blur-lg bg-opacity-95 px-2 py-1.5 flex items-center justify-around shadow-2xl">
      {items.map(item => {
        const Icon = item.icon;
        const isActive = activeView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg relative transition-all ${
              isActive ? 'text-amber-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
            <span className="text-[10px] mt-0.5 leading-tight">{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="absolute top-0.5 right-1 w-3.5 h-3.5 bg-amber-500 text-emerald-950 font-bold text-[9px] rounded-full flex items-center justify-center">
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
