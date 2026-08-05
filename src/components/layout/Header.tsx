import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Shield,
  Bell,
  Sun,
  Moon,
  Wifi,
  WifiOff,
  UserCheck,
  Search,
  CheckCircle2,
  X,
  FileText,
  Download,
  Database
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentUser,
    switchRole,
    theme,
    toggleTheme,
    isOnline,
    notifications,
    unreadCount,
    readNotification,
    setActiveView,
    setSelectedRup,
    requirements
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }
    const clean = term.toLowerCase().trim();
    const matches = requirements.filter(
      r =>
        r.rup.toLowerCase().includes(clean) ||
        r.applicantName.toLowerCase().includes(clean) ||
        r.origin.toLowerCase().includes(clean) ||
        r.externalCode.toLowerCase().includes(clean)
    ).slice(0, 5);
    setSearchResults(matches);
  };

  const handleSelectResult = (rup: string) => {
    setSelectedRup(rup);
    setActiveView('recepcion');
    setSearchTerm('');
    setSearchResults([]);
  };

  const rolesList: { role: UserRole; label: string; desc: string }[] = [
    { role: 'ADMIN', label: 'Administrador', desc: 'Acceso total y configuración' },
    { role: 'RECEPCION', label: 'Recepción', desc: 'Registro de requerimientos y RUP' },
    { role: 'SALA_EVIDENCIAS', label: 'Sala de Evidencias', desc: 'Control de cadena de custodia' },
    { role: 'ENCARGADO_SERVICIOS', label: 'Encargado Servicios', desc: 'Revisión, proveídos y asignación' },
    { role: 'PERITO', label: 'Perito Forense', desc: 'Atención de casos asignados e informes' },
    { role: 'TECNICO', label: 'Técnico Forense', desc: 'Servicios técnicos especializados' }
  ];

  return (
    <header className="sticky top-0 z-30 bg-emerald-950 text-white shadow-md border-b border-emerald-900">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand & Emblem */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveView('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-emerald-950 shadow-md font-extrabold border border-amber-300/40 shrink-0">
            <Shield className="w-6 h-6 fill-amber-500 text-emerald-950" />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="font-bold tracking-tight text-base text-amber-400">IITCUP</span>
              <span className="text-xs bg-emerald-800 text-emerald-100 px-1.5 py-0.5 rounded font-mono font-semibold">REGIONAL SANTA CRUZ</span>
            </div>
            <p className="text-[11px] text-emerald-200/80 leading-none mt-0.5 font-medium">Gestión Pericial, Técnica y Custodia</p>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="relative flex-1 max-w-md mx-2 hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-300" />
            <input
              type="text"
              placeholder="Buscar por RUP (ej: SCZ-7-000001), Solicitante o CUD..."
              value={searchTerm}
              onChange={e => handleSearch(e.target.value)}
              className="w-full bg-emerald-900/60 text-emerald-50 text-xs rounded-lg pl-9 pr-8 py-2 border border-emerald-800 focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-emerald-300/60"
            />
            {searchTerm && (
              <button
                onClick={() => { setSearchTerm(''); setSearchResults([]); }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-emerald-300 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-slate-900 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50 text-xs divide-y divide-slate-800">
              {searchResults.map(r => (
                <div
                  key={r.id}
                  onClick={() => handleSelectResult(r.rup)}
                  className="p-2.5 hover:bg-slate-800 cursor-pointer flex items-center justify-between text-slate-200"
                >
                  <div>
                    <div className="font-bold text-amber-400">{r.rup}</div>
                    <div className="text-[11px] text-slate-400">{r.applicantName} - {r.serviceName}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-700">
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Action Icons & Role Switcher */}
        <div className="flex items-center gap-2">
          
          {/* Online/Offline Status Pill */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
              isOnline
                ? 'bg-emerald-900/80 text-emerald-200 border-emerald-700'
                : 'bg-amber-950/90 text-amber-200 border-amber-700 animate-pulse'
            }`}
            title={isOnline ? 'Conexión activa con el servidor' : 'Modo Offline: Los cambios se guardan localmente'}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-400" /> : <WifiOff className="w-3.5 h-3.5 text-amber-400" />}
            <span className="hidden lg:inline">{isOnline ? 'Online' : 'Offline'}</span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-emerald-900/50 hover:bg-emerald-800 text-emerald-200 hover:text-white transition-colors"
            title={theme === 'light' ? 'Cambiar a Modo Oscuro' : 'Cambiar a Modo Claro'}
          >
            {theme === 'light' ? <Moon className="w-4 h-4 text-amber-300" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Notifications Center */}
          <div className="relative">
            <button
              onClick={() => setShowNotifPanel(!showNotifPanel)}
              className="p-2 rounded-lg bg-emerald-900/50 hover:bg-emerald-800 text-emerald-200 hover:text-white relative transition-colors"
              title="Notificaciones"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-emerald-950 font-bold text-[10px] flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifPanel && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-slate-900 text-slate-100 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="p-3 bg-emerald-950 border-b border-emerald-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-xs text-white">Notificaciones del Sistema</span>
                  </div>
                  <span className="text-[10px] font-semibold bg-emerald-800 px-2 py-0.5 rounded text-emerald-200">
                    {unreadCount} pend.
                  </span>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-800 text-xs">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs">No hay notificaciones recientes</div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => {
                          readNotification(n.id);
                          if (n.rup) {
                            setSelectedRup(n.rup);
                            setActiveView('recepcion');
                          }
                          setShowNotifPanel(false);
                        }}
                        className={`p-3 hover:bg-slate-800 cursor-pointer transition-colors ${
                          n.status === 'Pendiente' ? 'bg-slate-850 border-l-2 border-amber-500' : 'opacity-70'
                        }`}
                      >
                        <div className="flex items-center justify-between font-semibold text-amber-300">
                          <span>{n.title}</span>
                          <span className="text-[10px] text-slate-400">{new Date(n.createdAt).toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-1 leading-snug">{n.message}</p>
                        {n.rup && (
                          <div className="mt-1.5 text-[10px] font-mono text-emerald-400 font-bold">
                            RUP: {n.rup}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2 bg-slate-950 border-t border-slate-800 text-center">
                  <button
                    onClick={() => { setActiveView('notificaciones'); setShowNotifPanel(false); }}
                    className="text-[11px] text-amber-400 hover:underline font-semibold"
                  >
                    Ver centro de notificaciones
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Role Switcher Menu */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-900 to-emerald-800 hover:from-emerald-800 hover:to-emerald-700 text-white px-2.5 py-1.5 rounded-lg border border-emerald-700 text-xs font-semibold shadow-sm transition-all"
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
              <div className="text-left hidden sm:block">
                <div className="text-[11px] font-bold leading-none text-amber-300">{currentUser.name.split(' ')[0]}</div>
                <div className="text-[9px] text-emerald-200 uppercase tracking-wider">{currentUser.role}</div>
              </div>
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden text-xs">
                <div className="p-3 bg-emerald-950 border-b border-emerald-800">
                  <div className="font-bold text-white">{currentUser.name}</div>
                  <div className="text-[11px] text-emerald-300">{currentUser.officeName}</div>
                  <div className="mt-1 text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded inline-block font-mono font-semibold">
                    Rol: {currentUser.role}
                  </div>
                </div>

                <div className="p-2 font-bold text-[10px] uppercase text-slate-400 tracking-wider bg-slate-950">
                  Cambiar Rol de Evaluación
                </div>

                <div className="divide-y divide-slate-800">
                  {rolesList.map(r => (
                    <button
                      key={r.role}
                      onClick={() => {
                        switchRole(r.role);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left p-2.5 hover:bg-slate-800 flex items-start gap-2.5 transition-colors ${
                        currentUser.role === r.role ? 'bg-emerald-950/60 border-l-2 border-amber-500' : ''
                      }`}
                    >
                      <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${currentUser.role === r.role ? 'text-amber-400' : 'text-slate-600'}`} />
                      <div>
                        <div className={`font-semibold ${currentUser.role === r.role ? 'text-amber-300' : 'text-slate-200'}`}>{r.label}</div>
                        <div className="text-[10px] text-slate-400 leading-tight">{r.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="p-2.5 bg-slate-950 border-t border-slate-800 text-center">
                  <button
                    onClick={() => { setActiveView('configuracion'); setShowRoleMenu(false); }}
                    className="w-full text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center justify-center gap-1.5"
                  >
                    <Database className="w-3.5 h-3.5" />
                    Configurar Supabase / Exportar SQL
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
