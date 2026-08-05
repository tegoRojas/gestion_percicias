import React from 'react';
import { useApp } from '../context/AppContext';
import {
  FileCheck2,
  Clock,
  CheckCircle2,
  XCircle,
  PackageCheck,
  Building2,
  Sliders,
  TrendingUp,
  FileText,
  Printer
} from 'lucide-react';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from 'recharts';

import { generateRequirementPDF } from '../services/exports';

export const DashboardView: React.FC = () => {
  const { requirements, evidences, sections, offices, proveidos, reports, setSelectedRup, setActiveView } = useApp();

  // Metrics
  const totalRegistered = requirements.length;
  const totalPending = requirements.filter(r => r.status === 'REGISTRADO' || r.status === 'EN_REVISION' || r.status === 'ASIGNADO' || r.status === 'EN_PROCESO').length;
  const totalCompleted = requirements.filter(r => r.status === 'CONCLUIDO' || r.status === 'ENTREGADO' || r.status === 'FINALIZADO').length;
  const totalRepresented = requirements.filter(r => r.status === 'REPRESENTADO').length;
  const totalInCustody = evidences.filter(e => e.status === 'EN_CUSTODIA').length;

  // By Section chart data
  const sectionCounts = sections.map(sec => {
    const count = requirements.filter(r => r.sectionId === sec.id).length;
    return { name: sec.name.split(' ')[0], full: sec.name, count };
  }).filter(s => s.count > 0);

  // By Service Type
  const pericialCount = requirements.filter(r => r.serviceType === 'PERICIAL').length;
  const tecnicoCount = requirements.filter(r => r.serviceType === 'TECNICO').length;
  const ambosCount = requirements.filter(r => r.serviceType === 'AMBOS').length;

  const serviceTypeData = [
    { name: 'Pericial', value: pericialCount, color: '#004d25' },
    { name: 'Técnico', value: tecnicoCount, color: '#d97706' },
    { name: 'Ambos', value: ambosCount, color: '#0284c7' }
  ].filter(d => d.value > 0);

  // By Office
  const officeData = offices.map(off => ({
    name: off.name.replace('Oficina Regional ', ''),
    count: requirements.filter(r => r.regionalOfficeId === off.id).length
  }));

  // Monthly trend simulated/calculated
  const trendData = [
    { month: 'Mayo', registrados: 18, concluidos: 15 },
    { month: 'Junio', registrados: 24, concluidos: 21 },
    { month: 'Julio', registrados: 32, concluidos: 28 },
    { month: 'Agosto', registrados: requirements.length, concluidos: totalCompleted }
  ];

  return (
    <div className="space-y-6">
      
      {/* Banner Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-emerald-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-emerald-950 text-[10px] font-extrabold uppercase tracking-wide">
              IITCUP Regional Santa Cruz
            </span>
            <span className="text-xs text-emerald-300 font-medium">Panel de Control Operativo</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight">
            Gestión Integral de Requerimientos Periciales
          </h1>
          <p className="text-emerald-200/90 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Control en tiempo real de recepción de causas, proveídos, cadena de custodia y emisión de dictámenes periciales.
          </p>
        </div>

        <button
          onClick={() => setActiveView('recepcion')}
          className="bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold px-4 py-2.5 rounded-xl shadow-lg hover:shadow-amber-500/20 text-xs sm:text-sm transition-all flex items-center gap-2 shrink-0 border border-amber-300/60 cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          + Registrar Nuevo RUP
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        
        {/* Total Registrados */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Total RUP</span>
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">
            {totalRegistered}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Casos ingresados</div>
        </div>

        {/* Pendientes */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Pendientes</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-2">
            {totalPending}
          </div>
          <div className="text-[11px] text-amber-600 font-medium mt-1">En revisión / proceso</div>
        </div>

        {/* Concluidos */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold font-sans">Concluidos</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
            {totalCompleted}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Dictámenes listos</div>
        </div>

        {/* Representados */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Representados</span>
            <XCircle className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-red-600 dark:text-red-400 mt-2">
            {totalRepresented}
          </div>
          <div className="text-[11px] text-red-500 font-medium mt-1">Devueltos con observación</div>
        </div>

        {/* Evidencias en Custodia */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">En Custodia</span>
            <PackageCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-2">
            {totalInCustody}
          </div>
          <div className="text-[11px] text-blue-600 font-medium mt-1">Items en Sala de Evidencias</div>
        </div>

      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Casos por Sección */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Casos Atendidos por Sección Forense</h3>
            </div>
            <span className="text-[11px] text-slate-500">IITCUP SCZ</span>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectionCounts} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#004d25" radius={[4, 4, 0, 0]} name="Requerimientos" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Tipo de Servicio & Tendencia */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Distribución por Tipo de Servicio</h3>
            </div>
            <span className="text-[11px] text-slate-500">Pericial vs Técnico</span>
          </div>

          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={serviceTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                >
                  {serviceTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Recent Requirements Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">Últimos Requerimientos Ingresados</h3>
            <p className="text-xs text-slate-500">Trazabilidad en tiempo real de requerimientos periciales y técnicos</p>
          </div>

          <button
            onClick={() => setActiveView('recepcion')}
            className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
          >
            Ver todos los requerimientos →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">N° RUP</th>
                <th className="p-3">Fecha</th>
                <th className="p-3">Origen / Solicitante</th>
                <th className="p-3">Sección</th>
                <th className="p-3">Servicio</th>
                <th className="p-3">Evidencias</th>
                <th className="p-3">Estado</th>
                <th className="p-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {requirements.slice(0, 5).map(req => {
                const prov = proveidos.find(p => p.requirementId === req.id);
                const rep = reports.find(r => r.requirementId === req.id);
                const ev = evidences.find(e => e.requirementId === req.id);

                return (
                  <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-3 font-mono font-bold text-emerald-800 dark:text-emerald-400">
                      {req.rup}
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">
                      {new Date(req.entryDateTime).toLocaleDateString('es-BO')}
                    </td>
                    <td className="p-3 text-slate-900 dark:text-slate-100 font-medium">
                      <div>{req.origin}</div>
                      <div className="text-[10px] text-slate-500">{req.applicantName}</div>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{req.sectionName}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300 max-w-xs truncate">{req.serviceName}</td>
                    <td className="p-3">
                      {req.hasEvidence ? (
                        <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-300 dark:border-amber-800">
                          SÍ
                        </span>
                      ) : (
                        <span className="text-slate-400">NO</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        req.status === 'CONCLUIDO' || req.status === 'FINALIZADO'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                          : req.status === 'REPRESENTADO'
                          ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => generateRequirementPDF(req, ev, prov, rep)}
                        className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px] inline-flex items-center gap-1 border border-emerald-200 dark:border-emerald-800"
                        title="Imprimir Ficha Oficial RUP"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        PDF
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
