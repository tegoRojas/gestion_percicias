import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Check, Clock, CheckCheck, AlertCircle } from 'lucide-react';

export const NotificacionesView: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Centro de Notificaciones Automáticas
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Alertas sobre nuevos requerimientos, asignaciones periciales y movimientos de custodia
          </p>
        </div>

        <button
          onClick={markAllNotificationsRead}
          className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer border border-emerald-600"
        >
          <CheckCheck className="w-4 h-4 text-amber-400" />
          Marcar todas como leídas
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-4 space-y-3">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No existen notificaciones recibidas.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {notifications.map(n => (
              <div
                key={n.id}
                className={`py-3 px-2 flex items-start justify-between gap-3 transition-colors rounded-lg ${
                  n.read ? 'opacity-70' : 'bg-amber-500/5 dark:bg-amber-500/10'
                }`}
              >
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 dark:text-slate-100">{n.title}</span>
                    {n.rup && (
                      <span className="font-mono text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded">
                        RUP: {n.rup}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">{n.message}</p>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {new Date(n.dateTime).toLocaleString('es-BO')}
                  </div>
                </div>

                {!n.read && (
                  <button
                    onClick={() => markNotificationRead(n.id)}
                    className="p-1.5 rounded-lg bg-emerald-800 text-amber-300 hover:bg-emerald-700 font-bold text-[10px] flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" /> Leído
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
