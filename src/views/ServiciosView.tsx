import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Requirement, Proveido, User, FileAttachment, EvidenceItem } from '../types';
import {
  Briefcase,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  Send,
  FileText,
  AlertTriangle,
  X,
  FileCheck,
  Eye,
  Paperclip,
  Download,
  ShieldCheck,
  FolderOpen,
  Info,
  Package,
  Check,
  Building2,
  Calendar,
  FileCode,
  User as UserIcon,
  Tag,
  Hash,
  PackageCheck,
  Image as ImageIcon
} from 'lucide-react';

export const ServiciosView: React.FC = () => {
  const { requirements, proveidos, users, addProveido, currentUser, evidences } = useApp();

  const [selectedReq, setSelectedReq] = useState<Requirement | null>(null);
  const [showProveidoModal, setShowProveidoModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [previewAttachment, setPreviewAttachment] = useState<FileAttachment | null>(null);

  // Form State
  const [decision, setDecision] = useState<'ASIGNAR_PERITO' | 'REPRESENTAR'>('ASIGNAR_PERITO');
  const [assignedPeritoId, setAssignedPeritoId] = useState('');
  const [assignedTecnicoId, setAssignedTecnicoId] = useState('');
  const [legalViabilityNotes, setLegalViabilityNotes] = useState(
    'Requerimiento con orden legal competente. Cumple pertinencia y viabilidad técnica según disponibilidad de equipamiento e insumos forenses.'
  );
  const [observations, setObservations] = useState('Plazo máximo otorgado para entrega de informe: 5 días hábiles.');
  const [reviewedDataConfirmed, setReviewedDataConfirmed] = useState(true);

  const peritosList = users.filter(u => u.role === 'PERITO' && u.active);
  const tecnicosList = users.filter(u => u.role === 'TECNICO' && u.active);

  // Filter requirements pending review
  const pendingReqs = requirements.filter(r => r.status === 'EN_REVISION' || r.status === 'REGISTRADO');

  const handleOpenProveidoModal = (req: Requirement) => {
    setSelectedReq(req);
    if (peritosList.length > 0) setAssignedPeritoId(peritosList[0].id);
    if (tecnicosList.length > 0) setAssignedTecnicoId(tecnicosList[0].id);
    setReviewedDataConfirmed(false);
    setShowProveidoModal(true);
  };

  const handleOpenDetailModal = (req: Requirement) => {
    setSelectedReq(req);
    setShowDetailModal(true);
  };

  const handleSubmitProveido = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq) return;

    if (!reviewedDataConfirmed) {
      alert('Debe confirmar que ha revisado todos los datos del caso registrados por Recepción y los documentos adjuntos.');
      return;
    }

    if (decision === 'ASIGNAR_PERITO' && !assignedPeritoId && !assignedTecnicoId) {
      alert('Por favor seleccione al menos un Perito o Técnico asignado.');
      return;
    }

    const peritoObj = users.find(u => u.id === assignedPeritoId);
    const tecnicoObj = users.find(u => u.id === assignedTecnicoId);

    addProveido({
      requirementId: selectedReq.id,
      rup: selectedReq.rup,
      decision,
      assignedPeritoId: peritoObj?.id,
      assignedPeritoName: peritoObj?.name,
      assignedTecnicoId: tecnicoObj?.id,
      assignedTecnicoName: tecnicoObj?.name,
      legalViabilityNotes,
      observations
    });

    alert(`Proveído registrado exitosamente para RUP ${selectedReq.rup}.\nNotificación enviada al personal asignado.`);
    setShowProveidoModal(false);
    setSelectedReq(null);
  };

  // Helper to find associated evidences for a requirement
  const getAssociatedEvidences = (reqId: string, rup: string): EvidenceItem[] => {
    return evidences.filter(e => e.requirementId === reqId || e.rup === rup);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-emerald-600" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Encargado de Servicios Periciales
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Revisión integral de datos de Recepción, análisis de legalidad, pertinencia, viabilidad técnica, emisión de proveídos y asignación de peritos.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold bg-emerald-950 text-amber-300 px-3.5 py-2 rounded-xl border border-emerald-800 shadow-sm">
          <Clock className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{pendingReqs.length} casos pendientes de proveído</span>
        </div>
      </div>

      {/* Pending Requerimientos Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Requerimientos Pendientes de Análisis y Proveído ({pendingReqs.length})
          </h2>
          <span className="text-[11px] text-slate-500">
            Haga clic en un caso para revisar los datos de Recepción y documentos adjuntos
          </span>
        </div>

        {pendingReqs.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center text-slate-400 text-xs">
            No existen requerimientos pendientes de revisión en este momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingReqs.map(req => {
              const reqEvidences = getAssociatedEvidences(req.id, req.rup);
              return (
                <div
                  key={req.id}
                  className="bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800/80 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-sm text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                        {req.rup}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">
                        {req.externalCode}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(req.entryDateTime).toLocaleDateString('es-BO')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500 font-semibold text-[11px] block">Origen / Institución:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-100">{req.origin}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold text-[11px] block">Solicitante:</span>
                      <span className="text-slate-800 dark:text-slate-200 font-medium truncate block">{req.applicantName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold text-[11px] block">Sección Forense:</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">{req.sectionName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold text-[11px] block">Servicio Solicitado:</span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{req.serviceName}</span>
                    </div>
                  </div>

                  {/* Puntos de Pericia preview */}
                  <div className="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl text-[11px] text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-700">
                    <span className="font-bold block text-slate-500 mb-0.5 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      Puntos de Pericia Solicitados:
                    </span>
                    <p className="line-clamp-2 italic text-slate-800 dark:text-slate-200">"{req.puntosPericia}"</p>
                  </div>

                  {/* Attachments & Evidences indicators */}
                  <div className="flex items-center gap-3 text-[11px] pt-1 border-t border-slate-100 dark:border-slate-800">
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${req.attachments && req.attachments.length > 0 ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-bold' : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'}`}>
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>{req.attachments ? req.attachments.length : 0} adjunto(s)</span>
                    </div>

                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${req.hasEvidence || reqEvidences.length > 0 ? 'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold' : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'}`}>
                      <Package className="w-3.5 h-3.5" />
                      <span>{reqEvidences.length} evidencia(s) física(s)</span>
                    </div>

                    <div className="ml-auto text-[10px] text-slate-400 italic">
                      Reg.: {req.registeredBy}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => handleOpenDetailModal(req)}
                      className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      Ver Expediente
                    </button>

                    <button
                      onClick={() => handleOpenProveidoModal(req)}
                      className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <UserCheck className="w-4 h-4 text-amber-400" />
                      Emitir Proveído
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Processed Requirements & History */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-600" />
            Histórico de Proveídos y Asignaciones
          </h2>
          <span className="text-[11px] text-slate-500">
            Total proveídos emitidos: {proveidos.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3">N° RUP</th>
                <th className="p-3">Fecha Proveído</th>
                <th className="p-3">Decisión</th>
                <th className="p-3">Perito Asignado</th>
                <th className="p-3">Técnico Asignado</th>
                <th className="p-3">Análisis Legal / Viabilidad</th>
                <th className="p-3 text-center">Expediente</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {proveidos.map(prov => {
                const req = requirements.find(r => r.id === prov.requirementId);
                return (
                  <tr key={prov.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-3 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      {prov.rup}
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {new Date(prov.dateTime).toLocaleString('es-BO')}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        prov.decision === 'ASIGNAR_PERITO'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                      }`}>
                        {prov.decision}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                      {prov.assignedPeritoName || 'N/A'}
                    </td>
                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                      {prov.assignedTecnicoName || 'N/A'}
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                      {prov.legalViabilityNotes}
                    </td>
                    <td className="p-3 text-center">
                      {req && (
                        <button
                          onClick={() => handleOpenDetailModal(req)}
                          className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          title="Ver expediente completo de recepción"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Emisión de Proveído Pericial (With Full Reception Review Panel) */}
      {showProveidoModal && selectedReq && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-5xl shadow-2xl p-5 sm:p-6 space-y-4 text-xs max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h2 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                    Emisión de Proveído Pericial y Asignación
                  </h2>
                </div>
                <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                  RUP: {selectedReq.rup} | {selectedReq.externalCode} | Sección: {selectedReq.sectionName}
                </p>
              </div>
              <button
                onClick={() => setShowProveidoModal(false)}
                className="text-slate-400 hover:text-slate-200 p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content: 2-Column Split View */}
            <div className="overflow-y-auto flex-1 pr-1 space-y-4">
              
              {/* Important Alert Notice */}
              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 p-3 rounded-xl flex items-start gap-2 text-amber-900 dark:text-amber-200">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <strong className="font-bold">Requisito Obligatorio:</strong> Antes de emitir el proveído, observe y verifique cuidadosamente todos los datos del caso registrados por la encargada de Recepción, incluyendo los puntos de pericia, antecedentes y documentos adjuntos remitiéndose a las facultades del Encargado de Servicios Periciales.
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* Left Column (7 cols): Full Reception Details & Attachments Review */}
                <div className="lg:col-span-7 space-y-4 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                    <h3 className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs uppercase tracking-wide">
                      <FolderOpen className="w-4 h-4 text-emerald-600" />
                      1. Expediente Registrado por Recepción
                    </h3>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-2 py-0.5 rounded">
                      Recepcionado por: {selectedReq.registeredBy}
                    </span>
                  </div>

                  {/* General Case Metadata Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px]">
                    <div>
                      <span className="text-slate-400 font-semibold block text-[10px]">RUP</span>
                      <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">{selectedReq.rup}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block text-[10px]">CUD / Causa / IANUS</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedReq.externalCode}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block text-[10px]">Fecha / Hora Ingreso</span>
                      <span className="text-slate-700 dark:text-slate-300">
                        {new Date(selectedReq.entryDateTime).toLocaleString('es-BO')}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block text-[10px]">Oficina Regional</span>
                      <span className="text-slate-700 dark:text-slate-300">{selectedReq.regionalOfficeName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block text-[10px]">Institución Remitente</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedReq.origin}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block text-[10px]">Autoridad Solicitante</span>
                      <span className="text-slate-800 dark:text-slate-200">{selectedReq.applicantName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block text-[10px]">Cantidad de Fojas</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{selectedReq.fojaCount} fojas</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block text-[10px]">Tipo de Servicio</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedReq.serviceType}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block text-[10px]">Sección Forense</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedReq.sectionName}</span>
                    </div>
                  </div>

                  {/* Servicio Especifico */}
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px]">
                    <span className="text-slate-400 font-semibold block text-[10px]">Servicio Solicitado:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100">{selectedReq.serviceName}</span>
                  </div>

                  {/* Resumen / Antecedentes de Recepción */}
                  {selectedReq.observations && (
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px]">
                      <span className="text-slate-400 font-semibold block text-[10px] mb-0.5">Observaciones / Resumen de Recepción:</span>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic">{selectedReq.observations}</p>
                    </div>
                  )}

                  {/* Puntos de Pericia */}
                  <div className="bg-emerald-950 text-emerald-100 dark:bg-slate-900 p-3.5 rounded-xl border border-emerald-800 dark:border-emerald-700/60 shadow-inner">
                    <span className="font-bold text-amber-300 text-[11px] block mb-1 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-amber-400" />
                      PUNTOS DE PERICIA SOLICITADOS EN REQUERIMIENTO:
                    </span>
                    <p className="text-xs leading-relaxed font-sans text-slate-100 whitespace-pre-wrap">
                      {selectedReq.puntosPericia}
                    </p>
                  </div>

                  {/* Documentos Adjuntos (Oficios, Fojas, Documentos) */}
                  <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
                        <Paperclip className="w-4 h-4 text-blue-600" />
                        Documentos y Oficios Adjuntos por Recepción
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {selectedReq.attachments && selectedReq.attachments.length > 0
                          ? `${selectedReq.attachments.length} archivo(s)`
                          : 'Sin archivos'}
                      </span>
                    </div>

                    {selectedReq.attachments && selectedReq.attachments.length > 0 ? (
                      <div className="space-y-2">
                        {selectedReq.attachments.map(att => (
                          <div
                            key={att.id}
                            className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-[11px]"
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <FileCode className="w-4 h-4 text-blue-500 shrink-0" />
                              <div className="truncate">
                                <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
                                  {att.name}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  {Math.round(att.size / 1024)} KB | {new Date(att.uploadedAt).toLocaleDateString('es-BO')}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => setPreviewAttachment(att)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-2.5 py-1 rounded-md text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <Eye className="w-3 h-3" />
                                Previsualizar
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-3 text-[11px] text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        No se adjuntaron archivos digitalizados al momento del registro en recepción.
                      </div>
                    )}
                  </div>

                  {/* Associated Evidences in Sala */}
                  <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
                        <Package className="w-4 h-4 text-amber-500" />
                        Evidencias Físicas Asociadas en Sala de Evidencias
                      </span>
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                        {selectedReq.hasEvidence ? 'Registra evidencias' : 'Sin evidencia física'}
                      </span>
                    </div>

                    {getAssociatedEvidences(selectedReq.id, selectedReq.rup).length > 0 ? (
                      <div className="space-y-2">
                        {getAssociatedEvidences(selectedReq.id, selectedReq.rup).map(ev => (
                          <div key={ev.id} className="bg-amber-50/60 dark:bg-amber-950/20 p-2.5 rounded-lg border border-amber-200 dark:border-amber-900/40 text-[11px] space-y-1">
                            <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                              <span>{ev.evidenceType}</span>
                              <span className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 px-1.5 py-0.5 rounded">
                                {ev.status}
                              </span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300">{ev.description}</p>
                            <div className="text-[10px] text-slate-500 flex items-center gap-3">
                              <span>Embalaje: {ev.packaging}</span>
                              <span>Acta Colección: {ev.hasCollectionAct ? 'SÍ' : 'NO'}</span>
                              <span>Acta Custodia: {ev.hasCustodyAct ? 'SÍ' : 'NO'}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-2 text-[11px] text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        No hay elementos físicos registrados en sala de evidencias para este RUP.
                      </div>
                    )}
                  </div>

                </div>

                {/* Right Column (5 cols): Proveído Decision & Assignment Form */}
                <div className="lg:col-span-5 space-y-4">
                  
                  <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
                    <h3 className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs uppercase tracking-wide">
                      <UserCheck className="w-4 h-4 text-emerald-600" />
                      2. Emisión de Proveído y Asignación
                    </h3>
                  </div>

                  <form onSubmit={handleSubmitProveido} className="space-y-4">
                    
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Dictamen / Decisión del Proveído *
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setDecision('ASIGNAR_PERITO')}
                          className={`p-2.5 rounded-xl border text-left font-bold flex flex-col justify-between transition-all text-[11px] ${
                            decision === 'ASIGNAR_PERITO'
                              ? 'bg-emerald-950 text-amber-300 border-amber-400 shadow-md'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span>1. ASIGNAR PERITO</span>
                            <CheckCircle2 className="w-4 h-4 text-amber-400" />
                          </div>
                          <span className="text-[10px] text-slate-300 font-normal mt-1">Procedente</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setDecision('REPRESENTAR')}
                          className={`p-2.5 rounded-xl border text-left font-bold flex flex-col justify-between transition-all text-[11px] ${
                            decision === 'REPRESENTAR'
                              ? 'bg-red-950 text-red-300 border-red-500 shadow-md'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span>2. REPRESENTAR</span>
                            <XCircle className="w-4 h-4 text-red-400" />
                          </div>
                          <span className="text-[10px] text-red-300 font-normal mt-1">Observar / Devolver</span>
                        </button>
                      </div>
                    </div>

                    {decision === 'ASIGNAR_PERITO' && (
                      <div className="space-y-3 bg-emerald-50 dark:bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                        <div>
                          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-[11px]">
                            Perito Asignado *
                          </label>
                          <select
                            value={assignedPeritoId}
                            onChange={e => setAssignedPeritoId(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-bold"
                          >
                            <option value="">-- Seleccionar Perito --</option>
                            {peritosList.map(p => (
                              <option key={p.id} value={p.id}>
                                {p.name} ({p.badgeNumber || 'PERITO'}) - {p.sectionName}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-[11px]">
                            Técnico Asignado (Opcional)
                          </label>
                          <select
                            value={assignedTecnicoId}
                            onChange={e => setAssignedTecnicoId(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs"
                          >
                            <option value="">-- Seleccionar Técnico (Opcional) --</option>
                            {tecnicosList.map(t => (
                              <option key={t.id} value={t.id}>
                                {t.name} ({t.badgeNumber || 'TÉCNICO'})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-[11px]">
                        Análisis de Legalidad, Pertinencia y Viabilidad *
                      </label>
                      <textarea
                        rows={3}
                        value={legalViabilityNotes}
                        onChange={e => setLegalViabilityNotes(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-emerald-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-[11px]">
                        Instrucciones u Observaciones
                      </label>
                      <textarea
                        rows={2}
                        value={observations}
                        onChange={e => setObservations(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    {/* Mandatory Verification Checkbox */}
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                      <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-slate-800 dark:text-slate-200">
                        <input
                          type="checkbox"
                          checked={reviewedDataConfirmed}
                          onChange={e => setReviewedDataConfirmed(e.target.checked)}
                          className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                        />
                        <span className="leading-snug">
                          <strong className="font-bold">Confirmo la revisión:</strong> He verificado todos los datos del caso registrados por Recepción, los puntos de pericia y la documentación adjunta antes de firmar este proveído.
                        </span>
                      </label>
                    </div>

                    {/* Submit Buttons */}
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setShowProveidoModal(false)}
                        className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={!reviewedDataConfirmed}
                        className={`px-5 py-2 rounded-xl font-bold shadow-md flex items-center gap-2 cursor-pointer transition-all ${
                          reviewedDataConfirmed
                            ? 'bg-emerald-800 hover:bg-emerald-700 text-white'
                            : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <Send className="w-4 h-4 text-amber-400" />
                        Registrar Proveído y Notificar
                      </button>
                    </div>

                  </form>

                </div>

              </div>

            </div>

          </div>
        </div>
      )}

      {/* Modal 2: Standalone Case Detail Viewer */}
      {showDetailModal && selectedReq && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl p-5 sm:p-6 space-y-4 text-xs max-h-[90vh] flex flex-col">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 shrink-0">
              <div>
                <h2 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-emerald-600" />
                  Expediente Completo de Recepción - RUP {selectedReq.rup}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Registrado el {new Date(selectedReq.entryDateTime).toLocaleString('es-BO')} por {selectedReq.registeredBy}
                </p>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-4 pr-1">
              
              {/* General metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px]">RUP</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">{selectedReq.rup}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px]">CUD / Causa / IANUS</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedReq.externalCode}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px]">Oficina Regional</span>
                  <span className="text-slate-700 dark:text-slate-300">{selectedReq.regionalOfficeName}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px]">Origen / Institución</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedReq.origin}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px]">Solicitante</span>
                  <span className="text-slate-800 dark:text-slate-200">{selectedReq.applicantName}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px]">Fojas</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedReq.fojaCount} fojas</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px]">Sección Forense</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">{selectedReq.sectionName}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px]">Servicio Solicitado</span>
                  <span className="text-slate-800 dark:text-slate-200">{selectedReq.serviceName}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px]">Estado Actual</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">{selectedReq.status}</span>
                </div>
              </div>

              {/* Puntos de Pericia */}
              <div className="bg-emerald-950 text-emerald-100 p-4 rounded-xl border border-emerald-800">
                <span className="font-bold text-amber-300 text-xs block mb-1">PUNTOS DE PERICIA SOLICITADOS:</span>
                <p className="text-xs leading-relaxed whitespace-pre-wrap">{selectedReq.puntosPericia}</p>
              </div>

              {/* Documentos Adjuntos de Recepcion */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
                  <Paperclip className="w-4 h-4 text-blue-600" />
                  Documentos Adjuntos en Recepción ({selectedReq.attachments ? selectedReq.attachments.length : 0})
                </h4>

                {selectedReq.attachments && selectedReq.attachments.length > 0 ? (
                  <div className="space-y-2">
                    {selectedReq.attachments.map(att => (
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
                  <p className="text-slate-400 text-center py-2 text-xs italic">No existen archivos adjuntos para este caso.</p>
                )}
              </div>

              {/* Evidencias Físicas y Archivos Cargados por la Sala de Evidencias */}
              {(() => {
                const reqEvidences = evidences.filter(e => e.requirementId === selectedReq.id || e.rup === selectedReq.rup);
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

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  handleOpenProveidoModal(selectedReq);
                }}
                className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-amber-400" />
                Proceder a Emitir Proveído
              </button>

              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Modal 3: Document Attachment Previewer */}
      {previewAttachment && selectedReq && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                    {previewAttachment.name}
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Documento adjunto por Recepción | RUP: {selectedReq.rup}
                  </p>
                </div>
              </div>
              <button onClick={() => setPreviewAttachment(null)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Content Simulated Viewer Frame */}
            <div className="bg-slate-100 dark:bg-slate-950 p-6 rounded-xl border border-slate-300 dark:border-slate-800 max-h-[60vh] overflow-y-auto space-y-4 text-slate-800 dark:text-slate-200 font-serif">
              <div className="text-center border-b border-slate-300 dark:border-slate-800 pb-3 font-sans">
                <h4 className="font-black text-sm uppercase text-slate-900 dark:text-slate-100">
                  INSTITUTO DE INVESTIGACIONES TÉCNICO CIENTÍFICAS DE LA UNIVERSIDAD POLICIAL
                </h4>
                <p className="text-[11px] text-slate-500 font-semibold">IITCUP - DEPARTAMENTO DE SERVICIOS PERICIALES</p>
                <p className="text-[10px] font-mono text-emerald-600 font-bold mt-1">EXPEDIENTE DIGITAL: {selectedReq.rup}</p>
              </div>

              <div className="space-y-2 text-xs leading-relaxed font-sans">
                <p><strong>DOCUMENTO:</strong> {previewAttachment.name}</p>
                <p><strong>CÓDIGO EXTERNO:</strong> {selectedReq.externalCode}</p>
                <p><strong>ORIGEN:</strong> {selectedReq.origin}</p>
                <p><strong>AUTORIDAD SOLICITANTE:</strong> {selectedReq.applicantName}</p>
                <p><strong>FECHA REGISTRO:</strong> {new Date(previewAttachment.uploadedAt).toLocaleString('es-BO')}</p>

                <div className="mt-4 p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-700 dark:text-slate-300 space-y-1">
                  <p className="font-bold text-emerald-600">[CONTENIDO DEL REQUERIMIENTO Y FOJAS ANEXAS]</p>
                  <p>Puntos de pericia consignados:</p>
                  <p className="italic text-slate-500">"{selectedReq.puntosPericia}"</p>
                  <p className="mt-2 text-slate-400 text-[10px]">Firma digital de recepción: {selectedReq.registeredBy} - Validador IITCUP OK</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono">
                {previewAttachment.type} | {Math.round(previewAttachment.size / 1024)} KB
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={previewAttachment.dataUrl || '#'}
                  download={previewAttachment.name}
                  onClick={(e) => {
                    if (!previewAttachment.dataUrl) {
                      e.preventDefault();
                      alert(`Descargando documento simulado ${previewAttachment.name}`);
                    }
                  }}
                  className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Descargar Archivo
                </a>
                <button
                  onClick={() => setPreviewAttachment(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cerrar Previsualización
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
