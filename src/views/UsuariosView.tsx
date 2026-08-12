import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { User, UserRole } from '../types';
import { Users, Plus, Shield, ShieldAlert, CheckCircle2, X, Layers, Search, Key, UserCheck, Ban, Lock, Unlock, History, Database, Copy, Check, Download, FileCode } from 'lucide-react';

export const UsuariosView: React.FC = () => {
  const { currentUser, users, offices, sections, services, addUser, updateUser, setActiveView, setSelectedUserLogId } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Derive official forensic areas directly from the official forensic services catalog
  const forensicAreasList = useMemo(() => {
    const catalogAreas = Array.from(
      new Set(services.filter(s => s.active !== false).map(s => (s.area || s.sectionName || '').trim()))
    ).filter(Boolean);

    const fallbackAreas = [
      'BALÍSTICA', 'BIOLOGÍA', 'CICVIAL', 'GENÉTICA', 'CRIMINALÍSTICA DE CAMPO',
      'DOCUMENTOLOGÍA', 'IDENTIFICACIÓN HUELLOGRAFÍA', 'INFORMÁTICA',
      'MEDICINA LEGAL', 'PLANIMETRÍA Y DIBUJO', 'PSICOLOGÍA', 'QUÍMICA',
      'AUDIO Y VIDEO', 'AUDITORÍA FINANCIERA'
    ];

    const uniqueAreaNames = catalogAreas.length > 0 ? catalogAreas.sort() : fallbackAreas;

    return uniqueAreaNames.map(areaNameItem => {
      const areaName = String(areaNameItem);
      const matchingSec = sections.find(
        sec => sec.name.toLowerCase().includes(areaName.toLowerCase()) || areaName.toLowerCase().includes(sec.name.toLowerCase())
      );

      return {
        id: matchingSec ? matchingSec.id : `area-${areaName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        name: areaName,
        code: matchingSec?.code || areaName.substring(0, 3).toUpperCase(),
        sectionId: matchingSec?.id
      };
    });
  }, [services, sections]);

  // Form State matching spreadsheet table fields
  const [grado, setGrado] = useState('SOF. 2DO.');
  const [paternalLastName, setPaternalLastName] = useState('');
  const [maternalLastName, setMaternalLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [ci, setCi] = useState('');
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [email, setEmail] = useState('');
  const [escalafon, setEscalafon] = useState('');
  const [role, setRole] = useState<UserRole>('PERITO');
  const [officeId, setOfficeId] = useState(offices[0]?.id || 'off-1');
  const [cargo, setCargo] = useState('');
  const [selectedSectionIds, setSelectedSectionIds] = useState<string[]>([]);
  const [easTecnicas, setEasTecnicas] = useState<string[]>(['INFORMÁTICA']);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeStatus, setActiveStatus] = useState<boolean>(true);

  // Strict Protection: Only ADMIN can access or manage users
  if (currentUser.role !== 'ADMIN') {
    return (
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-red-200 dark:border-red-900 shadow-lg text-center space-y-4 max-w-xl mx-auto my-12">
        <div className="w-12 h-12 bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto border border-red-200 dark:border-red-800">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Acceso Restringido - Solo Administrador</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Únicamente los usuarios con rol de <strong className="text-amber-600 dark:text-amber-400 font-bold">ADMINISTRADOR</strong> tienen la autorización para gestionar el personal, crear cuentas de usuario y asignar o modificar roles del sistema.
          </p>
        </div>
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-300 font-mono">
          Usuario Actual: {currentUser.name} ({currentUser.role})
        </div>
      </div>
    );
  }

  const handleOpenAdd = () => {
    setEditingUser(null);
    setGrado('SGTO. 1RO.');
    setPaternalLastName('');
    setMaternalLastName('');
    setFirstName('');
    setSecondName('');
    setCi('');
    setGender('M');
    setEmail('');
    setEscalafon('');
    setRole('PERITO');
    setOfficeId(offices[0]?.id || 'off-1');
    setCargo('PERITO FORENSE');
    setEasTecnicas(['INFORMÁTICA']);
    setUsername('');
    setPassword('123456');
    setActiveStatus(true);

    const defaultAreaId = forensicAreasList[0]?.id || sections[0]?.id || 'sec-1';
    setSelectedSectionIds([defaultAreaId]);
    setShowModal(true);
  };

  const handleOpenEdit = (u: User) => {
    setEditingUser(u);
    setGrado(u.grado || 'SGTO.');
    setPaternalLastName(u.paternalLastName || u.name.split(' ')[1] || '');
    setMaternalLastName(u.maternalLastName || u.name.split(' ')[2] || '');
    setFirstName(u.firstName || u.name.split(' ')[0] || '');
    setSecondName(u.secondName || '');
    setCi(u.ci || u.badgeNumber || '');
    setGender((u.gender as 'M' | 'F') || 'M');
    setEmail(u.email || '');
    setEscalafon(u.escalafon || u.badgeNumber || '');
    setRole(u.role);
    setOfficeId(u.officeId || offices[0]?.id || 'off-1');
    setCargo(u.cargo || 'PERSONAL FORENSE');
    setUsername(u.username || u.email);
    setPassword(u.password || u.ci || '123456');
    setEasTecnicas(u.technicalAreas && u.technicalAreas.length > 0 ? u.technicalAreas : ['INFORMÁTICA']);
    setActiveStatus(u.active !== false);

    // Initialize multi-sections for Perito / Tecnico using official areas list
    if (u.sectionIds && u.sectionIds.length > 0) {
      const mappedIds = u.sectionIds.map(sId => {
        const match = forensicAreasList.find(
          a => a.id === sId || a.sectionId === sId || (u.sectionNames && u.sectionNames.some(sn => sn.toLowerCase().includes(a.name.toLowerCase()) || a.name.toLowerCase().includes(sn.toLowerCase())))
        );
        return match ? match.id : sId;
      });
      setSelectedSectionIds(mappedIds);
    } else if (u.sectionNames && u.sectionNames.length > 0) {
      const mappedIds = u.sectionNames.map(sn => {
        const match = forensicAreasList.find(a => a.name.toLowerCase().includes(sn.toLowerCase()) || sn.toLowerCase().includes(a.name.toLowerCase()));
        return match ? match.id : sn;
      });
      setSelectedSectionIds(mappedIds);
    } else if (u.sectionId) {
      const match = forensicAreasList.find(a => a.id === u.sectionId || a.sectionId === u.sectionId || (u.sectionName && a.name.toLowerCase().includes(u.sectionName.toLowerCase())));
      const resolvedId = match ? match.id : u.sectionId;
      setSelectedSectionIds([resolvedId]);
    } else {
      const defaultId = forensicAreasList[0]?.id || 'sec-1';
      setSelectedSectionIds([defaultId]);
    }

    setShowModal(true);
  };

  const handleToggleActive = (u: User) => {
    if (u.id === currentUser.id) {
      alert('⚠️ No puede deshabilitar su propia cuenta de Administrador con la que tiene sesión activa.');
      return;
    }

    const newStatus = u.active === false ? true : false;
    const actionText = newStatus ? 'HABILITAR' : 'DESHABILITAR';
    const confirmChange = window.confirm(
      `¿Está seguro de que desea ${actionText} la cuenta del usuario "${u.name}"?\n\n` +
      (newStatus
        ? 'El usuario habilitado podrá ingresar nuevamente al sistema.'
        : 'El usuario deshabilitado NO podrá ingresar al sistema.')
    );

    if (confirmChange) {
      updateUser({
        ...u,
        active: newStatus
      });
      alert(`✅ Usuario "${u.name}" ${newStatus ? 'HABILITADO' : 'DESHABILITADO'} exitosamente.`);
    }
  };

  const handleViewUserLogs = (u: User) => {
    setSelectedUserLogId(u.id);
    setActiveView('auditoria');
  };

  const handleToggleSection = (sId: string) => {
    if (selectedSectionIds.includes(sId)) {
      if (selectedSectionIds.length === 1) {
        alert('⚠️ Debe seleccionar al menos una Área Pericial.');
        return;
      }
      setSelectedSectionIds(selectedSectionIds.filter(id => id !== sId));
    } else {
      if (selectedSectionIds.length >= 3) {
        alert(`⚠️ Restricción Normativa: Un ${role === 'PERITO' ? 'Perito' : 'Técnico'} Forense puede tener asignadas como máximo hasta 3 Áreas Periciales.`);
        return;
      }
      setSelectedSectionIds([...selectedSectionIds, sId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const off = offices.find(o => o.id === officeId) || offices[0] || { id: 'off-1', name: 'Central Santa Cruz' };

    let finalSectionIds: string[] = [];
    let finalSectionNames: string[] = [];
    let primarySec = sections[0] || { id: 'sec-1', name: 'Balística Forense' };

    if (role === 'PERITO' || role === 'TECNICO') {
      if (selectedSectionIds.length === 0) {
        alert(`⚠️ Debe seleccionar al menos 1 área pericial.`);
        return;
      }
      finalSectionIds = selectedSectionIds;
      finalSectionNames = selectedSectionIds.map(id => {
        const area = forensicAreasList.find(a => a.id === id || a.sectionId === id);
        if (area) return area.name;
        const s = sections.find(sec => sec.id === id);
        return s ? s.name : id;
      }).filter(Boolean);

      const matchedArea = forensicAreasList.find(a => a.id === finalSectionIds[0] || a.sectionId === finalSectionIds[0]);
      const primarySecId = matchedArea?.sectionId || matchedArea?.id || finalSectionIds[0];
      primarySec = sections.find(s => s.id === primarySecId) || { id: primarySecId, name: finalSectionNames[0] || 'General' };
    } else {
      finalSectionIds = ['sec-1'];
      finalSectionNames = ['GENERAL'];
    }

    const calculatedFullName = `${grado ? grado + ' ' : ''}${firstName} ${secondName ? secondName + ' ' : ''}${paternalLastName} ${maternalLastName}`.trim();

    const userData: User = {
      id: editingUser ? editingUser.id : `usr-${Date.now()}`,
      grado,
      paternalLastName: paternalLastName.toUpperCase(),
      maternalLastName: maternalLastName.toUpperCase(),
      firstName: firstName.toUpperCase(),
      secondName: secondName.toUpperCase(),
      ci,
      gender,
      email: email || `${username}@gmail.com`,
      escalafon: escalafon || ci,
      role,
      officeId: off.id,
      officeName: off.name,
      cargo: cargo.toUpperCase(),
      sectionId: primarySec.id,
      sectionName: finalSectionNames.join(', '),
      sectionIds: finalSectionIds,
      sectionNames: finalSectionNames,
      technicalAreas: role === 'TECNICO' ? easTecnicas : [],
      name: calculatedFullName.toUpperCase(),
      username: username || email,
      password: password || ci,
      phone: ci,
      badgeNumber: escalafon || ci,
      active: activeStatus,
      createdAt: editingUser ? editingUser.createdAt : new Date().toISOString()
    };

    if (editingUser) {
      updateUser(userData);
      alert('✅ Usuario actualizado exitosamente.');
    } else {
      addUser(userData);
      alert('✅ Usuario registrado exitosamente.');
    }
    setShowModal(false);
  };

  // Filtered users list
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;
    const term = searchTerm.toLowerCase();
    return users.filter(u =>
      (u.name && u.name.toLowerCase().includes(term)) ||
      (u.ci && u.ci.toLowerCase().includes(term)) ||
      (u.email && u.email.toLowerCase().includes(term)) ||
      (u.username && u.username.toLowerCase().includes(term)) ||
      (u.cargo && u.cargo.toLowerCase().includes(term)) ||
      (u.role && u.role.toLowerCase().includes(term)) ||
      (u.escalafon && u.escalafon.toLowerCase().includes(term))
    );
  }, [users, searchTerm]);

  // Generate full Supabase SQL Script dynamically
  const generatedSqlScript = useMemo(() => {
    const escapeSql = (str: string | undefined | null) => {
      if (!str) return 'NULL';
      return `'${str.replace(/'/g, "''")}'`;
    };

    const escapeSqlArray = (arr: string[] | undefined | null) => {
      if (!arr || arr.length === 0) return 'ARRAY[]::TEXT[]';
      const items = arr.map(item => `'${item.replace(/'/g, "''")}'`).join(', ');
      return `ARRAY[${items}]::TEXT[]`;
    };

    let sql = `-- =============================================================================\n`;
    sql += `-- SCRIPT DE MIGRACIÓN DE USUARIOS POLICIALES IITCUP SANTA CRUZ PARA SUPABASE\n`;
    sql += `-- Base de Datos PostgreSQL / Supabase\n`;
    sql += `-- Generado: ${new Date().toLocaleString('es-BO')}\n`;
    sql += `-- Total Usuarios Exportados: ${users.length}\n`;
    sql += `-- =============================================================================\n\n`;

    sql += `-- 1. Habilitar extensión UUID si es necesaria\n`;
    sql += `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";\n\n`;

    sql += `-- 2. Crear Tabla 'usuarios' en la base de datos Supabase\n`;
    sql += `CREATE TABLE IF NOT EXISTS public.usuarios (\n`;
    sql += `    id VARCHAR(50) PRIMARY KEY,\n`;
    sql += `    grado VARCHAR(30),\n`;
    sql += `    paternal_last_name VARCHAR(100),\n`;
    sql += `    maternal_last_name VARCHAR(100),\n`;
    sql += `    first_name VARCHAR(100),\n`;
    sql += `    second_name VARCHAR(100),\n`;
    sql += `    full_name VARCHAR(255) NOT NULL,\n`;
    sql += `    ci VARCHAR(30) UNIQUE,\n`;
    sql += `    gender VARCHAR(10),\n`;
    sql += `    email VARCHAR(150) UNIQUE NOT NULL,\n`;
    sql += `    escalafon VARCHAR(50),\n`;
    sql += `    role VARCHAR(50) NOT NULL,\n`;
    sql += `    office_id VARCHAR(50) NOT NULL,\n`;
    sql += `    office_name VARCHAR(150),\n`;
    sql += `    cargo TEXT,\n`;
    sql += `    section_id VARCHAR(50),\n`;
    sql += `    section_name VARCHAR(150),\n`;
    sql += `    section_ids TEXT[],\n`;
    sql += `    section_names TEXT[],\n`;
    sql += `    technical_areas TEXT[],\n`;
    sql += `    username VARCHAR(150) UNIQUE NOT NULL,\n`;
    sql += `    password VARCHAR(255) NOT NULL,\n`;
    sql += `    phone VARCHAR(50),\n`;
    sql += `    badge_number VARCHAR(50),\n`;
    sql += `    active BOOLEAN DEFAULT TRUE NOT NULL,\n`;
    sql += `    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL\n`;
    sql += `);\n\n`;

    sql += `-- 3. Crear Índices de Alto Rendimiento en Supabase\n`;
    sql += `CREATE INDEX IF NOT EXISTS idx_usuarios_ci ON public.usuarios(ci);\n`;
    sql += `CREATE INDEX IF NOT EXISTS idx_usuarios_email ON public.usuarios(email);\n`;
    sql += `CREATE INDEX IF NOT EXISTS idx_usuarios_username ON public.usuarios(username);\n`;
    sql += `CREATE INDEX IF NOT EXISTS idx_usuarios_role ON public.usuarios(role);\n`;
    sql += `CREATE INDEX IF NOT EXISTS idx_usuarios_active ON public.usuarios(active);\n\n`;

    sql += `-- 4. Inserción de Usuarios Registrados (UPSERT - ON CONFLICT)\n`;
    sql += `INSERT INTO public.usuarios (\n`;
    sql += `    id, grado, paternal_last_name, maternal_last_name, first_name, second_name, full_name, ci, gender, email, escalafon, role, office_id, office_name, cargo, section_id, section_name, section_ids, section_names, technical_areas, username, password, phone, badge_number, active, created_at\n`;
    sql += `) VALUES\n`;

    const valuesSql = users.map(u => {
      return `(\n` +
        `  ${escapeSql(u.id)},\n` +
        `  ${escapeSql(u.grado)},\n` +
        `  ${escapeSql(u.paternalLastName)},\n` +
        `  ${escapeSql(u.maternalLastName)},\n` +
        `  ${escapeSql(u.firstName)},\n` +
        `  ${escapeSql(u.secondName)},\n` +
        `  ${escapeSql(u.name)},\n` +
        `  ${escapeSql(u.ci)},\n` +
        `  ${escapeSql(u.gender)},\n` +
        `  ${escapeSql(u.email)},\n` +
        `  ${escapeSql(u.escalafon)},\n` +
        `  ${escapeSql(u.role)},\n` +
        `  ${escapeSql(u.officeId)},\n` +
        `  ${escapeSql(u.officeName)},\n` +
        `  ${escapeSql(u.cargo)},\n` +
        `  ${escapeSql(u.sectionId)},\n` +
        `  ${escapeSql(u.sectionName)},\n` +
        `  ${escapeSqlArray(u.sectionIds)},\n` +
        `  ${escapeSqlArray(u.sectionNames)},\n` +
        `  ${escapeSqlArray(u.technicalAreas)},\n` +
        `  ${escapeSql(u.username)},\n` +
        `  ${escapeSql(u.password || u.ci || '123456')},\n` +
        `  ${escapeSql(u.phone)},\n` +
        `  ${escapeSql(u.badgeNumber)},\n` +
        `  ${u.active !== false ? 'TRUE' : 'FALSE'},\n` +
        `  ${escapeSql(u.createdAt || new Date().toISOString())}\n` +
        `)`;
    }).join(',\n');

    sql += valuesSql + `\nON CONFLICT (id) DO UPDATE SET\n`;
    sql += `    full_name = EXCLUDED.full_name,\n`;
    sql += `    ci = EXCLUDED.ci,\n`;
    sql += `    email = EXCLUDED.email,\n`;
    sql += `    role = EXCLUDED.role,\n`;
    sql += `    cargo = EXCLUDED.cargo,\n`;
    sql += `    section_ids = EXCLUDED.section_ids,\n`;
    sql += `    section_names = EXCLUDED.section_names,\n`;
    sql += `    technical_areas = EXCLUDED.technical_areas,\n`;
    sql += `    password = EXCLUDED.password,\n`;
    sql += `    active = EXCLUDED.active;\n\n`;

    sql += `-- Fin del Script de Migración Supabase\n`;
    return sql;
  }, [users]);

  const handleCopySql = () => {
    navigator.clipboard.writeText(generatedSqlScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleDownloadSql = () => {
    const blob = new Blob([generatedSqlScript], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `script_usuarios_supabase_${new Date().toISOString().slice(0, 10)}.sql`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Estructura Oficial de la Tabla de Usuarios
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Administración del personal policial, credenciales de acceso, escalafón, cargos y asignación de áreas periciales y técnicas
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowSqlModal(true)}
            className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-extrabold px-3.5 py-2.5 rounded-xl shadow-md text-xs flex items-center gap-1.5 cursor-pointer border border-amber-400 transition-all"
          >
            <Database className="w-4 h-4 text-slate-950" />
            Script SQL Supabase
          </button>

          <button
            onClick={handleOpenAdd}
            className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-md text-xs flex items-center gap-2 cursor-pointer border border-emerald-600 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Registrar Nuevo Usuario
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por Nombre, C.I., Email, Cargo, Escalafón..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-slate-100"
          />
        </div>
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Mostrando <strong className="text-emerald-600 dark:text-emerald-400">{filteredUsers.length}</strong> de <strong className="text-slate-700 dark:text-slate-300">{users.length}</strong> registros oficiales
        </div>
      </div>

      {/* Complete Database Table matching exact columns requested */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-emerald-950 text-amber-300 font-extrabold uppercase text-[10px] tracking-wider border-b border-emerald-800 whitespace-nowrap">
              <tr>
                <th className="p-2.5 border-r border-emerald-900/50">GRADO</th>
                <th className="p-2.5 border-r border-emerald-900/50">APELLIDO PATERNO</th>
                <th className="p-2.5 border-r border-emerald-900/50">APELLIDO MATERNO</th>
                <th className="p-2.5 border-r border-emerald-900/50">1ER. NOMBRE</th>
                <th className="p-2.5 border-r border-emerald-900/50">2DO. NOMBRE</th>
                <th className="p-2.5 border-r border-emerald-900/50">C. I.</th>
                <th className="p-2.5 border-r border-emerald-900/50 text-center">SEXO</th>
                <th className="p-2.5 border-r border-emerald-900/50">EMAIL</th>
                <th className="p-2.5 border-r border-emerald-900/50">ESCALAFON</th>
                <th className="p-2.5 border-r border-emerald-900/50">ROL</th>
                <th className="p-2.5 border-r border-emerald-900/50">OFICINA REGIONAL</th>
                <th className="p-2.5 border-r border-emerald-900/50">CARGO</th>
                <th className="p-2.5 border-r border-emerald-900/50">ÁREAS PERICIALES</th>
                <th className="p-2.5 border-r border-emerald-900/50">EAS TÉCNIC</th>
                <th className="p-2.5 border-r border-emerald-900/50">USUARIO LOGIN</th>
                <th className="p-2.5 border-r border-emerald-900/50">CONTRASEÑA</th>
                <th className="p-2.5 border-r border-emerald-900/50 text-center">ESTADO</th>
                <th className="p-2.5 text-center sticky right-0 bg-emerald-950 z-10 shadow-md">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono text-[11px] whitespace-nowrap">
              {filteredUsers.map((u, idx) => {
                const isPerito = u.role === 'PERITO';
                const isTecnico = u.role === 'TECNICO';

                const displayAreas = u.sectionNames && u.sectionNames.length > 0
                  ? u.sectionNames.join(', ')
                  : (u.sectionName || '-');

                const displayEasTecnic = isTecnico
                  ? (u.technicalAreas && u.technicalAreas.length > 0 ? u.technicalAreas.join(', ') : 'INFORMÁTICA')
                  : '-';

                return (
                  <tr key={u.id} className={`${idx % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/60 dark:bg-slate-800/40'} hover:bg-amber-500/10 transition-colors`}>
                    <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 font-bold text-emerald-700 dark:text-emerald-400">{u.grado || 'SOF.'}</td>
                    <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-slate-100">{u.paternalLastName || '-'}</td>
                    <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-slate-100">{u.maternalLastName || '-'}</td>
                    <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-slate-100">{u.firstName || '-'}</td>
                    <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">{u.secondName || '-'}</td>
                    <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 font-bold text-amber-600 dark:text-amber-400">{u.ci || u.badgeNumber || '-'}</td>
                    <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 text-center font-bold text-slate-700 dark:text-slate-300">{u.gender || 'M'}</td>
                    <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">{u.email}</td>
                    <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 font-bold text-slate-800 dark:text-slate-200">{u.escalafon || u.badgeNumber || '-'}</td>
                    <td className="p-2.5 border-r border-slate-200 dark:border-slate-800">
                      <span className="bg-emerald-900 text-emerald-100 dark:bg-emerald-950 dark:text-amber-300 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-700">
                        {u.role === 'ADMIN' ? 'ADMINISTRADOR' : u.role === 'ENCARGADO_SERVICIOS' ? 'ENCARGADO SERVICIOS' : u.role === 'PERITO' ? 'PERITO FORENSE' : u.role === 'TECNICO' ? 'TÉCNICO FORENSE' : u.role === 'RECEPCION' ? 'RECEPCIÓN' : 'SALA DE EVIDENCIAS'}
                      </span>
                    </td>
                    <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">{u.officeName || 'CENTRAL SANTA CRUZ'}</td>
                    <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-semibold">{u.cargo || '-'}</td>
                    <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 font-semibold text-emerald-800 dark:text-emerald-300">
                      {isPerito || !isTecnico ? displayAreas : '-'}
                    </td>
                    <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 font-semibold text-indigo-700 dark:text-indigo-300">
                      {displayEasTecnic}
                    </td>
                    <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-bold">{u.username || u.email}</td>
                    <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 text-amber-600 dark:text-amber-400 font-bold">{u.password || u.ci || '******'}</td>
                    <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 text-center font-bold">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] border ${
                        u.active !== false
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                          : 'bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300 border-red-300 dark:border-red-800'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${u.active !== false ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                        {u.active !== false ? 'HABILITADO' : 'DESHABILITADO'}
                      </span>
                    </td>
                    <td className="p-2.5 text-center sticky right-0 bg-white dark:bg-slate-900 z-10 shadow-md whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(u)}
                          disabled={u.id === currentUser.id}
                          title={u.id === currentUser.id ? 'No puede deshabilitar su propia cuenta activa' : (u.active !== false ? 'Deshabilitar Usuario' : 'Habilitar Usuario')}
                          className={`px-2 py-1 rounded-lg font-bold text-[10px] flex items-center gap-1 cursor-pointer shadow-sm transition-all border ${
                            u.id === currentUser.id
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600 dark:border-slate-700'
                              : u.active !== false
                              ? 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200 dark:bg-red-950/60 dark:hover:bg-red-900 dark:text-red-300 dark:border-red-800'
                              : 'bg-emerald-700 hover:bg-emerald-600 text-white border-emerald-500'
                          }`}
                        >
                          {u.active !== false ? (
                            <>
                              <Ban className="w-3 h-3 text-red-600 dark:text-red-400" />
                              Deshabilitar
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-3 h-3 text-emerald-200" />
                              Habilitar
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleViewUserLogs(u)}
                          title="Ver historial de actividades y logs de este usuario"
                          className="px-2 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center gap-1 cursor-pointer shadow-sm transition-all border border-amber-400"
                        >
                          <History className="w-3 h-3 text-slate-950" />
                          Logs
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEdit(u)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-[10px] cursor-pointer shadow-sm transition-all border border-emerald-600"
                        >
                          Editar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form for Creating / Editing Users */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl p-6 space-y-4 text-xs my-8 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <h2 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-600" />
                {editingUser ? 'Editar Registro de Usuario' : 'Registrar Nuevo Usuario en la Base de Datos'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Section 1: Personal Info & Grade */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <h3 className="font-bold text-emerald-800 dark:text-emerald-400 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4" /> 1. Datos Personales, Grado y C.I.
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold mb-1">GRADO *</label>
                    <select value={grado} onChange={e => setGrado(e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 font-bold text-slate-900 dark:text-slate-100">
                      <option value="CAP.">CAP.</option>
                      <option value="MY.">MY.</option>
                      <option value="TTE.">TTE.</option>
                      <option value="SOF. MY.">SOF. MY.</option>
                      <option value="SOF. 1RO.">SOF. 1RO.</option>
                      <option value="SOF. 2DO.">SOF. 2DO.</option>
                      <option value="SGTO. MY.">SGTO. MY.</option>
                      <option value="SGTO. 1RO.">SGTO. 1RO.</option>
                      <option value="SGTO. 2DO.">SGTO. 2DO.</option>
                      <option value="SGTO.">SGTO.</option>
                      <option value="MY. SERV.">MY. SERV.</option>
                      <option value="DR.">DR.</option>
                      <option value="DRA.">DRA.</option>
                      <option value="ING.">ING.</option>
                      <option value="LIC.">LIC.</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold mb-1">APELLIDO PATERNO *</label>
                    <input type="text" value={paternalLastName} onChange={e => setPaternalLastName(e.target.value)} required className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-slate-100 uppercase font-semibold" />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">APELLIDO MATERNO</label>
                    <input type="text" value={maternalLastName} onChange={e => setMaternalLastName(e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-slate-100 uppercase font-semibold" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold mb-1">1ER. NOMBRE *</label>
                    <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-slate-100 uppercase font-semibold" />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">2DO. NOMBRE</label>
                    <input type="text" value={secondName} onChange={e => setSecondName(e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-slate-100 uppercase font-semibold" />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">C. I. *</label>
                    <input type="text" value={ci} onChange={e => setCi(e.target.value)} required placeholder="ej. 6439119" className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 font-mono font-bold text-amber-600 dark:text-amber-400" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1">SEXO *</label>
                    <select value={gender} onChange={e => setGender(e.target.value as 'M' | 'F')} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 font-bold text-slate-900 dark:text-slate-100">
                      <option value="M">M (Masculino)</option>
                      <option value="F">F (Femenino)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold mb-1">ESCALAFÓN *</label>
                    <input type="text" value={escalafon} onChange={e => setEscalafon(e.target.value)} required placeholder="ej. 5052" className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 font-mono font-bold text-slate-900 dark:text-slate-100" />
                  </div>
                </div>
              </div>

              {/* Section 2: Institutional Role & Cargo */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <h3 className="font-bold text-emerald-800 dark:text-emerald-400 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                  <Shield className="w-4 h-4" /> 2. Cargo, Rol y Ubicación Institucional
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1">ROL *</label>
                    <select value={role} onChange={e => setRole(e.target.value as any)} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 font-bold text-slate-900 dark:text-slate-100">
                      <option value="ADMIN">ADMINISTRADOR</option>
                      <option value="ENCARGADO_SERVICIOS">ENCARGADO SERVICIOS</option>
                      <option value="PERITO">PERITO FORENSE</option>
                      <option value="RECEPCION">RECEPCIÓN</option>
                      <option value="SALA_EVIDENCIAS">SALA DE EVIDENCIAS</option>
                      <option value="TECNICO">TÉCNICO FORENSE</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold mb-1">OFICINA REGIONAL *</label>
                    <select value={officeId} onChange={e => setOfficeId(e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 font-semibold text-slate-900 dark:text-slate-100">
                      {offices.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-1">CARGO INSTITUCIONAL *</label>
                  <input type="text" value={cargo} onChange={e => setCargo(e.target.value)} required placeholder="ej. JEFE DEL REAFUC SANTA CRUZ" className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-slate-100 uppercase font-semibold" />
                </div>
              </div>

              {/* Section 3: Specialized Areas Assignment */}
              {role === 'PERITO' || role === 'TECNICO' ? (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-300 dark:border-amber-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-extrabold text-amber-900 dark:text-amber-300 flex items-center gap-1.5 text-xs">
                      <Layers className="w-4 h-4 text-amber-600" />
                      ÁREAS PERICIALES Asignadas (Hasta 3 máximo) *
                    </label>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
                      {selectedSectionIds.length} / 3 Seleccionadas
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-1.5 max-h-40 overflow-y-auto pt-1">
                    {forensicAreasList.map(s => {
                      const isSelected = selectedSectionIds.includes(s.id);
                      return (
                        <button
                          type="button"
                          key={s.id}
                          onClick={() => handleToggleSection(s.id)}
                          className={`p-2 rounded-lg text-left flex items-center justify-between transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-emerald-950 border-emerald-600 text-amber-300 font-bold'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-500'
                          }`}
                        >
                          <span className="text-xs">{s.code ? `[${s.code}] ${s.name}` : s.name}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${isSelected ? 'bg-amber-400 text-emerald-950' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                            {isSelected ? 'ASIGNADO' : 'SELECCIONAR'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {/* Section 4: Login Credentials and Status */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <h3 className="font-bold text-emerald-800 dark:text-emerald-400 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                  <Key className="w-4 h-4" /> 4. Credenciales de Acceso y Estado
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-bold mb-1">EMAIL *</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-slate-100" />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">USUARIO LOGIN *</label>
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 font-mono font-bold text-slate-900 dark:text-slate-100" />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">CONTRASEÑA *</label>
                    <input type="text" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 font-mono font-bold text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">ESTADO ACCESO *</label>
                    <select
                      value={activeStatus ? 'true' : 'false'}
                      onChange={e => setActiveStatus(e.target.value === 'true')}
                      className={`w-full border rounded-lg p-2 font-bold text-xs ${
                        activeStatus
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-700'
                          : 'bg-red-50 text-red-900 border-red-300 dark:bg-red-950 dark:text-red-300 dark:border-red-700'
                      }`}
                    >
                      <option value="true">🟢 HABILITADO</option>
                      <option value="false">🔴 DESHABILITADO</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2 border-slate-200 dark:border-slate-800">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl font-semibold cursor-pointer">Cancelar</button>
                <button type="submit" className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"><CheckCircle2 className="w-4 h-4" /> Guardar Usuario</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Supabase SQL Script Generator Modal */}
      {showSqlModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="bg-slate-950 text-white p-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-extrabold text-sm uppercase tracking-wider">
                    Script SQL para Migración a Supabase (PostgreSQL)
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Incluye definición de tabla, índices de rendimiento y migración de los {users.length} usuarios policiales activos.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSqlModal(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Action Bar */}
            <div className="p-3 bg-slate-100 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                <FileCode className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Format: PostgreSQL / Supabase SQL Editor</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopySql}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                    copiedSql
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-800 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {copiedSql ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedSql ? '¡Copiado al Portapapeles!' : 'Copiar Script SQL'}
                </button>

                <button
                  type="button"
                  onClick={handleDownloadSql}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-sm border border-amber-400"
                >
                  <Download className="w-4 h-4 text-slate-950" />
                  Descargar .sql
                </button>
              </div>
            </div>

            {/* Code Output */}
            <div className="p-4 bg-slate-950 text-slate-100 overflow-y-auto font-mono text-xs leading-relaxed flex-1 select-all">
              <pre className="whitespace-pre-wrap">{generatedSqlScript}</pre>
            </div>

            {/* Footer Notice */}
            <div className="p-3 bg-slate-900 text-slate-400 text-[11px] border-t border-slate-800 flex items-center justify-between">
              <span> Copia este script y ejecútalo en el <strong>SQL Editor</strong> del panel de tu proyecto en Supabase.</span>
              <button
                type="button"
                onClick={() => setShowSqlModal(false)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg cursor-pointer"
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
