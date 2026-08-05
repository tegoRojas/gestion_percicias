import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Requirement, EvidenceItem, CustodyLog, Proveido, ReportUpload } from '../types';

export const exportToExcel = (data: any[], filename: string, sheetName: string = 'Datos IITCUP') => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().slice(0, 10)}.xlsx`);
};

export const generateRequirementPDF = (
  req: Requirement,
  evidence?: EvidenceItem | EvidenceItem[],
  proveido?: Proveido,
  report?: ReportUpload,
  custodyLogs?: CustodyLog[]
) => {
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'letter'
  });

  const greenHeader = [0, 77, 37]; // #004d25 IITCUP Green
  const goldAccent = [217, 119, 6]; // #d97706
  const darkGray = [30, 41, 59];

  // Header Banner
  doc.setFillColor(greenHeader[0], greenHeader[1], greenHeader[2]);
  doc.rect(0, 0, 216, 28, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('POLICÍA BOLIVIANA - UNIVERSIDAD POLICIAL "MCAL. ANTONIO JOSÉ DE SUCRE"', 108, 9, { align: 'center' });
  doc.setFontSize(10.5);
  doc.text('INSTITUTO DE INVESTIGACIONES TÉCNICO CIENTÍFICAS (IITCUP)', 108, 15, { align: 'center' });
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.text('EXPEDIENTE DE TRAZABILIDAD PERICIAL Y FICHA OFICIAL DE CASO', 108, 22, { align: 'center' });

  // RUP Header Box
  doc.setFillColor(245, 247, 250);
  doc.setDrawColor(greenHeader[0], greenHeader[1], greenHeader[2]);
  doc.setLineWidth(0.8);
  doc.roundedRect(14, 32, 188, 16, 2, 2, 'FD');

  doc.setTextColor(greenHeader[0], greenHeader[1], greenHeader[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(`RUP: ${req.rup}`, 18, 42);

  doc.setFontSize(9.5);
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.text(`INGRESO: ${new Date(req.entryDateTime).toLocaleString('es-BO')}`, 105, 39);
  doc.setFont('helvetica', 'bold');
  doc.text(`ESTADO ACTUAL: ${req.status}`, 105, 44);

  let currentY = 52;

  // -------------------------------------------------------------
  // ETAPA 1: REGISTRO E INGRESO (MÓDULO DE RECEPCIÓN)
  // -------------------------------------------------------------
  autoTable(doc, {
    startY: currentY,
    head: [[{ content: 'ETAPA 1: DATOS DE RECEPCIÓN E INGRESO DEL REQUERIMIENTO', colSpan: 2, styles: { halign: 'left', fontStyle: 'bold', fillColor: greenHeader as any, textColor: [255, 255, 255], fontSize: 9 } }]],
    body: [
      ['Oficina Regional:', req.regionalOfficeName],
      ['Autoridad / Origen Solicitante:', req.origin],
      ['Código CUD / N° Causa / IANUS:', req.externalCode],
      ['Nombre Solicitante / Fiscal:', req.applicantName],
      ['Persona Interesada (quien deja):', req.interestedPersonName || 'No consignado'],
      ['Teléfono de Contacto:', req.interestedPersonPhone || 'No registrado'],
      ['Cantidad de Fojas:', `${req.fojaCount} fojas`],
      ['Tipo de Servicio:', req.serviceType],
      ['Sección Forense:', req.sectionName],
      ['Servicio Específico:', req.serviceName],
      ['Recepción Registrada por:', req.registeredBy],
      ['¿Registra Evidencia Física?:', req.hasEvidence ? 'SÍ (Ver Sección de Custodia)' : 'NO'],
      ['Documentos Adjuntos en Recepción:', req.attachments && req.attachments.length > 0 ? `${req.attachments.length} archivo(s) adjunto(s)` : 'Sin adjuntos iniciales']
    ],
    theme: 'grid',
    styles: { fontSize: 8.5, cellPadding: 2 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 65 } }
  });

  currentY = (doc as any).lastAutoTable.finalY + 4;

  // Puntos de Pericia Box
  doc.setFillColor(240, 243, 246);
  doc.rect(14, currentY, 188, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(greenHeader[0], greenHeader[1], greenHeader[2]);
  doc.text('PUNTOS DE PERICIA SOLICITADOS POR LA AUTORIDAD:', 18, currentY + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  const splitPoints = doc.splitTextToSize(req.puntosPericia || 'Sin puntos de pericia especificados.', 180);
  doc.text(splitPoints, 18, currentY + 11);

  currentY += 13 + splitPoints.length * 4;

  // -------------------------------------------------------------
  // ETAPA 2: SALA DE EVIDENCIAS Y CADENA DE CUSTODIA
  // -------------------------------------------------------------
  const evidenceList: EvidenceItem[] = Array.isArray(evidence)
    ? evidence
    : evidence ? [evidence] : [];

  const reqLogs = (custodyLogs || []).filter(l => 
    l.rup === req.rup || evidenceList.some(e => e.id === l.evidenceId)
  );

  if (currentY > 210) {
    doc.addPage();
    currentY = 20;
  }

  if (evidenceList.length > 0) {
    const evidenceRows = evidenceList.map((ev, idx) => [
      `Item #${idx + 1}`,
      ev.entryDateTime ? new Date(ev.entryDateTime).toLocaleString('es-BO') : 'N/A',
      ev.evidenceType,
      ev.packaging,
      ev.description,
      ev.status.replace(/_/g, ' '),
      ev.attachments && ev.attachments.length > 0 ? `${ev.attachments.length} archivo(s)` : 'Sin archivos'
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [
        [{ content: 'ETAPA 2: REGISTRO EN SALA DE EVIDENCIAS Y CADENA DE CUSTODIA', colSpan: 7, styles: { halign: 'left', fontStyle: 'bold', fillColor: [180, 83, 9], textColor: [255, 255, 255], fontSize: 9 } }],
        ['ITEM', 'FECHA / HORA REGISTRO', 'TIPO EVIDENCIA', 'EMBALAJE / PRECINTO', 'DESCRIPCIÓN TÉCNICA', 'ESTADO SALA', 'ADJUNTOS']
      ],
      body: evidenceRows,
      theme: 'grid',
      styles: { fontSize: 7.5, cellPadding: 2 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 16 },
        1: { cellWidth: 32 },
        2: { cellWidth: 25 },
        3: { cellWidth: 26 },
        5: { cellWidth: 28 }
      }
    });
    currentY = (doc as any).lastAutoTable.finalY + 4;

    // Sub-tabla de Historial de Cadena de Custodia
    if (reqLogs.length > 0) {
      if (currentY > 220) {
        doc.addPage();
        currentY = 20;
      }

      const logRows = reqLogs.map(l => {
        let actionFormatted: string = l.actionType;
        if (l.actionType === 'INGRESO_SALA') actionFormatted = 'INGRESO A SALA';
        else if (l.actionType === 'ENTREGA_A_PERITO') actionFormatted = 'ENTREGA A PERITO';
        else if (l.actionType === 'DEVOLUCION_DE_PERITO') actionFormatted = 'DEVOLUCIÓN A SALA';
        else if (l.actionType === 'SALIDA_FINAL') actionFormatted = 'SALIDA FINAL / DEVOLUCIÓN';

        const matchingEv = evidenceList.find(e => e.id === l.evidenceId);
        const deliveredPerson = (l.actionType === 'INGRESO_SALA' && matchingEv?.assigneeName)
          ? matchingEv.assigneeName
          : (l.deliveredBy || matchingEv?.assigneeName || 'Colector / Interesado');

        return [
          new Date(l.dateTime).toLocaleString('es-BO'),
          actionFormatted,
          deliveredPerson,
          l.receivedBy,
          l.motive
        ];
      });

      autoTable(doc, {
        startY: currentY,
        head: [
          [{ content: 'HISTORIAL DE TRAZABILIDAD Y MOVIMIENTOS DE CADENA DE CUSTODIA', colSpan: 5, styles: { halign: 'left', fontStyle: 'bold', fillColor: [120, 53, 15], textColor: [255, 255, 255], fontSize: 8.5 } }],
          ['FECHA / HORA MOVIMIENTO', 'ACCIÓN CUSTODIA', 'ENTREGADO POR', 'RECIBIDO POR', 'MOTIVO / DESTINO']
        ],
        body: logRows,
        theme: 'grid',
        styles: { fontSize: 7.5, cellPadding: 2 },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 35 },
          1: { cellWidth: 35 },
          2: { cellWidth: 35 },
          3: { cellWidth: 35 }
        }
      });
      currentY = (doc as any).lastAutoTable.finalY + 6;
    }
  } else {
    autoTable(doc, {
      startY: currentY,
      head: [[{ content: 'ETAPA 2: REGISTRO EN SALA DE EVIDENCIAS Y CADENA DE CUSTODIA', colSpan: 2, styles: { halign: 'left', fontStyle: 'bold', fillColor: [180, 83, 9], textColor: [255, 255, 255], fontSize: 9 } }]],
      body: [
        ['Registro de Evidencias:', req.hasEvidence ? 'Registrado con evidencia física en recepción. Pendiente de ingreso a sistema de Sala de Evidencias.' : 'Sin evidencias físicas registradas en Sala de Evidencias.']
      ],
      theme: 'grid',
      styles: { fontSize: 8.5, cellPadding: 2 },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 65 } }
    });
    currentY = (doc as any).lastAutoTable.finalY + 6;
  }

  // -------------------------------------------------------------
  // ETAPA 3: PROVEÍDO Y ASIGNACIÓN PERICIAL (ENCARGADO DE ÁREA)
  // -------------------------------------------------------------
  if (currentY > 220) {
    doc.addPage();
    currentY = 20;
  }

  if (proveido) {
    autoTable(doc, {
      startY: currentY,
      head: [[{ content: 'ETAPA 3: PROVEÍDO Y ASIGNACIÓN PERICIAL (ENCARGADO DE ÁREA)', colSpan: 2, styles: { halign: 'left', fontStyle: 'bold', fillColor: goldAccent as any, textColor: [255, 255, 255], fontSize: 9 } }]],
      body: [
        ['Fecha / Hora Proveído:', new Date(proveido.dateTime).toLocaleString('es-BO')],
        ['Dictamen / Decisión:', proveido.decision === 'ASIGNAR_PERITO' ? 'ASIGNACIÓN DE PERITO / TÉCNICO' : 'REPRESENTAR'],
        ['Perito Responsable Asignado:', proveido.assignedPeritoName || 'N/A'],
        ['Técnico Asignado:', proveido.assignedTecnicoName || 'N/A'],
        ['Análisis de Viabilidad Técnica-Legal:', proveido.legalViabilityNotes],
        ['Emitido y Registrado por:', proveido.registeredBy]
      ],
      theme: 'grid',
      styles: { fontSize: 8.5, cellPadding: 2 },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 65 } }
    });
    currentY = (doc as any).lastAutoTable.finalY + 6;
  } else {
    autoTable(doc, {
      startY: currentY,
      head: [[{ content: 'ETAPA 3: PROVEÍDO Y ASIGNACIÓN PERICIAL (ENCARGADO DE ÁREA)', colSpan: 2, styles: { halign: 'left', fontStyle: 'bold', fillColor: goldAccent as any, textColor: [255, 255, 255], fontSize: 9 } }]],
      body: [
        ['Estado Proveído:', 'Pendiente de proveído de asignación por el Encargado de Servicios Periciales.']
      ],
      theme: 'grid',
      styles: { fontSize: 8.5, cellPadding: 2 },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 65 } }
    });
    currentY = (doc as any).lastAutoTable.finalY + 6;
  }

  // -------------------------------------------------------------
  // ETAPA 4: DICTAMEN / INFORME EMITIDO (EL PERITO)
  // -------------------------------------------------------------
  if (currentY > 220) {
    doc.addPage();
    currentY = 20;
  }

  if (report) {
    autoTable(doc, {
      startY: currentY,
      head: [[{ content: 'ETAPA 4: INFORME / DICTAMEN PERICIAL EMITIDO (EL PERITO)', colSpan: 2, styles: { halign: 'left', fontStyle: 'bold', fillColor: [4, 120, 87] as any, textColor: [255, 255, 255], fontSize: 9 } }]],
      body: [
        ['Fecha / Hora de Emisión:', new Date(report.uploadDateTime).toLocaleString('es-BO')],
        ['Tipo de Documento:', report.reportType],
        ['N° Documento Oficial:', report.documentNumber],
        ['Resumen y Conclusiones Periciales:', report.summary],
        ['Perito Emisor / Subido por:', report.uploadedBy],
        ['Entrega a Autoridad Solicitante:', report.deliveryToAuthorityDate ? `Entregado el ${new Date(report.deliveryToAuthorityDate).toLocaleDateString('es-BO')} a ${report.authorityReceiverName || 'Autoridad'}` : 'Pendiente de entrega oficial a fiscalía/autoridad']
      ],
      theme: 'grid',
      styles: { fontSize: 8.5, cellPadding: 2 },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 65 } }
    });
    currentY = (doc as any).lastAutoTable.finalY + 6;
  } else {
    autoTable(doc, {
      startY: currentY,
      head: [[{ content: 'ETAPA 4: INFORME / DICTAMEN PERICIAL (EL PERITO)', colSpan: 2, styles: { halign: 'left', fontStyle: 'bold', fillColor: [4, 120, 87] as any, textColor: [255, 255, 255], fontSize: 9 } }]],
      body: [
        ['Estado Dictamen Pericial:', 'En ejecución pericial - Dictamen o Informe Técnico pendiente de emisión por el Perito Asignado.']
      ],
      theme: 'grid',
      styles: { fontSize: 8.5, cellPadding: 2 },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 65 } }
    });
    currentY = (doc as any).lastAutoTable.finalY + 6;
  }

  // -------------------------------------------------------------
  // FIRMAS DE VALIDACIÓN Y CONFORMIDAD (3 FIRMAS SOLICITADAS)
  // 1. Perito / Técnico | 2. Responsable de área | 3. Control de Calidad
  // -------------------------------------------------------------
  let sigY = currentY + 14;
  if (sigY > 225) {
    doc.addPage();
    sigY = 40;
  }

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, sigY - 4, 188, 38, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(greenHeader[0], greenHeader[1], greenHeader[2]);
  doc.text('FIRMAS Y VALIDEZ OFICIAL DE TRAZABILIDAD (IITCUP SANTA CRUZ)', 18, sigY + 1.5);

  const lineY = sigY + 22;
  doc.setLineWidth(0.4);
  doc.setDrawColor(71, 85, 105);

  // Firma 1: Perito / Técnico
  doc.line(18, lineY, 70, lineY);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('PERITO / TÉCNICO', 44, lineY + 4, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(report?.uploadedBy || proveido?.assignedPeritoName || proveido?.assignedTecnicoName || 'Perito / Técnico Asignado', 44, lineY + 8, { align: 'center' });
  doc.text('Firma y Sello Pericial', 44, lineY + 11.5, { align: 'center' });

  // Firma 2: Responsable de Área
  doc.line(78, lineY, 134, lineY);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('RESPONSABLE DE ÁREA', 106, lineY + 4, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(proveido?.registeredBy || `Encargado de Área (${req.sectionName})`, 106, lineY + 8, { align: 'center' });
  doc.text('Encargado de Servicios Periciales', 106, lineY + 11.5, { align: 'center' });

  // Firma 3: Control de Calidad
  doc.line(142, lineY, 198, lineY);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('CONTROL DE CALIDAD', 170, lineY + 4, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('Responsable Control de Calidad', 170, lineY + 8, { align: 'center' });
  doc.text('Dpto. Calidad e Inspección IITCUP', 170, lineY + 11.5, { align: 'center' });

  // Page numbering and footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Documento Oficial IITCUP Regional Santa Cruz - Ficha RUP: ${req.rup} | Página ${i} de ${pageCount} | Generado: ${new Date().toLocaleString('es-BO')}`,
      108,
      272,
      { align: 'center' }
    );
  }

  doc.save(`FICHA_TRAZABILIDAD_RUP_${req.rup}.pdf`);
};

export const generateCustodyPDF = (evidence: EvidenceItem, logs: CustodyLog[]) => {
  const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'letter' });
  const greenHeader = [0, 77, 37];

  // Header
  doc.setFillColor(greenHeader[0], greenHeader[1], greenHeader[2]);
  doc.rect(0, 0, 216, 26, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('ACTA OFICIAL DE CADENA DE CUSTODIA DE EVIDENCIAS', 108, 10, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('IITCUP REGIONAL SANTA CRUZ - SALA DE EVIDENCIAS Y CUSTODIA', 108, 17, { align: 'center' });

  // RUP Bar
  doc.setFillColor(240, 245, 240);
  doc.setDrawColor(greenHeader[0], greenHeader[1], greenHeader[2]);
  doc.roundedRect(14, 30, 188, 14, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(greenHeader[0], greenHeader[1], greenHeader[2]);
  doc.text(`RUP: ${evidence.rup}`, 20, 39);
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text(`TIPO EVIDENCIA: ${evidence.evidenceType}`, 100, 39);

  // Evidence metadata
  autoTable(doc, {
    startY: 48,
    head: [['DESCRIPCIÓN Y ESTADO DE LA EVIDENCIA INMUEBLE/MUEBLE', '']],
    body: [
      ['Embalaje / Precinto:', evidence.packaging],
      ['Descripción Detallada:', evidence.description],
      ['Interesado / Asignado:', evidence.assigneeName],
      ['Teléfono Contacto:', evidence.assigneePhone || 'N/A'],
      ['Acta de Colección Adjunta:', evidence.hasCollectionAct ? 'SÍ' : 'NO'],
      ['Acta Cadena de Custodia:', evidence.hasCustodyAct ? 'SÍ' : 'NO'],
      ['Estado en Sala:', evidence.status],
      ['Observaciones:', evidence.observations || 'Sin observaciones']
    ],
    theme: 'grid',
    headStyles: { fillColor: greenHeader as any, fontStyle: 'bold' },
    styles: { fontSize: 8.5, cellPadding: 2 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 60 } }
  });

  let currentY = (doc as any).lastAutoTable.finalY + 8;

  // Logs table
  const logRows = logs.map(l => [
    new Date(l.dateTime).toLocaleString('es-BO'),
    l.actionType,
    l.deliveredBy,
    l.receivedBy,
    l.motive
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['FECHA / HORA', 'ACCIÓN CUSTODIA', 'ENTREGADO POR', 'RECIBIDO POR', 'MOTIVO / DESTINO']],
    body: logRows.length > 0 ? logRows : [['--', 'Sin movimientos registrados', '--', '--', '--']],
    theme: 'striped',
    headStyles: { fillColor: [40, 50, 70], fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 2 }
  });

  doc.save(`ACTA_CADENA_CUSTODIA_${evidence.rup}.pdf`);
};

export const generateRequirementsListPDF = (reqs: Requirement[], title: string = 'REPORTE DE REQUERIMIENTOS IITCUP') => {
  const doc = new jsPDF({ orientation: 'l', unit: 'mm', format: 'letter' });
  const greenHeader = [0, 77, 37];

  doc.setFillColor(greenHeader[0], greenHeader[1], greenHeader[2]);
  doc.rect(0, 0, 279, 22, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(title, 140, 10, { align: 'center' });
  doc.setFontSize(9);
  doc.text(`Generado: ${new Date().toLocaleString('es-BO')} | IITCUP Regional Santa Cruz`, 140, 16, { align: 'center' });

  const rows = reqs.map(r => [
    r.rup,
    new Date(r.entryDateTime).toLocaleDateString('es-BO'),
    r.origin.slice(0, 25),
    r.applicantName.slice(0, 22),
    r.sectionName.slice(0, 20),
    r.serviceName.slice(0, 25),
    r.hasEvidence ? 'SÍ' : 'NO',
    r.status
  ]);

  autoTable(doc, {
    startY: 28,
    head: [['N° RUP', 'FECHA', 'ORIGEN', 'SOLICITANTE', 'SECCIÓN', 'SERVICIO', 'EVID.', 'ESTADO']],
    body: rows,
    theme: 'grid',
    headStyles: { fillColor: greenHeader as any, fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 2 }
  });

  doc.save(`REPORTE_IITCUP_${new Date().toISOString().slice(0, 10)}.pdf`);
};
