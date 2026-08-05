import { ServiceItem } from '../types';

export const INITIAL_FORENSIC_SERVICES: ServiceItem[] = [
  // BALÍSTICA
  { id: 'BA-HP', code: 'BA-HP', area: 'BALÍSTICA', name: 'Caracterización y Tipificacion de Heridas por Proyectiles de Arma de Fuego', type: 'SERVICIO PERICIAL', estimatedDays: 5, active: true },
  { id: 'BA-RP', code: 'BA-RP', area: 'BALÍSTICA', name: 'Comprobación de Resistencia en Probetas de Material Balístico y Blindaje', type: 'SERVICIO PERICIAL', estimatedDays: 5, active: true },
  { id: 'BA-CC', code: 'BA-CC', area: 'BALÍSTICA', name: 'Evaluación Mecánica y Control de Calidad de Armas de Fuego', type: 'SERVICIO PERICIAL', estimatedDays: 4, active: true },
  { id: 'BA-IV', code: 'BA-IV', area: 'BALÍSTICA', name: 'Inspección Técnica-Balística de Vehículos Blindados', type: 'SERVICIO PERICIAL', estimatedDays: 5, active: true },
  { id: 'BA-RB', code: 'BA-RB', area: 'BALÍSTICA', name: 'Reconstrucción de Hechos y Fenómenos Balísticos', type: 'SERVICIO PERICIAL', estimatedDays: 7, active: true },
  { id: 'BA-IB', code: 'BA-IB', area: 'BALÍSTICA', name: 'Tipificación e Identificación de Elementos Balísticos', type: 'SERVICIO PERICIAL', estimatedDays: 5, active: true },
  { id: 'BA-BE', code: 'BA-BE', area: 'BALÍSTICA', name: 'Validación de Blindaje en Equipo Unipersonal y Estructuras', type: 'SERVICIO PERICIAL', estimatedDays: 5, active: true },
  { id: 'BA-PB', code: 'BA-PB', area: 'BALÍSTICA', name: 'Procesamiento Balístico del Lugar del Hecho', type: 'SERVICIO PERICIAL', estimatedDays: 5, active: true },
  { id: 'BA-BV', code: 'BA-BV', area: 'BALÍSTICA', name: 'Validación de Blindaje Vehicular en Estructuras Nuevas', type: 'SERVICIO PERICIAL', estimatedDays: 5, active: true },
  { id: 'BA-MA', code: 'BA-MA', area: 'BALÍSTICA', name: 'Mantenimiento de Armas de Fuego', type: 'SERVICIO TÉCNICO', estimatedDays: 3, active: true },
  { id: 'BA-CB', code: 'BA-CB', area: 'BALÍSTICA', name: 'Certificación de Blindaje Vehicular en Estructuras Nuevas', type: 'SERVICIO ESPECIAL', estimatedDays: 5, active: true },
  { id: 'BA-AS', code: 'BA-AS', area: 'BALÍSTICA', name: 'Consultas Técnicas y Asesoramiento en Balística', type: 'SERVICIO ESPECIAL', estimatedDays: 2, active: true },

  // BIOLOGÍA
  { id: 'BO-IT', code: 'BO-IT', area: 'BIOLOGÍA', name: 'Caracterización e Identificación Taxonómica de Biodiversidad', type: 'SERVICIO PERICIAL', estimatedDays: 7, active: true },
  { id: 'BO-TB', code: 'BO-TB', area: 'BIOLOGÍA', name: 'Caracterización y Tipificación de Restos Biológicos', type: 'SERVICIO PERICIAL', estimatedDays: 7, active: true },
  { id: 'BO-CE', code: 'BO-CE', area: 'BIOLOGÍA', name: 'Valoración de Componentes Ecosistémicos', type: 'SERVICIO PERICIAL', estimatedDays: 7, active: true },
  { id: 'BO-AS', code: 'BO-AS', area: 'BIOLOGÍA', name: 'Consultas Técnicas y Asesoramiento en Biología', type: 'SERVICIO ESPECIAL', estimatedDays: 3, active: true },

  // CICVIAL
  { id: 'CV-DC', code: 'CV-DC', area: 'CICVIAL', name: 'Caracterización y Descripción de Diseño y Configuración Vial', type: 'SERVICIO PERICIAL', estimatedDays: 5, active: true },
  { id: 'CV-AT', code: 'CV-AT', area: 'CICVIAL', name: 'Reconstrucción de Accidentes de Tránsito', type: 'SERVICIO PERICIAL', estimatedDays: 7, active: true },
  { id: 'CV-DV', code: 'CV-DV', area: 'CICVIAL', name: 'Determinación de Daños en Vehículos', type: 'SERVICIO PERICIAL', estimatedDays: 5, active: true },
  { id: 'CV-OV', code: 'CV-OV', area: 'CICVIAL', name: 'Determinación de Obsolescencia Vehicular', type: 'SERVICIO PERICIAL', estimatedDays: 4, active: true },
  { id: 'CV-VA', code: 'CV-VA', area: 'CICVIAL', name: 'Inspección de Vehículos Adaptados y Especiales', type: 'SERVICIO PERICIAL', estimatedDays: 5, active: true },
  { id: 'CV-VV', code: 'CV-VV', area: 'CICVIAL', name: 'Tipificación de Vidrios Vehiculares', type: 'SERVICIO PERICIAL', estimatedDays: 3, active: true },
  { id: 'CV-VC', code: 'CV-VC', area: 'CICVIAL', name: 'Valoración Comercial Vehicular', type: 'SERVICIO PERICIAL', estimatedDays: 4, active: true },
  { id: 'CV-FH', code: 'CV-FH', area: 'CICVIAL', name: 'Valoración del Factor Humano Durante la Conducción Vehicular', type: 'SERVICIO PERICIAL', estimatedDays: 5, active: true },
  { id: 'CV-CD', code: 'CV-CD', area: 'CICVIAL', name: 'Determinación de Cambio de Diseño y Estructura Vehicular (Identificación Vehicular)', type: 'SERVICIO PERICIAL', estimatedDays: 5, active: true },
  { id: 'CV-EM', code: 'CV-EM', area: 'CICVIAL', name: 'Evaluación Mecánica Funcional Vehicular', type: 'SERVICIO TÉCNICO', estimatedDays: 3, active: true },
  { id: 'CV-VD', code: 'CV-VD', area: 'CICVIAL', name: 'Verificación de Datos Técnicos Vehiculares', type: 'SERVICIO TÉCNICO', estimatedDays: 3, active: true },
  { id: 'CV-AS', code: 'CV-AS', area: 'CICVIAL', name: 'Consultas Técnicas y Asesoramiento en Seguridad Vial', type: 'SERVICIO ESPECIAL', estimatedDays: 2, active: true },

  // GENÉTICA
  { id: 'CG-CG', code: 'CG-CG', area: 'GENÉTICA', name: 'Comparación Genética Identificativa de Elementos Biológicos', type: 'SERVICIO PERICIAL', estimatedDays: 10, active: true },
  { id: 'CG-DM', code: 'CG-DM', area: 'GENÉTICA', name: 'Detección Molecular de Microorganismos', type: 'SERVICIO PERICIAL', estimatedDays: 8, active: true },
  { id: 'CG-DT', code: 'CG-DT', area: 'GENÉTICA', name: 'Detección Molecular Orientativa de Trisomías', type: 'SERVICIO PERICIAL', estimatedDays: 8, active: true },
  { id: 'CG-DS', code: 'CG-DS', area: 'GENÉTICA', name: 'Detección y Tipificación de Cromosomas Sexuales Humanos', type: 'SERVICIO PERICIAL', estimatedDays: 8, active: true },
  { id: 'CG-PG', code: 'CG-PG', area: 'GENÉTICA', name: 'Determinación de Parentesco Genético', type: 'SERVICIO PERICIAL', estimatedDays: 10, active: true },
  { id: 'CG-IT', code: 'CG-IT', area: 'GENÉTICA', name: 'Identificación Taxonómica Molecular de Biodiversidad', type: 'SERVICIO PERICIAL', estimatedDays: 8, active: true },
  { id: 'CG-LA', code: 'CG-LA', area: 'GENÉTICA', name: 'Tipificación de Linaje Ancestral', type: 'SERVICIO PERICIAL', estimatedDays: 10, active: true },
  { id: 'CG-AA', code: 'CG-AA', area: 'GENÉTICA', name: 'Amplificación y Detección de Fragmentos de ADN por PCR', type: 'SERVICIO TÉCNICO', estimatedDays: 5, active: true },
  { id: 'CG-EC', code: 'CG-EC', area: 'GENÉTICA', name: 'Electroforesis Capilar de ADN Etiquetado', type: 'SERVICIO TÉCNICO', estimatedDays: 5, active: true },
  { id: 'CG-EA', code: 'CG-EA', area: 'GENÉTICA', name: 'Extracción y Purificación de Material Genético', type: 'SERVICIO TÉCNICO', estimatedDays: 4, active: true },
  { id: 'CG-SA', code: 'CG-SA', area: 'GENÉTICA', name: 'Secuenciación de Fragmentos de ADN', type: 'SERVICIO TÉCNICO', estimatedDays: 6, active: true },
  { id: 'CG-PI', code: 'CG-PI', area: 'GENÉTICA', name: 'Determinación del Perfil de Identidad Genética', type: 'SERVICIO TÉCNICO', estimatedDays: 5, active: true },
  { id: 'CG-AS', code: 'CG-AS', area: 'GENÉTICA', name: 'Asesoramiento en Genética Forense', type: 'SERVICIO ESPECIAL', estimatedDays: 3, active: true },

  // CRIMINALÍSTICA DE CAMPO
  { id: 'CC-TB', code: 'CC-TB', area: 'CRIMINALÍSTICA DE CAMPO', name: 'Rastreo y Caracterización de Trazas Biológicas In Situ', type: 'SERVICIO PERICIAL', estimatedDays: 5, active: true },
  { id: 'CC-FF', code: 'CC-FF', area: 'CRIMINALÍSTICA DE CAMPO', name: 'Fijación Fotográfica Forense', type: 'SERVICIO TÉCNICO', estimatedDays: 2, active: true },
  { id: 'CC-PL', code: 'CC-PL', area: 'CRIMINALÍSTICA DE CAMPO', name: 'Procesamiento Criminalístico del Lugar del Hecho', type: 'SERVICIO TÉCNICO', estimatedDays: 4, active: true },
  { id: 'CC-AS', code: 'CC-AS', area: 'CRIMINALÍSTICA DE CAMPO', name: 'Asesoramiento Durante el Procesamiento del Lugar del Hecho', type: 'SERVICIO ESPECIAL', estimatedDays: 2, active: true },

  // DOCUMENTOLOGÍA
  { id: 'DC-AI', code: 'DC-AI', area: 'DOCUMENTOLOGÍA', name: 'Correspondencia y Autenticación de Sistemas de Impresión', type: 'SERVICIO PERICIAL', estimatedDays: 5, active: true },
  { id: 'DC-AD', code: 'DC-AD', area: 'DOCUMENTOLOGÍA', name: 'Detección de Alteraciones en Documentos', type: 'SERVICIO PERICIAL', estimatedDays: 5, active: true },
  { id: 'DC-DA', code: 'DC-DA', area: 'DOCUMENTOLOGÍA', name: 'Detección de Anteposiciones en Contenidos Escriturales e Impresiones', type: 'SERVICIO PERICIAL', estimatedDays: 6, active: true },
  { id: 'DC-SH', code: 'DC-SH', area: 'DOCUMENTOLOGÍA', name: 'Autenticidad y Correspondencia de Sellos y Timbres', type: 'SERVICIO PERICIAL', estimatedDays: 5, active: true },
  { id: 'DC-ID', code: 'DC-ID', area: 'DOCUMENTOLOGÍA', name: 'Correspondencia y Autenticación (Identificación) de Firmas, Rúbricas y Manuscritos', type: 'SERVICIO PERICIAL', estimatedDays: 7, active: true },
  { id: 'DC-AS', code: 'DC-AS', area: 'DOCUMENTOLOGÍA', name: 'Consultas Técnicas y Asesoramiento en Documentología', type: 'SERVICIO ESPECIAL', estimatedDays: 2, active: true },

  // IDENTIFICACIÓN HUELLOGRAFÍA
  { id: 'IH-CN', code: 'IH-CN', area: 'IDENTIFICACIÓN HUELLOGRAFÍA', name: 'Identificación de Huellas de Calzados y Neumáticos', type: 'SERVICIO PERICIAL', estimatedDays: 5, active: true },
  { id: 'IH-HE', code: 'IH-HE', area: 'IDENTIFICACIÓN HUELLOGRAFÍA', name: 'Identificación de Huellas de Herramientas', type: 'SERVICIO PERICIAL', estimatedDays: 5, active: true },
  { id: 'IH-IN', code: 'IH-IN', area: 'IDENTIFICACIÓN HUELLOGRAFÍA', name: 'Identificación Necropapiloscópica', type: 'SERVICIO PERICIAL', estimatedDays: 4, active: true },
  { id: 'IH-IP', code: 'IH-IP', area: 'IDENTIFICACIÓN HUELLOGRAFÍA', name: 'Identificación Papiloscópica', type: 'SERVICIO PERICIAL', estimatedDays: 5, active: true },
  { id: 'IH-PL', code: 'IH-PL', area: 'IDENTIFICACIÓN HUELLOGRAFÍA', name: 'Procesamiento Huellográfico del Lugar del Hecho', type: 'SERVICIO PERICIAL', estimatedDays: 5, active: true },
  { id: 'IH-AS', code: 'IH-AS', area: 'IDENTIFICACIÓN HUELLOGRAFÍA', name: 'Consultas Técnicas y Asesoramiento en Huellografía', type: 'SERVICIO ESPECIAL', estimatedDays: 2, active: true },

  // INFORMÁTICA
  { id: 'IF-AD', code: 'IF-AD', area: 'INFORMÁTICA', name: 'Determinación de Origen y Autenticación de Datos', type: 'SERVICIO PERICIAL', estimatedDays: 6, active: true },
  { id: 'IF-GM', code: 'IF-GM', area: 'INFORMÁTICA', name: 'Reconstrucción de Ruta por Geolocalización de Dispositivos Móviles', type: 'SERVICIO PERICIAL', estimatedDays: 5, active: true },
  { id: 'IF-EI', code: 'IF-EI', area: 'INFORMÁTICA', name: 'Búsqueda y Extracción de Información Digital', type: 'SERVICIO TÉCNICO', estimatedDays: 4, active: true },
  { id: 'IF-RI', code: 'IF-RI', area: 'INFORMÁTICA', name: 'Recuperación de Información Digital', type: 'SERVICIO TÉCNICO', estimatedDays: 5, active: true },
  { id: 'IF-AS', code: 'IF-AS', area: 'INFORMÁTICA', name: 'Consultas Técnicas y Asesoramiento en Informática', type: 'SERVICIO ESPECIAL', estimatedDays: 2, active: true },

  // MEDICINA LEGAL
  { id: 'ML-EL', code: 'ML-EL', area: 'MEDICINA LEGAL', name: 'Evaluación de Lesiones', type: 'SERVICIO PERICIAL', estimatedDays: 4, active: true },
  { id: 'ML-MC', code: 'ML-MC', area: 'MEDICINA LEGAL', name: 'Análisis Médico Criminalístico', type: 'SERVICIO PERICIAL', estimatedDays: 5, active: true },
  { id: 'ML-LC', code: 'ML-LC', area: 'MEDICINA LEGAL', name: 'Intervención en Levantamiento de Cadáveres', type: 'SERVICIO PERICIAL', estimatedDays: 3, active: true },
  { id: 'ML-RP', code: 'ML-RP', area: 'MEDICINA LEGAL', name: 'Valoración en Casos de Responsabilidad Profesional Médica', type: 'SERVICIO PERICIAL', estimatedDays: 7, active: true },
  { id: 'ML-VD', code: 'ML-VD', area: 'MEDICINA LEGAL', name: 'Validación de Documentos Médico Forenses', type: 'SERVICIO PERICIAL', estimatedDays: 4, active: true },
  { id: 'ML-AS', code: 'ML-AS', area: 'MEDICINA LEGAL', name: 'Asesoramiento Médico Criminalístico', type: 'SERVICIO ESPECIAL', estimatedDays: 2, active: true },

  // PLANIMETRÍA Y DIBUJO
  { id: 'PD-PD', code: 'PD-PD', area: 'PLANIMETRÍA Y DIBUJO', name: 'Levantamiento Planimétrico Demostrativo', type: 'SERVICIO PERICIAL', estimatedDays: 5, active: true },
  { id: 'PD-RF', code: 'PD-RF', area: 'PLANIMETRÍA Y DIBUJO', name: 'Reconstrucción Gráfica Facial', type: 'SERVICIO PERICIAL', estimatedDays: 6, active: true },
  { id: 'PD-AR', code: 'PD-AR', area: 'PLANIMETRÍA Y DIBUJO', name: 'Evaluación de Estructura y Diseño Arquitectónico', type: 'SERVICIO PERICIAL', estimatedDays: 5, active: true },
  { id: 'PD-AV', code: 'PD-AV', area: 'PLANIMETRÍA Y DIBUJO', name: 'Reconstrucción o Animación Virtual del Hecho', type: 'SERVICIO TÉCNICO', estimatedDays: 6, active: true },
  { id: 'PD-PH', code: 'PD-PH', area: 'PLANIMETRÍA Y DIBUJO', name: 'Reconstrucción Gráfica Planimétrica del Hecho', type: 'SERVICIO TÉCNICO', estimatedDays: 5, active: true },
  { id: 'PD-FT', code: 'PD-FT', area: 'PLANIMETRÍA Y DIBUJO', name: 'Caracterización Somática Facial a Partir de Testimonios', type: 'SERVICIO TÉCNICO', estimatedDays: 4, active: true },
  { id: 'PD-AS', code: 'PD-AS', area: 'PLANIMETRÍA Y DIBUJO', name: 'Consultas Técnicas y Asesoramiento en Planimetría', type: 'SERVICIO ESPECIAL', estimatedDays: 2, active: true },

  // PSICOLOGÍA
  { id: 'PS-CA', code: 'PS-CA', area: 'PSICOLOGÍA', name: 'Determinación de Conductas Agresivas y/o Impulsivas', type: 'SERVICIO PERICIAL', estimatedDays: 7, active: true },
  { id: 'PS-DP', code: 'PS-DP', area: 'PSICOLOGÍA', name: 'Determinación de Daño Psicológico', type: 'SERVICIO PERICIAL', estimatedDays: 7, active: true },
  { id: 'PS-PS', code: 'PS-PS', area: 'PSICOLOGÍA', name: 'Determinación de Psicopatía', type: 'SERVICIO PERICIAL', estimatedDays: 7, active: true },
  { id: 'PS-RV', code: 'PS-RV', area: 'PSICOLOGÍA', name: 'Determinación de Riesgos de Violencia (Sexual, Conyugal, General)', type: 'SERVICIO PERICIAL', estimatedDays: 7, active: true },
  { id: 'PS-AP', code: 'PS-AP', area: 'PSICOLOGÍA', name: 'Determinación de Alienación Parental', type: 'SERVICIO PERICIAL', estimatedDays: 7, active: true },
  { id: 'PS-EM', code: 'PS-EM', area: 'PSICOLOGÍA', name: 'Determinación del Estado Mental', type: 'SERVICIO PERICIAL', estimatedDays: 7, active: true },
  { id: 'PS-PP', code: 'PS-PP', area: 'PSICOLOGÍA', name: 'Determinación del Perfil y/o Rasgos de Personalidad', type: 'SERVICIO PERICIAL', estimatedDays: 7, active: true },
  { id: 'PS-CT', code: 'PS-CT', area: 'PSICOLOGÍA', name: 'Determinación de la Credibilidad del Testimonio', type: 'SERVICIO PERICIAL', estimatedDays: 7, active: true },
  { id: 'PS-TP', code: 'PS-TP', area: 'PSICOLOGÍA', name: 'Identificación de Trastornos de Personalidad', type: 'SERVICIO PERICIAL', estimatedDays: 7, active: true },
  { id: 'PS-CS', code: 'PS-CS', area: 'PSICOLOGÍA', name: 'Identificación de Trastornos por Consumo de Sustancias y Adicciones', type: 'SERVICIO PERICIAL', estimatedDays: 7, active: true },
  { id: 'PS-TS', code: 'PS-TS', area: 'PSICOLOGÍA', name: 'Identificación de Trastornos Sexuales y/o Parafilias', type: 'SERVICIO PERICIAL', estimatedDays: 7, active: true },
  { id: 'PS-PM', code: 'PS-PM', area: 'PSICOLOGÍA', name: 'Retrospección del Perfil de Personalidad en Muertes Dudosas (Autopsia Psicológica)', type: 'SERVICIO PERICIAL', estimatedDays: 10, active: true },
  { id: 'PS-VP', code: 'PS-VP', area: 'PSICOLOGÍA', name: 'Evaluación Psicológica', type: 'SERVICIO TÉCNICO', estimatedDays: 4, active: true },
  { id: 'PS-CE', code: 'PS-CE', area: 'PSICOLOGÍA', name: 'Contención Psicológica Emocional', type: 'SERVICIO ESPECIAL', estimatedDays: 3, active: true },

  // QUÍMICA
  { id: 'QM-FT', code: 'QM-FT', area: 'QUÍMICA', name: 'Caracterización Cualitativa y Cuantitativa de Fibras Textiles', type: 'SERVICIO PERICIAL', estimatedDays: 5, active: true },
  { id: 'QM-RP', code: 'QM-RP', area: 'QUÍMICA', name: 'Detección de Residuos de Pólvora en Armas de Fuego y Prendas de Vestir', type: 'SERVICIO PERICIAL', estimatedDays: 4, active: true },
  { id: 'QM-TP', code: 'QM-TP', area: 'QUÍMICA', name: 'Comparación Química de Tintas y Pinturas', type: 'SERVICIO PERICIAL', estimatedDays: 5, active: true },
  { id: 'QM-SQ', code: 'QM-SQ', area: 'QUÍMICA', name: 'Identificación Química Forense de Sustancias Orgánicas e Inorgánicas', type: 'SERVICIO PERICIAL', estimatedDays: 6, active: true },
  { id: 'QM-RQ', code: 'QM-RQ', area: 'QUÍMICA', name: 'Restauración Química de Caracteres (Revenido Químico)', type: 'SERVICIO TÉCNICO', estimatedDays: 3, active: true },
  { id: 'QM-AS', code: 'QM-AS', area: 'QUÍMICA', name: 'Consultas Técnicas y Asesoramiento en Química Forense', type: 'SERVICIO ESPECIAL', estimatedDays: 2, active: true },

  // TOXICOLOGÍA
  { id: 'TX-DB', code: 'TX-DB', area: 'TOXICOLOGÍA', name: 'Detección de Metabolitos de Drogas y Medicamentos Controlados en Muestras Biológicas', type: 'SERVICIO PERICIAL', estimatedDays: 6, active: true },
  { id: 'TX-DV', code: 'TX-DV', area: 'TOXICOLOGÍA', name: 'Detección de Residuos de Drogas por Microaspirado', type: 'SERVICIO PERICIAL', estimatedDays: 5, active: true },
  { id: 'TX-VB', code: 'TX-VB', area: 'TOXICOLOGÍA', name: 'Detección de Sustancias Tóxicas y Venenosas en Muestras Biológicas', type: 'SERVICIO PERICIAL', estimatedDays: 6, active: true },
  { id: 'TX-TA', code: 'TX-TA', area: 'TOXICOLOGÍA', name: 'Determinación de Sustancias Tóxicas en Alimentos y Bebidas', type: 'SERVICIO PERICIAL', estimatedDays: 5, active: true },
  { id: 'TX-EM', code: 'TX-EM', area: 'TOXICOLOGÍA', name: 'Dosaje Etílico en Muestras Biológicas', type: 'SERVICIO PERICIAL', estimatedDays: 3, active: true },
  { id: 'TX-AS', code: 'TX-AS', area: 'TOXICOLOGÍA', name: 'Consultas Técnicas y Asesoramiento en Toxicología', type: 'SERVICIO ESPECIAL', estimatedDays: 2, active: true }
];
