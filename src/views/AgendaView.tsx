import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Requirement, PsychologyAppointment } from '../types';
import { AgendaModal } from '../components/AgendaModal';
import {
  Calendar,
  Clock,
  User as UserIcon,
  Search,
  Plus,
  MapPin,
  CheckCircle2,
  AlertCircle,
  FileText,
  Play,
  RefreshCw,
  FolderKanban,
  CalendarCheck,
  CalendarDays
} from 'lucide-react';

export const AgendaView: React.FC = () => {
  const { requirements, appointments, currentUser, proveidos, updateWorkStatus } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDateFilter, setSelectedDateFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedReqForModal, setSelectedReqForModal] = useState<Requirement | null>(null);

  // Filter psychology requirements assigned to perito or user
  const psychologyReqs = requirements.filter(req => {
    const isPsychSection =
      req.sectionName?.toUpperCase().includes('PSICOLOG') ||
      req.serviceName?.toUpperCase().includes('PSICOLOG') ||
      req.sectionId === 'sec-9' ||
      req.sectionId === 'sec-2';

    if (!isPsychSection) return false;

    // Filter by perito assignment or power roles
    const prov = proveidos.find(p => p.requirementId === req.id);
    const isAssigned = prov?.assignedPeritoId === currentUser.id || prov?.assignedTecnicoId === currentUser.id;
    const isPowerRole = currentUser.role === 'ADMIN' || currentUser.role === 'ENCARGADO_SERVICIOS' || currentUser.role === 'ENCARGADO_AREA';

    return isAssigned || isPowerRole;
  });

  // Requirements pending appointment scheduling (Status = ASIGNADO)
  const pendingSchedulingReqs = psychologyReqs.filter(r => r.status === 'ASIGNADO' && !r.appointment);

  // Already scheduled requirements or appointments
  const scheduledReqs = psychologyReqs.filter(r => r.status === 'AGENDADO' || r.appointment || r.status === 'EN_PROCESO');

  // Filtered list based on search and date
  const filteredScheduled = scheduledReqs.filter(req => {
    const apt = req.appointment;
    const matchesQuery =
      req.rup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (apt?.userData || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.interestedPersonName || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDate = !selectedDateFilter || (apt?.scheduledDate === selectedDateFilter);

    return matchesQuery && matchesDate;
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.scheduledDate === todayStr);

  const handleOpenScheduleModal = (req?: Requirement) => {
    setSelectedReqForModal(req || null);
    setShowModal(true);
  };

  const handleStartProcess = (reqId: string, rup: string) => {
    updateWorkStatus(reqId, 'Iniciado', 'Inicio de evaluación pericial en Psicología Forense.');
    alert(`¡Evaluación Pericial Iniciada Exitosamente!\nEl caso RUP ${rup} ha cambiado a estado "EN PROCESO".`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Agenda de Citas - Psicología Forense
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Programación y control de citas presenciales previo al inicio del estudio técnico pericial
          </p>
        </div>

        <button
          onClick={() => handleOpenScheduleModal()}
          className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg shadow-emerald-900/20 flex items-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Agendar Nueva Cita
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">Total Agendados</span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{scheduledReqs.length}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <CalendarDays className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">Citas de Hoy</span>
            <span className="text-2xl font-black text-amber-500">{todayAppointments.length}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">Pendientes de Agendar</span>
            <span className="text-2xl font-black text-sky-500">{pendingSchedulingReqs.length}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">Perito Activo</span>
            <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 truncate max-w-[120px] block">{currentUser.name.split(' ')[2] || currentUser.name}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <UserIcon className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Pending Scheduling Section */}
      {pendingSchedulingReqs.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/60 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-extrabold text-sm">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span>Casos Designados Pendientes de Agendamiento ({pendingSchedulingReqs.length})</span>
            </div>
            <span className="text-[11px] text-amber-700 dark:text-amber-400 font-medium hidden sm:inline">
              Agende la cita antes de iniciar la evaluación pericial
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingSchedulingReqs.map(req => (
              <div
                key={req.id}
                className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/80 p-3.5 rounded-xl shadow-sm flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 dark:text-slate-100 text-xs">{req.rup}</span>
                    <span className="bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded">
                      NUEVO CASO
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium mt-0.5 truncate max-w-[260px]">
                    {req.serviceName}
                  </p>
                  {req.interestedPersonName && (
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                      Usuario/Víctima: <strong className="text-slate-700 dark:text-slate-300">{req.interestedPersonName}</strong>
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleOpenScheduleModal(req)}
                  className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-[11px] rounded-lg shadow transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Agendar Cita
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controls & Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Search input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar por RUP, usuario o servicio..."
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            Filtrar Fecha:
          </label>
          <input
            type="date"
            value={selectedDateFilter}
            onChange={e => setSelectedDateFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {selectedDateFilter && (
            <button
              onClick={() => setSelectedDateFilter('')}
              className="text-xs text-red-500 hover:text-red-700 font-bold cursor-pointer"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <CalendarCheck className="w-4 h-4 text-emerald-600" />
          Listado de Citas Agendadas ({filteredScheduled.length})
        </h2>

        {filteredScheduled.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-2 text-slate-400">
            <Calendar className="w-8 h-8 mx-auto opacity-40 text-slate-400" />
            <p className="text-xs">No se encontraron citas agendadas con los filtros seleccionados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredScheduled.map(req => {
              const apt = req.appointment;
              const isToday = apt?.scheduledDate === todayStr;

              return (
                <div
                  key={req.id}
                  className={`bg-white dark:bg-slate-900 rounded-2xl border ${
                    isToday
                      ? 'border-amber-400 dark:border-amber-500/80 shadow-md ring-1 ring-amber-400/50'
                      : 'border-slate-200 dark:border-slate-800 shadow-sm'
                  } p-5 space-y-4 relative overflow-hidden`}
                >
                  {/* Status Ribbon */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">{req.rup}</span>
                        {isToday && (
                          <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                            ¡CITA HOY!
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold block mt-0.5">
                        {req.serviceName}
                      </span>
                    </div>

                    <span className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-extrabold text-[10px] px-3 py-1 rounded-xl border border-emerald-500/30">
                      {req.status}
                    </span>
                  </div>

                  {/* Date & Time Badge */}
                  <div className="bg-emerald-950 text-white p-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      <div>
                        <span className="text-[10px] text-slate-300 block uppercase tracking-wider">Fecha Agendada</span>
                        <span className="font-extrabold text-amber-300 text-xs">{apt?.scheduledDate || 'Por definir'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 border-l border-emerald-800 pl-4">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <div>
                        <span className="text-[10px] text-slate-300 block uppercase tracking-wider">Hora Cita</span>
                        <span className="font-extrabold text-amber-300 text-xs">{apt?.scheduledTime || 'Por definir'} hrs</span>
                      </div>
                    </div>
                  </div>

                  {/* User Data */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl">
                      <UserIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-700 dark:text-slate-300 block text-[11px]">
                          Datos del Usuario / Peritado:
                        </span>
                        <p className="text-slate-900 dark:text-slate-100 font-extrabold whitespace-pre-line mt-0.5">
                          {apt?.userData || req.interestedPersonName || 'No especificado'}
                        </p>
                      </div>
                    </div>

                    {apt?.location && (
                      <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400 px-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Lugar: <strong className="text-slate-800 dark:text-slate-200">{apt.location}</strong></span>
                      </div>
                    )}

                    {apt?.notes && (
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-amber-50 dark:bg-amber-950/20 p-2 rounded-lg border border-amber-200/50 dark:border-amber-800/30">
                        <strong>Obs:</strong> {apt.notes}
                      </div>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 gap-2">
                    <button
                      onClick={() => handleOpenScheduleModal(req)}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Reagendar Cita
                    </button>

                    {req.status === 'EN_PROCESO' ? (
                      <span className="px-3.5 py-1.5 bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30 font-extrabold text-xs rounded-xl flex items-center gap-1.5">
                        <Play className="w-3.5 h-3.5 fill-current text-sky-500 animate-pulse" />
                        Evaluación En Proceso
                      </span>
                    ) : (req.status === 'AGENDADO' || req.status === 'ASIGNADO') ? (
                      <button
                        onClick={() => handleStartProcess(req.id, req.rup)}
                        className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        Iniciar Evaluación Pericial
                      </button>
                    ) : null}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Agenda Modal */}
      <AgendaModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedReqForModal(null);
        }}
        selectedRequirement={selectedReqForModal}
      />

    </div>
  );
};
