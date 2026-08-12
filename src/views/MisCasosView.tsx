import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Requirement, ReportUpload, FileAttachment } from '../types';
import { generateRequirementPDF } from '../services/exports';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  Play,
  Upload,
  FileCheck2,
  Printer,
  Paperclip,
  Eye,
  X,
  FileText,
  PackageCheck,
  Image as ImageIcon,
  FolderOpen,
  Download,
  FileCode,
  AlertTriangle,
  Calendar,
  CalendarCheck
} from 'lucide-react';
import { AgendaModal } from '../components/AgendaModal';

export const MisCasosView: React.FC = () => {
  const {
    requirements,
    proveidos,
    updateWorkStatus,
    addReportUpload,
    reports,
    currentUser,
    evidences,
    custodyLogs
  } = useApp();

  const [selectedReq, setSelectedReq] = useState<Requirement | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);

  // Agenda Modal State
  const [showAgendaModal, setShowAgendaModal] = useState(false);
  const [selectedReqForAgenda, setSelectedReqForAgenda] = useState<Requirement | null>(null);

  // Detail Modal & Preview
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [activeReqDetail, setActiveReqDetail] = useState<Requirement | null>(null);
  const [previewAttachment, setPreviewAttachment] = useState<FileAttachment | null>(null);

  // Form State for Report Upload
  const [reportType, setReportType] = useState<ReportUpload['reportType']>('DICTAMEN_PERICIAL');
  const [documentNumber, setDocumentNumber] = useState(`DICTAMEN-IITCUP-SCZ-${Math.floor(Math.random()*900+100)}/2026`);
  const [summary, setSummary] = useState('');
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);

  // Filter cases assigned to current user
  const myAssignedReqs = requirements.filter(r => {
    const prov = proveidos.find(p => p.requirementId === r.id);
    if (!prov) return false;
    return prov.assignedPeritoId === currentUser.id || prov.assignedTecnicoId === currentUser.id || currentUser.role === 'ADMIN';
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setAttachments(prev => [
          ...prev,
          {
            id: 'att-' + Date.now(),
            name: file.name,
            size: file.size,
            type: file.type,
            dataUrl: reader.result as string,
            uploadedAt: new Date().toISOString()
          }
        ]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq || !summary || !documentNumber) {
      alert('Por favor complete el número de documento y el resumen del dictamen.');
      return;
    }

    addReportUpload({
      requirementId: selectedReq.id,
      rup: selectedReq.rup,
      reportType,
      documentNumber,
      summary,
      attachments
    });

    // Automatically update work status to Concluido
    updateWorkStatus(selectedReq.id, 'Concluido', `Carga de informe pericial ${documentNumber}`);

    alert(`¡Informe ${documentNumber} registrado exitosamente!\nEl caso RUP ${selectedReq.rup} ha pasado a estado CONCLUIDO.`);
    setShowReportModal(false);
    setSelectedReq(null);
    setSummary('');
    setAttachments([]);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Mis Casos Asignados - Perito / Técnico
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gestión exclusiva de casos periciales, actualización de estado de trabajo e ingreso de dictámenes
          </p>
        </div>

        <div className="bg-emerald-950 text-amber-300 px-3.5 py-1.5 rounded-xl border border-emerald-800 font-bold text-xs flex items-center gap-2">
          <span>Perito: {currentUser.name}</span>
          <span className="bg-amber-500 text-emerald-950 px-2 py-0.5 rounded text-[10px] uppercase">{currentUser.role}</span>
        </div>
      </div>

      {/* Cases Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-600" />
          Requerimientos Asignados para Peritaje ({myAssignedReqs.length})
        </h2>

        {myAssignedReqs.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center text-slate-400 text-xs">
            No tiene casos asignados actualmente.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myAssignedReqs.map(req => {
              const prov = proveidos.find(p => p.requirementId === req.id);
              const rep = reports.find(r => r.requirementId === req.id);

              // Evidencias registradas en Sala de Evidencias para este RUP
              const reqEvidences = evidences.filter(e => e.requirementId === req.id || e.rup === req.rup);
              const inCustodyEvidences = reqEvidences.filter(e => e.status === 'EN_CUSTODIA');
              const deliveredEvidences = reqEvidences.filter(e => e.status === 'ENTREGADO_A_PERITO');

              return (
                <div
                  key={req.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="font-mono font-extrabold text-sm text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                      {req.rup}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      req.status === 'CONCLUIDO' || req.status === 'FINALIZADO'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {req.status}
                    </span>
                  </div>

                  {/* ALERTA DE EVIDENCIA EN SALA DE EVIDENCIAS */}
                  {inCustodyEvidences.length > 0 ? (
                    <div className="bg-amber-500/15 dark:bg-amber-950/60 border-2 border-amber-500 text-amber-900 dark:text-amber-200 p-3 rounded-xl space-y-1.5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-extrabold text-xs text-amber-900 dark:text-amber-300">
                          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 animate-bounce" />
                          <span>⚠️ ALERTA: RECOGER EVIDENCIA EN SALA DE EVIDENCIAS</span>
                        </div>
                        <span className="bg-amber-500 text-emerald-950 font-black text-[9px] px-2 py-0.5 rounded uppercase tracking-wider shrink-0">
                          {inCustodyEvidences.length} Pendiente(s)
                        </span>
                      </div>

                      <p className="text-[11px] leading-tight font-medium text-amber-800 dark:text-amber-200">
                        El caso cuenta con evidencia física/digital registrada en custodia. <strong>Debe apersonarse a la Sala de Evidencias para recabar el/los elemento(s)</strong> en Cadena de Custodia.
                      </p>

                      <div className="pt-1 border-t border-amber-300/40 dark:border-amber-800/60 flex items-center justify-between text-[10px]">
                        <span className="truncate font-semibold text-slate-700 dark:text-amber-300">
                          <strong>Elementos:</strong> {inCustodyEvidences.map(e => `${e.evidenceType} (${e.packaging})`).join(', ')}
                        </span>
                        <button
                          onClick={() => {
                            setActiveReqDetail(req);
                            setShowDetailModal(true);
                          }}
                          className="text-amber-900 dark:text-amber-300 font-extrabold hover:underline shrink-0 flex items-center gap-0.5 cursor-pointer ml-2"
                        >
                          Ver Evidencias &rarr;
                        </button>
                      </div>
                    </div>
                  ) : deliveredEvidences.length > 0 ? (
                    <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 p-2.5 rounded-xl flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5 font-bold">
                        <PackageCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>✅ Evidencia Recogida ({deliveredEvidences.length} elemento(s) en su custodia)</span>
                      </div>
                      <button
                        onClick={() => {
                          setActiveReqDetail(req);
                          setShowDetailModal(true);
                        }}
                        className="text-emerald-800 dark:text-emerald-300 font-bold hover:underline text-[10px] cursor-pointer"
                      >
                        Ver Ficha
                      </button>
                    </div>
                  ) : req.hasEvidence ? (
                    <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 p-2.5 rounded-xl flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5 font-semibold">
                        <PackageCheck className="w-4 h-4 text-slate-500 shrink-0" />
                        <span>📦 Marcado en Recepción con Evidencia Física</span>
                      </div>
                      <span className="text-[10px] text-slate-400 italic">Pendiente registro en Sala</span>
                    </div>
                  ) : null}

                  {/* BLOQUE DE AGENDAMIENTO PARA PSICOLOGÍA */}
                  {(() => {
                    const isPsych =
                      req.sectionName?.toUpperCase().includes('PSICOLOG') ||
                      req.serviceName?.toUpperCase().includes('PSICOLOG') ||
                      req.sectionId === 'sec-9' ||
                      req.sectionId === 'sec-2';

                    if (!isPsych) return null;

                    if (req.appointment) {
                      return (
                        <div className="bg-emerald-950 text-white p-3 rounded-xl border border-emerald-800 space-y-1.5 shadow-sm">
                          <div className="flex items-center justify-between border-b border-emerald-800/80 pb-1.5">
                            <div className="flex items-center gap-1.5 font-extrabold text-amber-300 text-xs">
                              <CalendarCheck className="w-4 h-4 text-amber-400 shrink-0" />
                              <span>CITA AGENDADA EN PSICOLOGÍA</span>
                            </div>
                            <button
                              onClick={() => {
                                setSelectedReqForAgenda(req);
                                setShowAgendaModal(true);
                              }}
                              className="text-amber-300 hover:text-white font-bold text-[10px] underline cursor-pointer"
                            >
                              Reagendar
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <div>
                              <span className="text-slate-400 block text-[10px]">Fecha y Hora:</span>
                              <strong className="text-amber-300 font-extrabold">{req.appointment.scheduledDate} a las {req.appointment.scheduledTime} hrs</strong>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px]">Usuario:</span>
                              <strong className="text-slate-100 font-bold truncate block">{req.appointment.userData}</strong>
                            </div>
                          </div>
                          {(req.status === 'AGENDADO' || req.status === 'ASIGNADO') && (
                            <div className="pt-1">
                              <button
                                onClick={() => {
                                  updateWorkStatus(req.id, 'Iniciado', 'Inicio de evaluación psicológica pericial.');
                                  alert(`¡Evaluación Pericial Iniciada!\nEl RUP ${req.rup} se encuentra ahora "EN PROCESO".`);
                                }}
                                className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] rounded-lg shadow transition-all cursor-pointer flex items-center justify-center gap-1.5"
                              >
                                <Play className="w-3.5 h-3.5 fill-current" />
                                Iniciar Evaluación Pericial
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    }

                    if (req.status === 'ASIGNADO') {
                      return (
                        <div className="bg-amber-500/10 dark:bg-amber-950/40 border border-amber-400 dark:border-amber-700/80 p-3 rounded-xl flex items-center justify-between gap-2">
                          <div className="text-amber-900 dark:text-amber-300 text-[11px] font-semibold">
                            <span className="font-extrabold block text-amber-900 dark:text-amber-300 flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-amber-500" />
                              Cita de Psicología Pendiente
                            </span>
                            <span className="text-[10px] text-amber-700 dark:text-amber-400">Debe agendar su cita antes de iniciar la evaluación pericial.</span>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedReqForAgenda(req);
                              setShowAgendaModal(true);
                            }}
                            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-3 py-1.5 rounded-lg shadow transition-all shrink-0 cursor-pointer flex items-center gap-1"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            Agendar Cita
                          </button>
                        </div>
                      );
                    }

                    return null;
                  })()}

                  <div className="text-xs space-y-1">
                    <div>
                      <span className="text-slate-500 font-semibold">Solicitante: </span>
                      <span className="font-bold text-slate-800 dark:text-slate-100">{req.origin} - {req.applicantName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold">CUD / Causa: </span>
                      <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">{req.externalCode}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold">Servicio: </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{req.sectionName} - {req.serviceName}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-lg text-[11px] text-slate-700 dark:text-slate-300">
                    <span className="font-bold block text-slate-500 mb-0.5">Puntos de Pericia:</span>
                    <p className="line-clamp-3 italic">"{req.puntosPericia}"</p>
                  </div>

                  {prov && (
                    <div className="bg-amber-50 dark:bg-amber-950/30 p-2 rounded text-[11px] text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800/50">
                      <span className="font-bold">Proveído: </span>{prov.observations}
                    </div>
                  )}

                  {/* Actions for Expert */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap">
                    
                    {/* Work Status Buttons */}
                    {(req.status === 'ASIGNADO' || req.status === 'AGENDADO') && (
                      <button
                        onClick={() => {
                          updateWorkStatus(req.id, 'Iniciado', 'Trabajo pericial / evaluación iniciada.');
                          alert(`¡Caso marcado como EN PROCESO!\nRUP ${req.rup}`);
                        }}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5" />
                        Marcar INICIADO
                      </button>
                    )}

                    {req.status === 'EN_PROCESO' && (
                      <button
                        onClick={() => {
                          setSelectedReq(req);
                          setShowReportModal(true);
                        }}
                        className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 text-amber-400" />
                        Cargar Informe & CONCLUIR
                      </button>
                    )}

                    {req.status === 'CONCLUIDO' && (
                      <span className="text-emerald-600 font-bold text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Informe Cargado
                      </span>
                    )}

                    <button
                      onClick={() => {
                        setActiveReqDetail(req);
                        setShowDetailModal(true);
                      }}
                      className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold text-[11px] rounded-lg inline-flex items-center gap-1 cursor-pointer"
                      title="Ver Expediente y Archivos de Evidencias"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      Ver Ficha
                    </button>

                    <button
                      onClick={() => generateRequirementPDF(req, evidences.filter(e => e.requirementId === req.id || e.rup === req.rup), prov, rep, custodyLogs)}
                      className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold text-[11px] rounded-lg inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Ficha PDF
                    </button>

                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Upload Forensic Report */}
      {showReportModal && selectedReq && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl p-5 sm:p-6 space-y-4 text-xs">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h2 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-emerald-600" />
                  Carga de Informe Pericial / Dictamen
                </h2>
                <p className="text-xs font-mono text-amber-500 font-bold">RUP: {selectedReq.rup}</p>
              </div>
              <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tipo de Documento *
                  </label>
                  <select
                    value={reportType}
                    onChange={e => setReportType(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 font-bold"
                  >
                    <option value="DICTAMEN_PERICIAL">DICTAMEN PERICIAL</option>
                    <option value="INFORME_PERICIAL">INFORME PERICIAL</option>
                    <option value="INFORME_TECNICO">INFORME TÉCNICO</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Número de Correlativo / Código *
                  </label>
                  <input
                    type="text"
                    value={documentNumber}
                    onChange={e => setDocumentNumber(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Resumen de Conclusiones del Peritaje *
                </label>
                <textarea
                  rows={4}
                  value={summary}
                  onChange={e => setSummary(e.target.value)}
                  placeholder="Sintetizar las conclusiones técnicas alcanzadas en el estudio pericial..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Adjuntar Documentos Escaneados (PDF / DOCX)
                </label>
                <label className="cursor-pointer bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center gap-2 text-xs font-semibold w-fit">
                  <Paperclip className="w-4 h-4" />
                  Adjuntar Informe en PDF
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {attachments.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {attachments.map(a => (
                      <div key={a.id} className="text-[11px] bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded flex items-center justify-between">
                        <span className="font-mono text-slate-700 dark:text-slate-300">{a.name} ({Math.round(a.size/1024)} KB)</span>
                        <button type="button" onClick={() => setAttachments(prev => prev.filter(x => x.id !== a.id))} className="text-red-500 font-bold">×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  Cargar Informe y Marcar CONCLUIDO
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Modal: View Full Case Expediente with Evidence Room Attachments */}
      {showDetailModal && activeReqDetail && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl p-5 sm:p-6 space-y-4 max-h-[90vh] flex flex-col">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 shrink-0">
              <div>
                <h2 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-emerald-600" />
                  Expediente Completo del Caso - RUP {activeReqDetail.rup}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ingreso: {new Date(activeReqDetail.entryDateTime).toLocaleString('es-BO')} | {activeReqDetail.origin}
                </p>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="text-slate-400 hover:text-slate-200 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-4 text-xs pr-1">
              
              {/* Metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-slate-400 text-[10px] font-semibold block">RUP</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">{activeReqDetail.rup}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-semibold block">CUD / Causa / IANUS</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{activeReqDetail.externalCode}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-semibold block">Solicitante / Fiscal</span>
                  <span className="text-slate-800 dark:text-slate-200">{activeReqDetail.applicantName}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-semibold block">Sección Forense</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">{activeReqDetail.sectionName}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-semibold block">Servicio Específico</span>
                  <span className="text-slate-800 dark:text-slate-200">{activeReqDetail.serviceName}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-semibold block">Fojas</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{activeReqDetail.fojaCount} fojas</span>
                </div>
              </div>

              {/* Puntos de Pericia */}
              <div className="bg-emerald-950 text-emerald-100 p-4 rounded-xl border border-emerald-800">
                <span className="font-bold text-amber-300 text-xs block mb-1">PUNTOS DE PERICIA SOLICITADOS:</span>
                <p className="text-xs leading-relaxed whitespace-pre-wrap">{activeReqDetail.puntosPericia}</p>
              </div>

              {/* Reception Document Attachments */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
                  <Paperclip className="w-4 h-4 text-blue-600" />
                  Archivos Adjuntos de Recepción ({activeReqDetail.attachments ? activeReqDetail.attachments.length : 0})
                </h4>

                {activeReqDetail.attachments && activeReqDetail.attachments.length > 0 ? (
                  <div className="space-y-2">
                    {activeReqDetail.attachments.map(att => (
                      <div
                        key={att.id}
                        className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <FileCode className="w-5 h-5 text-blue-500" />
                          <div>
                            <span className="font-bold text-slate-800 dark:text-slate-200 block">{att.name}</span>
                            <span className="text-[10px] text-slate-400">
                              {Math.round(att.size / 1024)} KB | Subido: {new Date(att.uploadedAt).toLocaleString('es-BO')}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => setPreviewAttachment(att)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Ver Documento
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-center py-2 text-xs italic">No existen archivos adjuntos iniciales de Recepción.</p>
                )}
              </div>

              {/* Evidencias Físicas y Archivos Cargados por la Sala de Evidencias */}
              {(() => {
                const reqEvidences = evidences.filter(e => e.requirementId === activeReqDetail.id || e.rup === activeReqDetail.rup);
                return (
                  <div className="bg-amber-50/60 dark:bg-slate-800/60 p-4 rounded-xl border border-amber-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center justify-between border-b border-amber-200 dark:border-slate-700 pb-2">
                      <h4 className="font-extrabold text-amber-900 dark:text-amber-200 text-xs flex items-center gap-2">
                        <PackageCheck className="w-4 h-4 text-amber-500" />
                        Evidencias y Archivos Cargados por Sala de Evidencias ({reqEvidences.length})
                      </h4>
                      <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded">
                        Cadena de Custodia
                      </span>
                    </div>

                    {reqEvidences.length > 0 ? (
                      <div className="space-y-3">
                        {reqEvidences.map(ev => (
                          <div
                            key={ev.id}
                            className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-amber-200 dark:border-slate-700 space-y-2 shadow-sm"
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-extrabold text-slate-800 dark:text-slate-100">
                                {ev.evidenceType} - <span className="text-amber-600 dark:text-amber-400">{ev.packaging}</span>
                              </span>
                              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 font-extrabold text-[10px]">
                                {ev.status}
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">
                              <strong className="font-bold">Descripción:</strong> {ev.description}
                            </p>

                            <div className="text-[10px] text-slate-500 flex items-center justify-between">
                              <span>Colector/Asignado: {ev.assigneeName || 'Sala de Evidencias'}</span>
                              <span>Ingreso: {new Date(ev.entryDateTime).toLocaleString('es-BO')}</span>
                            </div>

                            {/* FILES ATTACHED BY SALA DE EVIDENCIA */}
                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                              <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 block mb-1.5 flex items-center gap-1">
                                <Paperclip className="w-3.5 h-3.5 text-emerald-600" />
                                Archivos adjuntados en Sala de Evidencias ({ev.attachments ? ev.attachments.length : 0}):
                              </span>

                              {ev.attachments && ev.attachments.length > 0 ? (
                                <div className="space-y-1.5">
                                  {ev.attachments.map(att => (
                                    <div
                                      key={att.id}
                                      className="bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-lg border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs"
                                    >
                                      <div className="flex items-center gap-2 overflow-hidden">
                                        {att.type.includes('pdf') ? (
                                          <FileCode className="w-4 h-4 text-red-500 shrink-0" />
                                        ) : (
                                          <ImageIcon className="w-4 h-4 text-blue-500 shrink-0" />
                                        )}
                                        <div className="truncate">
                                          <span className="font-bold text-slate-900 dark:text-slate-100 block truncate text-xs">
                                            {att.name}
                                          </span>
                                          <span className="text-[9px] text-slate-500 dark:text-slate-400">
                                            {Math.round(att.size / 1024)} KB | {new Date(att.uploadedAt).toLocaleString('es-BO')}
                                          </span>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-1.5 shrink-0">
                                        <button
                                          onClick={() => setPreviewAttachment(att)}
                                          className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded text-[10px] flex items-center gap-1 cursor-pointer"
                                        >
                                          <Eye className="w-3 h-3 text-amber-400" />
                                          Observar Archivo
                                        </button>
                                        {att.dataUrl && (
                                          <a
                                            href={att.dataUrl}
                                            download={att.name}
                                            className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold px-2 py-1 rounded text-[10px] flex items-center gap-1"
                                            title="Descargar"
                                          >
                                            <Download className="w-3 h-3" />
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-[10px] text-slate-400 italic">No hay archivos adjuntos registrados para esta evidencia.</p>
                              )}
                            </div>

                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-center py-2 text-xs italic">
                        No hay evidencias físicas o archivos adjuntos en Sala de Evidencias registrados para este RUP.
                      </p>
                    )}
                  </div>
                );
              })()}

            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
              >
                Cerrar Expediente
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Modal: Document / Image Previewer */}
      {previewAttachment && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                {previewAttachment.type.includes('pdf') ? (
                  <FileCode className="w-5 h-5 text-red-500" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-blue-500" />
                )}
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                    {previewAttachment.name}
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Tamaño: {Math.round(previewAttachment.size/1024)} KB | Subido: {new Date(previewAttachment.uploadedAt).toLocaleString('es-BO')}
                  </p>
                </div>
              </div>
              <button onClick={() => setPreviewAttachment(null)} className="text-slate-400 hover:text-slate-200 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Preview Frame */}
            <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-xl border border-slate-300 dark:border-slate-800 max-h-[60vh] overflow-y-auto flex flex-col items-center justify-center min-h-[250px]">
              {previewAttachment.dataUrl ? (
                previewAttachment.type.includes('image') ? (
                  <img
                    src={previewAttachment.dataUrl}
                    alt={previewAttachment.name}
                    className="max-h-[50vh] object-contain rounded-lg shadow-lg border border-slate-200 dark:border-slate-800"
                  />
                ) : (
                  <div className="text-center space-y-3 py-6">
                    <FileCode className="w-16 h-16 text-emerald-600 mx-auto" />
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">{previewAttachment.name}</p>
                      <p className="text-xs text-slate-500 mt-1">Vista previa de documento PDF / Archivo digital.</p>
                    </div>
                    <a
                      href={previewAttachment.dataUrl}
                      download={previewAttachment.name}
                      className="inline-flex items-center gap-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-amber-400" />
                      Descargar / Abrir Documento
                    </a>
                  </div>
                )
              ) : (
                <div className="text-center text-slate-400 py-8">
                  No hay datos binarios guardados para la vista previa en este ambiente local.
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setPreviewAttachment(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Floating Agenda Modal for Psychology Appointments */}
      <AgendaModal
        isOpen={showAgendaModal}
        onClose={() => {
          setShowAgendaModal(false);
          setSelectedReqForAgenda(null);
        }}
        selectedRequirement={selectedReqForAgenda}
      />

    </div>
  );
};
