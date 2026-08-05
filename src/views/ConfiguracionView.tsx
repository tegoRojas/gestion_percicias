import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { testSupabaseConnection } from '../services/supabase';
import { generateSupabaseSQL } from '../services/db';
import {
  Settings,
  Database,
  CheckCircle2,
  XCircle,
  Download,
  Wifi,
  WifiOff,
  Copy,
  Terminal,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

export const ConfiguracionView: React.FC = () => {
  const { isOnline } = useApp();

  const [supabaseUrl, setSupabaseUrl] = useState(
    localStorage.getItem('iitcup_supabase_url') || ''
  );
  const [supabaseKey, setSupabaseKey] = useState(
    localStorage.getItem('iitcup_supabase_key') || ''
  );

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSaveConfig = () => {
    localStorage.setItem('iitcup_supabase_url', supabaseUrl);
    localStorage.setItem('iitcup_supabase_key', supabaseKey);
    alert('Configuración de conexión Supabase guardada correctamente.');
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    const res = await testSupabaseConnection(supabaseUrl, supabaseKey);
    setTesting(false);
    setTestResult(res);
  };

  const handleDownloadSQL = () => {
    const sqlContent = generateSupabaseSQL();
    const blob = new Blob([sqlContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'iitcup_supabase_schema.sql';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-600" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Configuración y Conexión de Datos
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gestión del motor de sincronización backend (Supabase PostgreSQL) y estado offline PWA
          </p>
        </div>

        <div className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border ${
          isOnline
            ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
            : 'bg-amber-950 text-amber-300 border-amber-800'
        }`}>
          {isOnline ? <Wifi className="w-4 h-4 text-emerald-400" /> : <WifiOff className="w-4 h-4 text-amber-400" />}
          <span>{isOnline ? 'PWA En Línea' : 'PWA Modo Offline'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Supabase Config Form */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Database className="w-5 h-5 text-emerald-600" />
            <h2 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
              Credenciales Supabase PostgreSQL
            </h2>
          </div>

          <p className="text-slate-500">
            Ingrese los parámetros de su proyecto en Supabase para sincronizar los datos locales con la base de datos remota.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Project URL (Supabase API)
              </label>
              <input
                type="text"
                placeholder="https://xyzcompany.supabase.co"
                value={supabaseUrl}
                onChange={e => setSupabaseUrl(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                API anon / public Key
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={supabaseKey}
                onChange={e => setSupabaseKey(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleSaveConfig}
              className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              Guardar Credenciales
            </button>

            <button
              onClick={handleTestConnection}
              disabled={testing}
              className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${testing ? 'animate-spin' : ''}`} />
              Probar Conexión
            </button>
          </div>

          {testResult && (
            <div className={`p-3 rounded-xl border flex items-center gap-2 ${
              testResult.success
                ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300'
                : 'bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-300 border-red-300'
            }`}>
              {testResult.success ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <XCircle className="w-5 h-5 shrink-0" />}
              <span className="font-semibold">{testResult.message}</span>
            </div>
          )}

        </div>

        {/* Database SQL Export Panel */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Terminal className="w-5 h-5 text-amber-500" />
            <h2 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
              Esquema DDL PostgreSQL e Instrucciones SQL
            </h2>
          </div>

          <p className="text-slate-500 leading-relaxed">
            Descargue el script de creación de tablas, triggers para el correlativo automático del RUP (<code className="font-mono text-amber-500 font-bold">SCZ-7-000001</code>), reglas RLS y restricciones inmutables de auditoría para ejecutar directamente en el Editor SQL de Supabase.
          </p>

          <div className="bg-slate-950 text-emerald-400 p-3 rounded-xl font-mono text-[10px] space-y-1 border border-slate-800">
            <div>-- CREADO PARA IITCUP SANTA CRUZ</div>
            <div>CREATE TABLE requirements (...);</div>
            <div>CREATE TABLE custody_logs (...);</div>
            <div>CREATE TRIGGER trigger_generate_rup ...</div>
            <div>CREATE TRIGGER protect_audit_logs ...</div>
          </div>

          <button
            onClick={handleDownloadSQL}
            className="w-full bg-amber-500 hover:bg-amber-400 text-emerald-950 font-extrabold px-4 py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2 text-xs border border-amber-300 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Descargar Script SQL Completo (iitcup_supabase_schema.sql)
          </button>
        </div>

      </div>

    </div>
  );
};
