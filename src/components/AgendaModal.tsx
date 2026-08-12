import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Requirement, PsychologyAppointment } from '../types';
import { X, Calendar, Clock, User as UserIcon, MapPin, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface AgendaModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRequirement?: Requirement | null;
}

export const AgendaModal: React.FC<AgendaModalProps> = ({
  isOpen,
  onClose,
  selectedRequirement
}) => {
  const { requirements, proveidos, currentUser, addPsychologyAppointment } = useApp();

  const [chosenReqId, setChosenReqId] = useState<string>('');
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [scheduledTime, setScheduledTime] = useState<string>('');
  const [userData, setUserData] = useState<string>('');
  const [location, setLocation] = useState<string>('Consultorio de Psicología Forense IITCUP');
  const [notes, setNotes] = useState<string>('');

  // Filter psychology requirements assigned to perito/tecnico or all psychology reqs for admin
  const psychologyReqs = requirements.filter(req => {
    const isPsychSection =
      req.sectionName?.toUpperCase().includes('PSICOLOG') ||
      req.serviceName?.toUpperCase().includes('PSICOLOG') ||
      req.sectionId === 'sec-9' ||
      req.sectionId === 'sec-2';

    if (!isPsychSection) return false;

    // Check assignment if perito or tecnico
    const prov = proveidos.find(p => p.requirementId === req.id);
    const isAssigned = prov?.assignedPeritoId === currentUser.id || prov?.assignedTecnicoId === currentUser.id;
    const isPowerRole = currentUser.role === 'ADMIN' || currentUser.role === 'ENCARGADO_SERVICIOS' || currentUser.role === 'ENCARGADO_AREA';

    return (isAssigned || isPowerRole) && (req.status === 'ASIGNADO' || req.status === 'AGENDADO' || req.status === 'EN_PROCESO');
  });

  useEffect(() => {
    if (selectedRequirement) {
      setChosenReqId(selectedRequirement.id);
      if (selectedRequirement.appointment) {
        setScheduledDate(selectedRequirement.appointment.scheduledDate || '');
        setScheduledTime(selectedRequirement.appointment.scheduledTime || '');
        setUserData(selectedRequirement.appointment.userData || selectedRequirement.interestedPersonName || '');
        setLocation(selectedRequirement.appointment.location || 'Consultorio de Psicología Forense IITCUP');
        setNotes(selectedRequirement.appointment.notes || '');
      } else {
        // Pre-fill user data if interestedPersonName exists
        const defaultUser = [
          selectedRequirement.interestedPersonName,
          selectedRequirement.interestedPersonPhone ? `Tel: ${selectedRequirement.interestedPersonPhone}` : ''
        ].filter(Boolean).join(' - ');
        setUserData(defaultUser);
        setScheduledDate(new Date().toISOString().split('T')[0]);
        setScheduledTime('09:00');
      }
    } else if (psychologyReqs.length > 0) {
      setChosenReqId(psychologyReqs[0].id);
      setScheduledDate(new Date().toISOString().split('T')[0]);
      setScheduledTime('09:00');
    }
  }, [selectedRequirement, isOpen]);

  if (!isOpen) return null;

  const currentReq = selectedRequirement || psychologyReqs.find(r => r.id === chosenReqId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentReq) {
      alert('Por favor seleccione un requerimiento de Psicología.');
      return;
    }

    if (!scheduledDate || !scheduledTime) {
      alert('Por favor ingrese la fecha y hora agendada.');
      return;
    }

    if (!userData.trim()) {
      alert('Por favor ingrese los Datos del Usuario que se someterá a la pericia.');
      return;
    }

    addPsychologyAppointment({
      requirementId: currentReq.id,
      rup: currentReq.rup,
      scheduledDate,
      scheduledTime,
      userData,
      location,
      notes
    });

    alert(`¡Cita agendada exitosamente para el RUP ${currentReq.rup}!\nEl estado del caso ahora es "AGENDADO".`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-emerald-600/30 dark:border-emerald-500/30 rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-5 flex items-center justify-between border-b border-emerald-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight text-amber-300 flex items-center gap-2">
                Agenda de Citas - Psicología Forense
              </h2>
              <p className="text-xs text-slate-300">
                Agendamiento previo obligatorio antes de iniciar el trabajo pericial
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          
          {/* Requirement Selector */}
          <div>
            <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Caso RUP Asignado (Área de Psicología)
            </label>
            {selectedRequirement ? (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-emerald-800 dark:text-amber-400 text-sm">{selectedRequirement.rup}</span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">{selectedRequirement.serviceName}</p>
                </div>
                <span className="bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-amber-500/30">
                  {selectedRequirement.status}
                </span>
              </div>
            ) : psychologyReqs.length === 0 ? (
              <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-800 dark:text-amber-300 text-[11px] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>No se encontraron casos de Psicología pendientes de agendamiento asignados a su usuario.</span>
              </div>
            ) : (
              <select
                value={chosenReqId}
                onChange={e => setChosenReqId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {psychologyReqs.map(req => (
                  <option key={req.id} value={req.id}>
                    {req.rup} - {req.serviceName} ({req.status})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Date and Time Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                Fecha Agendada <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={e => setScheduledDate(e.target.value)}
                required
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-slate-100 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                Hora Agendada <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={scheduledTime}
                onChange={e => setScheduledTime(e.target.value)}
                required
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-slate-100 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* User Data Field */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <UserIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Datos del Usuario a someterse a la Pericia <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={userData}
              onChange={e => setUserData(e.target.value)}
              placeholder="Nombre completo del usuario/peritado, C.I., edad, número telefónico de contacto, relación procesal (víctima, imputado, testigo)..."
              required
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
            />
          </div>

          {/* Location / Facility Field */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              Lugar / Instalación de la Cita
            </label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="Ej: Consultorio de Psicología Forense IITCUP - Edificio Central / Cámara Gesell"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Notes / Instructions */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Observaciones / Recomendaciones previas
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Ej: Presentar Cédula de Identidad original. Venir acompañado de tutor legal si es menor de edad."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Info Banner */}
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-3 text-emerald-800 dark:text-emerald-300 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Al guardar este formulario, el estado del caso pasará automáticamente a <strong className="font-extrabold underline decoration-emerald-500">AGENDADO</strong>. Podrá ser notificado al usuario y registrado en su agenda personal de citas.
            </p>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!currentReq}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold rounded-xl shadow-lg shadow-emerald-900/30 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Calendar className="w-4 h-4" />
              Guardar y Cambiar Estado a AGENDADO
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
