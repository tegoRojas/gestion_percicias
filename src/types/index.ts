export type UserRole = 
  | 'ADMIN' 
  | 'RECEPCION' 
  | 'SALA_EVIDENCIAS' 
  | 'ENCARGADO_SERVICIOS' 
  | 'PERITO' 
  | 'TECNICO';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  officeId: string;
  officeName: string;
  sectionId?: string;
  sectionName?: string;
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
  | 'EN_PROCESO' 
  | 'CONCLUIDO' 
  | 'ENTREGADO' 
  | 'FINALIZADO' 
  | 'REPRESENTADO';

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
