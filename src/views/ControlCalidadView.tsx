import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Requirement, ReportUpload, FileAttachment } from '../types';
import {
  FileCheck2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Eye,
  FileText,
  Paperclip,
  Download,
  Check,
  X,
  UserCheck,
  Clock,
  Award,
  Building,
  Sparkles,
  Layers,
  CheckSquare
} from 'lucide-react';

export const ControlCalidadView: React.FC = () => {
  const {
    requirements,
    reports,
    addQualityReview,
    currentUser,
    qualityReviews
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'PENDIENTES' | 'OBSERVADOS' | 'CONCLUIDOS' | 'TODOS'>('PENDIENTES');

  // Modal for quality evaluation
  const [selectedReport, setSelectedReport] = useState<ReportUpload | null>(null);
  const [selectedReq, setSelectedReq] = useState<Requirement | null>(null);
  const [showEvalModal, setShowEvalModal] = useState(false);

  // Modal for detail & preview
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Form state for quality evaluation
  const [formatoEstandarValido, setFormatoEstandarValido] = useState<boolean>(true);
  const [redaccionOrtografiaValida, setRedaccionOrtografiaValida] = useState<boolean>(true);
  const [estructuraLegalValida, setEstructuraLegalValida] = useState<boolean>(true);
  const [firmasYAnexosValidos, setFirmasYAnexosValidos] = useState<boolean>(true);
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

    // Filter by search
    const matchesSearch =
      requirement.rup.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      requirement.sectionName.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    const stage = report.currentReviewStage || 'PENDIENTE_REVISION_TECNICA';

    if (statusFilter === 'PENDIENTES') {
      return stage === 'PENDIENTE_CONTROL_CALIDAD';
    } else if (statusFilter === 'OBSERVADOS') {
      return stage === 'OBSERVADO_CALIDAD';
    } else if (statusFilter === 'CONCLUIDOS') {
      return stage === 'CONCLUIDO';
    }
    return true;
  });

  const pendingCount = enrichedReports.filter(r => r.report.currentReviewStage === 'PENDIENTE_CONTROL_CALIDAD').length;
  const observedCount = enrichedReports.filter(r => r.report.currentReviewStage === 'OBSERVADO_CALIDAD').length;
  const concludedCount = enrichedReports.filter(r => r.report.currentReviewStage === 'CONCLUIDO').length;

  const handleOpenEvaluation = (report: ReportUpload, req: Requirement) => {
    setSelectedReport(report);
    setSelectedReq(req);
    // Reset form defaults
    setFormatoEstandarValido(true);
    setRedaccionOrtografiaValida(true);
    setEstructuraLegalValida(true);
    setFirmasYAnexosValidos(true);
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
      alert('Por favor detalle en las observaciones las correcciones de forma (redacción, formato o anexos) que el Perito debe subsanar.');
      return;
    }

    addQualityReview({
      reportId: selectedReport.id,
      requirementId: selectedReq.id,
      rup: selectedReq.rup,
      status: isApproved ? 'APROBADO_CALIDAD' : 'OBSERVADO_CALIDAD',
      formatoEstandarValido,
      redaccionOrtografiaValida,
      estructuraLegalValida,
      firmasYAnexosValidos,
      observations: observations.trim() || (isApproved ? 'Aprobación de Control de Calidad de Forma sin observaciones.' : 'Observado en revisión de calidad de forma.')
    });

    alert(
      isApproved
        ? `¡Control de Calidad Aprobado Satisfactoriamente!\nEl informe del RUP ${selectedReq.rup} ha concluido su proceso de revisión y está listo para entrega formal.`
        : `¡Informe Observado en Control de Calidad!\nSe devolvió el caso RUP ${selectedReq.rup} al Perito para corregir los aspectos de forma indicados.`
    );

    setShowEvalModal(false);
    setSelectedReport(null);
    setSelectedReq(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-xl p-6 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-indigo-300 text-sm font-medium mb-1">
              <Award className="w-5 h-5" />
              <span>Verificación de Aspectos de Forma, Formato y Estructura Legal</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Control de Calidad</h1>
            <p className="text-indigo-100/80 text-sm mt-1 max-w-2xl">
              Auditoría final de calidad de forma: validez de plantilla oficial, corrección sintáctica, citas normativas y foliado de anexos previa notificación a autoridades.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-lg border border-white/20">
            <UserCheck className="w-8 h-8 text-indigo-300" />
            <div>
              <p className="text-xs text-indigo-200 uppercase tracking-wider font-semibold">Responsable de Calidad</p>
              <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
              <p className="text-xs text-indigo-300 font-medium">{currentUser.cargo || 'Auditor de Calidad IITCUP'}</p>
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
              ? 'bg-blue-50 border-blue-300 dark:bg-blue-950/40 dark:border-blue-700 ring-2 ring-blue-500/20'
              : 'bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400">
              En Espera de Control Calidad
            </span>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/60 rounded-lg text-blue-600 dark:text-blue-300">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{pendingCount}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">por evaluar forma</span>
          </div>
        </div>

        <div
          onClick={() => setStatusFilter('OBSERVADOS')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            statusFilter === 'OBSERVADOS'
              ? 'bg-amber-50 border-amber-300 dark:bg-amber-950/40 dark:border-amber-700 ring-2 ring-amber-500/20'
              : 'bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Observados por Forma
            </span>
            <div className="p-2 bg-amber-100 dark:bg-amber-900/60 rounded-lg text-amber-600 dark:text-amber-300">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{observedCount}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">en corrección</span>
          </div>
        </div>

        <div
          onClick={() => setStatusFilter('CONCLUIDOS')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            statusFilter === 'CONCLUIDOS'
              ? 'bg-emerald-50 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-700 ring-2 ring-emerald-500/20'
              : 'bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Casos Concluidos
            </span>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/60 rounded-lg text-emerald-600 dark:text-emerald-300">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{concludedCount}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">listos para entrega</span>
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
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setStatusFilter('PENDIENTES')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === 'PENDIENTES'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Pendientes ({pendingCount})
          </button>
          <button
            onClick={() => setStatusFilter('OBSERVADOS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === 'OBSERVADOS'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Observados ({observedCount})
          </button>
          <button
            onClick={() => setStatusFilter('CONCLUIDOS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === 'CONCLUIDOS'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Concluidos ({concludedCount})
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

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-800 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Informes para Control de Calidad de Forma</span>
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Mostrando {filteredReports.length} registros
          </span>
        </div>

        {filteredReports.length === 0 ? (
          <div className="p-12 text-center">
            <Award className="w-12 h-12 text-blue-500/50 mx-auto mb-3" />
            <p className="text-base font-medium text-slate-700 dark:text-slate-300">No hay informes en esta categoría</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Los informes aprobados en Revisión Técnica por el Encargado de Área avanzan automáticamente a este módulo para el Control de Calidad final.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-3">Código RUP / Documento</th>
                  <th className="px-6 py-3">Perito / Área Forense</th>
                  <th className="px-6 py-3">Evaluación Técnica Previa</th>
                  <th className="px-6 py-3">Resumen / Contenido</th>
                  <th className="px-6 py-3">Estado Calidad</th>
                  <th className="px-6 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredReports.map(({ report, requirement }) => {
                  if (!requirement) return null;
                  const stage = report.currentReviewStage || 'PENDIENTE_REVISION_TECNICA';
                  const techRev = report.technicalReviews && report.technicalReviews.length > 0 ? report.technicalReviews[0] : null;

                  return (
                    <tr key={report.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{requirement.rup}</span>
                        </div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">{report.documentNumber}</div>
                        <div className="text-[11px] text-slate-400 mt-1">
                          Cargado: {new Date(report.uploadDateTime).toLocaleDateString()}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900 dark:text-white">{report.uploadedBy}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          <span>{requirement.sectionName}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {techRev ? (
                          <div className="text-xs bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-2 rounded-lg">
                            <div className="font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Aprobado por Encargado Área</span>
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                              {techRev.reviewerName}
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">En proceso</span>
                        )}
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
                        {stage === 'PENDIENTE_CONTROL_CALIDAD' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300 dark:border-blue-700">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Pendiente Calidad</span>
                          </span>
                        )}

                        {stage === 'OBSERVADO_CALIDAD' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Observado Forma</span>
                          </span>
                        )}

                        {stage === 'CONCLUIDO' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Concluido</span>
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenDetail(report, requirement)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700 transition-colors"
                            title="Ver Detalle"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {stage === 'PENDIENTE_CONTROL_CALIDAD' || stage === 'OBSERVADO_CALIDAD' ? (
                            <button
                              onClick={() => handleOpenEvaluation(report, requirement)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-sm transition-colors"
                            >
                              <CheckSquare className="w-3.5 h-3.5" />
                              <span>Evaluar Forma</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleOpenDetail(report, requirement)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Ver Calidad</span>
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

      {/* EVALUATION MODAL FOR CONTROL DE CALIDAD */}
      {showEvalModal && selectedReport && selectedReq && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden my-8">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
                  <Award className="w-4 h-4" />
                  <span>Auditoría de Control de Calidad y Aspectos de Forma</span>
                </div>
                <h3 className="text-xl font-bold text-white mt-1">
                  RUP: {selectedReq.rup} - {selectedReport.documentNumber}
                </h3>
              </div>
              <button
                onClick={() => setShowEvalModal(false)}
                className="p-1 rounded-lg text-indigo-200 hover:text-white hover:bg-white/10 transition-colors"
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
                    <span className="text-slate-400 block">Sección:</span>
                    <span className="font-semibold">{selectedReq.sectionName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Tipo Informe:</span>
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">{selectedReport.reportType.replace('_', ' ')}</span>
                  </div>
                </div>

                {/* Show technical review notes */}
                {selectedReport.technicalReviews && selectedReport.technicalReviews.length > 0 && (
                  <div className="mt-2 p-2.5 bg-emerald-50 dark:bg-emerald-950/30 rounded border border-emerald-200 dark:border-emerald-800">
                    <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 mb-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Dictamen de Revisión Técnica Previa (Encargado de Área)</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 italic">
                      "{selectedReport.technicalReviews[0].observations}"
                    </p>
                  </div>
                )}

                <div className="pt-2">
                  <span className="text-slate-400 block mb-1">Resumen del Informe:</span>
                  <p className="p-2.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded border border-slate-200 dark:border-slate-700">
                    {selectedReport.summary}
                  </p>
                </div>

                {selectedReport.attachments && selectedReport.attachments.length > 0 && (
                  <div className="pt-2">
                    <span className="text-slate-400 block mb-1">Adjuntos para Revisión de Formato:</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedReport.attachments.map(att => (
                        <a
                          key={att.id}
                          href={att.dataUrl || '#'}
                          download={att.name}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-medium text-indigo-700 dark:text-indigo-400 transition-colors"
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

              {/* FORM AUDIT CHECKLIST */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-indigo-700 dark:text-indigo-400 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span>Checklist de Aspectos de Forma y Normativa</span>
                </h4>

                {/* Item 1 */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">
                      1. Formato Estandarizado Institucional IITCUP
                    </label>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      ¿El documento cuenta con el encabezado oficial, tipografía institucional, márgenes y código de barras/QR?
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFormatoEstandarValido(true)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                        formatoEstandarValido
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" /> Conforme
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormatoEstandarValido(false)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                        !formatoEstandarValido
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <X className="w-3.5 h-3.5" /> Con Errores
                    </button>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">
                      2. Ortografía, Sintaxis y Redacción Forense
                    </label>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      ¿La redacción es clara, objetiva, imparcial y carente de errores ortográficos o gramaticales?
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setRedaccionOrtografiaValida(true)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                        redaccionOrtografiaValida
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" /> Conforme
                    </button>
                    <button
                      type="button"
                      onClick={() => setRedaccionOrtografiaValida(false)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                        !redaccionOrtografiaValida
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <X className="w-3.5 h-3.5" /> Con Errores
                    </button>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">
                      3. Estructura Legal y Cita Normativa
                    </label>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      ¿Cita correctamente el Art. 206 del CPP, la designación de peritos y las disposiciones legales vigentes?
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEstructuraLegalValida(true)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                        estructuraLegalValida
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" /> Conforme
                    </button>
                    <button
                      type="button"
                      onClick={() => setEstructuraLegalValida(false)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                        !estructuraLegalValida
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <X className="w-3.5 h-3.5" /> Incompleto
                    </button>
                  </div>
                </div>

                {/* Item 4 */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">
                      4. Foliado, Anexos y Firmas del Personal
                    </label>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      ¿Posee la constancia de firmas, fotogramas etiquetados, actas de evidencia y foliación continua?
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFirmasYAnexosValidos(true)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                        firmasYAnexosValidos
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" /> Conforme
                    </button>
                    <button
                      type="button"
                      onClick={() => setFirmasYAnexosValidos(false)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                        !firmasYAnexosValidos
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <X className="w-3.5 h-3.5" /> Falta Anexo
                    </button>
                  </div>
                </div>

                {/* Textarea */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Observaciones de Forma y Recomendaciones de Calidad
                  </label>
                  <textarea
                    rows={4}
                    value={observations}
                    onChange={e => setObservations(e.target.value)}
                    placeholder="Escriba las observaciones de forma (ej.: corregir número de causa en carátula, agregar firma digital en hoja de anexos, alinear márgenes de tabla de evidencias)..."
                    className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
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
                  className="w-full sm:w-auto px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Observar Aspectos de Forma</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSubmitEvaluation(true)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Aprobar Calidad y Concluir Caso</span>
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
                <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">Historial de Calidad e Informe</span>
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
              </div>

              {/* Quality Reviews History */}
              {selectedReport.qualityReviews && selectedReport.qualityReviews.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
                    Historial de Revisiones de Control de Calidad
                  </h4>
                  <div className="space-y-2">
                    {selectedReport.qualityReviews.map(qr => (
                      <div key={qr.id} className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 rounded-lg text-xs">
                        <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white mb-1">
                          <span>{qr.reviewerName} ({qr.reviewerGrado || 'Control Calidad'})</span>
                          <span className={qr.status === 'APROBADO_CALIDAD' ? 'text-emerald-600' : 'text-amber-600'}>
                            {qr.status}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 mt-1">{qr.observations}</p>
                        <div className="text-[10px] text-slate-400 mt-2">
                          Revisado el: {new Date(qr.reviewedAt).toLocaleString()}
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
