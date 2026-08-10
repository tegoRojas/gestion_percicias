import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AuditLog, UserRole } from '../types';
import {
  ShieldAlert,
  Lock,
  Search,
  Filter,
  Download,
  User as UserIcon,
  Activity,
  Eye,
  X,
  FileSpreadsheet,
  XCircle,
  Clock,
  Layers,
  Key,
  Database
} from 'lucide-react';

export const AuditoríaView: React.FC = () => {
  const { auditLogs, users, selectedUserLogId, setSelectedUserLogId } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string>(selectedUserLogId || 'ALL');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [selectedModule, setSelectedModule] = useState<string>('ALL');
  const [selectedActionType, setSelectedActionType] = useState<string>('ALL');
  const [selectedLogDetail, setSelectedLogDetail] = useState<AuditLog | null>(null);

  // Sync selectedUserLogId from AppContext if passed from UsuariosView
  useEffect(() => {
    if (selectedUserLogId) {
      setSelectedUserId(selectedUserLogId);
    }
  }, [selectedUserLogId]);

  // Extract distinct modules and action types for filters
  const modulesList = useMemo(() => {
    const set = new Set(auditLogs.map(a => a.module).filter(Boolean));
    return Array.from(set).sort();
  }, [auditLogs]);

  const actionTypesList = useMemo(() => {
    const set = new Set(auditLogs.map(a => a.action).filter(Boolean));
    return Array.from(set).sort();
  }, [auditLogs]);

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      // User filter
      if (selectedUserId !== 'ALL' && log.userId !== selectedUserId) {
        // Also check if userName matches in case of demo users
        const matchingUser = users.find(u => u.id === selectedUserId);
        if (!matchingUser || !log.userName.toLowerCase().includes(matchingUser.name.toLowerCase())) {
          return false;
        }
      }

      // Role filter
      if (selectedRole !== 'ALL' && log.userRole !== selectedRole) {
        return false;
      }

      // Module filter
      if (selectedModule !== 'ALL' && log.module !== selectedModule) {
        return false;
      }

      // Action Type filter
      if (selectedActionType !== 'ALL' && log.action !== selectedActionType) {
        return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim();
        const matchName = log.userName.toLowerCase().includes(term);
        const matchRole = log.userRole.toLowerCase().includes(term);
        const matchAction = log.action.toLowerCase().includes(term);
        const matchModule = log.module.toLowerCase().includes(term);
        const matchNewState = (log.newState || '').toLowerCase().includes(term);
        const matchPrevState = (log.previousState || '').toLowerCase().includes(term);
        const matchIp = log.ip.toLowerCase().includes(term);

        if (!matchName && !matchRole && !matchAction && !matchModule && !matchNewState && !matchPrevState && !matchIp) {
          return false;
        }
      }

      return true;
    });
  }, [auditLogs, selectedUserId, selectedRole, selectedModule, selectedActionType, searchTerm, users]);

  // Stats calculation
  const stats = useMemo(() => {
    const total = auditLogs.length;
    const logins = auditLogs.filter(a => a.action.includes('INICIO_SESION') || a.action.includes('LOGIN')).length;
    const userAdminActions = auditLogs.filter(a => a.action.includes('USUARIO') || a.module.includes('Usuarios')).length;
    const forensicActions = auditLogs.filter(a => a.action.includes('REQUERIMIENTO') || a.action.includes('EVIDENCIA') || a.action.includes('PERITO') || a.action.includes('INFORME')).length;

    return { total, logins, userAdminActions, forensicActions };
  }, [auditLogs]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedUserId('ALL');
    setSelectedRole('ALL');
    setSelectedModule('ALL');
    setSelectedActionType('ALL');
    setSelectedUserLogId(null);
  };

  const handleExportCSV = () => {
    if (filteredLogs.length === 0) {
      alert('No hay registros para exportar con los filtros actuales.');
      return;
    }

    const headers = ['ID', 'Fecha_Hora', 'ID_Usuario', 'Nombre_Usuario', 'Rol_Usuario', 'Modulo', 'Accion', 'Estado_Anterior', 'Nuevo_Estado_Detalle', 'IP_Origen'];
    const rows = filteredLogs.map(l => [
      `"${l.id}"`,
      `"${new Date(l.dateTime).toLocaleString('es-BO')}"`,
      `"${l.userId}"`,
      `"${l.userName.replace(/"/g, '""')}"`,
      `"${l.userRole}"`,
      `"${l.module}"`,
      `"${l.action}"`,
      `"${(l.previousState || '').replace(/"/g, '""')}"`,
      `"${(l.newState || '').replace(/"/g, '""')}"`,
      `"${l.ip}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `IITCUP_Audit_Logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper for rendering action badge styles
  const renderActionBadge = (action: string) => {
    let colorClass = 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    if (action.includes('INICIO_SESION') || action.includes('LOGIN')) {
      colorClass = 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800';
    } else if (action.includes('CREAC') || action.includes('NUEVO') || action.includes('REGISTRO')) {
      colorClass = 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-800';
    } else if (action.includes('ACTUALIZ') || action.includes('ASIGNAC') || action.includes('MODIFICAC')) {
      colorClass = 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800';
    } else if (action.includes('ESTADO') || action.includes('DESHABILIT') || action.includes('ELIMINAC') || action.includes('CIERRE')) {
      colorClass = 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950/80 dark:text-red-300 dark:border-red-800';
    }

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border font-mono ${colorClass}`}>
        {action}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Auditoría y Logs de Actividades de Usuario
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Registro inmutable e inalterable de cada inicio de sesión, alta de requerimientos, asignaciones y cambios de estado por usuario.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer border border-emerald-600"
          >
            <Download className="w-4 h-4" />
            Exportar Logs (CSV)
          </button>
          
          <div className="flex items-center gap-2 bg-red-950/80 text-red-200 border border-red-800 px-3 py-1.5 rounded-xl text-xs font-bold">
            <Lock className="w-4 h-4 text-red-400" />
            <span>Registros Inmutables</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Registros</div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">{stats.total}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-800">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Inicios de Sesión</div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">{stats.logins}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-800">
            <UserIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Gestión Usuarios</div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">{stats.userAdminActions}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-200 dark:border-purple-800">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Operaciones RUP</div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">{stats.forensicActions}</div>
          </div>
        </div>
      </div>

      {/* Control Panel & Filters */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider">
            <Filter className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Filtros de Búsqueda y Revisión de Logs</span>
          </div>
          {(selectedUserId !== 'ALL' || selectedRole !== 'ALL' || selectedModule !== 'ALL' || selectedActionType !== 'ALL' || searchTerm !== '') && (
            <button
              onClick={handleClearFilters}
              className="text-[11px] font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <XCircle className="w-3.5 h-3.5" />
              Limpiar Filtros
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* Search Term Input */}
          <div className="lg:col-span-2 relative">
            <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">BÚSQUEDA GENERAL</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por usuario, C.I., módulo, acción o texto..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 font-medium placeholder-slate-400 focus:ring-2 focus:ring-emerald-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* User Select */}
          <div>
            <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">USUARIO / FUNCIONARIO</label>
            <select
              value={selectedUserId}
              onChange={e => {
                setSelectedUserId(e.target.value);
                setSelectedUserLogId(e.target.value === 'ALL' ? null : e.target.value);
              }}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">-- TODOS LOS USUARIOS --</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.username})
                </option>
              ))}
            </select>
          </div>

          {/* Role Select */}
          <div>
            <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">ROL DE USUARIO</label>
            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">-- TODOS LOS ROLES --</option>
              <option value="ADMIN">ADMINISTRADOR</option>
              <option value="RECEPCION">RECEPCIÓN</option>
              <option value="ENCARGADO_SERVICIOS">ENCARGADO DE SERVICIOS</option>
              <option value="PERITO">PERITO FORENSE</option>
              <option value="TECNICO">TÉCNICO FORENSE</option>
              <option value="SALA_EVIDENCIAS">SALA DE EVIDENCIAS</option>
            </select>
          </div>

          {/* Module Select */}
          <div>
            <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">MÓDULO DEL SISTEMA</label>
            <select
              value={selectedModule}
              onChange={e => setSelectedModule(e.target.value)}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">-- TODOS LOS MÓDULOS --</option>
              {modulesList.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Notice if specific user selected */}
      {selectedUserId !== 'ALL' && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 p-3 rounded-xl flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>
              Mostrando únicamente el registro de logs del usuario: <strong>{users.find(u => u.id === selectedUserId)?.name || selectedUserId}</strong>
            </span>
          </div>
          <button
            onClick={() => {
              setSelectedUserId('ALL');
              setSelectedUserLogId(null);
            }}
            className="px-2 py-1 bg-amber-200 dark:bg-amber-900 hover:bg-amber-300 rounded-lg font-bold text-[10px] text-amber-900 dark:text-amber-100 transition-all cursor-pointer"
          >
            Ver Todos
          </button>
        </div>
      )}

      {/* Audit Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="font-bold text-xs text-slate-700 dark:text-slate-300">
            Registros Encontrados: <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{filteredLogs.length}</span>
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
            PWA IITCUP • Registro Cronológico Oficial
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-emerald-950 text-white font-bold uppercase text-[10px] tracking-wider border-b border-emerald-900">
              <tr>
                <th className="p-3">FECHA Y HORA</th>
                <th className="p-3">USUARIO / ROL</th>
                <th className="p-3">MÓDULO</th>
                <th className="p-3">ACCIÓN REALIZADA</th>
                <th className="p-3">ESTADO / DETALLE DE LA OPERACIÓN</th>
                <th className="p-3">IP ORIGEN</th>
                <th className="p-3 text-center">VER DETALLE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-sans">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 dark:text-slate-400">
                    <div className="max-w-xs mx-auto space-y-2">
                      <ShieldAlert className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="font-bold text-sm">No se encontraron registros de logs</p>
                      <p className="text-xs">Ajuste los criterios de búsqueda o de selección de usuario.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLogs.map(a => (
                  <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-3 text-slate-600 dark:text-slate-300 whitespace-nowrap font-mono text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(a.dateTime).toLocaleString('es-BO', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </div>
                    </td>

                    <td className="p-3 font-sans">
                      <div className="font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <UserIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>{a.userName}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-[9px] bg-amber-500/20 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold border border-amber-500/30">
                          {a.userRole}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono">ID: {a.userId}</span>
                      </div>
                    </td>

                    <td className="p-3 font-sans font-bold text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
                      {a.module}
                    </td>

                    <td className="p-3 whitespace-nowrap">
                      {renderActionBadge(a.action)}
                    </td>

                    <td className="p-3 text-slate-800 dark:text-slate-200 font-sans max-w-md truncate">
                      {a.newState || a.previousState || '-'}
                    </td>

                    <td className="p-3 text-slate-400 font-mono text-[10px] whitespace-nowrap">
                      {a.ip}
                    </td>

                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedLogDetail(a)}
                        className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-800 hover:text-white text-slate-700 dark:text-slate-200 font-bold text-[10px] rounded-lg transition-all border border-slate-300 dark:border-slate-700 flex items-center gap-1 mx-auto cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        Detalle
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Detail Modal */}
      {selectedLogDetail && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-slate-950 text-white p-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-sm uppercase tracking-wider">
                  Detalle del Log de Actividad
                </h3>
              </div>
              <button
                onClick={() => setSelectedLogDetail(null)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 font-sans">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">FECHA Y HORA</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                    {new Date(selectedLogDetail.dateTime).toLocaleString('es-BO')}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">MÓDULO</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">
                    {selectedLogDetail.module}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">USUARIO FUNCIONARIO</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {selectedLogDetail.userName}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">ROL</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {selectedLogDetail.userRole}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">TIPO DE ACCIÓN</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedLogDetail.action}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">DIRECCIÓN IP / HOST</span>
                  <span className="font-mono text-slate-600 dark:text-slate-300">
                    {selectedLogDetail.ip}
                  </span>
                </div>
              </div>

              {selectedLogDetail.previousState && (
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">ESTADO ANTERIOR</span>
                  <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300 font-mono text-[11px] border border-slate-200 dark:border-slate-700">
                    {selectedLogDetail.previousState}
                  </div>
                </div>
              )}

              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">DETALLE DE LA OPERACIÓN / NUEVO ESTADO</span>
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg text-emerald-900 dark:text-emerald-200 font-medium text-xs border border-emerald-200 dark:border-emerald-800/60 leading-relaxed">
                  {selectedLogDetail.newState || 'Sin descripción adicional.'}
                </div>
              </div>

              <div className="p-3 bg-red-950/20 border border-red-800/50 rounded-xl text-[10px] text-red-700 dark:text-red-300 flex items-start gap-2">
                <Lock className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                <p>
                  <strong>Garantía de Inmutabilidad Legal:</strong> Este registro está firmado digitalmente y almacenado en la bitácora auditora inalterable de la Policía Boliviana. Las acciones de DELETE y UPDATE están restringidas por la base de datos.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 text-right">
              <button
                onClick={() => setSelectedLogDetail(null)}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all"
              >
                Cerrar Detalle
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
