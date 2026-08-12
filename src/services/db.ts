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
  TechnicalReview,
  QualityReview,
  AppNotification,
  AuditLog,
  PsychologyAppointment
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
  TECHNICAL_REVIEWS: 'iitcup_technical_reviews',
  QUALITY_REVIEWS: 'iitcup_quality_reviews',
  NOTIFICATIONS: 'iitcup_notifications',
  AUDIT_LOGS: 'iitcup_audit_logs',
  SEQUENCE: 'iitcup_rup_sequence',
  SUPABASE_CONFIG: 'iitcup_supabase_cfg',
  APPOINTMENTS: 'iitcup_appointments'
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
  { id: 'usr-admin', name: 'CAP. JUAN ALBERTO ROJAS CAMACHO', grado: 'CAP.', paternalLastName: 'ROJAS', maternalLastName: 'CAMACHO', firstName: 'JUAN', secondName: 'ALBERTO', ci: '6439119', gender: 'M', email: 'ROJASCAMACHO@gmail.com', escalafon: '5052', role: 'ADMIN', officeId: 'off-1', officeName: 'Central Santa Cruz', cargo: 'JEFE DEL REAFUC SANTA CRUZ', sectionId: 'sec-1', sectionName: 'Balística Forense', sectionIds: ['sec-1'], sectionNames: ['BALÍSTICA'], username: 'ROJASCAMACHO@gmail.com', password: '6439119', phone: '6439119', badgeNumber: '5052', active: true, createdAt: '2026-01-01T08:00:00Z' },
  { id: 'usr-encargado', name: 'MY. CARLOS EDUARDO CALVO MORALES', grado: 'MY.', paternalLastName: 'CALVO', maternalLastName: 'MORALES', firstName: 'CARLOS', secondName: 'EDUARDO', ci: '6211971', gender: 'M', email: 'CALVOMORALES@gmail.com', escalafon: '5050-OF', role: 'ENCARGADO_SERVICIOS', officeId: 'off-1', officeName: 'Central Santa Cruz', cargo: 'JEFE DPTAL. DEL IITCUP SANTA CRUZ', sectionId: 'sec-4', sectionName: 'Informática y Telecomunicaciones Forenses', sectionIds: ['sec-4'], sectionNames: ['INFORMÁTICA'], username: 'CALVOMORALES@gmail.com', password: '6211971', phone: '6211971', badgeNumber: '5050-OF', active: true, createdAt: '2026-01-01T08:00:00Z' },
  { id: 'usr-enc-area', name: 'CAP. MAURICIO PEREZ VARGAS', grado: 'CAP.', paternalLastName: 'PEREZ', maternalLastName: 'VARGAS', firstName: 'MAURICIO', secondName: '', ci: '7788990', gender: 'M', email: 'PEREZVARGAS@gmail.com', escalafon: '5080', role: 'ENCARGADO_AREA', officeId: 'off-1', officeName: 'Central Santa Cruz', cargo: 'ENCARGADO DE ÁREA - EVALUACIÓN TÉCNICA FORENSE', sectionId: 'sec-4', sectionName: 'Informática y Telecomunicaciones Forenses', sectionIds: ['sec-4'], sectionNames: ['INFORMÁTICA'], username: 'PEREZVARGAS@gmail.com', password: '7788990', phone: '7788990', badgeNumber: '5080', active: true, createdAt: '2026-01-01T08:00:00Z' },
  { id: 'usr-ctrl-calidad', name: 'DRA. MARIA RENE PAREDES ZURITA', grado: 'DRA.', paternalLastName: 'PAREDES', maternalLastName: 'ZURITA', firstName: 'MARIA', secondName: 'RENE', ci: '8899001', gender: 'F', email: 'PAREDESZURITA@gmail.com', escalafon: '5081', role: 'CONTROL_CALIDAD', officeId: 'off-1', officeName: 'Central Santa Cruz', cargo: 'RESPONSABLE DE CONTROL DE CALIDAD Y FORMA', sectionId: 'sec-1', sectionName: 'Balística Forense', sectionIds: ['sec-1'], sectionNames: ['BALÍSTICA'], username: 'PAREDESZURITA@gmail.com', password: '8899001', phone: '8899001', badgeNumber: '5081', active: true, createdAt: '2026-01-01T08:00:00Z' },
  { id: 'usr-millares', name: 'MY. NESTOR HERNAN MILLARES CARDENAS', grado: 'MY.', paternalLastName: 'MILLARES', maternalLastName: 'CARDENAS', firstName: 'NESTOR', secondName: 'HERNAN', ci: '6720304', gender: 'M', email: 'MILLARESCARDENAS@gmail.com', escalafon: '5051', role: 'PERITO', officeId: 'off-1', officeName: 'Central Santa Cruz', cargo: 'PERITO DE LA SECCION DOCUMENTOLOGIA Y HUELLOGRAFIA', sectionId: 'sec-2', sectionName: 'Documentología y Grafotecnia', sectionIds: ['sec-2'], sectionNames: ['DOCUMENTOLOGÍA'], username: 'MILLARESCARDENAS@gmail.com', password: '6720304', phone: '6720304', badgeNumber: '5051', active: true, createdAt: '2026-01-01T08:00:00Z' },
  { id: 'usr-ajllahuanca', name: 'TTE. VLADIMIR AJLLAHUANCA CHURA', grado: 'TTE.', paternalLastName: 'AJLLAHUANCA', maternalLastName: 'CHURA', firstName: 'VLADIMIR', secondName: '', ci: '9137934', gender: 'M', email: 'AJLLAHUANCA CHURA@gmail.com', escalafon: '5053', role: 'PERITO', officeId: 'off-1', officeName: 'Central Santa Cruz', cargo: 'ENCARGADO DE LA SECCION SERVICIO TECNICO AUXILIAR', sectionId: 'sec-4', sectionName: 'Informática y Telecomunicaciones Forenses', sectionIds: ['sec-4'], sectionNames: ['INFORMÁTICA'], username: 'AJLLAHUANCA CHURA@gmail.com', password: '9137934', phone: '9137934', badgeNumber: '5053', active: true, createdAt: '2026-01-01T08:00:00Z' },
  { id: 'usr-huanca-j', name: 'TTE. JHONNY DORIAM HUANCA GUTIERREZ', grado: 'TTE.', paternalLastName: 'HUANCA', maternalLastName: 'GUTIERREZ', firstName: 'JHONNY', secondName: 'DORIAM', ci: '6113277', gender: 'M', email: 'HUANCAGUTIERREZ@gmail.com', escalafon: '5055', role: 'PERITO', officeId: 'off-1', officeName: 'Central Santa Cruz', cargo: 'ENCARGADO DEL SIIC SCZ', sectionId: 'sec-1', sectionName: 'Balística Forense', sectionIds: ['sec-1'], sectionNames: ['BALÍSTICA'], username: 'HUANCAGUTIERREZ@gmail.com', password: '6113277', phone: '6113277', badgeNumber: '5055', active: true, createdAt: '2026-01-01T08:00:00Z' },
  { id: 'usr-vallejos', name: 'SOF. MY. ORLANDO VALLEJOS VALDIVIA', grado: 'SOF. MY.', paternalLastName: 'VALLEJOS', maternalLastName: 'VALDIVIA', firstName: 'ORLANDO', secondName: '', ci: '4383788', gender: 'M', email: 'VALLEJOSVALDIVIA@gmail.com', escalafon: '5056', role: 'PERITO', officeId: 'off-1', officeName: 'Central Santa Cruz', cargo: 'PERITO DE LA SECCION INFORMATICA', sectionId: 'sec-4', sectionName: 'Informática y Telecomunicaciones Forenses', sectionIds: ['sec-4'], sectionNames: ['INFORMÁTICA'], username: 'VALLEJOSVALDIVIA@gmail.com', password: '4383788', phone: '4383788', badgeNumber: '5056', active: true, createdAt: '2026-01-01T08:00:00Z' },
  { id: 'usr-chura', name: 'SOF. 1RO. CONSTANCIO CHURA PAUCARA', grado: 'SOF. 1RO.', paternalLastName: 'CHURA', maternalLastName: 'PAUCARA', firstName: 'CONSTANCIO', secondName: '', ci: '4802933', gender: 'M', email: 'CHURAPAUCARA@gmail.com', escalafon: '5057', role: 'PERITO', officeId: 'off-1', officeName: 'Central Santa Cruz', cargo: 'EXPERTO EN ARMAS REAFUC', sectionId: 'sec-2', sectionName: 'Documentología y Grafotecnia', sectionIds: ['sec-2'], sectionNames: ['DOCUMENTOLOGÍA'], username: 'CHURAPAUCARA@gmail.com', password: '4802933', phone: '4802933', badgeNumber: '5057', active: true, createdAt: '2026-01-01T08:00:00Z' },
  { id: 'usr-camacho-o', name: 'SOF. 2DO. ORLANDO CAMACHO VIA', grado: 'SOF. 2DO.', paternalLastName: 'CAMACHO', maternalLastName: 'VIA', firstName: 'ORLANDO', secondName: '', ci: '5844840', gender: 'M', email: 'CAMACHOVIA @gmail.com', escalafon: '5058', role: 'PERITO', officeId: 'off-1', officeName: 'Central Santa Cruz', cargo: 'PERITO DE LA SECCION INFROMATICA, CRIMINALISTICA DE CAMPO Y BALISTICA', sectionId: 'sec-1', sectionName: 'Balística Forense', sectionIds: ['sec-1'], sectionNames: ['BALÍSTICA'], username: 'CAMACHOVIA @gmail.com', password: '5844840', phone: '5844840', badgeNumber: '5058', active: true, createdAt: '2026-01-01T08:00:00Z' },
  { id: 'usr-cusi', name: 'SOF. 2DO. SONIA CUSI CASTILLO', grado: 'SOF. 2DO.', paternalLastName: 'CUSI', maternalLastName: 'CASTILLO', firstName: 'SONIA', secondName: '', ci: '6052515', gender: 'F', email: 'CUSICASTILLO@gmail.com', escalafon: '5059', role: 'PERITO', officeId: 'off-1', officeName: 'Central Santa Cruz', cargo: 'PERITO DE LA SECCION INFORMATICA', sectionId: 'sec-4', sectionName: 'Informática y Telecomunicaciones Forenses', sectionIds: ['sec-4'], sectionNames: ['INFORMÁTICA'], username: 'CUSICASTILLO@gmail.com', password: '6052515', phone: '6052515', badgeNumber: '5059', active: true, createdAt: '2026-01-01T08:00:00Z' },
  { id: 'usr-alvarado', name: 'SGTO. MY. MARCO ANTONIO ALVARADO QUINO', grado: 'SGTO. MY.', paternalLastName: 'ALVARADO', maternalLastName: 'QUINO', firstName: 'MARCO', secondName: 'ANTONIO', ci: '5475940', gender: 'M', email: 'ALVARADOQUINO@gmail.com', escalafon: '5063', role: 'PERITO', officeId: 'off-1', officeName: 'Central Santa Cruz', cargo: 'PERITO DE LA SECCION CRIMINALISTICA DE CAMPO E INFORMATICA', sectionId: 'sec-2', sectionName: 'Documentología y Grafotecnia', sectionIds: ['sec-2'], sectionNames: ['DOCUMENTOLOGÍA'], username: 'ALVARADOQUINO@gmail.com', password: '5475940', phone: '5475940', badgeNumber: '5063', active: true, createdAt: '2026-01-01T08:00:00Z' },
  { id: 'usr-huanca-g', name: 'SGTO. MY. GENARO EDUARDO HUANCA PADILLA', grado: 'SGTO. MY.', paternalLastName: 'HUANCA', maternalLastName: 'PADILLA', firstName: 'GENARO', secondName: 'EDUARDO', ci: '4879020', gender: 'M', email: 'HUANCAPADILLA@gmail.com', escalafon: '5064', role: 'PERITO', officeId: 'off-1', officeName: 'Central Santa Cruz', cargo: 'PERITO DE LA SECCION TOXICOLOGIA', sectionId: 'sec-1', sectionName: 'Balística Forense', sectionIds: ['sec-1'], sectionNames: ['BALÍSTICA'], username: 'HUANCAPADILLA@gmail.com', password: '4879020', phone: '4879020', badgeNumber: '5064', active: true, createdAt: '2026-01-01T08:00:00Z' },
  { id: 'usr-huanca-r', name: 'SGTO. MY. RAQUEL HUANCA QUISPE', grado: 'SGTO. MY.', paternalLastName: 'HUANCA', maternalLastName: 'QUISPE', firstName: 'RAQUEL', secondName: '', ci: '6724318', gender: 'F', email: 'HUANCAQUISPE@gmail.com', escalafon: '5065', role: 'PERITO', officeId: 'off-1', officeName: 'Central Santa Cruz', cargo: 'PERITO DE LA SECCION INFORMATICA', sectionId: 'sec-4', sectionName: 'Informática y Telecomunicaciones Forenses', sectionIds: ['sec-4'], sectionNames: ['INFORMÁTICA'], username: 'HUANCAQUISPE@gmail.com', password: '6724318', phone: '6724318', badgeNumber: '5065', active: true, createdAt: '2026-01-01T08:00:00Z' },
  { id: 'usr-tancara', name: 'SGTO. MY. JANETH TANCARA CARAZANI', grado: 'SGTO. MY.', paternalLastName: 'TANCARA', maternalLastName: 'CARAZANI', firstName: 'JANETH', secondName: '', ci: '6741477', gender: 'F', email: 'TANCARACARAZANI@gmail.com', escalafon: '5066', role: 'PERITO', officeId: 'off-1', officeName: 'Central Santa Cruz', cargo: 'PERITO DE LA SECCION INFORMATICA', sectionId: 'sec-2', sectionName: 'Documentología y Grafotecnia', sectionIds: ['sec-2'], sectionNames: ['DOCUMENTOLOGÍA'], username: 'TANCARACARAZANI@gmail.com', password: '6741477', phone: '6741477', badgeNumber: '5066', active: true, createdAt: '2026-01-01T08:00:00Z' },
  { id: 'usr-alaca', name: 'SGTO. 1RO. EBER EDGAR ALACA GIRONDA', grado: 'SGTO. 1RO.', paternalLastName: 'ALACA', maternalLastName: 'GIRONDA', firstName: 'EBER', secondName: 'EDGAR', ci: '6989700', gender: 'M', email: 'ALACAGIRONDA@gmail.com', escalafon: '5067', role: 'PERITO', officeId: 'off-1', officeName: 'Central Santa Cruz', cargo: 'PERITO DE LA SECCION INFORMATICA, CRIMINALISTICA DE CAMPO', sectionId: 'sec-1', sectionName: 'Balística Forense', sectionIds: ['sec-1'], sectionNames: ['BALÍSTICA'], username: 'ALACAGIRONDA@gmail.com', password: '6989700', phone: '6989700', badgeNumber: '5067', active: true, createdAt: '2026-01-01T08:00:00Z' },
  { id: 'usr-apaza', name: 'SGTO. 1RO. DIEGO ARMANDO APAZA ARHUATA', grado: 'SGTO. 1RO.', paternalLastName: 'APAZA', maternalLastName: 'ARHUATA', firstName: 'DIEGO', secondName: 'ARMANDO', ci: '8328728', gender: 'M', email: 'APAZAARHUATA@gmail.com', escalafon: '5068', role: 'PERITO', officeId: 'off-1', officeName: 'Central Santa Cruz', cargo: 'ENROLADOR DEL SIIC', sectionId: 'sec-4', sectionName: 'Informática y Telecomunicaciones Forenses', sectionIds: ['sec-4'], sectionNames: ['INFORMÁTICA'], username: 'APAZAARHUATA@gmail.com', password: '8328728', phone: '8328728', badgeNumber: '5068', active: true, createdAt: '2026-01-01T08:00:00Z' },
  { id: 'usr-calcina', name: 'SGTO. 1RO. GROBER SANTOS CALCINA CONDORI', grado: 'SGTO. 1RO.', paternalLastName: 'CALCINA', maternalLastName: 'CONDORI', firstName: 'GROBER', secondName: 'SANTOS', ci: '7079232', gender: 'M', email: 'CALCINACONDORI@gmail.com', escalafon: '5069', role: 'PERITO', officeId: 'off-1', officeName: 'Central Santa Cruz', cargo: 'PERITO DE LA SECCION CRIMINALISTICA DE CAMPO', sectionId: 'sec-2', sectionName: 'Documentología y Grafotecnia', sectionIds: ['sec-2'], sectionNames: ['DOCUMENTOLOGÍA'], username: 'CALCINACONDORI@gmail.com', password: '7079232', phone: '7079232', badgeNumber: '5069', active: true, createdAt: '2026-01-01T08:00:00Z' },
  { id: 'usr-machaca', name: 'SGTO. 1RO. ROMER DIEGO MACHACA SURCO', grado: 'SGTO. 1RO.', paternalLastName: 'MACHACA', maternalLastName: 'SURCO', firstName: 'ROMER', secondName: 'DIEGO', ci: '6798822', gender: 'M', email: 'MACHACASURCO@gmail.com', escalafon: '5071', role: 'PERITO', officeId: 'off-1', officeName: 'Central Santa Cruz', cargo: 'PERITO DE LA SECCION CRIMINLAISTICA DE CAMPO', sectionId: 'sec-4', sectionName: 'Informática y Telecomunicaciones Forenses', sectionIds: ['sec-4'], sectionNames: ['INFORMÁTICA'], username: 'MACHACASURCO@gmail.com', password: '6798822', phone: '6798822', badgeNumber: '5071', active: true, createdAt: '2026-01-01T08:00:00Z' },
  { id: 'usr-arce', name: 'SGTO. 2DO. WILSON ARCE VELA', grado: 'SGTO. 2DO.', paternalLastName: 'ARCE', maternalLastName: 'VELA', firstName: 'WILSON', secondName: '', ci: '12790852', gender: 'M', email: 'ARCEVELA@gmail.com', escalafon: '5074', role: 'PERITO', officeId: 'off-1', officeName: 'Central Santa Cruz', cargo: 'PERITO DE LA SECCION INFORMATICA', sectionId: 'sec-4', sectionName: 'Informática y Telecomunicaciones Forenses', sectionIds: ['sec-4'], sectionNames: ['INFORMÁTICA'], username: 'ARCEVELA@gmail.com', password: '12790852', phone: '12790852', badgeNumber: '5074', active: true, createdAt: '2026-01-01T08:00:00Z' },
  { id: 'usr-coro', name: 'SGTO. 2DO. MAICOL FERMIN CORO CONDORI', grado: 'SGTO. 2DO.', paternalLastName: 'CORO', maternalLastName: 'CONDORI', firstName: 'MAICOL', secondName: 'FERMIN', ci: '8240750', gender: 'M', email: 'COROCONDORI@gmail.com', escalafon: '5075', role: 'PERITO', officeId: 'off-1', officeName: 'Central Santa Cruz', cargo: 'PERITO DE LA SECCION CRIMINALISTICA DE CAMPO', sectionId: 'sec-2', sectionName: 'Documentología y Grafotecnia', sectionIds: ['sec-2'], sectionNames: ['DOCUMENTOLOGÍA'], username: 'COROCONDORI@gmail.com', password: '8240750', phone: '8240750', badgeNumber: '5075', active: true, createdAt: '2026-01-01T08:00:00Z' },
  { id: 'usr-garcia', name: 'SGTO. FREDDY GUSTAVO GARCIA CHOQUE', grado: 'SGTO.', paternalLastName: 'GARCIA', maternalLastName: 'CHOQUE', firstName: 'FREDDY', secondName: 'GUSTAVO', ci: '6087530', gender: 'M', email: 'GARCIACHOQUE@gmail.com', escalafon: '5076', role: 'PERITO', officeId: 'off-1', officeName: 'Central Santa Cruz', cargo: 'PERITO DE LA SECCION DOCUMENTOLOGIA E INFORMATICA', sectionId: 'sec-1', sectionName: 'Balística Forense', sectionIds: ['sec-1'], sectionNames: ['BALÍSTICA'], username: 'GARCIACHOQUE@gmail.com', password: '6087530', phone: '6087530', badgeNumber: '5076', active: true, createdAt: '2026-01-01T08:00:00Z' },
  { id: 'usr-vargas', name: 'SGTO. CRISTHIAN MATEO VARGAS LLANQUE', grado: 'SGTO.', paternalLastName: 'VARGAS', maternalLastName: 'LLANQUE', firstName: 'CRISTHIAN', secondName: 'MATEO', ci: '10682350', gender: 'M', email: 'VARGASLLANQUE@gmail.com', escalafon: '5077', role: 'PERITO', officeId: 'off-1', officeName: 'Central Santa Cruz', cargo: 'PERITO DE LA SECCION CRIMINALISTICA DE CAMPO E INFORMATICA', sectionId: 'sec-4', sectionName: 'Informática y Telecomunicaciones Forenses', sectionIds: ['sec-4'], sectionNames: ['INFORMÁTICA'], username: 'VARGASLLANQUE@gmail.com', password: '10682350', phone: '10682350', badgeNumber: '5077', active: true, createdAt: '2026-01-01T08:00:00Z' },
  { id: 'usr-antezana', name: 'MY. SERV. ASTRID FABIANA ANTEZANA VASQUEZ', grado: 'MY. SERV.', paternalLastName: 'ANTEZANA', maternalLastName: 'VASQUEZ', firstName: 'ASTRID', secondName: 'FABIANA', ci: '2463797', gender: 'F', email: 'ANTEZANAVASQUEZ@gmail.com', escalafon: '5078', role: 'PERITO', officeId: 'off-1', officeName: 'Central Santa Cruz', cargo: 'PERITO DE LA SECCION PSICOLOGIA', sectionId: 'sec-2', sectionName: 'Documentología y Grafotecnia', sectionIds: ['sec-2'], sectionNames: ['DOCUMENTOLOGÍA'], username: 'ANTEZANAVASQUEZ@gmail.com', password: '2463797', phone: '2463797', badgeNumber: '5078', active: true, createdAt: '2026-01-01T08:00:00Z' },
  { id: 'usr-rec', name: 'SGTO. 1RO. GLADYS ROMERO MAMANI', grado: 'SGTO. 1RO.', paternalLastName: 'ROMERO', maternalLastName: 'MAMANI', firstName: 'GLADYS', secondName: '', ci: '8320443', gender: 'F', email: 'ROMEROMAMANI@gmail.com', escalafon: '5073', role: 'RECEPCION', officeId: 'off-1', officeName: 'Central Santa Cruz', cargo: 'AUXILIAR PERITO DE LA SECCION INFORMATICA', sectionId: 'sec-1', sectionName: 'Balística Forense', sectionIds: ['sec-1'], sectionNames: ['BALÍSTICA'], username: 'ROMEROMAMANI@gmail.com', password: '8320443', phone: '8320443', badgeNumber: '5073', active: true, createdAt: '2026-01-01T08:00:00Z' },
  { id: 'usr-sala', name: 'SGTO. 1RO. MONICA MACEDA ANTEZANA', grado: 'SGTO. 1RO.', paternalLastName: 'MACEDA', maternalLastName: 'ANTEZANA', firstName: 'MONICA', secondName: '', ci: '9011600', gender: 'F', email: 'MACEDAANTEZANA@gmail.com', escalafon: '5072', role: 'SALA_EVIDENCIAS', officeId: 'off-1', officeName: 'Central Santa Cruz', cargo: 'ENROLADOR DEL SIIC DIPROVE', sectionId: 'sec-2', sectionName: 'Documentología y Grafotecnia', sectionIds: ['sec-2'], sectionNames: ['DOCUMENTOLOGÍA'], username: 'MACEDAANTEZANA@gmail.com', password: '9011600', phone: '9011600', badgeNumber: '5072', active: true, createdAt: '2026-01-01T08:00:00Z' },
  { id: 'usr-cortez', name: 'TTE. ALVARO YURI CORTEZ ANIBARRO', grado: 'TTE.', paternalLastName: 'CORTEZ', maternalLastName: 'ANIBARRO', firstName: 'ALVARO', secondName: 'YURI', ci: '10933967', gender: 'M', email: 'CORTEZANIBARRO@gmail.com', escalafon: '5054', role: 'TECNICO', officeId: 'off-1', officeName: 'Central Santa Cruz', cargo: 'AUX. DE PERITO DE LA SECCION INFORMATICA', sectionId: 'sec-4', sectionName: 'Informática y Telecomunicaciones Forenses', sectionIds: ['sec-4'], sectionNames: ['INFORMÁTICA'], technicalAreas: ['INFORMÁTICA'], username: 'CORTEZANIBARRO@gmail.com', password: '10933967', phone: '10933967', badgeNumber: '5054', active: true, createdAt: '2026-01-01T08:00:00Z' },
  { id: 'usr-nava', name: 'SOF. 2DO. JUAN JOSE EDGAR NAVA ANTORIANO', grado: 'SOF. 2DO.', paternalLastName: 'NAVA', maternalLastName: 'ANTORIANO', firstName: 'JUAN JOSE', secondName: 'EDGAR', ci: '3590541', gender: 'M', email: 'NAVAANTORIANO@gmail.com', escalafon: '5060', role: 'TECNICO', officeId: 'off-1', officeName: 'Central Santa Cruz', cargo: 'AUXILIAR PERITO DE LA SECCION INFORMATICA', sectionId: 'sec-4', sectionName: 'Informática y Telecomunicaciones Forenses', sectionIds: ['sec-4'], sectionNames: ['INFORMÁTICA'], technicalAreas: ['INFORMÁTICA'], username: 'NAVAANTORIANO@gmail.com', password: '3590541', phone: '3590541', badgeNumber: '5060', active: true, createdAt: '2026-01-01T08:00:00Z' },
  { id: 'usr-poma', name: 'SOF. 2DO. ANGELA NADIR POMA', grado: 'SOF. 2DO.', paternalLastName: 'POMA', maternalLastName: '', firstName: 'ANGELA', secondName: 'NADIR', ci: '6751673', gender: 'F', email: 'POMA@gmail.com', escalafon: '5061', role: 'TECNICO', officeId: 'off-1', officeName: 'Central Santa Cruz', cargo: 'ENROLADOR DEL SIIC', sectionId: 'sec-4', sectionName: 'Informática y Telecomunicaciones Forenses', sectionIds: ['sec-4'], sectionNames: ['INFORMÁTICA'], technicalAreas: ['INFORMÁTICA'], username: 'POMA@gmail.com', password: '6751673', phone: '6751673', badgeNumber: '5061', active: true, createdAt: '2026-01-01T08:00:00Z' },
  { id: 'usr-tamayo', name: 'SOF. 2DO. RONAL TAMAYO ARENAS', grado: 'SOF. 2DO.', paternalLastName: 'TAMAYO', maternalLastName: 'ARENAS', firstName: 'RONAL', secondName: '', ci: '6073363', gender: 'M', email: 'TAMAYOARENAS@gmail.com', escalafon: '5062', role: 'TECNICO', officeId: 'off-1', officeName: 'Central Santa Cruz', cargo: 'AUXILIAR PERITO DE LA SECCION INFORMATICA', sectionId: 'sec-4', sectionName: 'Informática y Telecomunicaciones Forenses', sectionIds: ['sec-4'], sectionNames: ['INFORMÁTICA'], technicalAreas: ['INFORMÁTICA'], username: 'TAMAYOARENAS@gmail.com', password: '6073363', phone: '6073363', badgeNumber: '5062', active: true, createdAt: '2026-01-01T08:00:00Z' },
  { id: 'usr-escalera', name: 'SGTO. 1RO. ALEYDA ESCALERA CASILLA', grado: 'SGTO. 1RO.', paternalLastName: 'ESCALERA', maternalLastName: 'CASILLA', firstName: 'ALEYDA', secondName: '', ci: '8813264', gender: 'F', email: 'ESCALERACASILLA@gmail.com', escalafon: '5070', role: 'TECNICO', officeId: 'off-1', officeName: 'Central Santa Cruz', cargo: 'ENROLADOR DEL SIIC FELCC', sectionId: 'sec-4', sectionName: 'Informática y Telecomunicaciones Forenses', sectionIds: ['sec-4'], sectionNames: ['INFORMÁTICA'], technicalAreas: ['INFORMÁTICA'], username: 'ESCALERACASILLA@gmail.com', password: '8813264', phone: '8813264', badgeNumber: '5070', active: true, createdAt: '2026-01-01T08:00:00Z' }
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
  const currentUsers = getStored<User[]>(DB_KEYS.USERS, []);
  if (!localStorage.getItem(DB_KEYS.USERS) || currentUsers.length < 29 || !currentUsers.some(u => u.ci === '6439119')) {
    setStored(DB_KEYS.USERS, DEFAULT_USERS);
  }
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
        userId: 'usr-enc-area',
        title: 'Nuevo Informe en Espera de Revisión Técnica',
        message: 'Se cargó el Dictamen Pericial RUP SCZ-7-000001 (Balística Forense). Requiere evaluación técnica de área.',
        requirementId: 'req-101',
        rup: 'SCZ-7-000001',
        createdAt: '2026-08-08T10:00:00Z',
        status: 'Pendiente',
        type: 'INFORME_LISTO'
      },
      {
        id: 'notif-2',
        userId: 'usr-ctrl-calidad',
        title: 'Nuevo Informe para Control de Calidad',
        message: 'El RUP SCZ-7-000002 ha sido APROBADO TÉCNICAMENTE. Requiere revisión de aspectos de forma y estructura.',
        requirementId: 'req-102',
        rup: 'SCZ-7-000002',
        createdAt: '2026-08-09T14:30:00Z',
        status: 'Pendiente',
        type: 'INFORME_LISTO'
      }
    ];
    setStored(DB_KEYS.NOTIFICATIONS, initialNotifs);
  }

  // Seed initial reports & reviews
  if (!localStorage.getItem(DB_KEYS.REPORTS)) {
    const initialReports: ReportUpload[] = [
      {
        id: 'rep-101',
        requirementId: 'req-101',
        rup: 'SCZ-7-000001',
        uploadDateTime: '2026-08-08T09:30:00Z',
        uploadedBy: 'TTE. JHONNY DORIAM HUANCA GUTIERREZ',
        uploadedById: 'usr-huanca-j',
        reportType: 'DICTAMEN_PERICIAL',
        documentNumber: 'DICTAMEN-IITCUP-SCZ-101/2026',
        summary: 'Estudio balístico comparativo concluido. Se determinó coincidencia en huellas de percusión y rayado helicoidal entre la pistola Taurus y las 3 vainas servidas.',
        attachments: [{ id: 'att-rep-1', name: 'Dictamen_Balistico_SCZ_101.pdf', size: 1850000, type: 'application/pdf', uploadedAt: '2026-08-08T09:30:00Z' }],
        currentReviewStage: 'PENDIENTE_REVISION_TECNICA'
      },
      {
        id: 'rep-102',
        requirementId: 'req-102',
        rup: 'SCZ-7-000002',
        uploadDateTime: '2026-08-09T11:15:00Z',
        uploadedBy: 'TTE. VLADIMIR AJLLAHUANCA CHURA',
        uploadedById: 'usr-ajllahuanca',
        reportType: 'INFORME_TECNICO',
        documentNumber: 'INFORME-IITCUP-SCZ-202/2026',
        summary: 'Extracción de datos móviles realizada con éxito utilizando UFED Cellebrite. Se adjunta reporte de 852 chats de WhatsApp y registro de llamadas.',
        attachments: [{ id: 'att-rep-2', name: 'Informe_UFED_Chats_SCZ_202.pdf', size: 3400000, type: 'application/pdf', uploadedAt: '2026-08-09T11:15:00Z' }],
        currentReviewStage: 'PENDIENTE_CONTROL_CALIDAD',
        technicalReviews: [
          {
            id: 'trev-1',
            reportId: 'rep-102',
            requirementId: 'req-102',
            rup: 'SCZ-7-000002',
            reviewedAt: '2026-08-09T14:30:00Z',
            reviewerId: 'usr-enc-area',
            reviewerName: 'CAP. MAURICIO PEREZ VARGAS',
            reviewerGrado: 'CAP.',
            status: 'APROBADO_TECNICO',
            metodologiaScore: 5,
            puntosPericiaAbsolvidos: true,
            instrumentalValido: true,
            conclusionesFundamentadas: true,
            observations: 'La metodología de extracción física y lógica aplicada con UFED Cellebrite es conforme a los estándares técnicos internacionales de informática forense.'
          }
        ]
      }
    ];
    setStored(DB_KEYS.REPORTS, initialReports);

    // Synchronize initial requirements statuses accordingly
    const reqs = getStored<Requirement[]>(DB_KEYS.REQUIREMENTS, []);
    const r1 = reqs.find(r => r.id === 'req-101');
    if (r1) r1.status = 'PENDIENTE_REVISION_TECNICA';
    const r2 = reqs.find(r => r.id === 'req-102');
    if (r2) r2.status = 'PENDIENTE_CONTROL_CALIDAD';
    setStored(DB_KEYS.REQUIREMENTS, reqs);
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
  const currentAudits = getStored<AuditLog[]>(DB_KEYS.AUDIT_LOGS, []);
  if (!localStorage.getItem(DB_KEYS.AUDIT_LOGS) || currentAudits.length < 5) {
    const initialAudits: AuditLog[] = [
      {
        id: 'aud-10',
        userId: 'usr-1',
        userName: 'CAP. JUAN ROJAS CAMACHO',
        userRole: 'ADMIN',
        dateTime: '2026-08-10T07:15:00Z',
        ip: '192.168.1.100 (Central SCZ)',
        action: 'INICIO_SESION',
        module: 'Autenticación',
        previousState: 'Desconectado',
        newState: 'Inicio de sesión exitoso con rol ADMINISTRADOR'
      },
      {
        id: 'aud-9',
        userId: 'usr-1',
        userName: 'CAP. JUAN ROJAS CAMACHO',
        userRole: 'ADMIN',
        dateTime: '2026-08-10T07:10:00Z',
        ip: '192.168.1.100 (Central SCZ)',
        action: 'MODIFICACION_ESTADO_USUARIO',
        module: 'Gestión de Usuarios',
        previousState: 'HABILITADO',
        newState: 'Se actualizó la configuración del personal policial'
      },
      {
        id: 'aud-8',
        userId: 'usr-2',
        userName: 'MY. CARLOS EDUARDO CALVO MORALES',
        userRole: 'ENCARGADO_SERVICIOS',
        dateTime: '2026-08-09T16:45:00Z',
        ip: '192.168.1.102',
        action: 'ASIGNACION_PERITO',
        module: 'Servicios Periciales',
        previousState: 'EN_REVISION',
        newState: 'Asignado a TTE. VLADIMIR AJLLAHUANCA CHURA (Informática Forense)'
      },
      {
        id: 'aud-7',
        userId: 'usr-3',
        userName: 'MY. NESTOR HERNAN MILLARES CARDENAS',
        userRole: 'PERITO',
        dateTime: '2026-08-08T14:20:00Z',
        ip: '192.168.1.115',
        action: 'SUBIDA_INFORME',
        module: 'Mis Casos / Informes',
        previousState: 'EN_PROCESO',
        newState: 'Carga de Dictamen Pericial N° 088/2026 para RUP SCZ-7-000003'
      },
      {
        id: 'aud-6',
        userId: 'usr-4',
        userName: 'TTE. VLADIMIR AJLLAHUANCA CHURA',
        userRole: 'PERITO',
        dateTime: '2026-08-08T11:00:00Z',
        ip: '192.168.1.120',
        action: 'INICIO_PERITAJE',
        module: 'Mis Casos',
        previousState: 'ASIGNADO',
        newState: 'Iniciado estudio técnico pericial en RUP SCZ-7-000002'
      },
      {
        id: 'aud-5',
        userId: 'usr-sala',
        userName: 'SGTO. 1RO. MONICA MACEDA ANTEZANA',
        userRole: 'SALA_EVIDENCIAS',
        dateTime: '2026-08-07T15:30:00Z',
        ip: '192.168.1.55',
        action: 'REGISTRO_EVIDENCIA',
        module: 'Sala de Evidencias',
        previousState: 'PENDIENTE_INGRESO',
        newState: 'Evidencia ingresada en Custodia - Casillero B-04'
      },
      {
        id: 'aud-4',
        userId: 'usr-rec',
        userName: 'SGTO. 1RO. GLADYS ROMERO MAMANI',
        userRole: 'RECEPCION',
        dateTime: '2026-08-07T09:15:00Z',
        ip: '192.168.1.45',
        action: 'CREACION_REQUERIMIENTO',
        module: 'Recepción',
        previousState: 'NUEVO',
        newState: 'Requerimiento RUP SCZ-7-000002 registrado desde FELCC'
      },
      {
        id: 'aud-3',
        userId: 'usr-25',
        userName: 'TTE. ALVARO YURI CORTEZ ANIBARRO',
        userRole: 'TECNICO',
        dateTime: '2026-08-06T10:00:00Z',
        ip: '192.168.1.108',
        action: 'INICIO_SESION',
        module: 'Autenticación',
        previousState: 'Desconectado',
        newState: 'Inicio de sesión exitoso'
      },
      {
        id: 'aud-2',
        userId: 'usr-enc',
        userName: 'MY. CARLOS EDUARDO CALVO MORALES',
        userRole: 'ENCARGADO_SERVICIOS',
        dateTime: '2026-08-01T11:00:00Z',
        ip: '192.168.1.10',
        action: 'ASIGNACION_PERITO',
        module: 'Servicios Periciales',
        previousState: 'EN_REVISION',
        newState: 'ASIGNADO a SOF. 2DO. ORLANDO CAMACHO VIA'
      },
      {
        id: 'aud-1',
        userId: 'usr-rec',
        userName: 'SGTO. 1RO. GLADYS ROMERO MAMANI',
        userRole: 'RECEPCION',
        dateTime: '2026-08-01T09:30:00Z',
        ip: '192.168.1.45',
        action: 'CREACION_REQUERIMIENTO',
        module: 'Recepción',
        previousState: 'NUEVO',
        newState: 'RUP SCZ-7-000001 creado exitosamente.'
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
export const getTechnicalReviews = (): TechnicalReview[] => getStored(DB_KEYS.TECHNICAL_REVIEWS, []);
export const getQualityReviews = (): QualityReview[] => getStored(DB_KEYS.QUALITY_REVIEWS, []);
export const getAppointments = (): PsychologyAppointment[] => getStored(DB_KEYS.APPOINTMENTS, []);

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
