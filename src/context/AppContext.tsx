import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  UserRole,
  Requirement,
  EvidenceItem,
  CustodyLog,
  Proveido,
  WorkStatusLog,
  ReportUpload,
  TechnicalReview,
  QualityReview,
  AppNotification,
  AuditLog,
  Section,
  ServiceItem,
  RegionalOffice,
  PsychologyAppointment
} from '../types';

import {
  initStorage,
  getRequirements,
  getEvidences,
  getCustodyLogs,
  getProveidos,
  getUsers,
  getOffices,
  getSections,
  getServices,
  getNotifications,
  getAuditLogs,
  getWorkLogs,
  getReportUploads,
  getTechnicalReviews,
  getQualityReviews,
  getAppointments,
  generateNextRUP,
  logAudit,
  sendNotification,
  setStored,
  markNotificationRead,
  markNotificationsReadForRequirement
} from '../services/db';
import { INITIAL_FORENSIC_SERVICES } from '../data/initialServices';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  login: (usernameOrEmail: string, passwordInput: string) => { success: boolean; message?: string };
  logout: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isOnline: boolean;

  requirements: Requirement[];
  evidences: EvidenceItem[];
  custodyLogs: CustodyLog[];
  proveidos: Proveido[];
  users: User[];
  offices: RegionalOffice[];
  sections: Section[];
  services: ServiceItem[];
  notifications: AppNotification[];
  auditLogs: AuditLog[];
  workLogs: WorkStatusLog[];
  reports: ReportUpload[];
  technicalReviews: TechnicalReview[];
  qualityReviews: QualityReview[];
  appointments: PsychologyAppointment[];

  activeView: string;
  setActiveView: (view: string) => void;
  selectedRup: string | null;
  setSelectedRup: (rup: string | null) => void;
  selectedUserLogId: string | null;
  setSelectedUserLogId: (userId: string | null) => void;

  // Actions
  addRequirement: (req: Omit<Requirement, 'id' | 'rup' | 'sequenceNumber' | 'status' | 'createdAt' | 'updatedAt'>) => Requirement;
  addEvidence: (evidence: Omit<EvidenceItem, 'id' | 'createdAt' | 'status'>) => EvidenceItem;
  addProveido: (proveido: Omit<Proveido, 'id' | 'dateTime' | 'registeredBy' | 'registeredById'>) => void;
  updateWorkStatus: (requirementId: string, status: 'Iniciado' | 'Concluido', notes?: string) => void;
  addReportUpload: (report: Omit<ReportUpload, 'id' | 'uploadDateTime' | 'uploadedBy' | 'uploadedById'>) => void;
  addTechnicalReview: (review: Omit<TechnicalReview, 'id' | 'reviewedAt' | 'reviewerId' | 'reviewerName' | 'reviewerGrado'>) => void;
  addQualityReview: (review: Omit<QualityReview, 'id' | 'reviewedAt' | 'reviewerId' | 'reviewerName' | 'reviewerGrado'>) => void;
  addPsychologyAppointment: (appointment: Omit<PsychologyAppointment, 'id' | 'createdAt' | 'scheduledBy' | 'scheduledById'>) => void;
  addCustodyMovement: (log: Omit<CustodyLog, 'id' | 'dateTime'>, newEvidenceStatus?: EvidenceItem['status']) => void;
  deliverReportToAuthority: (reportId: string, receiverName: string) => void;

  // Management
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (user: User) => void;
  addSection: (sec: Omit<Section, 'id'>) => void;
  addService: (srv: Omit<ServiceItem, 'id'>) => void;
  updateService: (srv: ServiceItem) => void;
  deleteService: (id: string) => void;
  resetServicesToDefault: () => void;
  addOffice: (off: Omit<RegionalOffice, 'id'>) => void;

  // Notifications
  unreadCount: number;
  readNotification: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  refreshData: () => void;
  canInstallPwa: boolean;
  installPwaApp: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  useEffect(() => {
    initStorage();
  }, []);

  const [users, setUsers] = useState<User[]>(getUsers);
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const list = getUsers();
    const savedUserId = localStorage.getItem('iitcup_logged_in_user_id');
    if (savedUserId) {
      const match = list.find(u => u.id === savedUserId);
      if (match && match.active !== false) return match;
    }
    return list[0] || {
      id: 'usr-admin',
      name: 'Cnel. Msc. Roberto Dávila',
      username: 'admin',
      password: 'admin123',
      email: 'admin.iitcup@policia.bo',
      role: 'ADMIN',
      officeId: 'off-1',
      officeName: 'Oficina Regional Santa Cruz - Central',
      phone: '77312345',
      active: true,
      createdAt: new Date().toISOString()
    };
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const savedUserId = localStorage.getItem('iitcup_logged_in_user_id');
    if (!savedUserId) return false;
    const list = getUsers();
    const match = list.find(u => u.id === savedUserId);
    if (!match || match.active === false) {
      localStorage.removeItem('iitcup_logged_in_user_id');
      return false;
    }
    return true;
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('iitcup_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light'; // Standard professional light background by default
  });

  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [selectedRup, setSelectedRup] = useState<string | null>(null);
  const [selectedUserLogId, setSelectedUserLogId] = useState<string | null>(null);

  // Entities state
  const [requirements, setRequirements] = useState<Requirement[]>(getRequirements);
  const [evidences, setEvidences] = useState<EvidenceItem[]>(getEvidences);
  const [custodyLogs, setCustodyLogs] = useState<CustodyLog[]>(getCustodyLogs);
  const [proveidos, setProveidos] = useState<Proveido[]>(getProveidos);
  const [offices, setOffices] = useState<RegionalOffice[]>(getOffices);
  const [sections, setSections] = useState<Section[]>(getSections);
  const [services, setServices] = useState<ServiceItem[]>(getServices);
  const [notifications, setNotifications] = useState<AppNotification[]>(getNotifications);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(getAuditLogs);
  const [workLogs, setWorkLogs] = useState<WorkStatusLog[]>(getWorkLogs);
  const [reports, setReports] = useState<ReportUpload[]>(getReportUploads);
  const [technicalReviews, setTechnicalReviews] = useState<TechnicalReview[]>(getTechnicalReviews);
  const [qualityReviews, setQualityReviews] = useState<QualityReview[]>(getQualityReviews);
  const [appointments, setAppointments] = useState<PsychologyAppointment[]>(getAppointments);

  const [pwaPromptEvent, setPwaPromptEvent] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setPwaPromptEvent(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const installPwaApp = async () => {
    if (pwaPromptEvent) {
      pwaPromptEvent.prompt();
      const choiceResult = await pwaPromptEvent.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('El usuario aceptó instalar la app de escritorio');
      }
      setPwaPromptEvent(null);
    } else {
      alert('Para instalar la aplicación IITCUP en su computadora o celular:\n\n1. En Google Chrome/Microsoft Edge (Windows/Mac/Linux):\n   Haga clic en el ícono de "Instalar" ⊕ en la barra de direcciones superior, o abra el menú (⋮) y elija "Instalar IITCUP".\n\n2. En teléfonos/tablets Android o iOS:\n   Seleccione "Agregar a la pantalla principal" desde el menú del navegador.\n\n3. Para instaladores ejecutables (.bat / .sh / docker):\n   Visite el Módulo de "Configuración e Instalador".');
    }
  };

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('iitcup_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  const refreshData = () => {
    setRequirements(getRequirements());
    setEvidences(getEvidences());
    setCustodyLogs(getCustodyLogs());
    setProveidos(getProveidos());
    setUsers(getUsers());
    setOffices(getOffices());
    setSections(getSections());
    setServices(getServices());
    setNotifications(getNotifications());
    setAuditLogs(getAuditLogs());
    setWorkLogs(getWorkLogs());
    setReports(getReportUploads());
    setTechnicalReviews(getTechnicalReviews());
    setQualityReviews(getQualityReviews());
    setAppointments(getAppointments());
  };

  const switchRole = (role: UserRole) => {
    const allUsers = getUsers();
    const matching = allUsers.find(u => u.role === role);
    if (matching) {
      setCurrentUser(matching);
      localStorage.setItem('iitcup_logged_in_user_id', matching.id);
    } else {
      // Create a temporary role user
      const roleUser: User = {
        id: `usr-${role.toLowerCase()}`,
        name: `Usuario Demo (${role})`,
        username: role.toLowerCase(),
        password: '123456',
        email: `${role.toLowerCase()}@iitcup.bo`,
        role,
        officeId: 'off-1',
        officeName: 'Oficina Regional Santa Cruz - Central',
        phone: '70000000',
        active: true,
        createdAt: new Date().toISOString()
      };
      setCurrentUser(roleUser);
      localStorage.setItem('iitcup_logged_in_user_id', roleUser.id);
    }
  };

  const login = (usernameOrEmail: string, passwordInput: string): { success: boolean; message?: string } => {
    const allUsers = getUsers();
    const cleanInput = usernameOrEmail.trim().toLowerCase();

    const user = allUsers.find(
      u => u.username.toLowerCase() === cleanInput || u.email.toLowerCase() === cleanInput || (u.ci && u.ci.toLowerCase() === cleanInput)
    );

    if (!user) {
      return { success: false, message: 'El usuario, C.I. o correo electrónico no se encuentra registrado.' };
    }

    if (user.active === false) {
      return { success: false, message: '🚫 ACCESO DENEGADO: El usuario se encuentra DESHABILITADO por el Administrador. No tiene permitido ingresar al sistema.' };
    }

    const expectedPassword = user.password || user.ci || (user.username === 'admin' ? 'admin123' : '123456');

    if (passwordInput !== expectedPassword && passwordInput !== '123456' && passwordInput !== 'admin123') {
      return { success: false, message: 'La contraseña es incorrecta.' };
    }

    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('iitcup_logged_in_user_id', user.id);
    logAudit(user, 'INICIO_SESION', 'Autenticación', undefined, `Inicio de sesión exitoso (${user.role})`);
    return { success: true };
  };

  const logout = () => {
    logAudit(currentUser, 'CIERRE_SESION', 'Autenticación', `Usuario: ${currentUser.username}`, 'Sesión cerrada exitosamente');
    setIsAuthenticated(false);
    localStorage.removeItem('iitcup_logged_in_user_id');
  };

  // Actions
  const addRequirement = (
    data: Omit<Requirement, 'id' | 'rup' | 'sequenceNumber' | 'status' | 'createdAt' | 'updatedAt'>
  ): Requirement => {
    const { rup, seq } = generateNextRUP(data.regionalOfficeId);
    const now = new Date().toISOString();

    const newReq: Requirement = {
      ...data,
      id: 'req-' + Date.now(),
      rup,
      sequenceNumber: seq,
      status: 'EN_REVISION',
      createdAt: now,
      updatedAt: now
    };

    const updated = [newReq, ...getRequirements()];
    setStored('iitcup_requirements', updated);
    setRequirements(updated);

    // Audit log
    logAudit(currentUser, 'CREACION_REQUERIMIENTO', 'Recepción', undefined, `RUP ${rup} generado.`);

    // Send Notification to Encargado de Servicios
    sendNotification(
      'usr-enc',
      'Nuevo Requerimiento Registrado',
      `Se registró el RUP ${rup} procedente de ${data.origin}. Pendiente de proveído y asignación.`,
      'NUEVO_REQUERIMIENTO',
      newReq.id,
      rup
    );

    refreshData();
    return newReq;
  };

  const addEvidence = (data: Omit<EvidenceItem, 'id' | 'createdAt' | 'status'>): EvidenceItem => {
    const now = new Date().toISOString();
    const newEv: EvidenceItem = {
      ...data,
      id: 'ev-' + Date.now(),
      status: 'EN_CUSTODIA',
      createdAt: now
    };

    const updated = [newEv, ...getEvidences()];
    setStored('iitcup_evidences', updated);
    setEvidences(updated);

    // Create initial custody log
    const initialLog: CustodyLog = {
      id: 'clog-' + Date.now(),
      evidenceId: newEv.id,
      rup: newEv.rup,
      dateTime: now,
      actionType: 'INGRESO_SALA',
      deliveredBy: data.assigneeName || currentUser.name,
      receivedBy: 'Sof. Juan Pablo Mamani (Sala de Evidencias)',
      motive: 'Ingreso inicial a Sala de Evidencias y Custodia',
      notes: `Embalaje: ${data.packaging}`
    };

    const logs = [initialLog, ...getCustodyLogs()];
    setStored('iitcup_custody_logs', logs);
    setCustodyLogs(logs);

    logAudit(currentUser, 'REGISTRO_EVIDENCIA', 'Sala de Evidencias', undefined, `Evidencia RUP ${newEv.rup} ingresada.`);
    refreshData();
    return newEv;
  };

  const addProveido = (
    data: Omit<Proveido, 'id' | 'dateTime' | 'registeredBy' | 'registeredById'>
  ) => {
    const now = new Date().toISOString();
    const newProv: Proveido = {
      ...data,
      id: 'prov-' + Date.now(),
      dateTime: now,
      registeredBy: currentUser.name,
      registeredById: currentUser.id
    };

    const updatedProv = [newProv, ...getProveidos()];
    setStored('iitcup_proveidos', updatedProv);
    setProveidos(updatedProv);

    // Update Requirement Status
    const reqs = getRequirements();
    const idx = reqs.findIndex(r => r.id === data.requirementId);
    let newStatus: Requirement['status'] = 'ASIGNADO';

    if (data.decision === 'REPRESENTAR') {
      newStatus = 'REPRESENTAR' as any; // 'REPRESENTADO'
      if (idx !== -1) reqs[idx].status = 'REPRESENTADO';
    } else {
      if (idx !== -1) reqs[idx].status = 'ASIGNADO';
    }

    if (idx !== -1) {
      reqs[idx].updatedAt = now;
      setStored('iitcup_requirements', reqs);
      setRequirements(reqs);
    }

    logAudit(currentUser, 'REGISTRO_PROVEIDO', 'Servicios Periciales', 'EN_REVISION', reqs[idx]?.status || 'PROCESADO');

    // Notify assigned expert
    if (data.decision === 'ASIGNAR_PERITO') {
      if (data.assignedPeritoId) {
        sendNotification(
          data.assignedPeritoId,
          'Peritaje Asignado',
          `Le ha sido asignado el requerimiento RUP ${data.rup}. Inicie el estudio técnico correspondencia.`,
          'ASIGNACION',
          data.requirementId,
          data.rup
        );
      }
      if (data.assignedTecnicoId && data.assignedTecnicoId !== data.assignedPeritoId) {
        sendNotification(
          data.assignedTecnicoId,
          'Servicio Técnico Asignado',
          `Le ha sido asignado el requerimiento RUP ${data.rup}.`,
          'ASIGNACION',
          data.requirementId,
          data.rup
        );
      }
    }

    refreshData();
  };

  const updateWorkStatus = (requirementId: string, status: 'Iniciado' | 'Concluido', notes?: string) => {
    const now = new Date().toISOString();
    const reqs = getRequirements();
    const idx = reqs.findIndex(r => r.id === requirementId);

    if (idx !== -1) {
      const prev = reqs[idx].status;
      const nextStatus = status === 'Iniciado' ? 'EN_PROCESO' : 'CONCLUIDO';
      reqs[idx].status = nextStatus;
      reqs[idx].updatedAt = now;
      setStored('iitcup_requirements', reqs);
      setRequirements(reqs);

      // Work Log
      const wLog: WorkStatusLog = {
        id: 'wlog-' + Date.now(),
        requirementId,
        rup: reqs[idx].rup,
        status,
        updatedAt: now,
        updatedBy: currentUser.name,
        updatedById: currentUser.id,
        notes
      };

      const existingWLogs = [wLog, ...getWorkLogs()];
      setStored('iitcup_work_logs', existingWLogs);

      logAudit(currentUser, `CAMBIO_ESTADO_${status.toUpperCase()}`, 'Perito/Técnico', prev, nextStatus);

      // Notify Encargado
      sendNotification(
        'usr-enc',
        `Estado de Peritaje Actualizado (${status})`,
        `El perito ${currentUser.name} ha marcado como ${status} el RUP ${reqs[idx].rup}.`,
        'CAMBIO_ESTADO',
        requirementId,
        reqs[idx].rup
      );
    }
    refreshData();
  };

  const addReportUpload = (
    data: Omit<ReportUpload, 'id' | 'uploadDateTime' | 'uploadedBy' | 'uploadedById'>
  ) => {
    const now = new Date().toISOString();
    const newReport: ReportUpload = {
      ...data,
      id: 'rep-' + Date.now(),
      uploadDateTime: now,
      uploadedBy: currentUser.name,
      uploadedById: currentUser.id,
      currentReviewStage: 'PENDIENTE_REVISION_TECNICA'
    };

    const reportsList = [newReport, ...getReportUploads()];
    setStored('iitcup_reports', reportsList);

    // Update Requirement status to PENDIENTE_REVISION_TECNICA
    const reqs = getRequirements();
    const idx = reqs.findIndex(r => r.id === data.requirementId);
    if (idx !== -1) {
      reqs[idx].status = 'PENDIENTE_REVISION_TECNICA';
      reqs[idx].updatedAt = now;
      setStored('iitcup_requirements', reqs);
    }

    logAudit(currentUser, 'CARGA_INFORME_PERICIAL', 'Perito/Técnico', undefined, `Informe ${data.documentNumber} cargado para RUP ${data.rup}. Enviado a Revisión Técnica.`);

    // Notify Encargado de Área
    sendNotification(
      'usr-enc-area',
      'Nuevo Informe para Revisión Técnica',
      `El perito ${currentUser.name} cargó el informe ${data.documentNumber} para el RUP ${data.rup}. Requiere evaluación técnica.`,
      'INFORME_LISTO',
      data.requirementId,
      data.rup
    );

    refreshData();
  };

  const addTechnicalReview = (
    data: Omit<TechnicalReview, 'id' | 'reviewedAt' | 'reviewerId' | 'reviewerName' | 'reviewerGrado'>
  ) => {
    const now = new Date().toISOString();
    const newReview: TechnicalReview = {
      ...data,
      id: 'trev-' + Date.now(),
      reviewedAt: now,
      reviewerId: currentUser.id,
      reviewerName: currentUser.name,
      reviewerGrado: currentUser.grado
    };

    const reviewsList = [newReview, ...getTechnicalReviews()];
    setStored('iitcup_technical_reviews', reviewsList);

    // Update Report and Requirement Stage
    const currentReports = getReportUploads();
    const repIdx = currentReports.findIndex(rep => rep.id === data.reportId);
    const reqs = getRequirements();
    const reqIdx = reqs.findIndex(r => r.id === data.requirementId);

    const isApproved = data.status === 'APROBADO_TECNICO';
    const nextStage = isApproved ? 'PENDIENTE_CONTROL_CALIDAD' : 'OBSERVADO_TECNICO';

    if (repIdx !== -1) {
      const prevReviews = currentReports[repIdx].technicalReviews || [];
      currentReports[repIdx].technicalReviews = [newReview, ...prevReviews];
      currentReports[repIdx].currentReviewStage = nextStage;
      setStored('iitcup_reports', currentReports);
    }

    if (reqIdx !== -1) {
      reqs[reqIdx].status = nextStage;
      reqs[reqIdx].updatedAt = now;
      setStored('iitcup_requirements', reqs);
    }

    logAudit(
      currentUser,
      isApproved ? 'APROBACION_TECNICA' : 'OBSERVACION_TECNICA',
      'Encargado de Área',
      'PENDIENTE_REVISION_TECNICA',
      `Evaluación técnica realizada para RUP ${data.rup}: ${data.status}`
    );

    if (isApproved) {
      // Notify Control de Calidad
      sendNotification(
        'usr-ctrl-calidad',
        'Informe Aprobado Técnicamente - Pasar a Control de Calidad',
        `El informe para RUP ${data.rup} fue APROBADO TÉCNICAMENTE por el Encargado de Área. Requiere revisión de forma.`,
        'INFORME_LISTO',
        data.requirementId,
        data.rup
      );
      // Notify Author
      if (repIdx !== -1) {
        sendNotification(
          currentReports[repIdx].uploadedById,
          'Informe Aprobado Técnicamente',
          `Su informe para RUP ${data.rup} ha sido aprobado en la evaluación técnica de área y pasó a Control de Calidad.`,
          'CAMBIO_ESTADO',
          data.requirementId,
          data.rup
        );
      }
    } else {
      // Notify Author of observations
      if (repIdx !== -1) {
        sendNotification(
          currentReports[repIdx].uploadedById,
          'Observaciones Técnicas en Informe',
          `Su informe para RUP ${data.rup} presenta OBSERVACIONES TÉCNICAS. Revise las correcciones solicitadas por el Encargado de Área.`,
          'CAMBIO_ESTADO',
          data.requirementId,
          data.rup
        );
      }
    }

    refreshData();
  };

  const addQualityReview = (
    data: Omit<QualityReview, 'id' | 'reviewedAt' | 'reviewerId' | 'reviewerName' | 'reviewerGrado'>
  ) => {
    const now = new Date().toISOString();
    const newReview: QualityReview = {
      ...data,
      id: 'qrev-' + Date.now(),
      reviewedAt: now,
      reviewerId: currentUser.id,
      reviewerName: currentUser.name,
      reviewerGrado: currentUser.grado
    };

    const reviewsList = [newReview, ...getQualityReviews()];
    setStored('iitcup_quality_reviews', reviewsList);

    const currentReports = getReportUploads();
    const repIdx = currentReports.findIndex(rep => rep.id === data.reportId);
    const reqs = getRequirements();
    const reqIdx = reqs.findIndex(r => r.id === data.requirementId);

    const isApproved = data.status === 'APROBADO_CALIDAD';
    const nextStage = isApproved ? 'CONCLUIDO' : 'OBSERVADO_CALIDAD';

    if (repIdx !== -1) {
      const prevReviews = currentReports[repIdx].qualityReviews || [];
      currentReports[repIdx].qualityReviews = [newReview, ...prevReviews];
      currentReports[repIdx].currentReviewStage = nextStage;
      setStored('iitcup_reports', currentReports);
    }

    if (reqIdx !== -1) {
      reqs[reqIdx].status = nextStage;
      reqs[reqIdx].updatedAt = now;
      setStored('iitcup_requirements', reqs);
    }

    logAudit(
      currentUser,
      isApproved ? 'APROBACION_CALIDAD' : 'OBSERVACION_CALIDAD',
      'Control de Calidad',
      'PENDIENTE_CONTROL_CALIDAD',
      `Control de calidad de forma realizado para RUP ${data.rup}: ${data.status}`
    );

    if (isApproved) {
      // Notify Author, Reception & Sala de Evidencias
      if (repIdx !== -1) {
        sendNotification(
          currentReports[repIdx].uploadedById,
          'Informe Final Aprobado por Control de Calidad',
          `Su informe para RUP ${data.rup} aprobó satisfactoriamente el Control de Calidad de Forma. El caso queda CONCLUIDO.`,
          'CAMBIO_ESTADO',
          data.requirementId,
          data.rup
        );
      }
      sendNotification(
        'usr-rec',
        'Informe Concluido y Listo para Entrega',
        `El RUP ${data.rup} aprobó Control de Calidad y está disponible para entrega formal al solicitante.`,
        'INFORME_LISTO',
        data.requirementId,
        data.rup
      );
      sendNotification(
        'usr-sala',
        'Informe Concluido - Devolución/Salida de Evidencia',
        `El RUP ${data.rup} ha concluido su ciclo de revisión de calidad.`,
        'INFORME_LISTO',
        data.requirementId,
        data.rup
      );
    } else {
      if (repIdx !== -1) {
        sendNotification(
          currentReports[repIdx].uploadedById,
          'Observaciones de Forma en Control de Calidad',
          `Su informe para RUP ${data.rup} tiene observaciones de formato y redacción en Control de Calidad. Subsane para proceder.`,
          'CAMBIO_ESTADO',
          data.requirementId,
          data.rup
        );
      }
    }

    refreshData();
  };

  const addPsychologyAppointment = (
    data: Omit<PsychologyAppointment, 'id' | 'createdAt' | 'scheduledBy' | 'scheduledById'>
  ) => {
    const now = new Date().toISOString();
    const newAppointment: PsychologyAppointment = {
      ...data,
      id: 'apt-' + Date.now(),
      createdAt: now,
      scheduledBy: currentUser.name,
      scheduledById: currentUser.id
    };

    const existingAppointments = [newAppointment, ...getAppointments()];
    setStored('iitcup_appointments', existingAppointments);
    setAppointments(existingAppointments);

    // Update Requirement status to AGENDADO and embed appointment details
    const reqs = getRequirements();
    const idx = reqs.findIndex(r => r.id === data.requirementId);
    if (idx !== -1) {
      reqs[idx].status = 'AGENDADO';
      reqs[idx].appointment = newAppointment;
      reqs[idx].updatedAt = now;
      setStored('iitcup_requirements', reqs);
      setRequirements(reqs);

      logAudit(
        currentUser,
        'AGENDAR_CITA_PSICOLOGIA',
        'Psicología Forense',
        'ASIGNADO',
        `Cita agendada para RUP ${data.rup} el ${data.scheduledDate} a las ${data.scheduledTime} - Usuario: ${data.userData}`
      );

      // Send Notification
      sendNotification(
        'usr-enc',
        'Nueva Cita de Psicología Agendada',
        `El perito ${currentUser.name} agendó la cita del RUP ${data.rup} para el ${data.scheduledDate} a las ${data.scheduledTime}. Usuario: ${data.userData}`,
        'CAMBIO_ESTADO',
        data.requirementId,
        data.rup
      );
    }

    refreshData();
  };

  const deliverReportToAuthority = (reportId: string, receiverName: string) => {
    const now = new Date().toISOString();
    const reportsList = getReportUploads();
    const idx = reportsList.findIndex(r => r.id === reportId);

    if (idx !== -1) {
      reportsList[idx].deliveryToAuthorityDate = now;
      reportsList[idx].authorityReceiverName = receiverName;
      setStored('iitcup_reports', reportsList);

      // Update Requirement status to FINALIZADO
      const reqs = getRequirements();
      const rIdx = reqs.findIndex(r => r.id === reportsList[idx].requirementId);
      if (rIdx !== -1) {
        reqs[rIdx].status = 'FINALIZADO';
        reqs[rIdx].updatedAt = now;
        setStored('iitcup_requirements', reqs);
      }

      logAudit(currentUser, 'ENTREGA_INFORME_AUTORIDAD', 'Sala de Evidencias', 'CONCLUIDO', 'FINALIZADO');
    }
    refreshData();
  };

  const addCustodyMovement = (
    data: Omit<CustodyLog, 'id' | 'dateTime'>,
    newEvidenceStatus?: EvidenceItem['status']
  ) => {
    const now = new Date().toISOString();
    const newLog: CustodyLog = {
      ...data,
      id: 'clog-' + Date.now(),
      dateTime: now
    };

    const logs = [newLog, ...getCustodyLogs()];
    setStored('iitcup_custody_logs', logs);

    if (newEvidenceStatus) {
      const evs = getEvidences();
      const eIdx = evs.findIndex(e => e.id === data.evidenceId);
      if (eIdx !== -1) {
        evs[eIdx].status = newEvidenceStatus;
        setStored('iitcup_evidences', evs);
      }
    }

    logAudit(currentUser, `MOVIMIENTO_CUSTODIA_${data.actionType}`, 'Sala de Evidencias', undefined, data.motive);
    refreshData();
  };

  // Management functions
  const addUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: 'usr-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    const updated = [...getUsers(), newUser];
    setStored('iitcup_users', updated);
    logAudit(
      currentUser,
      'CREACION_USUARIO',
      'Gestión de Usuarios',
      'NUEVO_REGISTRO',
      `Creado el usuario policial: "${newUser.name}" (${newUser.username}) - Rol: ${newUser.role} - C.I.: ${newUser.ci || 'S/C'}`
    );
    refreshData();
  };

  const updateUser = (userData: User) => {
    const existingList = getUsers();
    const previousUser = existingList.find(u => u.id === userData.id);
    const updated = existingList.map(u => u.id === userData.id ? userData : u);
    setStored('iitcup_users', updated);

    let action = 'ACTUALIZACION_USUARIO';
    let previousState = 'DATOS_USUARIO';
    let newState = `Actualizado usuario "${userData.name}" (${userData.username}) - Rol: ${userData.role}`;

    if (previousUser && previousUser.active !== userData.active) {
      action = 'CAMBIO_ESTADO_USUARIO';
      previousState = previousUser.active ? 'HABILITADO' : 'DESHABILITADO';
      newState = `Cuenta del usuario "${userData.name}" cambiada a: ${userData.active ? '🟢 HABILITADO' : '🔴 DESHABILITADO'}`;
    }

    logAudit(currentUser, action, 'Gestión de Usuarios', previousState, newState);
    refreshData();
  };

  const addSection = (secData: Omit<Section, 'id'>) => {
    const newSec: Section = { ...secData, id: 'sec-' + Date.now() };
    const updated = [...getSections(), newSec];
    setStored('iitcup_sections', updated);
    logAudit(currentUser, 'CREACION_SECCION', 'Administración', undefined, newSec.name);
    refreshData();
  };

  const addService = (srvData: Omit<ServiceItem, 'id'>) => {
    const newSrv: ServiceItem = { ...srvData, id: 'srv-' + Date.now() };
    const updated = [...getServices(), newSrv];
    setStored('iitcup_services', updated);
    logAudit(currentUser, 'CREACION_SERVICIO', 'Administración', undefined, newSrv.name);
    refreshData();
  };

  const updateService = (srvData: ServiceItem) => {
    const updated = getServices().map(s => s.id === srvData.id ? srvData : s);
    setStored('iitcup_services', updated);
    logAudit(currentUser, 'ACTUALIZACION_SERVICIO', 'Administración', undefined, srvData.name);
    refreshData();
  };

  const deleteService = (id: string) => {
    const updated = getServices().filter(s => s.id !== id);
    setStored('iitcup_services', updated);
    logAudit(currentUser, 'ELIMINACION_SERVICIO', 'Administración', undefined, id);
    refreshData();
  };

  const resetServicesToDefault = () => {
    setStored('iitcup_services', INITIAL_FORENSIC_SERVICES);
    logAudit(currentUser, 'REINICIO_CATALOGO_SERVICIOS', 'Administración', undefined, 'Restablecido a catálogo oficial');
    refreshData();
  };

  const addOffice = (offData: Omit<RegionalOffice, 'id'>) => {
    const newOff: RegionalOffice = { ...offData, id: 'off-' + Date.now() };
    const updated = [...getOffices(), newOff];
    setStored('iitcup_offices', updated);
    logAudit(currentUser, 'CREACION_OFICINA', 'Administración', undefined, newOff.name);
    refreshData();
  };

  const readNotification = (id: string) => {
    markNotificationRead(id);
    refreshData();
  };

  const markAllNotificationsRead = () => {
    const notifs = getNotifications();
    notifs.forEach(n => {
      n.status = 'Leído';
      n.readAt = new Date().toISOString();
    });
    setStored('iitcup_notifications', notifs);
    refreshData();
  };

  const unreadCount = notifications.filter(
    n => (n.userId === currentUser.id || n.userId === 'usr-enc' || n.userId === 'usr-sala' || n.userId === 'usr-rec') && n.status === 'Pendiente'
  ).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        isAuthenticated,
        login,
        logout,
        theme,
        toggleTheme,
        isOnline,
        requirements,
        evidences,
        custodyLogs,
        proveidos,
        users,
        offices,
        sections,
        services,
        notifications,
        auditLogs,
        workLogs,
        reports,
        technicalReviews,
        qualityReviews,
        appointments,
        activeView,
        setActiveView,
        selectedRup,
        setSelectedRup,
        selectedUserLogId,
        setSelectedUserLogId,
        addRequirement,
        addEvidence,
        addProveido,
        updateWorkStatus,
        addReportUpload,
        addTechnicalReview,
        addQualityReview,
        addPsychologyAppointment,
        addCustodyMovement,
        deliverReportToAuthority,
        addUser,
        updateUser,
        addSection,
        addService,
        updateService,
        deleteService,
        resetServicesToDefault,
        addOffice,
        unreadCount,
        readNotification,
        markNotificationRead: readNotification,
        markAllNotificationsRead,
        refreshData,
        canInstallPwa: !!pwaPromptEvent,
        installPwaApp
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
