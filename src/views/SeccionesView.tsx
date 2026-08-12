import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ServiceItem } from '../types';
import {
  Sliders,
  Plus,
  X,
  Search,
  Filter,
  Edit2,
  Trash2,
  RotateCcw,
  Briefcase,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  ShieldCheck,
  Database,
  Copy,
  Check,
  Download,
  FileCode
} from 'lucide-react';

export const SeccionesView: React.FC = () => {
  const {
    sections,
    services,
    addSection,
    addService,
    updateService,
    deleteService,
    resetServicesToDefault
  } = useApp();

  const [activeTab, setActiveTab] = useState<'SERVICES' | 'SECTIONS'>('SERVICES');

  // Filters for services
  const [searchQuery, setSearchQuery] = useState('');
  const [filterArea, setFilterArea] = useState('TODAS');
  const [filterType, setFilterType] = useState('TODOS');
  const [filterStatus, setFilterStatus] = useState('TODOS');

  // Modals
  const [showSecModal, setShowSecModal] = useState(false);
  const [showSrvModal, setShowSrvModal] = useState(false);
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  // Section Form State
  const [secCode, setSecCode] = useState('');
  const [secName, setSecName] = useState('');
  const [secDesc, setSecDesc] = useState('');
  const [secManager, setSecManager] = useState('');

  // Service Form State
  const [srvCode, setSrvCode] = useState('');
  const [srvName, setSrvName] = useState('');
  const [srvArea, setSrvArea] = useState('BALÍSTICA');
  const [customArea, setCustomArea] = useState('');
  const [srvType, setSrvType] = useState<'SERVICIO PERICIAL' | 'SERVICIO TÉCNICO' | 'SERVICIO ESPECIAL' | string>('SERVICIO PERICIAL');
  const [srvDays, setSrvDays] = useState(5);
  const [srvActive, setSrvActive] = useState(true);

  // Unique areas from current catalog
  const uniqueAreas = useMemo(() => {
    const areas = Array.from(new Set(services.map(s => s.area || s.sectionName || 'GENERAL')));
    return areas.sort();
  }, [services]);

  // Unique service types
  const uniqueTypes = useMemo(() => {
    const types = Array.from(new Set(services.map(s => s.type)));
    return types.sort();
  }, [services]);

  // Filtered Services
  const filteredServices = useMemo(() => {
    return services.filter(srv => {
      const currentArea = srv.area || srv.sectionName || '';
      const matchesSearch =
        srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (srv.code && srv.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
        currentArea.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesArea = filterArea === 'TODAS' || currentArea === filterArea;
      const matchesType = filterType === 'TODOS' || srv.type === filterType;
      const matchesStatus =
        filterStatus === 'TODOS' ||
        (filterStatus === 'ACTIVO' && srv.active) ||
        (filterStatus === 'INACTIVO' && !srv.active);

      return matchesSearch && matchesArea && matchesType && matchesStatus;
    });
  }, [services, searchQuery, filterArea, filterType, filterStatus]);

  // Generate full Supabase SQL Script dynamically for Secciones and Servicios
  const generatedSqlScript = useMemo(() => {
    const escapeSql = (str: string | undefined | null) => {
      if (!str) return 'NULL';
      return `'${str.replace(/'/g, "''")}'`;
    };

    let sql = `-- =============================================================================\n`;
    sql += `-- SCRIPT DE MIGRACIÓN DE SECCIONES Y SERVICIOS PERICIALES IITCUP SANTA CRUZ\n`;
    sql += `-- Base de Datos PostgreSQL / Supabase\n`;
    sql += `-- Fecha de Generación: ${new Date().toLocaleString('es-BO')}\n`;
    sql += `-- Total Secciones: ${sections.length} | Total Servicios: ${services.length}\n`;
    sql += `-- =============================================================================\n\n`;

    sql += `-- 1. Habilitar extensión UUID si es requerida\n`;
    sql += `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";\n\n`;

    sql += `-- 2. Crear Tabla 'secciones'\n`;
    sql += `CREATE TABLE IF NOT EXISTS public.secciones (\n`;
    sql += `    id VARCHAR(50) PRIMARY KEY,\n`;
    sql += `    code VARCHAR(30) UNIQUE NOT NULL,\n`;
    sql += `    name VARCHAR(150) NOT NULL,\n`;
    sql += `    description TEXT,\n`;
    sql += `    manager_name VARCHAR(150),\n`;
    sql += `    active BOOLEAN DEFAULT TRUE NOT NULL,\n`;
    sql += `    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL\n`;
    sql += `);\n\n`;

    sql += `-- 3. Crear Tabla 'servicios'\n`;
    sql += `CREATE TABLE IF NOT EXISTS public.servicios (\n`;
    sql += `    id VARCHAR(50) PRIMARY KEY,\n`;
    sql += `    code VARCHAR(30),\n`;
    sql += `    name TEXT NOT NULL,\n`;
    sql += `    area VARCHAR(150) NOT NULL,\n`;
    sql += `    section_id VARCHAR(50) REFERENCES public.secciones(id) ON DELETE SET NULL,\n`;
    sql += `    section_name VARCHAR(150),\n`;
    sql += `    type VARCHAR(50) NOT NULL,\n`;
    sql += `    estimated_days INTEGER DEFAULT 5 NOT NULL,\n`;
    sql += `    active BOOLEAN DEFAULT TRUE NOT NULL,\n`;
    sql += `    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL\n`;
    sql += `);\n\n`;

    sql += `-- 4. Crear Índices de Rendimiento en Supabase\n`;
    sql += `CREATE INDEX IF NOT EXISTS idx_secciones_code ON public.secciones(code);\n`;
    sql += `CREATE INDEX IF NOT EXISTS idx_secciones_active ON public.secciones(active);\n`;
    sql += `CREATE INDEX IF NOT EXISTS idx_servicios_area ON public.servicios(area);\n`;
    sql += `CREATE INDEX IF NOT EXISTS idx_servicios_type ON public.servicios(type);\n`;
    sql += `CREATE INDEX IF NOT EXISTS idx_servicios_section_id ON public.servicios(section_id);\n`;
    sql += `CREATE INDEX IF NOT EXISTS idx_servicios_active ON public.servicios(active);\n\n`;

    sql += `-- 5. Inserción de Secciones Forenses (UPSERT)\n`;
    if (sections.length > 0) {
      sql += `INSERT INTO public.secciones (id, code, name, description, manager_name, active) VALUES\n`;
      const secValues = sections.map(s => {
        return `  (${escapeSql(s.id)}, ${escapeSql(s.code)}, ${escapeSql(s.name)}, ${escapeSql(s.description)}, ${escapeSql(s.managerName)}, ${s.active !== false ? 'TRUE' : 'FALSE'})`;
      }).join(',\n');
      sql += secValues + `\nON CONFLICT (id) DO UPDATE SET\n`;
      sql += `    code = EXCLUDED.code,\n`;
      sql += `    name = EXCLUDED.name,\n`;
      sql += `    description = EXCLUDED.description,\n`;
      sql += `    manager_name = EXCLUDED.manager_name,\n`;
      sql += `    active = EXCLUDED.active;\n\n`;
    }

    sql += `-- 6. Inserción de Catálogo de Servicios Periciales (UPSERT)\n`;
    if (services.length > 0) {
      sql += `INSERT INTO public.servicios (id, code, name, area, section_id, section_name, type, estimated_days, active) VALUES\n`;
      const srvValues = services.map(srv => {
        return `  (${escapeSql(srv.id)}, ${escapeSql(srv.code)}, ${escapeSql(srv.name)}, ${escapeSql(srv.area || srv.sectionName || 'GENERAL')}, ${escapeSql(srv.sectionId)}, ${escapeSql(srv.sectionName)}, ${escapeSql(srv.type)}, ${srv.estimatedDays || 5}, ${srv.active !== false ? 'TRUE' : 'FALSE'})`;
      }).join(',\n');
      sql += srvValues + `\nON CONFLICT (id) DO UPDATE SET\n`;
      sql += `    code = EXCLUDED.code,\n`;
      sql += `    name = EXCLUDED.name,\n`;
      sql += `    area = EXCLUDED.area,\n`;
      sql += `    section_id = EXCLUDED.section_id,\n`;
      sql += `    section_name = EXCLUDED.section_name,\n`;
      sql += `    type = EXCLUDED.type,\n`;
      sql += `    estimated_days = EXCLUDED.estimated_days,\n`;
      sql += `    active = EXCLUDED.active;\n\n`;
    }

    sql += `-- Fin del Script de Migración de Secciones y Servicios para Supabase\n`;
    return sql;
  }, [sections, services]);

  const handleCopySql = () => {
    navigator.clipboard.writeText(generatedSqlScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleDownloadSql = () => {
    const blob = new Blob([generatedSqlScript], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `script_secciones_servicios_supabase_${new Date().toISOString().slice(0, 10)}.sql`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleOpenNewServiceModal = () => {
    setEditingService(null);
    setSrvCode('');
    setSrvName('');
    setSrvArea(uniqueAreas[0] || 'BALÍSTICA');
    setCustomArea('');
    setSrvType('SERVICIO PERICIAL');
    setSrvDays(5);
    setSrvActive(true);
    setShowSrvModal(true);
  };

  const handleOpenEditServiceModal = (srv: ServiceItem) => {
    setEditingService(srv);
    setSrvCode(srv.code || '');
    setSrvName(srv.name);
    setSrvArea(srv.area || srv.sectionName || 'BALÍSTICA');
    setCustomArea('');
    setSrvType(srv.type);
    setSrvDays(srv.estimatedDays || 5);
    setSrvActive(srv.active);
    setShowSrvModal(true);
  };

  const handleSrvSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!srvName.trim()) {
      alert('Por favor ingrese el nombre del servicio pericial.');
      return;
    }

    const finalArea = srvArea === 'OTRO' ? customArea.trim().toUpperCase() : srvArea;
    if (!finalArea) {
      alert('Por favor especifique el área pericial.');
      return;
    }

    if (editingService) {
      updateService({
        ...editingService,
        code: srvCode.toUpperCase() || undefined,
        name: srvName,
        area: finalArea,
        sectionName: finalArea,
        type: srvType,
        estimatedDays: srvDays,
        active: srvActive
      });
      alert('Servicio actualizado correctamente.');
    } else {
      addService({
        code: srvCode.toUpperCase() || undefined,
        name: srvName,
        area: finalArea,
        sectionName: finalArea,
        type: srvType,
        estimatedDays: srvDays,
        active: srvActive
      });
      alert('Nuevo servicio agregado exitosamente al catálogo.');
    }

    setShowSrvModal(false);
  };

  const handleToggleStatus = (srv: ServiceItem) => {
    updateService({
      ...srv,
      active: !srv.active
    });
  };

  const handleDeleteService = (srv: ServiceItem) => {
    if (confirm(`¿Está seguro de eliminar el servicio "${srv.name}"?`)) {
      deleteService(srv.id);
    }
  };

  const handleResetCatalog = () => {
    if (confirm('¿Restablecer el catálogo de Servicios Periciales al catálogo oficial de 101 servicios del IITCUP?')) {
      resetServicesToDefault();
      alert('Catálogo de servicios periciales restablecido exitosamente.');
    }
  };

  const handleSecSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSection({
      code: secCode.toUpperCase(),
      name: secName,
      description: secDesc,
      managerName: secManager,
      active: true
    });
    alert('Sección agregada exitosamente.');
    setShowSecModal(false);
    setSecCode('');
    setSecName('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-6 h-6 text-emerald-600" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Administración de Servicios Periciales
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gestión centralizada del catálogo de Áreas, Tipos de Servicio y Servicios Periciales del IITCUP (Módulo de Administración)
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowSqlModal(true)}
            className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-extrabold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 border border-amber-400 shadow-xs cursor-pointer transition-all"
            title="Generar script SQL para Supabase"
          >
            <Database className="w-4 h-4 text-slate-950" />
            <span>Script SQL Supabase</span>
          </button>

          <button
            onClick={handleResetCatalog}
            className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 border border-slate-300 dark:border-slate-700 cursor-pointer"
            title="Restablecer al catálogo base de 101 servicios oficial"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Restablecer Catálogo Oficial</span>
          </button>

          <button
            onClick={() => setShowSecModal(true)}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 border border-slate-700"
          >
            <Plus className="w-4 h-4" /> Nueva Sección
          </button>

          <button
            onClick={handleOpenNewServiceModal}
            className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md border border-emerald-600"
          >
            <Plus className="w-4 h-4" /> Agregar Servicio Pericial
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-4">
        <button
          onClick={() => setActiveTab('SERVICES')}
          className={`pb-3 px-2 font-bold text-sm flex items-center gap-2 transition-colors border-b-2 ${
            activeTab === 'SERVICES'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Catálogo de Servicios Periciales ({services.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('SECTIONS')}
          className={`pb-3 px-2 font-bold text-sm flex items-center gap-2 transition-colors border-b-2 ${
            activeTab === 'SECTIONS'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Secciones Especializadas ({sections.length})</span>
        </button>
      </div>

      {activeTab === 'SERVICES' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            {/* Search */}
            <div className="relative">
              <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Buscar Servicio / Código</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Ej. Balístico, UFED, ADN..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
                />
              </div>
            </div>

            {/* Filter Area */}
            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Área Pericial</label>
              <select
                value={filterArea}
                onChange={e => setFilterArea(e.target.value)}
                className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-emerald-600 font-semibold text-slate-800 dark:text-slate-200"
              >
                <option value="TODAS">TODAS LAS ÁREAS ({uniqueAreas.length})</option>
                {uniqueAreas.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            {/* Filter Type */}
            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Tipo de Servicio</label>
              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-emerald-600 font-semibold text-emerald-800 dark:text-emerald-400"
              >
                <option value="TODOS">TODOS LOS TIPOS</option>
                {uniqueTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Filter Status */}
            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Estado</label>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
              >
                <option value="TODOS">TODOS LOS ESTADOS</option>
                <option value="ACTIVO">SÓLO ACTIVOS</option>
                <option value="INACTIVO">SÓLO INACTIVOS</option>
              </select>
            </div>
          </div>

          {/* Table of Services */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center font-bold text-slate-700 dark:text-slate-200">
              <span>Listado Oficial de Servicios Periciales ({filteredServices.length} de {services.length})</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    <th className="p-3 text-center w-12">N°</th>
                    <th className="p-3 w-28">Código</th>
                    <th className="p-3 w-48">Área Pericial</th>
                    <th className="p-3 w-44">Tipo de Servicio</th>
                    <th className="p-3">Nombre del Servicio Pericial</th>
                    <th className="p-3 text-center w-24">Plazo Est.</th>
                    <th className="p-3 text-center w-28">Estado</th>
                    <th className="p-3 text-right w-24">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
                  {filteredServices.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400 italic">
                        No se encontraron servicios periciales con los criterios de búsqueda seleccionados.
                      </td>
                    </tr>
                  ) : (
                    filteredServices.map((srv, idx) => (
                      <tr key={srv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="p-3 text-center text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                        <td className="p-3 font-mono font-bold text-amber-600 dark:text-amber-400">
                          {srv.code ? `[${srv.code}]` : '-'}
                        </td>
                        <td className="p-3 font-bold text-slate-900 dark:text-slate-100">
                          {srv.area || srv.sectionName}
                        </td>
                        <td className="p-3">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight ${
                            srv.type === 'SERVICIO PERICIAL' || srv.type === 'PERICIAL'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                              : srv.type === 'SERVICIO TÉCNICO' || srv.type === 'TECNICO'
                              ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border border-sky-300 dark:border-sky-800'
                              : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-300 dark:border-purple-800'
                          }`}>
                            {srv.type}
                          </span>
                        </td>
                        <td className="p-3 font-medium text-slate-900 dark:text-slate-100">
                          {srv.name}
                        </td>
                        <td className="p-3 text-center text-slate-500 font-mono">
                          {srv.estimatedDays || 5} d
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleToggleStatus(srv)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all flex items-center justify-center gap-1 mx-auto ${
                              srv.active
                                ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border border-emerald-500/30'
                                : 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/30'
                            }`}
                          >
                            {srv.active ? (
                              <>
                                <CheckCircle2 className="w-3 h-3" /> Activo
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3" /> Inactivo
                              </>
                            )}
                          </button>
                        </td>
                        <td className="p-3 text-right space-x-1">
                          <button
                            onClick={() => handleOpenEditServiceModal(srv)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition-colors inline-block"
                            title="Editar Servicio"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteService(srv)}
                            className="p-1.5 bg-rose-100 hover:bg-rose-200 dark:bg-rose-950 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 rounded-lg transition-colors inline-block"
                            title="Eliminar Servicio"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'SECTIONS' && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <h2 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
              Secciones Especializadas del IITCUP ({sections.length})
            </h2>
            <button
              onClick={() => setShowSecModal(true)}
              className="bg-slate-800 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Agregar Sección
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {sections.map(s => (
              <div key={s.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-amber-500 font-extrabold text-sm mr-2">[{s.code}]</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{s.name}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 rounded text-[10px] font-mono">
                    {s.managerName || 'Sin Encargado'}
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Add / Edit Service */}
      {showSrvModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-3">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg p-6 space-y-4 text-xs shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-600" />
                <span>{editingService ? 'Editar Servicio Pericial' : 'Nuevo Servicio Pericial'}</span>
              </h3>
              <button onClick={() => setShowSrvModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSrvSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Area */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    1° Área Pericial *
                  </label>
                  <select
                    value={srvArea}
                    onChange={e => setSrvArea(e.target.value)}
                    className="w-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg p-2.5 font-bold outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    {uniqueAreas.map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                    <option value="OTRO">+ AGREGAR NUEVA ÁREA...</option>
                  </select>
                </div>

                {/* Custom Area if selected OTRO */}
                {srvArea === 'OTRO' ? (
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Nombre de la Nueva Área *
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. ODONTOLOGÍA FORENSE"
                      value={customArea}
                      onChange={e => setCustomArea(e.target.value)}
                      required
                      className="w-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg p-2.5 uppercase font-bold outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                ) : (
                  /* Code */
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Código de Servicio (Opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. BAL-01, BIO-02..."
                      value={srvCode}
                      onChange={e => setSrvCode(e.target.value)}
                      className="w-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg p-2.5 font-mono uppercase outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Service Type */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    2° Tipo de Servicio *
                  </label>
                  <select
                    value={srvType}
                    onChange={e => setSrvType(e.target.value)}
                    className="w-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg p-2.5 font-bold text-emerald-800 dark:text-emerald-400 outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="SERVICIO PERICIAL">SERVICIO PERICIAL</option>
                    <option value="SERVICIO TÉCNICO">SERVICIO TÉCNICO</option>
                    <option value="SERVICIO ESPECIAL">SERVICIO ESPECIAL</option>
                  </select>
                </div>

                {/* Estimated Days */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Plazo Estimado (Días Hábiles)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={srvDays}
                    onChange={e => setSrvDays(Number(e.target.value))}
                    className="w-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                  />
                </div>
              </div>

              {/* Service Name */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  3° Nombre del Servicio Pericial Específico *
                </label>
                <textarea
                  rows={2}
                  value={srvName}
                  onChange={e => setSrvName(e.target.value)}
                  placeholder="Ej. Estudio Comparativo Balístico de Vaina/Proyectil..."
                  required
                  className="w-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                <input
                  type="checkbox"
                  id="srvActiveCheck"
                  checked={srvActive}
                  onChange={e => setSrvActive(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <label htmlFor="srvActiveCheck" className="font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                  Servicio Activo en Formulario de Recepción
                </label>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSrvModal(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 font-bold rounded-xl text-slate-700 dark:text-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md border border-emerald-600"
                >
                  {editingService ? 'Guardar Cambios' : 'Crear Servicio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Section */}
      {showSecModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-3">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md p-5 space-y-4 text-xs shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between border-b pb-2 font-bold text-base">
              <span>Nueva Sección Forense</span>
              <button onClick={() => setShowSecModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSecSubmit} className="space-y-3">
              <div><label className="block font-bold">Código (3 letras) *</label><input type="text" maxLength={4} value={secCode} onChange={e => setSecCode(e.target.value)} required className="w-full border rounded p-2 font-mono uppercase" /></div>
              <div><label className="block font-bold">Nombre Sección *</label><input type="text" value={secName} onChange={e => setSecName(e.target.value)} required className="w-full border rounded p-2 font-bold" /></div>
              <div><label className="block font-bold">Descripción</label><input type="text" value={secDesc} onChange={e => setSecDesc(e.target.value)} className="w-full border rounded p-2" /></div>
              <div><label className="block font-bold">Encargado de Sección</label><input type="text" value={secManager} onChange={e => setSecManager(e.target.value)} className="w-full border rounded p-2" /></div>
              <div className="pt-2 flex justify-end gap-2"><button type="button" onClick={() => setShowSecModal(false)} className="px-3 py-1.5 bg-slate-200 rounded">Cancelar</button><button type="submit" className="px-4 py-1.5 bg-emerald-800 text-white font-bold rounded">Guardar</button></div>
            </form>
          </div>
        </div>
      )}

      {/* Supabase SQL Script Generator Modal for Secciones & Servicios */}
      {showSqlModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="bg-slate-950 text-white p-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-extrabold text-sm uppercase tracking-wider">
                    Script SQL para Migración a Supabase (Secciones y Servicios)
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Incluye definición de tablas 'secciones' y 'servicios', llaves foráneas, índices y migración de {sections.length} Secciones y {services.length} Servicios Periciales.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSqlModal(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Action Bar */}
            <div className="p-3 bg-slate-100 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                <FileCode className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Compatibilidad: PostgreSQL 12+ / Supabase SQL Editor</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopySql}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                    copiedSql
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-800 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {copiedSql ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedSql ? '¡Copiado al Portapapeles!' : 'Copiar Script SQL'}
                </button>

                <button
                  type="button"
                  onClick={handleDownloadSql}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-sm border border-amber-400"
                >
                  <Download className="w-4 h-4 text-slate-950" />
                  Descargar .sql
                </button>
              </div>
            </div>

            {/* Code Output */}
            <div className="p-4 bg-slate-950 text-slate-100 overflow-y-auto font-mono text-xs leading-relaxed flex-1 select-all">
              <pre className="whitespace-pre-wrap">{generatedSqlScript}</pre>
            </div>

            {/* Footer Notice */}
            <div className="p-3 bg-slate-900 text-slate-400 text-[11px] border-t border-slate-800 flex items-center justify-between">
              <span> Ejecuta este script en el <strong>SQL Editor</strong> del panel de control de tu proyecto en Supabase.</span>
              <button
                type="button"
                onClick={() => setShowSqlModal(false)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
