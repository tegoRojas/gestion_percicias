import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { exportToExcel, generateRequirementsListPDF } from '../services/exports';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Filter,
  Search,
  Calendar,
  Sliders,
  Building2,
  Users
} from 'lucide-react';

export const ReportesView: React.FC = () => {
  const { requirements, sections, services, offices, users, proveidos } = useApp();

  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedOffice, setSelectedOffice] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPerito, setSelectedPerito] = useState('');

  const peritosList = users.filter(u => u.role === 'PERITO' || u.role === 'TECNICO');

  // Filter requirements
  const filtered = requirements.filter(r => {
    if (dateStart && new Date(r.entryDateTime) < new Date(dateStart)) return false;
    if (dateEnd && new Date(r.entryDateTime) > new Date(dateEnd + 'T23:59:59')) return false;
    if (selectedSection && r.sectionId !== selectedSection) return false;
    if (selectedOffice && r.regionalOfficeId !== selectedOffice) return false;
    if (selectedStatus && r.status !== selectedStatus) return false;

    if (selectedPerito) {
      const prov = proveidos.find(p => p.requirementId === r.id);
      if (!prov || (prov.assignedPeritoId !== selectedPerito && prov.assignedTecnicoId !== selectedPerito)) {
        return false;
      }
    }

    return true;
  });

  const handleExcelExport = () => {
    const excelData = filtered.map(r => ({
      'N° RUP': r.rup,
      'Fecha Ingreso': new Date(r.entryDateTime).toLocaleString('es-BO'),
      'Oficina Regional': r.regionalOfficeName,
      'Origen Solicitante': r.origin,
      'Código CUD/Causa': r.externalCode,
      'Solicitante': r.applicantName,
      'Fojas': r.fojaCount,
      'Tipo Servicio': r.serviceType,
      'Sección': r.sectionName,
      'Servicio': r.serviceName,
      'Evidencias': r.hasEvidence ? 'SÍ' : 'NO',
      'Estado': r.status
    }));

    exportToExcel(excelData, 'Reporte_IITCUP_SantaCruz', 'Requerimientos');
  };

  const handlePdfExport = () => {
    generateRequirementsListPDF(filtered, 'REPORTE GENERAL DE REQUERIMIENTOS PERICIALES - IITCUP');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Reportes Estadísticos y Exportación
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generación de planillas Excel y reportes oficiales en PDF con múltiples filtros paramétricos
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExcelExport}
            className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm border border-emerald-600 cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-400" />
            Exportar Excel (.xlsx)
          </button>

          <button
            onClick={handlePdfExport}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm border border-slate-700 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            Exportar PDF
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 pb-2">
          <Filter className="w-4 h-4 text-amber-500" />
          Filtros de Búsqueda y Generación de Reporte
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">
              Fecha Desde
            </label>
            <input
              type="date"
              value={dateStart}
              onChange={e => setDateStart(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">
              Fecha Hasta
            </label>
            <input
              type="date"
              value={dateEnd}
              onChange={e => setDateEnd(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">
              Sección Forense
            </label>
            <select
              value={selectedSection}
              onChange={e => setSelectedSection(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs"
            >
              <option value="">Todas las Secciones</option>
              {sections.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">
              Oficina Regional
            </label>
            <select
              value={selectedOffice}
              onChange={e => setSelectedOffice(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs"
            >
              <option value="">Todas las Oficinas</option>
              {offices.map(o => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">
              Estado del Caso
            </label>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs"
            >
              <option value="">Todos los Estados</option>
              <option value="REGISTRADO">REGISTRADO</option>
              <option value="EN_REVISION">EN_REVISION</option>
              <option value="ASIGNADO">ASIGNADO</option>
              <option value="EN_PROCESO">EN_PROCESO</option>
              <option value="CONCLUIDO">CONCLUIDO</option>
              <option value="FINALIZADO">FINALIZADO</option>
              <option value="REPRESENTADO">REPRESENTADO</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">
              Perito / Técnico
            </label>
            <select
              value={selectedPerito}
              onChange={e => setSelectedPerito(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs"
            >
              <option value="">Todos los Peritos</option>
              {peritosList.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-300">
            Resultados filtrados: <span className="text-amber-500 font-extrabold text-sm">{filtered.length}</span> registros
          </span>

          <button
            onClick={() => {
              setDateStart('');
              setDateEnd('');
              setSelectedSection('');
              setSelectedOffice('');
              setSelectedStatus('');
              setSelectedPerito('');
            }}
            className="text-slate-500 hover:underline text-[11px]"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>

      {/* Filtered Data Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3">N° RUP</th>
                <th className="p-3">Ingreso</th>
                <th className="p-3">Oficina</th>
                <th className="p-3">Origen / Solicitante</th>
                <th className="p-3">CUD/Causa</th>
                <th className="p-3">Sección / Servicio</th>
                <th className="p-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-3 font-mono font-bold text-emerald-700 dark:text-emerald-400">{r.rup}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">{new Date(r.entryDateTime).toLocaleDateString('es-BO')}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{r.regionalOfficeName.split(' ')[2] || 'SCZ'}</td>
                  <td className="p-3 text-slate-900 dark:text-slate-100 font-medium">
                    <div>{r.origin}</div>
                    <div className="text-[10px] text-slate-500">{r.applicantName}</div>
                  </td>
                  <td className="p-3 font-mono text-slate-600 dark:text-slate-300">{r.externalCode}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{r.sectionName}</td>
                  <td className="p-3 font-bold text-amber-600 dark:text-amber-400">{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
