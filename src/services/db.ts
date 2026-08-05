import {
  User,
  RegionalOffice,
  Section,
  ServiceItem,
  Requirement,
  EvidenceItem,
  CustodyLog,
  Proveido,
  WorkStatusLog,
  ReportUpload,
  AppNotification,
  AuditLog
} from '../types';
import { INITIAL_FORENSIC_SERVICES } from '../data/initialServices';

const DB_KEYS = {
  USERS: 'iitcup_users',
  OFFICES: 'iitcup_offices',
  SECTIONS: 'iitcup_sections',
  SERVICES: 'iitcup_services',
  REQUIREMENTS: 'iitcup_requirements',
  EVIDENCES: 'iitcup_evidences',
  CUSTODY_LOGS: 'iitcup_custody_logs',
  PROVEIDOS: 'iitcup_proveidos',
  WORK_LOGS: 'iitcup_work_logs',
  REPORTS: 'iitcup_reports',
  NOTIFICATIONS: 'iitcup_notifications',
  AUDIT_LOGS: 'iitcup_audit_logs',
  SEQUENCE: 'iitcup_rup_sequence',
  SUPABASE_CONFIG: 'iitcup_supabase_cfg'
};

// Initial Seed Data
const DEFAULT_OFFICES: RegionalOffice[] = [
  { id: 'off-1', code: 'SCZ', numericCode: '7', name: 'Oficina Regional Santa Cruz - Central', city: 'Santa Cruz de la Sierra', address: 'Av. Mutualista 3er Anillo', isDefault: true },
  { id: 'off-2', code: 'MON', numericCode: '7', name: 'Oficina Regional Montero', city: 'Montero', address: 'Calle Comercio N° 45' },
  { id: 'off-3', code: 'CAM', numericCode: '7', name: 'Oficina Regional Camiri', city: 'Camiri', address: 'Av. Petrolera N° 12' },
  { id: 'off-4', code: 'PSA', numericCode: '7', name: 'Oficina Regional Puerto Suárez', city: 'Puerto Suárez', address: 'Av. Bolivar s/n' },
  { id: 'off-5', code: 'WAR', numericCode: '7', name: 'Oficina Regional Warnes', city: 'Warnes', address: 'Plaza Principal Warnes' }
];

const DEFAULT_SECTIONS: Section[] = [
  { id: 'sec-1', code: 'BAL', name: 'Balística Forense', description: 'Estudio de armas de fuego, proyectiles, casquillos y trayectorias.', managerName: 'Cap. Msc. Luis Vargas', active: true },
  { id: 'sec-2', code: 'DOC', name: 'Documentología y Grafotecnia', description: 'Examen de firma, autenticidad documental y papel moneda.', managerName: 'Dra. Patricia Soliz', active: true },
  { id: 'sec-3', code: 'BIO', name: 'Biología y Genética Forense', description: 'Análisis de manchas hemáticas, fluidos biológicos y ADN.', managerName: 'Lic. Fernando Claros', active: true },
  { id: 'sec-4', code: 'INF', name: 'Informática y Telecomunicaciones Forenses', description: 'Extracción de datos en celulares, DVR, discos y análisis digital.', managerName: 'Ing. Grover Mendoza', active: true },
  { id: 'sec-5', code: 'QUI', name: 'Química y Toxicología Forense', description: 'Análisis de sustancias controladas, venenos y muestras químicas.', managerName: 'Dra. Maria Elena Arteaga', active: true },
  { id: 'sec-6', code: 'CAM', name: 'Criminalística de Campo', description: 'Procesamiento de la escena del crimen y fijación de evidencias.', managerName: 'Cap. Jorge Gutierrez', active: true },
  { id: 'sec-7', code: 'ACC', name: 'Accidentología Vial y Peritaje Técnico', description: 'Investigación técnica de accidentes de tránsito.', managerName: 'Ing. Carlos Aguilera', active: true },
  { id: 'sec-8', code: 'CUS', name: 'Sala de Evidencias y Custodia', description: 'Resguardo, control y administración de la cadena de custodia.', managerName: 'Sgt. Mario Aguilera', active: true }
];

const DEFAULT_SERVICES: ServiceItem[] = INITIAL_FORENSIC_SERVICES;

const DEFAULT_USERS: User[] = [
  { id: 'usr-admin', name: 'Cnel. Msc. Roberto Dávila', username: 'admin', email: 'admin.iitcup@policia.bo', role: 'ADMIN', officeId: 'off-1', officeName: 'Oficina Regional Santa Cruz - Central', phone: '77312345', badgeNumber: 'IIT-001', active: true, createdAt: '2026-01-01T08:00:00Z' },
  { id: 'usr-rec', name: 'Sgt. Ana María Rojas', username: 'recepcion', email: 'recepcion.scz@iitcup.bo', role: 'RECEPCION', officeId: 'off-1', officeName: 'Oficina Regional Santa Cruz - Central', phone: '77323456', badgeNumber: 'IIT-012', active: true, createdAt: '2026-01-01T08:00:00Z' },
  { id: 'usr-sala', name: 'Sof. Juan Pablo Mamani', username: 'custodia', email: 'custodia.scz@iitcup.bo', role: 'SALA_EVIDENCIAS', officeId: 'off-1', officeName: 'Oficina Regional Santa Cruz - Central', phone: '77334567', badgeNumber: 'IIT-025', active: true, createdAt: '2026-01-01T08:00:00Z' },
  { id: 'usr-enc', name: 'Mayor Lic. Gonzalo Terrazas', username: 'encargado', email: 'encargado.pericial@iitcup.bo', role: 'ENCARGADO_SERVICIOS', officeId: 'off-1', officeName: 'Oficina Regional Santa Cruz - Central', phone: '77345678', badgeNumber: 'IIT-005', active: true, createdAt: '2026-01-01T08:00:00Z' },
  { id: 'usr-perito1', name: 'Cap. Ing. David Justiniano', username: 'djustiniano', email: 'd.justiniano@iitcup.bo', role: 'PERITO', officeId: 'off-1', officeName: 'Oficina Regional Santa Cruz - Central', sectionId: 'sec-4', sectionName: 'Informática y Telecomunicaciones Forenses', phone: '77356789', badgeNumber: 'PER-102', active: true, createdAt: '2026-01-01T08:00:00Z' },
  { id: 'usr-perito2', name: 'Dra. Claudia Barrientos', username: 'cbarrientos', email: 'c.barrientos@iitcup.bo', role: 'PERITO', officeId: 'off-1', officeName: 'Oficina Regional Santa Cruz - Central', sectionId: 'sec-1', sectionName: 'Balística Forense', phone: '77367890', badgeNumber: 'PER-105', active: true, createdAt: '2026-01-01T08:00:00Z' },
  { id: 'usr-tec1', name: 'Tco. Marcelo Flores', username: 'mflores', email: 'm.flores@iitcup.bo', role: 'TECNICO', officeId: 'off-1', officeName: 'Oficina Regional Santa Cruz - Central', sectionId: 'sec-2', sectionName: 'Documentología y Grafotecnia', phone: '77378901', badgeNumber: 'TEC-201', active: true, createdAt: '2026-01-01T08:00:00Z' }
];

export const getStored = <T>(key: string, defaultValue: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return defaultValue;
  }
};

export const setStored = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to storage:`, e);
  }
};

// Initialize DB with seed if empty
export const initStorage = () => {
  if (!localStorage.getItem(DB_KEYS.OFFICES)) setStored(DB_KEYS.OFFICES, DEFAULT_OFFICES);
  if (!localStorage.getItem(DB_KEYS.SECTIONS)) setStored(DB_KEYS.SECTIONS, DEFAULT_SECTIONS);
  const currentStoredServices = getStored<ServiceItem[]>(DB_KEYS.SERVICES, []);
  if (!localStorage.getItem(DB_KEYS.SERVICES) || currentStoredServices.length < 20 || !currentStoredServices.some(s => s.area)) {
    setStored(DB_KEYS.SERVICES, DEFAULT_SERVICES);
  }
  if (!localStorage.getItem(DB_KEYS.USERS)) setStored(DB_KEYS.USERS, DEFAULT_USERS);
  if (!localStorage.getItem(DB_KEYS.SEQUENCE)) setStored(DB_KEYS.SEQUENCE, 5);

  // Seed initial requirements if none
  if (!localStorage.getItem(DB_KEYS.REQUIREMENTS)) {
    const initialReqs: Requirement[] = [
      {
        id: 'req-101',
        rup: 'SCZ-7-000001',
        sequenceNumber: 1,
        entryDateTime: '2026-08-01T09:30:00Z',
        regionalOfficeId: 'off-1',
        regionalOfficeName: 'Oficina Regional Santa Cruz - Central',
        origin: 'Fiscalía Especializada en Delitos contra la Vida',
        externalCode: 'CUD: 7011020260012',
        applicantName: 'Dr. Marco Antonio Rivas (Fiscal de Materia)',
        fojaCount: 24,
        serviceType: 'PERICIAL',
        sectionId: 'sec-1',
        sectionName: 'Balística Forense',
        serviceId: 'srv-1',
        serviceName: 'Estudio Comparativo Balístico de Vaina/Proyectil',
        hasEvidence: true,
        puntosPericia: '1) Determinar calibre y fabricante de los 3 casquillos colectados.\n2) Establecer si percutieron en la misma arma incautada.',
        observations: 'Cadena de custodia intacta. Remitido en bolsa de polietileno con precinto 00452.',
        status: 'EN_PROCESO',
        registeredBy: 'Sgt. Ana María Rojas',
        registeredById: 'usr-rec',
        attachments: [{ id: 'att-1', name: 'Requerimiento_Fiscal_CUD_7011.pdf', size: 1048576, type: 'application/pdf', uploadedAt: '2026-08-01T09:30:00Z' }],
        createdAt: '2026-08-01T09:30:00Z',
        updatedAt: '2026-08-01T11:00:00Z'
      },
      {
        id: 'req-102',
        rup: 'SCZ-7-000002',
        sequenceNumber: 2,
        entryDateTime: '2026-08-02T14:15:00Z',
        regionalOfficeId: 'off-1',
        regionalOfficeName: 'Oficina Regional Santa Cruz - Central',
        origin: 'FELCC - División Propiedad Santa Cruz',
        externalCode: 'N° Causa: 145/2026',
        applicantName: 'Tcnl. Juan Carlos Vaca (Asignado al Caso)',
        fojaCount: 12,
        serviceType: 'PERICIAL',
        sectionId: 'sec-4',
        sectionName: 'Informática y Telecomunicaciones Forenses',
        serviceId: 'srv-6',
        serviceName: 'Extracción Forense de Dispositivo Móvil (UFED)',
        hasEvidence: true,
        puntosPericia: '1) Extracción de conversaciones de WhatsApp de las fechas 20 al 25 de Julio 2026.\n2) Recuperación de registro de llamadas y galería multimedia.',
        observations: 'Celular Samsung Galaxy S23 Ultra con pantalla fisurada pero operativo.',
        status: 'ASIGNADO',
        registeredBy: 'Sgt. Ana María Rojas',
        registeredById: 'usr-rec',
        attachments: [{ id: 'att-2', name: 'Oficio_FELCC_145_2026.pdf', size: 845210, type: 'application/pdf', uploadedAt: '2026-08-02T14:15:00Z' }],
        createdAt: '2026-08-02T14:15:00Z',
        updatedAt: '2026-08-02T16:20:00Z'
      },
      {
        id: 'req-103',
        rup: 'SCZ-7-000003',
        sequenceNumber: 3,
        entryDateTime: '2026-08-03T08:45:00Z',
        regionalOfficeId: 'off-1',
        regionalOfficeName: 'Oficina Regional Santa Cruz - Central',
        origin: 'Juzgado 2° de Instrucción en lo Penal',
        externalCode: 'IANUS: 202604812',
        applicantName: 'Dra. Beatriz Sandoval (Juez de Instrucción)',
        fojaCount: 35,
        serviceType: 'PERICIAL',
        sectionId: 'sec-2',
        sectionName: 'Documentología y Grafotecnia',
        serviceId: 'srv-3',
        serviceName: 'Peritaje Grafotécnico en Firmas y Rúbricas',
        hasEvidence: true,
        puntosPericia: 'Cotejo de la firma atribuida al Sr. Fernando Morales en la minuta de compraventa con patrones indubitados.',
        observations: 'Se adjuntan documentos originales en sobre cerrado.',
        status: 'EN_REVISION',
        registeredBy: 'Sgt. Ana María Rojas',
        registeredById: 'usr-rec',
        attachments: [
          { id: 'att-103-1', name: 'Oficio_Requerimiento_Juzgado2_2026.pdf', size: 1240500, type: 'application/pdf', uploadedAt: '2026-08-03T08:45:00Z' },
          { id: 'att-103-2', name: 'Minuta_Compraventa_Escaneada_Foja1.jpg', size: 3450000, type: 'image/jpeg', uploadedAt: '2026-08-03T08:46:00Z' },
          { id: 'att-103-3', name: 'Acta_Recepcion_Documental_Firma.pdf', size: 520100, type: 'application/pdf', uploadedAt: '2026-08-03T08:46:00Z' }
        ],
        createdAt: '2026-08-03T08:45:00Z',
        updatedAt: '2026-08-03T08:45:00Z'
      },
      {
        id: 'req-104',
        rup: 'SCZ-7-000004',
        sequenceNumber: 4,
        entryDateTime: '2026-08-03T11:20:00Z',
        regionalOfficeId: 'off-2',
        regionalOfficeName: 'Oficina Regional Montero',
        origin: 'Fiscalía de Montero',
        externalCode: 'CUD: 701202026088',
        applicantName: 'Dr. Hernán Torrico (Fiscal de Montero)',
        fojaCount: 8,
        serviceType: 'TECNICO',
        sectionId: 'sec-2',
        sectionName: 'Documentología y Grafotecnia',
        serviceId: 'srv-4',
        serviceName: 'Verificación de Documento de Identidad / Moneda',
        hasEvidence: true,
        puntosPericia: 'Verificación de autenticidad de billetes de 100 bolivianos incautados.',
        status: 'REGISTRADO',
        registeredBy: 'Sgt. Ana María Rojas',
        registeredById: 'usr-rec',
        attachments: [
          { id: 'att-104-1', name: 'Orden_Fiscal_Montero_CUD_7012.pdf', size: 920000, type: 'application/pdf', uploadedAt: '2026-08-03T11:20:00Z' },
          { id: 'att-104-2', name: 'Fotografias_Billetes_Incautados.jpg', size: 2150000, type: 'image/jpeg', uploadedAt: '2026-08-03T11:21:00Z' }
        ],
        createdAt: '2026-08-03T11:20:00Z',
        updatedAt: '2026-08-03T11:20:00Z'
      },
      {
        id: 'req-105',
        rup: 'SCZ-7-000005',
        sequenceNumber: 5,
        entryDateTime: '2026-07-28T10:00:00Z',
        regionalOfficeId: 'off-1',
        regionalOfficeName: 'Oficina Regional Santa Cruz - Central',
        origin: 'DIPOFRVE Santa Cruz',
        externalCode: 'DIP-223/2026',
        applicantName: 'Cap. Jorge Lora',
        fojaCount: 15,
        serviceType: 'PERICIAL',
        sectionId: 'sec-3',
        sectionName: 'Biología y Genética Forense',
        serviceId: 'srv-5',
        serviceName: 'Análisis e Identificación de Fluidos Biológicos',
        hasEvidence: true,
        puntosPericia: 'Detección de fluidos biológicos en prenda de vestir.',
        status: 'CONCLUIDO',
        registeredBy: 'Sgt. Ana María Rojas',
        registeredById: 'usr-rec',
        attachments: [],
        createdAt: '2026-07-28T10:00:00Z',
        updatedAt: '2026-08-03T16:00:00Z'
      }
    ];
    setStored(DB_KEYS.REQUIREMENTS, initialReqs);
  }

  // Seed evidences
  if (!localStorage.getItem(DB_KEYS.EVIDENCES)) {
    const initialEvidences: EvidenceItem[] = [
      {
        id: 'ev-1',
        requirementId: 'req-101',
        rup: 'SCZ-7-000001',
        entryDateTime: '2026-08-01T09:40:00Z',
        packaging: 'Bolsa de polietileno transparente precintada N° 00452',
        evidenceType: 'Arma de fuego',
        description: 'Pistola marca Taurus calibre 9mm N° de serie B82910 con cargador y 3 casquillos servidos.',
        assigneeName: 'Sof. Juan Pablo Mamani',
        assigneePhone: '77334567',
        hasCollectionAct: true,
        hasCustodyAct: true,
        observations: 'Sello de seguridad conforme y firma de oficial colector.',
        status: 'ENTREGADO_A_PERITO',
        attachments: [
          {
            id: 'ev-att-1',
            name: 'Acta_Cadena_Custodia_Pistola_Taurus.pdf',
            size: 1150000,
            type: 'application/pdf',
            uploadedAt: '2026-08-01T09:40:00Z'
          },
          {
            id: 'ev-att-2',
            name: 'Fotografia_Registro_Evidencia_Arma.jpg',
            size: 2450000,
            type: 'image/jpeg',
            uploadedAt: '2026-08-01T09:42:00Z'
          }
        ],
        createdAt: '2026-08-01T09:40:00Z'
      },
      {
        id: 'ev-2',
        requirementId: 'req-102',
        rup: 'SCZ-7-000002',
        entryDateTime: '2026-08-02T14:30:00Z',
        packaging: 'Sobre de manila con cinta adhesiva membretada FELCC',
        evidenceType: 'Celular',
        description: 'Smartphone Samsung Galaxy S23 Ultra color negro con funda protectora.',
        assigneeName: 'Sof. Juan Pablo Mamani',
        assigneePhone: '77334567',
        hasCollectionAct: true,
        hasCustodyAct: true,
        observations: 'Incluye tarjeta SIM Entel.',
        status: 'EN_CUSTODIA',
        attachments: [
          {
            id: 'ev-att-3',
            name: 'Fotografia_Celular_Samsung_S23.jpg',
            size: 1890000,
            type: 'image/jpeg',
            uploadedAt: '2026-08-02T14:31:00Z'
          },
          {
            id: 'ev-att-4',
            name: 'Acta_Coleccion_Lugar_Hecho.pdf',
            size: 820000,
            type: 'application/pdf',
            uploadedAt: '2026-08-02T14:32:00Z'
          }
        ],
        createdAt: '2026-08-02T14:30:00Z'
      }
    ];
    setStored(DB_KEYS.EVIDENCES, initialEvidences);
  }

  // Seed proveídos
  if (!localStorage.getItem(DB_KEYS.PROVEIDOS)) {
    const initialProveidos: Proveido[] = [
      {
        id: 'prov-1',
        requirementId: 'req-101',
        rup: 'SCZ-7-000001',
        dateTime: '2026-08-01T11:00:00Z',
        decision: 'ASIGNAR_PERITO',
        assignedPeritoId: 'usr-perito2',
        assignedPeritoName: 'Dra. Claudia Barrientos',
        legalViabilityNotes: 'El requerimiento cumple con todos los preceptos del Art. 206 y 209 del Código de Procedimiento Penal. Viable técnicamente.',
        observations: 'Plazo asignado para informe: 5 días hábiles.',
        registeredBy: 'Mayor Lic. Gonzalo Terrazas',
        registeredById: 'usr-enc'
      },
      {
        id: 'prov-2',
        requirementId: 'req-102',
        rup: 'SCZ-7-000002',
        dateTime: '2026-08-02T16:20:00Z',
        decision: 'ASIGNAR_PERITO',
        assignedPeritoId: 'usr-perito1',
        assignedPeritoName: 'Cap. Ing. David Justiniano',
        legalViabilityNotes: 'Pertinencia corroborada con orden judicial. Procede peritaje de informática forense.',
        observations: 'Prioridad alta.',
        registeredBy: 'Mayor Lic. Gonzalo Terrazas',
        registeredById: 'usr-enc'
      }
    ];
    setStored(DB_KEYS.PROVEIDOS, initialProveidos);
  }

  // Seed notifications
  if (!localStorage.getItem(DB_KEYS.NOTIFICATIONS)) {
    const initialNotifs: AppNotification[] = [
      {
        id: 'notif-1',
        userId: 'usr-enc',
        title: 'Nuevo Requerimiento Registrado',
        message: 'Se ha ingresado el RUP SCZ-7-000003 correspondiente a Documentología y Grafotecnia.',
        requirementId: 'req-103',
        rup: 'SCZ-7-000003',
        createdAt: '2026-08-03T08:45:00Z',
        status: 'Pendiente',
        type: 'NUEVO_REQUERIMIENTO'
      },
      {
        id: 'notif-2',
        userId: 'usr-perito1',
        title: 'Asignación de Peritaje',
        message: 'Le ha sido asignado el caso RUP SCZ-7-000002 de Extracción Forense UFED.',
        requirementId: 'req-102',
        rup: 'SCZ-7-000002',
        createdAt: '2026-08-02T16:20:00Z',
        status: 'Pendiente',
        type: 'ASIGNACION'
      }
    ];
    setStored(DB_KEYS.NOTIFICATIONS, initialNotifs);
  }

  // Seed custody logs
  if (!localStorage.getItem(DB_KEYS.CUSTODY_LOGS)) {
    const initialCustodyLogs: CustodyLog[] = [
      {
        id: 'clog-1',
        evidenceId: 'ev-1',
        rup: 'SCZ-7-000001',
        dateTime: '2026-08-01T09:40:00Z',
        actionType: 'INGRESO_SALA',
        deliveredBy: 'Sgt. Ana María Rojas',
        receivedBy: 'Sof. Juan Pablo Mamani',
        motive: 'Recepción inicial de evidencia procedente de Fiscalía.',
        notes: 'Ingresa a casillero de seguridad A-12.'
      },
      {
        id: 'clog-2',
        evidenceId: 'ev-1',
        rup: 'SCZ-7-000001',
        dateTime: '2026-08-01T11:30:00Z',
        actionType: 'ENTREGA_A_PERITO',
        deliveredBy: 'Sof. Juan Pablo Mamani',
        receivedBy: 'Dra. Claudia Barrientos',
        motive: 'Entrega de armamento para examen balístico pericial.',
        notes: 'Firma de libro de control y acta de traspaso.'
      }
    ];
    setStored(DB_KEYS.CUSTODY_LOGS, initialCustodyLogs);
  }

  // Audit Logs initial seed
  if (!localStorage.getItem(DB_KEYS.AUDIT_LOGS)) {
    const initialAudits: AuditLog[] = [
      {
        id: 'aud-1',
        userId: 'usr-rec',
        userName: 'Sgt. Ana María Rojas',
        userRole: 'RECEPCION',
        dateTime: '2026-08-01T09:30:00Z',
        ip: '192.168.1.45',
        action: 'CREACION_REQUERIMIENTO',
        module: 'Recepción',
        newState: 'RUP SCZ-7-000001 creado exitosamente.'
      },
      {
        id: 'aud-2',
        userId: 'usr-enc',
        userName: 'Mayor Lic. Gonzalo Terrazas',
        userRole: 'ENCARGADO_SERVICIOS',
        dateTime: '2026-08-01T11:00:00Z',
        ip: '192.168.1.10',
        action: 'ASIGNACION_PERITO',
        module: 'Servicios Periciales',
        previousState: 'EN_REVISION',
        newState: 'ASIGNADO a Dra. Claudia Barrientos'
      }
    ];
    setStored(DB_KEYS.AUDIT_LOGS, initialAudits);
  }
};

// Data Retrieval APIs
export const getRequirements = (): Requirement[] => getStored(DB_KEYS.REQUIREMENTS, []);
export const getEvidences = (): EvidenceItem[] => getStored(DB_KEYS.EVIDENCES, []);
export const getCustodyLogs = (): CustodyLog[] => getStored(DB_KEYS.CUSTODY_LOGS, []);
export const getProveidos = (): Proveido[] => getStored(DB_KEYS.PROVEIDOS, []);
export const getUsers = (): User[] => getStored(DB_KEYS.USERS, []);
export const getOffices = (): RegionalOffice[] => getStored(DB_KEYS.OFFICES, []);
export const getSections = (): Section[] => getStored(DB_KEYS.SECTIONS, []);
export const getServices = (): ServiceItem[] => getStored(DB_KEYS.SERVICES, []);
export const getNotifications = (): AppNotification[] => getStored(DB_KEYS.NOTIFICATIONS, []);
export const getAuditLogs = (): AuditLog[] => getStored(DB_KEYS.AUDIT_LOGS, []);
export const getWorkLogs = (): WorkStatusLog[] => getStored(DB_KEYS.WORK_LOGS, []);
export const getReportUploads = (): ReportUpload[] => getStored(DB_KEYS.REPORTS, []);

// RUP Sequence Generator
export const generateNextRUP = (officeId?: string): { rup: string; seq: number } => {
  const offices = getOffices();
  const selectedOffice = offices.find(o => o.id === officeId) || offices[0];
  const prefix = selectedOffice.code; // "SCZ"
  const regCode = selectedOffice.numericCode; // "7"
  
  const currentSeq = getStored<number>(DB_KEYS.SEQUENCE, 5) + 1;
  setStored(DB_KEYS.SEQUENCE, currentSeq);

  const seqFormatted = String(currentSeq).padStart(6, '0');
  const rup = `${prefix}-${regCode}-${seqFormatted}`;
  return { rup, seq: currentSeq };
};

// Audit Logger (IMMUTABLE)
export const logAudit = (
  user: { id: string; name: string; role: any },
  action: string,
  module: string,
  previousState?: string,
  newState?: string
) => {
  const logs = getAuditLogs();
  const newLog: AuditLog = {
    id: 'aud-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    dateTime: new Date().toISOString(),
    ip: '127.0.0.1 (Local PWA Session)',
    action,
    module,
    previousState,
    newState
  };
  logs.unshift(newLog);
  setStored(DB_KEYS.AUDIT_LOGS, logs);
};

// Notification Dispatcher
export const sendNotification = (
  userId: string,
  title: string,
  message: string,
  type: AppNotification['type'],
  requirementId?: string,
  rup?: string
) => {
  const notifs = getNotifications();
  const newNotif: AppNotification = {
    id: 'notif-' + Date.now(),
    userId,
    title,
    message,
    requirementId,
    rup,
    createdAt: new Date().toISOString(),
    status: 'Pendiente',
    type
  };
  notifs.unshift(newNotif);
  setStored(DB_KEYS.NOTIFICATIONS, notifs);
};

export const markNotificationRead = (notifId: string) => {
  const notifs = getNotifications();
  const idx = notifs.findIndex(n => n.id === notifId);
  if (idx !== -1) {
    notifs[idx].status = 'Leído';
    notifs[idx].readAt = new Date().toISOString();
    setStored(DB_KEYS.NOTIFICATIONS, notifs);
  }
};

export const markNotificationsReadForRequirement = (userId: string, requirementId: string) => {
  const notifs = getNotifications();
  let updated = false;
  notifs.forEach(n => {
    if ((n.userId === userId || n.userId === 'ROLE_PERITO' || n.userId === 'ROLE_ENCARGADO') && n.requirementId === requirementId && n.status === 'Pendiente') {
      n.status = 'Leído';
      n.readAt = new Date().toISOString();
      updated = true;
    }
  });
  if (updated) setStored(DB_KEYS.NOTIFICATIONS, notifs);
};

// Generate Pure PostgreSQL / Supabase DDL SQL Script
export const generateSupabaseSQL = (): string => {
  return `-- ====================================================================
-- ESTRUCTURA COMPLETA BASE DE DATOS POSTGRESQL / SUPABASE
-- IITCUP REGIONAL SANTA CRUZ - SISTEMA DE GESTION PERICIAL Y TECNICA
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLA OFICINAS REGIONALES
CREATE TABLE IF NOT EXISTS public.regional_offices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(10) NOT NULL UNIQUE,
    numeric_code VARCHAR(10) NOT NULL DEFAULT '7',
    name VARCHAR(150) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABLA SECCIONES PERICIALES
CREATE TABLE IF NOT EXISTS public.sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    manager_name VARCHAR(150),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABLA SERVICIOS
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_id UUID REFERENCES public.sections(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('PERICIAL', 'TECNICO')),
    estimated_days INT DEFAULT 5,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABLA USUARIOS DEL SISTEMA
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    role VARCHAR(30) CHECK (role IN ('ADMIN', 'RECEPCION', 'SALA_EVIDENCIAS', 'ENCARGADO_SERVICIOS', 'PERITO', 'TECNICO')),
    office_id UUID REFERENCES public.regional_offices(id),
    section_id UUID REFERENCES public.sections(id),
    phone VARCHAR(30),
    badge_number VARCHAR(50),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. SECUENCIA Y TABLA DE REQUERIMIENTOS PERICIALES Y TECNICOS
CREATE SEQUENCE IF NOT EXISTS rup_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE IF NOT EXISTS public.requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sequence_number INT DEFAULT nextval('rup_seq'),
    rup VARCHAR(20) UNIQUE NOT NULL,
    entry_date_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    regional_office_id UUID REFERENCES public.regional_offices(id),
    origin VARCHAR(200) NOT NULL,
    external_code VARCHAR(100) NOT NULL,
    applicant_name VARCHAR(150) NOT NULL,
    interested_person_name VARCHAR(150),
    interested_person_phone VARCHAR(30),
    foja_count INT NOT NULL DEFAULT 1,
    service_type VARCHAR(20) CHECK (service_type IN ('PERICIAL', 'TECNICO', 'AMBOS')),
    section_id UUID REFERENCES public.sections(id),
    service_id UUID REFERENCES public.services(id),
    has_evidence BOOLEAN DEFAULT FALSE,
    puntos_pericia TEXT NOT NULL,
    observations TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'REGISTRADO',
    registered_by_id UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FUNCTION TRIGGER PARA REQUERIMIENTO AUTOMATICO DE RUP (SCZ-7-000001)
CREATE OR REPLACE FUNCTION generate_rup_code()
RETURNS TRIGGER AS $$
DECLARE
    seq_num INT;
    rup_code VARCHAR(20);
BEGIN
    seq_num := nextval('rup_seq');
    NEW.sequence_number := seq_num;
    rup_code := 'SCZ-7-' || LPAD(seq_num::text, 6, '0');
    NEW.rup := rup_code;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_auto_rup ON public.requirements;

CREATE TRIGGER trg_auto_rup
BEFORE INSERT ON public.requirements
FOR EACH ROW
WHEN (NEW.rup IS NULL OR NEW.rup = '')
EXECUTE FUNCTION generate_rup_code();

-- 6. TABLA EVIDENCIAS (SALA DE EVIDENCIAS Y CADENA DE CUSTODIA)
CREATE TABLE IF NOT EXISTS public.evidences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requirement_id UUID REFERENCES public.requirements(id) ON DELETE CASCADE,
    rup VARCHAR(20) NOT NULL,
    entry_date_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    packaging VARCHAR(200) NOT NULL,
    evidence_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    assignee_name VARCHAR(150) NOT NULL,
    assignee_phone VARCHAR(30),
    has_collection_act BOOLEAN DEFAULT FALSE,
    has_custody_act BOOLEAN DEFAULT FALSE,
    observations TEXT,
    status VARCHAR(30) DEFAULT 'EN_CUSTODIA',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. TABLA HISTORIAL CADENA DE CUSTODIA
CREATE TABLE IF NOT EXISTS public.custody_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    evidence_id UUID REFERENCES public.evidences(id) ON DELETE CASCADE,
    rup VARCHAR(20) NOT NULL,
    date_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    action_type VARCHAR(50) NOT NULL,
    delivered_by VARCHAR(150) NOT NULL,
    received_by VARCHAR(150) NOT NULL,
    motive TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. TABLA PROVEIDOS Y ASIGNACIONES
CREATE TABLE IF NOT EXISTS public.proveidos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requirement_id UUID REFERENCES public.requirements(id) ON DELETE CASCADE,
    rup VARCHAR(20) NOT NULL,
    date_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    decision VARCHAR(30) CHECK (decision IN ('ASIGNAR_PERITO', 'REPRESENTAR')),
    assigned_perito_id UUID REFERENCES public.users(id),
    assigned_tecnico_id UUID REFERENCES public.users(id),
    legal_viability_notes TEXT NOT NULL,
    observations TEXT,
    registered_by_id UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. TABLA INFORMES Y DICTAMENES PERICIALES
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requirement_id UUID REFERENCES public.requirements(id) ON DELETE CASCADE,
    rup VARCHAR(20) NOT NULL,
    upload_date_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    uploaded_by_id UUID REFERENCES public.users(id),
    report_type VARCHAR(50) NOT NULL,
    document_number VARCHAR(100) NOT NULL,
    summary TEXT NOT NULL,
    delivery_to_authority_date TIMESTAMP WITH TIME ZONE,
    authority_receiver_name VARCHAR(150),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. TABLA NOTIFICACIONES EN LA APLICACION
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id),
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    requirement_id UUID REFERENCES public.requirements(id),
    rup VARCHAR(20),
    status VARCHAR(20) DEFAULT 'Pendiente',
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. TABLA AUDITORIA (INMUTABLE - NO PERMITE DELETE)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id),
    user_name VARCHAR(150) NOT NULL,
    user_role VARCHAR(30) NOT NULL,
    date_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    module VARCHAR(50) NOT NULL,
    previous_state TEXT,
    new_state TEXT
);

-- RESTRICCION INMUTABILIDAD EN AUDITORIA (PREVIENE ELIMINACION)
CREATE OR REPLACE FUNCTION prevent_audit_deletion()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'No está permitido eliminar registros de auditoría en IITCUP.';
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_protect_audit ON public.audit_logs;

CREATE TRIGGER trg_protect_audit
BEFORE DELETE OR UPDATE ON public.audit_logs
FOR EACH ROW
EXECUTE FUNCTION prevent_audit_deletion();

-- POLÍTICAS RLS (ROW LEVEL SECURITY)
ALTER TABLE public.requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lectura de requerimientos segun rol" ON public.requirements;
DROP POLICY IF EXISTS "Permiso administradores" ON public.audit_logs;

CREATE POLICY "Lectura de requerimientos segun rol" ON public.requirements
FOR SELECT USING (true);

CREATE POLICY "Permiso administradores" ON public.audit_logs
FOR ALL USING (auth.jwt() ->> 'role' = 'ADMIN' OR true);

`;
};
