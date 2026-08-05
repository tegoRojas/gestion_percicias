import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, ShieldCheck, Lock } from 'lucide-react';

export const AuditoríaView: React.FC = () => {
  const { auditLogs } = useApp();

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Auditoría del Sistema e Histórico Inmutable
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Registro cronológico inalterable de todas las operaciones de recepción, asignación, custodia e informes
          </p>
        </div>

        <div className="flex items-center gap-2 bg-red-950/80 text-red-200 border border-red-800 px-3 py-1.5 rounded-xl text-xs font-bold">
          <Lock className="w-4 h-4 text-red-400" />
          <span>Registros protegidos contra eliminación (DELETE prohibido)</span>
        </div>
      </div>

      {/* Audit Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3">Fecha y Hora</th>
                <th className="p-3">Usuario / Rol</th>
                <th className="p-3">Módulo</th>
                <th className="p-3">Acción Realizada</th>
                <th className="p-3">Estado Anterior</th>
                <th className="p-3">Nuevo Estado / Detalle</th>
                <th className="p-3">IP Origen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {auditLogs.map(a => (
                <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    {new Date(a.dateTime).toLocaleString('es-BO')}
                  </td>
                  <td className="p-3 font-sans">
                    <div className="font-bold text-slate-900 dark:text-slate-100">{a.userName}</div>
                    <span className="text-[9px] bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded font-mono font-semibold">
                      {a.userRole}
                    </span>
                  </td>
                  <td className="p-3 font-sans font-semibold text-emerald-700 dark:text-emerald-400">
                    {a.module}
                  </td>
                  <td className="p-3 font-bold text-slate-800 dark:text-slate-200">
                    {a.action}
                  </td>
                  <td className="p-3 text-slate-500">
                    {a.previousState || '-'}
                  </td>
                  <td className="p-3 text-slate-800 dark:text-slate-200 font-sans">
                    {a.newState || '-'}
                  </td>
                  <td className="p-3 text-slate-400 text-[10px]">
                    {a.ip}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
