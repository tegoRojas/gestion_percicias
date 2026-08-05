import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EvidenceItem, EvidenceType, CustodyLog, FileAttachment, Requirement } from '../types';
import { generateCustodyPDF } from '../services/exports';
import {
  PackageCheck,
  Plus,
  ArrowRightLeft,
  Search,
  Printer,
  History,
  ShieldCheck,
  X,
  CheckCircle2,
  Send,
  User,
  Phone,
  Eye,
  Paperclip,
  Building2,
  FileText,
  Image as ImageIcon,
  FileUp,
  AlertTriangle,
  FolderOpen,
  Tag,
  Download,
  Check,
  Info,
  Calendar,
  FileCode
} from 'lucide-react';

export const EvidenciasView: React.FC = () => {
  const {
    evidences,
    custodyLogs,
    requirements,
    addEvidence,
    addCustodyMovement,
    deliverReportToAuthority,
    reports,
    currentUser
  } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showEvDetailModal, setShowEvDetailModal] = useState(false);

  const [selectedEv, setSelectedEv] = useState<EvidenceItem | null>(null);
  const [previewAttachment, setPreviewAttachment] = useState<FileAttachment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State: Add Evidence
  const [rupInput, setRupInput] = useState('');
  const [packaging, setPackaging] = useState('Bolsa de polietileno transparente precintada');
  const [evidenceType, setEvidenceType] = useState<EvidenceType>('Arma de fuego');
  const [description, setDescription] = useState('');
  const [assigneeName, setAssigneeName] = useState('');
  const [assigneePhone, setAssigneePhone] = useState('');
  const [hasCollectionAct, setHasCollectionAct] = useState(true);
  const [hasCustodyAct, setHasCustodyAct] = useState(true);
  const [attachedFiles, setAttachedFiles] = useState<FileAttachment[]>([]);

  // Form State: Custody Movement
  const [actionType, setActionType] = useState<CustodyLog['actionType']>('ENTREGA_A_PERITO');
  const [deliveredBy, setDeliveredBy] = useState(currentUser.name);
  const [receivedBy, setReceivedBy] = useState('');
  const [motive, setMotive] = useState('Entrega de evidencia para inicio de análisis pericial balístico/informático.');
  const [notes, setNotes] = useState('');

  const evidenceTypesList: EvidenceType[] = [
    'Documento',
    'Arma de fuego',
    'Celular',
    'DVR',
    'Laptop',
    'CPU',
    'CD',
    'DVD',
    'Pen Drive',
    'Disco Externo',
    'Otros'
  ];

  // Match current entered RUP with requirements database
  const matchedRequirement = requirements.find(
    r => r.rup.toLowerCase().trim() === rupInput.toLowerCase().trim()
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files) as File[];

    files.forEach((file: File) => {
      const isPdf = file.name.endsWith('.pdf') || file.type.includes('pdf');
      const isJpg = file.name.endsWith('.jpg') || file.name.endsWith('.jpeg') || file.type.includes('image');

      if (!isPdf && !isJpg) {
        alert(`El archivo ${file.name} no tiene formato PDF o JPG permitido.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const dataUrl = uploadEvent.target?.result as string;
        const newAtt: FileAttachment = {
          id: 'att-ev-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
          name: file.name,
          size: file.size,
          type: isPdf ? 'application/pdf' : 'image/jpeg',
          dataUrl,
          uploadedAt: new Date().toISOString()
        };
        setAttachedFiles(prev => [...prev, newAtt]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddEvidenceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const req = requirements.find(r => r.rup.toLowerCase().trim() === rupInput.toLowerCase().trim());
    if (!req) {
      alert(`El RUP "${rupInput}" no existe en el sistema. Por favor seleccione o verifique el RUP.`);
      return;
    }

    addEvidence({
      requirementId: req.id,
      rup: req.rup,
      entryDateTime: new Date().toISOString(),
      packaging,
      evidenceType,
      description,
      assigneeName: assigneeName || req.applicantName,
      assigneePhone,
      hasCollectionAct,
      hasCustodyAct,
      observations: notes,
      attachments: attachedFiles
    });

    alert(`Evidencia vinculada a pericia (${req.sectionName} / ${req.serviceName}) y registrada exitosamente en Sala de Evidencias.`);
    setShowAddModal(false);
    setDescription('');
    setRupInput('');
    setAttachedFiles([]);
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEv || !receivedBy) {
      alert('Por favor ingrese el nombre del receptor.');
      return;
    }

    let nextEvStatus: EvidenceItem['status'] = 'EN_CUSTODIA';
    if (actionType === 'ENTREGA_A_PERITO') nextEvStatus = 'ENTREGADO_A_PERITO';
    if (actionType === 'DEVOLUCION_DE_PERITO') nextEvStatus = 'DEVUELTO_A_SALA';
    if (actionType === 'SALIDA_FINAL') nextEvStatus = 'ENTREGADO_A_SOLICITANTE';

    addCustodyMovement(
      {
        evidenceId: selectedEv.id,
        rup: selectedEv.rup,
        actionType,
        deliveredBy,
        receivedBy,
        motive,
        notes
      },
      nextEvStatus
    );

    alert('Movimiento de Cadena de Custodia registrado con éxito.');
    setShowTransferModal(false);
  };

  const filteredEvidences = evidences.filter(
    e => e.rup.toLowerCase().includes(searchTerm.toLowerCase()) ||
         e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
         e.evidenceType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Sala de Evidencias y Cadena de Custodia
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Resguardo, recepción con verificación de Sección/Servicio, adjunto de actas/fotografías (PDF/JPG) y trazabilidad.
          </p>
        </div>

        <button
          onClick={() => {
            if (requirements.length > 0 && !rupInput) {
              setRupInput(requirements[0].rup);
              setAssigneeName(requirements[0].applicantName);
            }
            setShowAddModal(true);
          }}
          className="bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold px-4 py-2.5 rounded-xl shadow-md text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer border border-amber-300"
        >
          <Plus className="w-4 h-4" />
          Registrar Evidencia en Sala
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar evidencia por RUP, tipo, descripción..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>
      </div>

      {/* Evidences Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3">N° RUP</th>
                <th className="p-3">Sección / Servicio Pericial</th>
                <th className="p-3">Tipo / Embalaje</th>
                <th className="p-3">Descripción Evidencia</th>
                <th className="p-3">Adjuntos (PDF/JPG)</th>
                <th className="p-3">Estado Custodia</th>
                <th className="p-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredEvidences.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No existen ítems registrados en Sala de Evidencias.
                  </td>
                </tr>
              ) : (
                filteredEvidences.map(ev => {
                  const evLogs = custodyLogs.filter(l => l.evidenceId === ev.id);
                  const req = requirements.find(r => r.rup === ev.rup);
                  return (
                    <tr key={ev.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-3 font-mono font-bold text-amber-600 dark:text-amber-400">
                        {ev.rup}
                      </td>
                      
                      {/* Confirmación Sección / Servicio pericial */}
                      <td className="p-3 text-slate-800 dark:text-slate-200 font-semibold">
                        {req ? (
                          <div className="space-y-0.5">
                            <span className="font-bold text-emerald-700 dark:text-emerald-400 block text-[11px]">
                              {req.sectionName}
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                              {req.serviceName}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">No especificado</span>
                        )}
                      </td>

                      <td className="p-3 text-slate-900 dark:text-slate-100 font-semibold">
                        <div>{ev.evidenceType}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{ev.packaging}</div>
                      </td>

                      <td className="p-3 text-slate-700 dark:text-slate-200 max-w-xs leading-tight">
                        {ev.description}
                      </td>

                      {/* Adjuntos (PDF/JPG) */}
                      <td className="p-3">
                        {ev.attachments && ev.attachments.length > 0 ? (
                          <button
                            onClick={() => {
                              setSelectedEv(ev);
                              setShowEvDetailModal(true);
                            }}
                            className="bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800 text-[10px] flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Paperclip className="w-3.5 h-3.5 text-blue-500" />
                            <span>{ev.attachments.length} archivo(s) PDF/JPG</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">Sin adjuntos</span>
                        )}
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ev.status === 'EN_CUSTODIA'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300'
                            : ev.status === 'ENTREGADO_A_PERITO'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                        }`}>
                          {ev.status}
                        </span>
                      </td>

                      <td className="p-3 text-right whitespace-nowrap space-x-1">
                        
                        {/* Ver Pericia y Adjuntos */}
                        <button
                          onClick={() => {
                            setSelectedEv(ev);
                            setShowEvDetailModal(true);
                          }}
                          className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 text-blue-700 dark:text-blue-300 font-semibold text-[11px] inline-flex items-center gap-1 border border-blue-200 dark:border-blue-800"
                          title="Ver datos completos de la pericia y adjuntos"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Ver Pericia
                        </button>

                        {/* Traspaso Cadena de Custodia */}
                        <button
                          onClick={() => {
                            setSelectedEv(ev);
                            setShowTransferModal(true);
                          }}
                          className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950 hover:bg-amber-100 text-amber-800 dark:text-amber-300 font-semibold text-[11px] inline-flex items-center gap-1 border border-amber-300"
                          title="Registrar Traspaso de Custodia"
                        >
                          <ArrowRightLeft className="w-3.5 h-3.5" />
                          Traspaso
                        </button>

                        {/* Histórico */}
                        <button
                          onClick={() => {
                            setSelectedEv(ev);
                            setShowHistoryModal(true);
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold text-[11px] inline-flex items-center gap-1"
                          title="Ver Trazabilidad"
                        >
                          <History className="w-3.5 h-3.5" />
                        </button>

                        {/* PDF */}
                        <button
                          onClick={() => generateCustodyPDF(ev, evLogs)}
                          className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px] inline-flex items-center gap-1 border border-emerald-200 dark:border-emerald-800"
                          title="Imprimir Acta Oficial PDF"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          PDF
                        </button>

                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Register Evidence (With RUP Confirmation & PDF/JPG Attachments) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl p-5 sm:p-6 space-y-4 max-h-[92vh] flex flex-col">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <PackageCheck className="w-5 h-5 text-amber-500" />
                <h2 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                  Ingreso de Evidencia a Sala de Custodia
                </h2>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEvidenceSubmit} className="space-y-4 text-xs overflow-y-auto flex-1 pr-1">
              
              {/* Section 1: RUP Selection & Automatic "Sección / Servicio" Confirmation */}
              <div className="bg-amber-50/60 dark:bg-slate-800/80 p-4 rounded-xl border border-amber-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-800 dark:text-slate-200 text-xs">
                    1. Número RUP de la Pericia *
                  </label>
                  <span className="text-[10px] text-slate-500 font-medium">
                    Seleccione un RUP registrado para confirmar el servicio pericial
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Ej. SCZ-7-000001"
                    value={rupInput}
                    onChange={e => setRupInput(e.target.value)}
                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 font-mono font-extrabold text-amber-600 dark:text-amber-400 text-sm outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                  
                  {/* Dropdown selector of registered RUPs */}
                  <select
                    value={rupInput}
                    onChange={e => {
                      setRupInput(e.target.value);
                      const req = requirements.find(r => r.rup === e.target.value);
                      if (req && !assigneeName) setAssigneeName(req.applicantName);
                    }}
                    className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 font-mono font-bold text-slate-700 dark:text-slate-200 text-xs"
                  >
                    <option value="">-- Seleccionar RUP --</option>
                    {requirements.map(reqItem => (
                      <option key={reqItem.id} value={reqItem.rup}>
                        {reqItem.rup} - {reqItem.sectionName} ({reqItem.serviceName})
                      </option>
                    ))}
                  </select>
                </div>

                {/* REQUIREMENT #1 PROMPT FULFILLMENT: Confirmation text with "Sección / Servicio" */}
                {rupInput.trim() !== '' && (
                  <div className="mt-2">
                    {matchedRequirement ? (
                      <div className="bg-emerald-950 text-emerald-100 p-3.5 rounded-xl border-2 border-emerald-500 space-y-2 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 font-extrabold text-amber-300 text-xs">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>RUP CONFIRMADO - DATOS DE LA PERICIA</span>
                          </div>
                          <span className="text-[10px] bg-emerald-800 text-emerald-200 font-mono px-2 py-0.5 rounded font-bold">
                            {matchedRequirement.rup}
                          </span>
                        </div>

                        {/* Explicit Highlighted Section / Service box */}
                        <div className="bg-slate-900/90 p-2.5 rounded-lg border border-emerald-700/80 space-y-0.5">
                          <div className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-amber-400" />
                            SECCIÓN / SERVICIO SOLICITADO:
                          </div>
                          <div className="text-xs font-black text-white">
                            {matchedRequirement.sectionName} <span className="text-amber-400">/</span> {matchedRequirement.serviceName}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-200 pt-0.5">
                          <div>
                            <span className="text-slate-400 font-semibold block text-[10px]">CUD / Causa / IANUS:</span>
                            <span className="font-bold text-amber-200">{matchedRequirement.externalCode}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-semibold block text-[10px]">Autoridad Solicitante:</span>
                            <span className="font-medium truncate block">{matchedRequirement.applicantName}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-slate-400 font-semibold block text-[10px]">Puntos de Pericia:</span>
                            <span className="italic text-slate-300 line-clamp-2">"{matchedRequirement.puntosPericia}"</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-red-950/80 border border-red-500 rounded-xl p-3 text-[11px] text-red-200 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                        <span>
                          El RUP "{rupInput}" no fue encontrado en el sistema. Seleccione un RUP válido de la lista para confirmar la Sección / Servicio pericial.
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Section 2: Evidence Physical Data */}
              <div className="space-y-3">
                <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wide border-b border-slate-200 dark:border-slate-800 pb-1">
                  2. Datos de la Evidencia Física
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Tipo de Evidencia *
                    </label>
                    <select
                      value={evidenceType}
                      onChange={e => setEvidenceType(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 outline-none font-semibold text-xs"
                    >
                      {evidenceTypesList.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Embalaje / Precinto *
                    </label>
                    <input
                      type="text"
                      value={packaging}
                      onChange={e => setPackaging(e.target.value)}
                      placeholder="Ej. Bolsa plástica precintada 00452"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 outline-none text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Oficial Colector / Interesado
                    </label>
                    <input
                      type="text"
                      value={assigneeName}
                      onChange={e => setAssigneeName(e.target.value)}
                      placeholder="Nombre del oficial o colector"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 outline-none text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Teléfono de Contacto
                    </label>
                    <input
                      type="text"
                      value={assigneePhone}
                      onChange={e => setAssigneePhone(e.target.value)}
                      placeholder="Ej. 77312345"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 outline-none text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Descripción Detallada de la Evidencia *
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Detallar marca, modelo, número de serie, estado físico..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 outline-none text-xs"
                    required
                  />
                </div>

                <div className="flex items-center gap-6 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasCollectionAct}
                      onChange={e => setHasCollectionAct(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span className="font-bold text-slate-700 dark:text-slate-300">Cuenta con Acta de Colección</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasCustodyAct}
                      onChange={e => setHasCustodyAct(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span className="font-bold text-slate-700 dark:text-slate-300">Cuenta con Acta de Cadena de Custodia</span>
                  </label>
                </div>
              </div>

              {/* REQUIREMENT #2 PROMPT FULFILLMENT: Attach Files in PDF and JPG formats */}
              <div className="space-y-2 border-t border-slate-200 dark:border-slate-800 pt-3">
                <div className="flex items-center justify-between">
                  <label className="font-extrabold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
                    <Paperclip className="w-4 h-4 text-blue-600" />
                    3. Adjuntar Archivos (PDF, JPG)
                  </label>
                  <span className="text-[10px] text-slate-400">
                    Formatos soportados: PDF, JPG, JPEG
                  </span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 space-y-2">
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-2 transition-colors shadow-sm">
                      <FileUp className="w-4 h-4" />
                      <span>Seleccionar PDF / JPG</span>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,image/jpeg,application/pdf"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Cargue fotografías de la evidencia, actas escaneadas o respaldos.
                    </span>
                  </div>

                  {/* List of uploaded attachments */}
                  {attachedFiles.length > 0 ? (
                    <div className="space-y-2 pt-2">
                      {attachedFiles.map((file, idx) => (
                        <div
                          key={file.id || idx}
                          className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            {file.type.includes('pdf') ? (
                              <FileText className="w-4 h-4 text-red-500 shrink-0" />
                            ) : (
                              <ImageIcon className="w-4 h-4 text-blue-500 shrink-0" />
                            )}
                            <div className="truncate">
                              <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">
                                {file.name}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {Math.round(file.size / 1024)} KB | {file.type.includes('pdf') ? 'PDF' : 'JPG'}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setAttachedFiles(prev => prev.filter((_, i) => i !== idx))}
                            className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg transition-colors cursor-pointer"
                            title="Eliminar adjunto"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-2 text-[11px] text-slate-400 italic">
                      No se han adjuntado archivos aún. Puede seleccionar múltiples imágenes JPG o documentos PDF.
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!matchedRequirement}
                  className={`px-5 py-2 rounded-xl font-bold shadow-md flex items-center gap-2 cursor-pointer transition-all ${
                    matchedRequirement
                      ? 'bg-amber-500 hover:bg-amber-400 text-emerald-950'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Registrar Evidencia y Adjuntos
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Modal 2: Full Evidence & Pericia Details Viewer (Observación con todos los datos de la pericia y adjuntos) */}
      {showEvDetailModal && selectedEv && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl p-5 sm:p-6 space-y-4 text-xs max-h-[90vh] flex flex-col">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 shrink-0">
              <div>
                <h2 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-amber-500" />
                  Detalle de la Evidencia y Pericia
                </h2>
                <p className="text-xs font-mono text-amber-600 dark:text-amber-400 font-bold mt-0.5">
                  RUP: {selectedEv.rup}
                </p>
              </div>
              <button onClick={() => setShowEvDetailModal(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-4 pr-1">
              
              {/* Linked Requirement Data (Sección / Servicio) */}
              {(() => {
                const req = requirements.find(r => r.rup === selectedEv.rup);
                return req ? (
                  <div className="bg-emerald-950 text-emerald-100 p-4 rounded-xl border border-emerald-800 space-y-3 shadow-inner">
                    <div className="flex items-center justify-between border-b border-emerald-800/80 pb-2">
                      <span className="font-extrabold text-amber-300 text-xs flex items-center gap-1.5 uppercase">
                        <Building2 className="w-4 h-4 text-amber-400" />
                        DATOS DE LA PERICIA REGISTRADA
                      </span>
                      <span className="text-[10px] bg-emerald-800 text-emerald-200 font-mono font-bold px-2 py-0.5 rounded">
                        RUP: {req.rup}
                      </span>
                    </div>

                    <div className="bg-slate-900/90 p-3 rounded-lg border border-emerald-700 space-y-1">
                      <span className="text-[10px] text-amber-400 font-bold block">SECCIÓN / SERVICIO SOLICITADO:</span>
                      <p className="text-sm font-extrabold text-white">
                        {req.sectionName} <span className="text-amber-400">/</span> {req.serviceName}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-[11px]">
                      <div>
                        <span className="text-slate-400 font-semibold block text-[10px]">CUD / Causa / IANUS:</span>
                        <span className="font-bold text-amber-200">{req.externalCode}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold block text-[10px]">Autoridad Solicitante:</span>
                        <span className="font-medium text-slate-100">{req.applicantName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold block text-[10px]">Origen / Institución:</span>
                        <span className="text-slate-100">{req.origin}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400 font-semibold block text-[10px]">Puntos de Pericia Solicitados:</span>
                      <p className="text-xs italic text-slate-200 bg-slate-900/60 p-2.5 rounded-lg border border-emerald-800/60 mt-1">
                        "{req.puntosPericia}"
                      </p>
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Physical Evidence Details */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wide flex items-center gap-1.5">
                  <PackageCheck className="w-4 h-4 text-amber-500" />
                  Ficha de Registro en Sala de Evidencias
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[11px]">
                  <div>
                    <span className="text-slate-400 font-semibold block text-[10px]">Tipo Evidencia</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100">{selectedEv.evidenceType}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block text-[10px]">Embalaje / Precinto</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedEv.packaging}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block text-[10px]">Estado Custodia</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">{selectedEv.status}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block text-[10px]">Colector / Interesado</span>
                    <span className="text-slate-800 dark:text-slate-200">{selectedEv.assigneeName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block text-[10px]">Teléfono</span>
                    <span className="text-slate-800 dark:text-slate-200">{selectedEv.assigneePhone || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block text-[10px]">Ingreso a Sala</span>
                    <span className="text-slate-800 dark:text-slate-200">
                      {new Date(selectedEv.entryDateTime).toLocaleString('es-BO')}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block text-[10px]">Descripción Detallada:</span>
                  <p className="text-xs text-slate-800 dark:text-slate-200 font-medium bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 mt-0.5">
                    {selectedEv.description}
                  </p>
                </div>
              </div>

              {/* Attachments Section (PDF / JPG) */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
                    <Paperclip className="w-4 h-4 text-blue-600" />
                    Archivos Adjuntos de la Evidencia ({selectedEv.attachments ? selectedEv.attachments.length : 0})
                  </h4>
                  <span className="text-[10px] text-slate-400">PDFs y Fotografías JPG</span>
                </div>

                {selectedEv.attachments && selectedEv.attachments.length > 0 ? (
                  <div className="space-y-2">
                    {selectedEv.attachments.map(att => (
                      <div
                        key={att.id}
                        className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          {att.type.includes('pdf') ? (
                            <FileText className="w-5 h-5 text-red-500 shrink-0" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-blue-500 shrink-0" />
                          )}
                          <div className="truncate">
                            <span className="font-bold text-slate-800 dark:text-slate-100 block truncate">
                              {att.name}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {Math.round(att.size / 1024)} KB | Subido: {new Date(att.uploadedAt).toLocaleString('es-BO')}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => setPreviewAttachment(att)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Observar Archivo
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-slate-400 text-xs italic bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    No se adjuntaron documentos o fotografías al registrar esta evidencia.
                  </div>
                )}
              </div>

            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setShowEvDetailModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Modal 3: Document / Image Previewer */}
      {previewAttachment && selectedEv && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                {previewAttachment.type.includes('pdf') ? (
                  <FileText className="w-5 h-5 text-red-500" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-blue-500" />
                )}
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                    {previewAttachment.name}
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Evidencia RUP: {selectedEv.rup} | Tipo: {previewAttachment.type.includes('pdf') ? 'Documento PDF' : 'Imagen JPG'}
                  </p>
                </div>
              </div>
              <button onClick={() => setPreviewAttachment(null)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Preview Frame */}
            <div className="bg-slate-100 dark:bg-slate-950 p-6 rounded-xl border border-slate-300 dark:border-slate-800 max-h-[60vh] overflow-y-auto flex flex-col items-center justify-center min-h-[250px]">
              {previewAttachment.dataUrl ? (
                previewAttachment.type.includes('image') ? (
                  <img
                    src={previewAttachment.dataUrl}
                    alt={previewAttachment.name}
                    className="max-h-[50vh] object-contain rounded-lg shadow-md"
                  />
                ) : (
                  <iframe
                    src={previewAttachment.dataUrl}
                    title={previewAttachment.name}
                    className="w-full h-[50vh] rounded-lg"
                  />
                )
              ) : (
                /* Simulated Document Graphic for Sample Records */
                <div className="w-full text-slate-800 dark:text-slate-200 space-y-3 font-sans">
                  <div className="text-center border-b border-slate-300 dark:border-slate-800 pb-3">
                    <h4 className="font-black text-sm uppercase text-slate-900 dark:text-slate-100">
                      IITCUP - SALA DE EVIDENCIAS Y CUSTODIA
                    </h4>
                    <p className="text-[11px] text-amber-600 font-bold">RESPALDO DIGITAL DE CUSTODIA</p>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                    <p><strong>ARCHIVO:</strong> {previewAttachment.name}</p>
                    <p><strong>RUP ASOCIADO:</strong> {selectedEv.rup}</p>
                    <p><strong>TIPO EVIDENCIA:</strong> {selectedEv.evidenceType}</p>
                    <p><strong>TAMAÑO:</strong> {Math.round(previewAttachment.size / 1024)} KB</p>
                    <p><strong>FECHA REGISTRO:</strong> {new Date(previewAttachment.uploadedAt).toLocaleString('es-BO')}</p>
                    
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 italic text-[11px] mt-2">
                      [Vista previa oficial del archivo {previewAttachment.name.endsWith('.pdf') ? 'PDF' : 'JPG'} almacenado en custodia digital IITCUP].
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400">IITCUP - Cadena de Custodia Digital</span>
              <button
                onClick={() => setPreviewAttachment(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Modal: Transfer Custody */}
      {showTransferModal && selectedEv && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-5 sm:p-6 space-y-4 text-xs">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h2 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                  Movimiento de Cadena de Custodia
                </h2>
                <p className="text-xs font-mono text-amber-500 font-bold">RUP: {selectedEv.rup}</p>
              </div>
              <button onClick={() => setShowTransferModal(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTransferSubmit} className="space-y-3">
              
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tipo de Movimiento
                </label>
                <select
                  value={actionType}
                  onChange={e => setActionType(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 font-bold"
                >
                  <option value="ENTREGA_A_PERITO">ENTREGA A PERITO / TÉCNICO</option>
                  <option value="DEVOLUCION_DE_PERITO">DEVOLUCIÓN DE PERITO A SALA</option>
                  <option value="SALIDA_FINAL">SALIDA FINAL A INSTITUCIÓN SOLICITANTE</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Entregado Por (Responsable de Sala)
                </label>
                <input
                  type="text"
                  value={deliveredBy}
                  onChange={e => setDeliveredBy(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Recibido Por (Perito / Receptor) *
                </label>
                <input
                  type="text"
                  placeholder="Nombre y grado del perito o funcionario receptor"
                  value={receivedBy}
                  onChange={e => setReceivedBy(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Motivo / Destino del Movimiento
                </label>
                <input
                  type="text"
                  value={motive}
                  onChange={e => setMotive(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Observaciones de Integridad
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Ej. Precinto verificado en presencia de las partes..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Registrar Movimiento
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Modal: Custody History Timeline */}
      {showHistoryModal && selectedEv && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl p-5 sm:p-6 space-y-4 text-xs">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h2 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  Historial de Cadena de Custodia
                </h2>
                <p className="text-xs font-mono text-amber-500 font-bold">RUP: {selectedEv.rup} | {selectedEv.evidenceType}</p>
              </div>
              <button onClick={() => setShowHistoryModal(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-80 overflow-y-auto p-2">
              {custodyLogs.filter(l => l.evidenceId === selectedEv.id).map((log) => (
                <div key={log.id} className="relative pl-6 border-l-2 border-amber-500 space-y-1">
                  <div className="absolute -left-2 top-0 w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-white dark:border-slate-900"></div>
                  <div className="flex items-center justify-between font-bold text-slate-900 dark:text-slate-100">
                    <span className="text-emerald-700 dark:text-emerald-400">{log.actionType}</span>
                    <span className="text-[10px] text-slate-400">{new Date(log.dateTime).toLocaleString('es-BO')}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 font-medium">{log.motive}</p>
                  <div className="text-[11px] text-slate-500">
                    Entregado por: <span className="font-semibold text-slate-700 dark:text-slate-300">{log.deliveredBy}</span> | Recibido por: <span className="font-semibold text-slate-700 dark:text-slate-300">{log.receivedBy}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => generateCustodyPDF(selectedEv, custodyLogs.filter(l => l.evidenceId === selectedEv.id))}
                className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                Imprimir Acta de Cadena de Custodia PDF
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
