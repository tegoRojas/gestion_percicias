export type UserRole = 
  | 'ADMIN' 
  | 'RECEPCION' 
  | 'SALA_EVIDENCIAS' 
  | 'ENCARGADO_SERVICIOS' 
  | 'ENCARGADO_AREA' 
  | 'CONTROL_CALIDAD' 
  | 'PERITO' 
  | 'TECNICO';

export const ROLE_ALLOWED_VIEWS: Record<UserRole, string[]> = {
  ADMIN: [
    'dashboard', 'recepcion', 'evidencias', 'servicios', 'mis_casos', 'agenda',
    'revision_tecnica', 'control_calidad', 'reportes', 'usuarios',
    'secciones', 'oficinas', 'auditoria', 'notificaciones', 'configuracion'
  ],
  RECEPCION: [
    'dashboard', 'recepcion', 'evidencias', 'notificaciones'
  ],
  ENCARGADO_SERVICIOS: [
    'dashboard', 'servicios', 'mis_casos', 'agenda', 'revision_tecnica', 'control_calidad', 'evidencias', 'reportes', 'notificaciones'
  ],
  ENCARGADO_AREA: [
    'dashboard', 'revision_tecnica', 'mis_casos', 'agenda', 'servicios', 'evidencias', 'notificaciones'
  ],
  CONTROL_CALIDAD: [
    'dashboard', 'control_calidad', 'mis_casos', 'servicios', 'evidencias', 'notificaciones'
  ],
  PERITO: [
    'dashboard', 'mis_casos', 'agenda', 'evidencias', 'notificaciones'
  ],
  TECNICO: [
    'dashboard', 'mis_casos', 'agenda', 'evidencias', 'notificaciones'
  ],
  SALA_EVIDENCIAS: [
    'dashboard', 'evidencias', 'notificaciones'
  ]
};

export interface User {
  id: string;
  grado?: string;
  paternalLastName?: string;
  maternalLastName?: string;
  firstName?: string;
  secondName?: string;
  ci?: string;
  gender?: 'M' | 'F' | string;
  email: string;
  escalafon?: string;
  role: UserRole;
  officeId: string;
  officeName: string;
  cargo?: string;
  sectionId?: string;
  sectionName?: string;
  sectionIds?: string[];
  sectionNames?: string[];
  technicalAreas?: string[];
  name: string;
  username: string;
  password?: string;
  phone: string;
  badgeNumber?: string;
  active: boolean;
  createdAt: string;
}

export interface RegionalOffice {
  id: string;
  code: string; // e.g. "SCZ", "MON", "CAM", "PSA", "WAR"
  numericCode: string; // e.g. "7"
  name: string;
  city: string;
  address: string;
  isDefault?: boolean;
}

export interface Section {
  id: string;
  code: string;
  name: string;
  description: string;
  managerName?: string;
  active: boolean;
}

export interface ServiceItem {
  id: string;
  code?: string;
  name: string;
  area?: string;
  sectionId?: string;
  sectionName?: string;
  type: 'SERVICIO PERICIAL' | 'SERVICIO TÉCNICO' | 'SERVICIO ESPECIAL' | 'PERICIAL' | 'TECNICO' | string;
  estimatedDays?: number;
  active: boolean;
}

export interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl?: string;
  uploadedAt: string;
}

export type RequirementStatus = 
  | 'REGISTRADO' 
  | 'EN_REVISION' 
  | 'ASIGNADO' 
  | 'AGENDADO'
  | 'EN_PROCESO' 
  | 'PENDIENTE_REVISION_TECNICA'
  | 'OBSERVADO_TECNICO'
  | 'PENDIENTE_CONTROL_CALIDAD'
  | 'OBSERVADO_CALIDAD'
  | 'CONCLUIDO' 
  | 'ENTREGADO' 
  | 'FINALIZADO' 
  | 'REPRESENTADO';

export interface PsychologyAppointment {
  id: string;
  requirementId: string;
  rup: string;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:MM
  userData: string;      // Datos del usuario que se someterá a la pericia
  location?: string;     // Consultorio, Cámara Gesell, etc.
  notes?: string;        // Observaciones
  scheduledBy: string;
  scheduledById: string;
  createdAt: string;
}

export interface Requirement {
  id: string;
  rup: string; // SCZ-7-000001
  sequenceNumber: number;
  entryDateTime: string;
  regionalOfficeId: string;
  regionalOfficeName: string;
  origin: string; // e.g., Fiscalía SCZ, FELCC, Juzgado, etc.
  externalCode: string; // CUD, N° Causa, IANUS
  applicantName: string;
  interestedPersonName?: string;
  interestedPersonPhone?: string;
  fojaCount: number;
  serviceType: 'PERICIAL' | 'TECNICO' | 'AMBOS';
  sectionId: string;
  sectionName: string;
  serviceId: string;
  serviceName: string;
  hasEvidence: boolean;
  puntosPericia: string;
  observations?: string;
  status: RequirementStatus;
  registeredBy: string; // Name of Receptionist
  registeredById: string;
  attachments: FileAttachment[];
  appointment?: PsychologyAppointment;
  createdAt: string;
  updatedAt: string;
}

export type EvidenceType = 
  | 'Documento' 
  | 'Arma de fuego' 
  | 'Celular' 
  | 'DVR' 
  | 'Laptop' 
  | 'CPU' 
  | 'CD' 
  | 'DVD' 
  | 'Pen Drive' 
  | 'Disco Externo' 
  | 'Otros';

export type EvidenceStatus = 
  | 'EN_CUSTODIA' 
  | 'ENTREGADO_A_PERITO' 
  | 'DEVUELTO_A_SALA' 
  | 'ENTREGADO_A_SOLICITANTE';

export interface EvidenceItem {
  id: string;
  requirementId: string;
  rup: string;
  entryDateTime: string;
  packaging: string; // Embalaje
  evidenceType: EvidenceType;
  description: string;
  assigneeName: string; // Asignado o interesado
  assigneePhone: string;
  hasCollectionAct: boolean; // Acta de colección
  hasCustodyAct: boolean; // Acta de cadena de custodia
  observations?: string;
  status: EvidenceStatus;
  attachments: FileAttachment[];
  createdAt: string;
}

export interface CustodyLog {
  id: string;
  evidenceId: string;
  rup: string;
  dateTime: string;
  actionType: 'INGRESO_SALA' | 'ENTREGA_A_PERITO' | 'DEVOLUCION_DE_PERITO' | 'SALIDA_FINAL';
  deliveredBy: string;
  receivedBy: string;
  motive: string;
  notes?: string;
}

export interface Proveido {
  id: string;
  requirementId: string;
  rup: string;
  dateTime: string;
  decision: 'ASIGNAR_PERITO' | 'REPRESENTAR';
  assignedPeritoId?: string;
  assignedPeritoName?: string;
  assignedTecnicoId?: string;
  assignedTecnicoName?: string;
  legalViabilityNotes: string;
  observations?: string;
  registeredBy: string;
  registeredById: string;
}

export interface WorkStatusLog {
  id: string;
  requirementId: string;
  rup: string;
  status: 'Iniciado' | 'Concluido';
  updatedAt: string;
  updatedBy: string;
  updatedById: string;
  notes?: string;
}

export interface TechnicalReview {
  id: string;
  reportId: string;
  requirementId: string;
  rup: string;
  reviewedAt: string;
  reviewerId: string;
  reviewerName: string;
  reviewerGrado?: string;
  status: 'APROBADO_TECNICO' | 'OBSERVADO_TECNICO';
  metodologiaScore: number; // 1 to 5
  puntosPericiaAbsolvidos: boolean;
  instrumentalValido: boolean;
  conclusionesFundamentadas: boolean;
  observations: string; // Detalle de evaluación o correcciones técnicas requeridas
}

export interface QualityReview {
  id: string;
  reportId: string;
  requirementId: string;
  rup: string;
  reviewedAt: string;
  reviewerId: string;
  reviewerName: string;
  reviewerGrado?: string;
  status: 'APROBADO_CALIDAD' | 'OBSERVADO_CALIDAD';
  formatoEstandarValido: boolean;
  redaccionOrtografiaValida: boolean;
  estructuraLegalValida: boolean;
  firmasYAnexosValidos: boolean;
  observations: string; // Detalle de evaluación o correcciones de forma requeridas
}

export interface ReportUpload {
  id: string;
  requirementId: string;
  rup: string;
  uploadDateTime: string;
  uploadedBy: string;
  uploadedById: string;
  reportType: 'INFORME_PERICIAL' | 'DICTAMEN_PERICIAL' | 'INFORME_TECNICO';
  documentNumber: string;
  summary: string;
  attachments: FileAttachment[];
  deliveryToAuthorityDate?: string;
  authorityReceiverName?: string;
  technicalReviews?: TechnicalReview[];
  qualityReviews?: QualityReview[];
  currentReviewStage?: 'PENDIENTE_REVISION_TECNICA' | 'OBSERVADO_TECNICO' | 'PENDIENTE_CONTROL_CALIDAD' | 'OBSERVADO_CALIDAD' | 'CONCLUIDO';
}

export interface AppNotification {
  id: string;
  userId: string; // or 'ROLE_ENCARGADO', 'ROLE_PERITO', etc.
  title: string;
  message: string;
  requirementId?: string;
  rup?: string;
  createdAt: string;
  readAt?: string;
  status: 'Pendiente' | 'Leído';
  type: 'NUEVO_REQUERIMIENTO' | 'ASIGNACION' | 'CAMBIO_ESTADO' | 'EVIDENCIA_RECIBIDA' | 'INFORME_LISTO';
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  dateTime: string;
  ip: string;
  action: string;
  module: string;
  previousState?: string;
  newState?: string;
}

export interface DashboardStats {
  totalRegistered: number;
  totalPending: number;
  totalCompleted: number;
  totalRepresented: number;
  totalEvidenceInCustody: number;
  bySection: { sectionName: string; count: number }[];
  byServiceType: { serviceType: string; count: number }[];
  byOffice: { officeName: string; count: number }[];
  monthlyTrend: { month: string; registered: number; completed: number }[];
}
