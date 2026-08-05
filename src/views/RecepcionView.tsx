import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Requirement, EvidenceItem, FileAttachment } from '../types';
import { generateRequirementPDF } from '../services/exports';
import {
  FilePlus,
  Search,
  Filter,
  Printer,
  FileText,
  Paperclip,
  CheckCircle2,
  Package,
  Eye,
  Plus,
  X,
  AlertCircle,
  PackageCheck,
  Image as ImageIcon,
  FolderOpen,
  FileCode,
  Download
} from 'lucide-react';

export const RecepcionView: React.FC = () => {
  const {
    requirements,
    offices,
    sections,
    services,
    addRequirement,
    addEvidence,
    proveidos,
    reports,
    evidences,
    custodyLogs,
    selectedRup,
    setSelectedRup,
    setActiveView,
    currentUser
  } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [activeReqDetail, setActiveReqDetail] = useState<Requirement | null>(null);
  const [previewAttachment, setPreviewAttachment] = useState<FileAttachment | null>(null);

  // Filters
  const [filterRup, setFilterRup] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Form State - Hierarchical Forensic Services Selection
  const [selectedArea, setSelectedArea] = useState<string>('BALÍSTICA');
  const [selectedServiceType, setSelectedServiceType] = useState<string>('SERVICIO PERICIAL');
  const [serviceId, setServiceId] = useState<string>('');

  const [regionalOfficeId, setRegionalOfficeId] = useState(offices[0]?.id || 'off-1');
  const [origin, setOrigin] = useState('Fiscalía Especializada en Delitos contra la Vida');
  const [externalCode, setExternalCode] = useState('');
  const [applicantName, setApplicantName] = useState('');
  const [interestedPersonName, setInterestedPersonName] = useState('');
  const [interestedPersonPhone, setInterestedPersonPhone] = useState('');
  const [fojaCount, setFojaCount] = useState<number>(10);
  const [hasEvidence, setHasEvidence] = useState(true);
  const [puntosPericia, setPuntosPericia] = useState('');
  const [observations, setObservations] = useState('');
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);

  // Evidence Modal State if user clicks register evidence right away
  const [registerEvidenceNow, setRegisterEvidenceNow] = useState(false);
  const [packaging, setPackaging] = useState('Bolsa plástica transparente precintada');
  const [evidenceType, setEvidenceType] = useState<EvidenceItem['evidenceType']>('Arma de fuego');
  const [evidenceDesc, setEvidenceDesc] = useState('');
  const [assigneeName, setAssigneeName] = useState('');
  const [assigneePhone, setAssigneePhone] = useState('');
  const [hasCollectionAct, setHasCollectionAct] = useState(true);
  const [hasCustodyAct, setHasCustodyAct] = useState(true);

  // Derive unique Areas available
  const availableAreas = useMemo(() => {
    const areas = Array.from(new Set(services.filter(s => s.active !== false).map(s => s.area || s.sectionName || 'BALÍSTICA')));
    return areas.sort();
  }, [services]);

  // Derive unique Service Types for selected Area
  const availableServiceTypes = useMemo(() => {
    const types = Array.from(
      new Set(
        services
          .filter(s => s.active !== false && (s.area === selectedArea || s.sectionName === selectedArea))
          .map(s => s.type)
      )
    );
    return types;
  }, [services, selectedArea]);

  // Derive specific services for selected Area and Type
  const availableForensicServices = useMemo(() => {
    return services.filter(
      s => s.active !== false &&
      (s.area === selectedArea || s.sectionName === selectedArea) &&
      s.type === selectedServiceType
    );
  }, [services, selectedArea, selectedServiceType]);

  // Keep state updated
  useEffect(() => {
    if (availableAreas.length > 0 && (!selectedArea || !availableAreas.includes(selectedArea))) {
      const defaultArea = availableAreas[0];
      setSelectedArea(defaultArea);
      const types = Array.from(
        new Set(
          services
            .filter(s => s.active !== false && (s.area === defaultArea || s.sectionName === defaultArea))
            .map(s => s.type)
        )
      );
      const defaultType = types[0] || 'SERVICIO PERICIAL';
      setSelectedServiceType(defaultType);
      const srvs = services.filter(
        s => s.active !== false &&
        (s.area === defaultArea || s.sectionName === defaultArea) &&
        s.type === defaultType
      );
      if (srvs.length > 0) setServiceId(srvs[0].id);
    }
  }, [availableAreas, services]);

  const handleAreaChange = (newArea: string) => {
    setSelectedArea(newArea);
    const types = Array.from(
      new Set(
        services
          .filter(s => s.active !== false && (s.area === newArea || s.sectionName === newArea))
          .map(s => s.type)
      )
    );
    const defaultType = types[0] || 'SERVICIO PERICIAL';
    setSelectedServiceType(defaultType);

    const srvs = services.filter(
      s => s.active !== false &&
      (s.area === newArea || s.sectionName === newArea) &&
      s.type === defaultType
    );
    if (srvs.length > 0) {
      setServiceId(srvs[0].id);
    } else {
      setServiceId('');
    }
  };

  const handleServiceTypeChange = (newType: string) => {
    setSelectedServiceType(newType);
    const srvs = services.filter(
      s => s.active !== false &&
      (s.area === selectedArea || s.sectionName === selectedArea) &&
      s.type === newType
    );
    if (srvs.length > 0) {
      setServiceId(srvs[0].id);
    } else {
      setServiceId('');
    }
  };

  useEffect(() => {
    if (selectedRup) {
      const match = requirements.find(r => r.rup.toLowerCase() === selectedRup.toLowerCase());
      if (match) {
        setActiveReqDetail(match);
        setShowDetailModal(true);
      }
    }
  }, [selectedRup, requirements]);

  // Handle service filtering based on section
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const newAtt: FileAttachment = {
          id: 'att-' + Date.now(),
          name: file.name,
          size: file.size,
          type: file.type,
          dataUrl: reader.result as string,
          uploadedAt: new Date().toISOString()
        };
        setAttachments(prev => [...prev, newAtt]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !puntosPericia || !externalCode) {
      alert('Por favor complete los campos obligatorios (Solicitante, Código Externo y Puntos de Pericia).');
      return;
    }

    const selectedOffice = offices.find(o => o.id === regionalOfficeId) || offices[0];
    const selectedService = services.find(s => s.id === serviceId) || availableForensicServices[0] || services[0];
    const areaName = selectedService?.area || selectedArea;
    const srvName = selectedService
      ? `${selectedService.code ? '[' + selectedService.code + '] ' : ''}${selectedService.name}`
      : 'Servicio Pericial';
    const computedServiceType: 'PERICIAL' | 'TECNICO' | 'AMBOS' =
      selectedServiceType.includes('TÉCNICO') || selectedServiceType.includes('TECNICO') ? 'TECNICO' : 'PERICIAL';

    const createdReq = addRequirement({
      entryDateTime: new Date().toISOString(),
      regionalOfficeId: selectedOffice.id,
      regionalOfficeName: selectedOffice.name,
      origin,
      externalCode,
      applicantName,
      interestedPersonName,
      interestedPersonPhone,
      fojaCount,
      serviceType: computedServiceType,
      sectionId: selectedService?.sectionId || 'sec-1',
      sectionName: areaName,
      serviceId: selectedService?.id || 'srv-1',
      serviceName: srvName,
      hasEvidence,
      puntosPericia,
      observations,
      registeredBy: currentUser.name,
      registeredById: currentUser.id,
      attachments
    });

    // If evidence flag is checked and user wants to register evidence now
    if (hasEvidence && registerEvidenceNow && evidenceDesc) {
      addEvidence({
        requirementId: createdReq.id,
        rup: createdReq.rup,
        entryDateTime: new Date().toISOString(),
        packaging,
        evidenceType,
        description: evidenceDesc,
        assigneeName: assigneeName || applicantName,
        assigneePhone,
        hasCollectionAct,
        hasCustodyAct,
        observations: 'Registrada al momento del requerimiento.',
        attachments: []
      });
    }

    alert(`¡Requerimiento registrado exitosamente!\nNúmero RUP asignado: ${createdReq.rup}`);
    setShowModal(false);
    // Reset form
    setExternalCode('');
    setApplicantName('');
    setInterestedPersonName('');
    setInterestedPersonPhone('');
    setPuntosPericia('');
    setObservations('');
    setAttachments([]);
    setRegisterEvidenceNow(false);
    setEvidenceDesc('');
  };

  // Filtered Requirements
  const filteredRequirements = requirements.filter(r => {
    const matchRup = !filterRup || 
      r.rup.toLowerCase().includes(filterRup.toLowerCase()) || 
      r.applicantName.toLowerCase().includes(filterRup.toLowerCase()) || 
      (r.interestedPersonName && r.interestedPersonName.toLowerCase().includes(filterRup.toLowerCase())) ||
      (r.interestedPersonPhone && r.interestedPersonPhone.toLowerCase().includes(filterRup.toLowerCase())) ||
      r.externalCode.toLowerCase().includes(filterRup.toLowerCase());
    const matchSec = !filterSection || r.sectionId === filterSection;
    const matchStat = !filterStatus || r.status === filterStatus;
    return matchRup && matchSec && matchStat;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <FilePlus className="w-5 h-5 text-emerald-600" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Recepción de Requerimientos
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Registro oficial y generación de código correlativo automático RUP (SCZ-7-XXXXXX)
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-md text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer border border-emerald-600"
        >
          <Plus className="w-4 h-4" />
          Registrar Nuevo Requerimiento
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por RUP, Solicitante o CUD..."
            value={filterRup}
            onChange={e => setFilterRup(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={filterSection}
            onChange={e => setFilterSection(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-600 outline-none w-1/2 md:w-auto"
          >
            <option value="">Todas las Secciones</option>
            {sections.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-600 outline-none w-1/2 md:w-auto"
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
      </div>

      {/* Requirements Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3">N° RUP</th>
                <th className="p-3">Ingreso</th>
                <th className="p-3">Origen / Solicitante</th>
                <th className="p-3">Código Ext.</th>
                <th className="p-3">Sección / Servicio</th>
                <th className="p-3">Fojas</th>
                <th className="p-3">Evidencias</th>
                <th className="p-3">Estado</th>
                <th className="p-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRequirements.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    No se encontraron requerimientos registrados con esos criterios.
                  </td>
                </tr>
              ) : (
                filteredRequirements.map(req => {
                  const prov = proveidos.find(p => p.requirementId === req.id);
                  const rep = reports.find(r => r.requirementId === req.id);
                  const ev = evidences.find(e => e.requirementId === req.id);

                  return (
                    <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-3 font-mono font-bold text-emerald-800 dark:text-emerald-400">
                        {req.rup}
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {new Date(req.entryDateTime).toLocaleString('es-BO', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="p-3 text-slate-900 dark:text-slate-100 font-medium">
                        <div>{req.origin}</div>
                        <div className="text-[10px] text-slate-500">{req.applicantName}</div>
                      </td>
                      <td className="p-3 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                        {req.externalCode}
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-300">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{req.sectionName}</div>
                        <div className="text-[10px] text-slate-500 max-w-xs truncate">{req.serviceName}</div>
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-300">{req.fojaCount}</td>
                      <td className="p-3">
                        {req.hasEvidence ? (
                          <span className="bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-300 dark:border-amber-800 inline-flex items-center gap-1">
                            <Package className="w-3 h-3" /> SÍ
                          </span>
                        ) : (
                          <span className="text-slate-400">NO</span>
                        )}
                      </td>
                      <td className="p-3 whitespace-nowrap">
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
                      <td className="p-3 text-right whitespace-nowrap space-x-1">
                        <button
                          onClick={() => {
                            setActiveReqDetail(req);
                            setShowDetailModal(true);
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold text-[11px] inline-flex items-center gap-1"
                          title="Ver Detalle Completo"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => generateRequirementPDF(req, ev, prov, rep)}
                          className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px] inline-flex items-center gap-1 border border-emerald-200 dark:border-emerald-800"
                          title="Imprimir Ficha Oficial RUP PDF"
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

      {/* Modal: Register Requirement Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl p-5 sm:p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-950 text-amber-400 flex items-center justify-center font-bold">
                  <FilePlus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                    Nuevo Requerimiento Pericial / Técnico
                  </h2>
                  <p className="text-xs text-slate-500">Se generará automáticamente la correlativa RUP (SCZ-7-XXXXXX)</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Office */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Oficina Regional
                  </label>
                  <select
                    value={regionalOfficeId}
                    onChange={e => setRegionalOfficeId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-600 outline-none"
                  >
                    {offices.map(o => (
                      <option key={o.id} value={o.id}>{o.name}</option>
                    ))}
                  </select>
                </div>

                {/* Origin */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Origen / Institución Solicitante *
                  </label>
                  <input
                    type="text"
                    value={origin}
                    onChange={e => setOrigin(e.target.value)}
                    placeholder="Ej. Fiscalía Especializada, FELCC, Juzgado..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-600 outline-none"
                    required
                  />
                </div>

                {/* External Code */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Código Externo (CUD, N° Causa, IANUS) *
                  </label>
                  <input
                    type="text"
                    value={externalCode}
                    onChange={e => setExternalCode(e.target.value)}
                    placeholder="Ej. CUD: 7011020260088 / Causa: 202/2026"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-600 outline-none font-mono"
                    required
                  />
                </div>

                {/* Applicant Name */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nombre del Solicitante / Autoridad *
                  </label>
                  <input
                    type="text"
                    value={applicantName}
                    onChange={e => setApplicantName(e.target.value)}
                    placeholder="Ej. Dr. Marco Antonio Rivas (Fiscal de Materia)"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-600 outline-none"
                    required
                  />
                </div>

                {/* Interested Person Name */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Persona Interesada (quien deja el requerimiento)
                  </label>
                  <input
                    type="text"
                    value={interestedPersonName}
                    onChange={e => setInterestedPersonName(e.target.value)}
                    placeholder="Ej. Sbtte. Carlos Mendoza / Abg. Juan Pérez"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>

                {/* Interested Person Phone */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Teléfono de Contacto (Persona Interesada)
                  </label>
                  <input
                    type="tel"
                    value={interestedPersonPhone}
                    onChange={e => setInterestedPersonPhone(e.target.value)}
                    placeholder="Ej. 77345678 / 3-345678"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-600 outline-none font-mono"
                  />
                </div>

                {/* Foja Count */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Cantidad de Fojas
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={fojaCount}
                    onChange={e => setFojaCount(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>

                {/* HIERARCHICAL SERVICE SELECTION CONTAINER */}
                <div className="md:col-span-2 bg-slate-100 dark:bg-slate-800/70 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-400 font-bold border-b border-slate-200 dark:border-slate-700 pb-2 text-sm uppercase tracking-wide">
                    <span>Clasificación del Requerimiento (Selección de 3 Niveles)</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* 1. Area */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                        1° Área Pericial *
                      </label>
                      <select
                        value={selectedArea}
                        onChange={e => handleAreaChange(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-600 outline-none font-bold text-slate-900 dark:text-slate-100 text-sm"
                      >
                        {availableAreas.map(area => (
                          <option key={area} value={area}>{area}</option>
                        ))}
                      </select>
                    </div>

                    {/* 2. Type */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                        2° Tipo de Servicio *
                      </label>
                      <select
                        value={selectedServiceType}
                        onChange={e => handleServiceTypeChange(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-600 outline-none font-semibold text-emerald-800 dark:text-emerald-400 text-sm"
                      >
                        {availableServiceTypes.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    {/* 3. Specific Service */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                        3° Servicio Pericial Específico *
                      </label>
                      <select
                        value={serviceId}
                        onChange={e => setServiceId(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-600 outline-none text-sm font-medium"
                      >
                        {availableForensicServices.map(srv => (
                          <option key={srv.id} value={srv.id}>
                            {srv.code ? `[${srv.code}] ` : ''}{srv.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

              </div>

              {/* Evidence Checkbox & Form */}
              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-3.5 space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="hasEvidence"
                    checked={hasEvidence}
                    onChange={e => setHasEvidence(e.target.checked)}
                    className="w-4 h-4 text-emerald-800 rounded border-amber-400 focus:ring-amber-500"
                  />
                  <label htmlFor="hasEvidence" className="font-bold text-slate-800 dark:text-amber-200 text-xs">
                    ¿Este requerimiento incluye Evidencias Físicas? (Muestras, armas, celulares, etc.)
                  </label>
                </div>

                {hasEvidence && (
                  <div className="pt-2 border-t border-amber-200/60 dark:border-amber-800/60 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="registerNow"
                        checked={registerEvidenceNow}
                        onChange={e => setRegisterEvidenceNow(e.target.checked)}
                        className="w-3.5 h-3.5 text-emerald-700 rounded"
                      />
                      <label htmlFor="registerNow" className="font-medium text-slate-700 dark:text-amber-300 text-[11px]">
                        Registrar datos inmediatos de evidencia para la Sala de Evidencias
                      </label>
                    </div>

                    {registerEvidenceNow && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                            Tipo de Evidencia
                          </label>
                          <select
                            value={evidenceType}
                            onChange={e => setEvidenceType(e.target.value as any)}
                            className="w-full bg-white dark:bg-slate-900 border border-amber-300 rounded p-1.5 text-xs"
                          >
                            <option value="Arma de fuego">Arma de fuego</option>
                            <option value="Celular">Celular / Smartphone</option>
                            <option value="Documento">Documento / Minuta</option>
                            <option value="DVR">DVR Video</option>
                            <option value="Laptop">Laptop / Computadora</option>
                            <option value="Pen Drive">Pen Drive / Memoria</option>
                            <option value="Otros">Otros</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                            Embalaje / Precinto
                          </label>
                          <input
                            type="text"
                            value={packaging}
                            onChange={e => setPackaging(e.target.value)}
                            placeholder="Ej. Bolsa plástica precintada N° 45"
                            className="w-full bg-white dark:bg-slate-900 border border-amber-300 rounded p-1.5 text-xs"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                            Descripción de la Evidencia
                          </label>
                          <input
                            type="text"
                            value={evidenceDesc}
                            onChange={e => setEvidenceDesc(e.target.value)}
                            placeholder="Ej. Smartphone Samsung S23 con funda y tarjeta SIM"
                            className="w-full bg-white dark:bg-slate-900 border border-amber-300 rounded p-1.5 text-xs"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Puntos de Pericia */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Puntos de Pericia Solicitados *
                </label>
                <textarea
                  rows={3}
                  value={puntosPericia}
                  onChange={e => setPuntosPericia(e.target.value)}
                  placeholder="Escriba textualmente los puntos de pericia consignados en el oficio u orden..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-600 outline-none"
                  required
                />
              </div>

              {/* File Attachment */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Adjuntar Documentos (PDF, DOC, DOCX, JPG, PNG)
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center gap-2 text-xs font-semibold">
                    <Paperclip className="w-4 h-4" />
                    Seleccionar Archivo
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-slate-500">
                    {attachments.length} archivo(s) adjunto(s)
                  </span>
                </div>

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

              {/* Form Buttons */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold shadow-md cursor-pointer flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Registrar Requerimiento y Generar RUP
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Modal: View Requirement Detail & Evidence Room Files */}
      {showDetailModal && activeReqDetail && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl p-5 sm:p-6 space-y-4 max-h-[90vh] flex flex-col">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-emerald-950 text-amber-400 font-mono font-extrabold text-sm border border-emerald-700">
                  {activeReqDetail.rup}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Ingreso: {new Date(activeReqDetail.entryDateTime).toLocaleString('es-BO')}
                </span>
              </div>

              <button onClick={() => { setShowDetailModal(false); setSelectedRup(null); }} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-4 text-xs pr-1">
              
              {/* General Metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-slate-400 text-[10px] font-semibold block">Origen / Institución:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">{activeReqDetail.origin}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-semibold block">Solicitante / Autoridad:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">{activeReqDetail.applicantName}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-semibold block">Persona Interesada (quien deja):</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">{activeReqDetail.interestedPersonName || 'No consignado'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-semibold block">Teléfono de Contacto:</span>
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{activeReqDetail.interestedPersonPhone || 'No registrado'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-semibold block">Código CUD / Causa:</span>
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">{activeReqDetail.externalCode}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-semibold block">Sección Forense:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">{activeReqDetail.sectionName}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-semibold block">Servicio Específico:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-100">{activeReqDetail.serviceName}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-semibold block">Fojas:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">{activeReqDetail.fojaCount} fojas</span>
                </div>
              </div>

              {/* Puntos de Pericia */}
              <div>
                <span className="text-slate-500 text-[11px] font-extrabold block mb-1">Puntos de Pericia Solicitados:</span>
                <p className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-slate-800 dark:text-slate-200 whitespace-pre-wrap border border-slate-200 dark:border-slate-700">
                  {activeReqDetail.puntosPericia}
                </p>
              </div>

              {/* Reception Document Attachments */}
              <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
                  <Paperclip className="w-4 h-4 text-blue-600" />
                  Archivos Adjuntos en Recepción ({activeReqDetail.attachments ? activeReqDetail.attachments.length : 0})
                </h4>

                {activeReqDetail.attachments && activeReqDetail.attachments.length > 0 ? (
                  <div className="space-y-1.5">
                    {activeReqDetail.attachments.map(att => (
                      <div
                        key={att.id}
                        className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <FileCode className="w-4 h-4 text-blue-500" />
                          <div>
                            <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">{att.name}</span>
                            <span className="text-[10px] text-slate-400">
                              {Math.round(att.size / 1024)} KB | {new Date(att.uploadedAt).toLocaleString('es-BO')}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => setPreviewAttachment(att)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-2.5 py-1 rounded-lg text-[11px] flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Ver Archivo
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-center py-1 text-[11px] italic">No se adjuntaron documentos iniciales en Recepción.</p>
                )}
              </div>

              {/* Evidence Room Physical Items & Files Loaded by Sala de Evidencia */}
              {(() => {
                const reqEvidences = evidences.filter(e => e.requirementId === activeReqDetail.id || e.rup === activeReqDetail.rup);
                return (
                  <div className="bg-amber-50/50 dark:bg-slate-800/50 p-4 rounded-xl border border-amber-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center justify-between border-b border-amber-200 dark:border-slate-700 pb-2">
                      <h4 className="font-extrabold text-amber-900 dark:text-amber-200 text-xs flex items-center gap-2">
                        <PackageCheck className="w-4 h-4 text-amber-500" />
                        Evidencias y Archivos Cargados por la Sala de Evidencias ({reqEvidences.length})
                      </h4>
                      <span className="text-[10px] text-amber-700 dark:text-amber-300 font-bold bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded">
                        Custodia & Trazabilidad
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
                              <span>Ingresado por: {ev.assigneeName || 'Sala de Evidencias'}</span>
                              <span>Fecha: {new Date(ev.entryDateTime).toLocaleString('es-BO')}</span>
                            </div>

                            {/* FILES ATTACHED BY SALA DE EVIDENCIAS */}
                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                              <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 block mb-1.5 flex items-center gap-1">
                                <Paperclip className="w-3.5 h-3.5 text-emerald-600" />
                                Archivos adjuntos en Sala de Evidencias ({ev.attachments ? ev.attachments.length : 0}):
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
                                <p className="text-[10px] text-slate-400 italic">No se subieron archivos adjuntos para esta evidencia física.</p>
                              )}
                            </div>

                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-center py-2 text-xs italic">
                        No hay registros de evidencia física asociados en Sala de Evidencias para este RUP.
                      </p>
                    )}
                  </div>
                );
              })()}

              <div className="flex items-center justify-between bg-emerald-950 text-emerald-100 p-3 rounded-xl mt-3">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-emerald-300 block">Estado Actual</span>
                  <span className="font-extrabold text-sm text-amber-300">{activeReqDetail.status}</span>
                </div>

                <button
                  onClick={() => generateRequirementPDF(activeReqDetail, evidences.filter(e => e.requirementId === activeReqDetail.id || e.rup === activeReqDetail.rup), proveidos.find(p => p.requirementId === activeReqDetail.id), reports.find(r => r.requirementId === activeReqDetail.id), custodyLogs)}
                  className="bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  Imprimir Ficha PDF
                </button>
              </div>

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

    </div>
  );
};
