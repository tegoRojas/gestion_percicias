import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Requirement, ReportUpload, FileAttachment } from '../types';
import { generateRequirementPDF } from '../services/exports';
import {
  FileCheck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Eye,
  FileText,
  Paperclip,
  Download,
  Star,
  Check,
  X,
  UserCheck,
  Clock,
  ShieldCheck,
  Building,
  HelpCircle
} from 'lucide-react';

export const RevisionTecnicaView: React.FC = () => {
  const {
    requirements,
    reports,
    addTechnicalReview,
    currentUser,
    technicalReviews,
    setSelectedRup,
    setActiveView
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'PENDIENTES' | 'OBSERVADOS' | 'APROBADOS' | 'TODOS'>('PENDIENTES');

  // Modal for technical evaluation
  const [selectedReport, setSelectedReport] = useState<ReportUpload | null>(null);
  const [selectedReq, setSelectedReq] = useState<Requirement | null>(null);
  const [showEvalModal, setShowEvalModal] = useState(false);

  // Modal for details & attachments preview
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [previewAttachment, setPreviewAttachment] = useState<FileAttachment | null>(null);

  // Form state for technical evaluation
  const [metodologiaScore, setMetodologiaScore] = useState<number>(5);
  const [puntosPericiaAbsolvidos, setPuntosPericiaAbsolvidos] = useState<boolean>(true);
  const [instrumentalValido, setInstrumentalValido] = useState<boolean>(true);
  const [conclusionesFundamentadas, setConclusionesFundamentadas] = useState<boolean>(true);
  const [observations, setObservations] = useState<string>('');

  // Get list of reports in pipeline
  const enrichedReports = reports.map(rep => {
    const req = requirements.find(r => r.id === rep.requirementId);
    return {
      report: rep,
      requirement: req
    };
  });

  const filteredReports = enrichedReports.filter(({ report, requirement }) => {
    if (!requirement) return false;

    // Filter by user search
    const matchesSearch =
      requirement.rup.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      requirement.sectionName.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    const stage = report.currentReviewStage || 'PENDIENTE_REVISION_TECNICA';

    if (statusFilter === 'PENDIENTES') {
      return stage === 'PENDIENTE_REVISION_TECNICA';
    } else if (statusFilter === 'OBSERVADOS') {
      return stage === 'OBSERVADO_TECNICO';
    } else if (statusFilter === 'APROBADOS') {
      return stage === 'PENDIENTE_CONTROL_CALIDAD' || stage === 'OBSERVADO_CALIDAD' || stage === 'CONCLUIDO';
    }
    return true;
  });

  const pendingCount = enrichedReports.filter(r => (r.report.currentReviewStage || 'PENDIENTE_REVISION_TECNICA') === 'PENDIENTE_REVISION_TECNICA').length;
  const observedCount = enrichedReports.filter(r => r.report.currentReviewStage === 'OBSERVADO_TECNICO').length;
  const approvedCount = enrichedReports.filter(r => ['PENDIENTE_CONTROL_CALIDAD', 'OBSERVADO_CALIDAD', 'CONCLUIDO'].includes(r.report.currentReviewStage || '')).length;

  const handleOpenEvaluation = (report: ReportUpload, req: Requirement) => {
    setSelectedReport(report);
    setSelectedReq(req);
    // Reset form defaults
    setMetodologiaScore(5);
    setPuntosPericiaAbsolvidos(true);
    setInstrumentalValido(true);
    setConclusionesFundamentadas(true);
    setObservations('');
    setShowEvalModal(true);
  };

  const handleOpenDetail = (report: ReportUpload, req: Requirement) => {
    setSelectedReport(report);
    setSelectedReq(req);
    setShowDetailModal(true);
  };

  const handleSubmitEvaluation = (isApproved: boolean) => {
    if (!selectedReport || !selectedReq) return;

    if (!isApproved && !observations.trim()) {
      alert('Por favor especifique en el campo de observaciones las correcciones o detalles técnicos que el Perito debe subsanar.');
      return;
    }

    addTechnicalReview({
      reportId: selectedReport.id,
      requirementId: selectedReq.id,
      rup: selectedReq.rup,
      status: isApproved ? 'APROBADO_TECNICO' : 'OBSERVADO_TECNICO',
      metodologiaScore,
      puntosPericiaAbsolvidos,
      instrumentalValido,
      conclusionesFundamentadas,
      observations: observations.trim() || (isApproved ? 'Aprobado satisfactoriamente sin observaciones técnicas.' : 'Revisión técnica observada.')
    });

    alert(
      isApproved
        ? `¡Evaluación Técnica Aprobada!\nEl informe del RUP ${selectedReq.rup} pasó exitosamente a la etapa de Control de Calidad.`
        : `¡Informe Observado Técnicamente!\nSe notificó al perito autor para la corrección de los aspectos señalados en RUP ${selectedReq.rup}.`
    );

    setShowEvalModal(false);
    setSelectedReport(null);
    setSelectedReq(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-xl p-6 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-emerald-300 text-sm font-medium mb-1">
              <ShieldCheck className="w-5 h-5" />
              <span>Evaluación Metodológica y Rigor Científico</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Revisión Técnica - Encargado de Área</h1>
            <p className="text-emerald-100/80 text-sm mt-1 max-w-2xl">
              Evaluación especializada del contenido técnico, sustento científico, absolución de puntos periciales e instrumental utilizado en informes periciales.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-lg border border-white/20">
            <UserCheck className="w-8 h-8 text-emerald-300" />
            <div>
              <p className="text-xs text-emerald-200 uppercase tracking-wider font-semibold">Evaluador Autorizado</p>
              <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
              <p className="text-xs text-emerald-300 font-medium">{currentUser.cargo || 'Encargado de Área Técnicamente Asignado'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setStatusFilter('PENDIENTES')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            statusFilter === 'PENDIENTES'
              ? 'bg-amber-50 border-amber-300 dark:bg-amber-950/40 dark:border-amber-700 ring-2 ring-amber-500/20'
              : 'bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Pendientes de Evaluación
            </span>
            <div className="p-2 bg-amber-100 dark:bg-amber-900/60 rounded-lg text-amber-600 dark:text-amber-300">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{pendingCount}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">informes requeridos</span>
          </div>
        </div>

        <div
          onClick={() => setStatusFilter('OBSERVADOS')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            statusFilter === 'OBSERVADOS'
              ? 'bg-rose-50 border-rose-300 dark:bg-rose-950/40 dark:border-rose-700 ring-2 ring-rose-500/20'
              : 'bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700 hover:border-rose-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-400">
              Observados Técnicamente
            </span>
            <div className="p-2 bg-rose-100 dark:bg-rose-900/60 rounded-lg text-rose-600 dark:text-rose-300">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{observedCount}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">en subsanación</span>
          </div>
        </div>

        <div
          onClick={() => setStatusFilter('APROBADOS')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            statusFilter === 'APROBADOS'
              ? 'bg-emerald-50 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-700 ring-2 ring-emerald-500/20'
              : 'bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Aprobados Técnicamente
            </span>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/60 rounded-lg text-emerald-600 dark:text-emerald-300">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{approvedCount}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">derivados a Control Calidad</span>
          </div>
        </div>
      </div>

      {/* Filters & Controls */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por RUP, Perito, N° Informe o Sección..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setStatusFilter('PENDIENTES')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === 'PENDIENTES'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Pendientes ({pendingCount})
          </button>
          <button
            onClick={() => setStatusFilter('OBSERVADOS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === 'OBSERVADOS'
                ? 'bg-rose-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Observados ({observedCount})
          </button>
          <button
            onClick={() => setStatusFilter('APROBADOS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === 'APROBADOS'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Aprobados ({approvedCount})
          </button>
          <button
            onClick={() => setStatusFilter('TODOS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === 'TODOS'
                ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Todos ({enrichedReports.length})
          </button>
        </div>
      </div>

      {/* Reports Table / List */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-800 dark:text-white flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Informes para Evaluación Técnica</span>
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Mostrando {filteredReports.length} registros
          </span>
        </div>

        {filteredReports.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle className="w-12 h-12 text-emerald-500/50 mx-auto mb-3" />
            <p className="text-base font-medium text-slate-700 dark:text-slate-300">No hay informes en esta categoría</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Los informes concluidos por Peritos o Técnicos aparecerán automáticamente aquí para revisión del Encargado de Área.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-3">Código RUP / Documento</th>
                  <th className="px-6 py-3">Perito / Área Forense</th>
                  <th className="px-6 py-3">Tipo de Informe</th>
                  <th className="px-6 py-3">Resumen / Síntesis</th>
                  <th className="px-6 py-3">Estado Evaluación</th>
                  <th className="px-6 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredReports.map(({ report, requirement }) => {
                  if (!requirement) return null;
                  const stage = report.currentReviewStage || 'PENDIENTE_REVISION_TECNICA';

                  return (
                    <tr key={report.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{requirement.rup}</span>
                        </div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">{report.documentNumber}</div>
                        <div className="text-[11px] text-slate-400 mt-1">
                          Cargado: {new Date(report.uploadDateTime).toLocaleDateString()} {new Date(report.uploadDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900 dark:text-white">{report.uploadedBy}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          <span>{requirement.sectionName}</span>
                        </div>
                        <div className="text-[11px] text-emerald-600 dark:text-emerald-400">{requirement.serviceName}</div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                          {report.reportType.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="px-6 py-4 max-w-xs">
                        <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2">
                          {report.summary}
                        </p>
                        {report.attachments && report.attachments.length > 0 && (
                          <div className="flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 mt-1">
                            <Paperclip className="w-3 h-3" />
                            <span>{report.attachments.length} archivo(s) adjunto(s)</span>
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {stage === 'PENDIENTE_REVISION_TECNICA' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Pendiente Evaluación</span>
                          </span>
                        )}

                        {stage === 'OBSERVADO_TECNICO' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-700">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Observado Técnico</span>
                          </span>
                        )}

                        {['PENDIENTE_CONTROL_CALIDAD', 'OBSERVADO_CALIDAD', 'CONCLUIDO'].includes(stage) && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Aprobado Técnico</span>
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenDetail(report, requirement)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700 transition-colors"
                            title="Ver Detalle de Caso e Informe"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {stage === 'PENDIENTE_REVISION_TECNICA' || stage === 'OBSERVADO_TECNICO' ? (
                            <button
                              onClick={() => handleOpenEvaluation(report, requirement)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium shadow-sm transition-colors"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Evaluar Técnico</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleOpenDetail(report, requirement)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Ver Resultado</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* EVALUATION MODAL */}
      {showEvalModal && selectedReport && selectedReq && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden my-8">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-6 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Evaluación de Aspectos Técnicos y Metodológicos</span>
                </div>
                <h3 className="text-xl font-bold text-white mt-1">
                  RUP: {selectedReq.rup} - {selectedReport.documentNumber}
                </h3>
              </div>
              <button
                onClick={() => setShowEvalModal(false)}
                className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Summary Box */}
              <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-slate-700 dark:text-slate-300">
                  <div>
                    <span className="text-slate-400 block">Perito/Técnico Autor:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{selectedReport.uploadedBy}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Sección Forense:</span>
                    <span className="font-semibold">{selectedReq.sectionName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Servicio Solicitado:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{selectedReq.serviceName}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block mb-1">Puntos de Pericia requeridos por Fiscalía/Autoridad:</span>
                  <p className="p-2 bg-white dark:bg-slate-800 rounded text-slate-800 dark:text-slate-200 italic border border-slate-200 dark:border-slate-700">
                    "{selectedReq.puntosPericia}"
                  </p>
                </div>
                <div className="pt-2">
                  <span className="text-slate-400 block mb-1">Síntesis / Resumen del Dictamen Cargado:</span>
                  <p className="p-2.5 bg-emerald-50/50 dark:bg-emerald-950/20 text-slate-800 dark:text-slate-200 rounded border border-emerald-200 dark:border-emerald-800">
                    {selectedReport.summary}
                  </p>
                </div>

                {selectedReport.attachments && selectedReport.attachments.length > 0 && (
                  <div className="pt-2">
                    <span className="text-slate-400 block mb-1">Archivos y Documentos Adjuntos por el Perito:</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedReport.attachments.map(att => (
                        <a
                          key={att.id}
                          href={att.dataUrl || '#'}
                          download={att.name}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-medium text-emerald-700 dark:text-emerald-400 transition-colors"
                        >
                          <Paperclip className="w-3.5 h-3.5" />
                          <span>{att.name}</span>
                          <Download className="w-3 h-3 text-slate-400 ml-1" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* TECHNICAL EVALUATION FORM */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Matriz de Evaluación Técnica Forense</span>
                </h4>

                {/* Score Metodológico */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">
                      1. Calificación de Metodología y Procedimiento Científico
                    </label>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Evaluación de rigor de investigación, cadena de custodia e instrumental.
                    </span>
                  </div>
                  <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                    {[1, 2, 3, 4, 5].map(score => (
                      <button
                        key={score}
                        type="button"
                        onClick={() => setMetodologiaScore(score)}
                        className={`p-1 transition-transform ${score <= metodologiaScore ? 'text-amber-500 scale-110' : 'text-slate-300 dark:text-slate-600'}`}
                      >
                        <Star className="w-6 h-6 fill-current" />
                      </button>
                    ))}
                    <span className="ml-2 text-xs font-bold text-slate-700 dark:text-slate-300">{metodologiaScore}/5</span>
                  </div>
                </div>

                {/* Check 1 */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">
                      2. Absolución de Puntos Periciales
                    </label>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      ¿El dictamen responde cabalmente a todas las preguntas requeridas por la autoridad?
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPuntosPericiaAbsolvidos(true)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                        puntosPericiaAbsolvidos
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" /> Sí
                    </button>
                    <button
                      type="button"
                      onClick={() => setPuntosPericiaAbsolvidos(false)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                        !puntosPericiaAbsolvidos
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <X className="w-3.5 h-3.5" /> No
                    </button>
                  </div>
                </div>

                {/* Check 2 */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">
                      3. Instrumental, Reactivos o Software Forense
                    </label>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      ¿Se utilizó equipamiento certificado, calibrado o software forense validado?
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setInstrumentalValido(true)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                        instrumentalValido
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" /> Válido
                    </button>
                    <button
                      type="button"
                      onClick={() => setInstrumentalValido(false)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                        !instrumentalValido
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <X className="w-3.5 h-3.5" /> Inadecuado
                    </button>
                  </div>
                </div>

                {/* Check 3 */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">
                      4. Fundamentación Científica de Conclusiones
                    </label>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      ¿Las conclusiones derivan directamente del análisis objetivo realizado?
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setConclusionesFundamentadas(true)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                        conclusionesFundamentadas
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" /> Fundamentado
                    </button>
                    <button
                      type="button"
                      onClick={() => setConclusionesFundamentadas(false)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                        !conclusionesFundamentadas
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <X className="w-3.5 h-3.5" /> Insuficiente
                    </button>
                  </div>
                </div>

                {/* Textarea Observaciones */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Fundamentación del Dictamen Técnico / Observaciones a Subsanar <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={observations}
                    onChange={e => setObservations(e.target.value)}
                    placeholder="Detalle los argumentos técnicos de la aprobación o las observaciones específicas que el Perito debe ajustar (ej.: aclarar calibración del microscopio balístico, ampliar el informe de extracción UFED)..."
                    className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="bg-slate-50 dark:bg-slate-900/80 p-4 px-6 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setShowEvalModal(false)}
                className="w-full sm:w-auto px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 text-sm font-medium transition-colors"
              >
                Cancelar
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleSubmitEvaluation(false)}
                  className="w-full sm:w-auto px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Observar Informe</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSubmitEvaluation(true)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Aprobar y Derivar a Control de Calidad</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {showDetailModal && selectedReport && selectedReq && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden my-8">
            <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">Detalle de Historial y Evaluación</span>
                <h3 className="text-xl font-bold text-white mt-1">RUP: {selectedReq.rup}</h3>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-sm text-slate-700 dark:text-slate-300">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl">
                <div>
                  <span className="text-xs text-slate-400 block">N° Documento:</span>
                  <span className="font-bold font-mono text-slate-900 dark:text-white">{selectedReport.documentNumber}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Perito / Técnico Autor:</span>
                  <span className="font-semibold">{selectedReport.uploadedBy}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Sección:</span>
                  <span>{selectedReq.sectionName}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Servicio:</span>
                  <span>{selectedReq.serviceName}</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 block mb-1 font-semibold">Resumen del Dictamen:</span>
                <p className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg text-xs leading-relaxed border border-slate-200 dark:border-slate-700">
                  {selectedReport.summary}
                </p>
              </div>

              {/* Technical Reviews History */}
              {selectedReport.technicalReviews && selectedReport.technicalReviews.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                    Historial de Evaluaciones Técnicas
                  </h4>
                  <div className="space-y-2">
                    {selectedReport.technicalReviews.map(tr => (
                      <div key={tr.id} className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs">
                        <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white mb-1">
                          <span>{tr.reviewerName} ({tr.reviewerGrado || 'Encargado Área'})</span>
                          <span className={tr.status === 'APROBADO_TECNICO' ? 'text-emerald-600' : 'text-rose-600'}>
                            {tr.status}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 mt-1">{tr.observations}</p>
                        <div className="text-[10px] text-slate-400 mt-2">
                          Evaluado el: {new Date(tr.reviewedAt).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/80 p-4 px-6 border-t border-slate-200 dark:border-slate-700 flex justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 bg-slate-800 text-white hover:bg-slate-900 rounded-xl text-xs font-semibold"
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
