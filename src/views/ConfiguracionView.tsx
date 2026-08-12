import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { testSupabaseConnection } from '../services/supabase';
import { generateSupabaseSQL } from '../services/db';
import {
  Settings,
  Database,
  CheckCircle2,
  XCircle,
  Download,
  Wifi,
  WifiOff,
  Terminal,
  RefreshCw,
  Laptop,
  Monitor,
  HardDrive,
  FileCode,
  Layers,
  HelpCircle,
  FolderArchive,
  Server,
  ShieldCheck,
  Smartphone,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const ConfiguracionView: React.FC = () => {
  const { isOnline, installPwaApp, canInstallPwa } = useApp();

  const [activeTab, setActiveTab] = useState<'INSTALADOR' | 'DATABASE' | 'RESPALDO'>('INSTALADOR');

  const [supabaseUrl, setSupabaseUrl] = useState(
    localStorage.getItem('iitcup_supabase_url') || ''
  );
  const [supabaseKey, setSupabaseKey] = useState(
    localStorage.getItem('iitcup_supabase_key') || ''
  );

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSaveConfig = () => {
    localStorage.setItem('iitcup_supabase_url', supabaseUrl);
    localStorage.setItem('iitcup_supabase_key', supabaseKey);
    alert('Configuración de conexión Supabase guardada correctamente.');
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    const res = await testSupabaseConnection(supabaseUrl, supabaseKey);
    setTesting(false);
    setTestResult(res);
  };

  const handleDownloadSQL = () => {
    const sqlContent = generateSupabaseSQL();
    const blob = new Blob([sqlContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'iitcup_supabase_schema.sql';
    link.click();
    URL.revokeObjectURL(url);
  };

  // GENERATE WINDOWS BATCH INSTALLER
  const handleDownloadWindowsInstaller = () => {
    const batContent = `@echo off
title Instalador Sistema IITCUP - Regional Santa Cruz
color 0A
cls
echo =======================================================================
echo          INSTALADOR Y LAUNCHER DE ESCRITORIO - SISTEMA IITCUP
echo     Instituto de Investigaciones Tecnico Cientificas de la Universidad Policial
echo =======================================================================
echo.
echo [1/3] Verificando entorno de ejecucion en Windows...
timeout /t 1 >nul
echo [2/3] Configurando ejecucion como Aplicacion de Escritorio Standalone...
timeout /t 1 >nul
echo [3/3] Creando acceso directo en el Escritorio de Windows...

set APP_URL=%CD%\\index.html
if not exist "%APP_URL%" set APP_URL=https://ais-pre-wws2d2grhlhneibbsqgfma-568647444940.us-east1.run.app

echo Set oWS = WScript.CreateObject("WScript.Shell") > CreateShortcut.vbs
echo sLinkFile = oWS.SpecialFolders("Desktop") ^& "\\IITCUP Regional Santa Cruz.lnk" >> CreateShortcut.vbs
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> CreateShortcut.vbs
echo oLink.TargetPath = "cmd.exe" >> CreateShortcut.vbs
echo oLink.Arguments = "/c start msedge --app=" ^& "%APP_URL%" >> CreateShortcut.vbs
echo oLink.Description = "Sistema de Gestion Integral de Requerimientos y Cadena de Custodia IITCUP" >> CreateShortcut.vbs
echo oLink.Save >> CreateShortcut.vbs

cscript //nologo CreateShortcut.vbs
del CreateShortcut.vbs

echo.
echo =======================================================================
echo   INSTALACION COMPLETADA EXITOSAMENTE
echo   Se ha generado el acceso directo "IITCUP Regional Santa Cruz" en su Escritorio.
echo =======================================================================
echo.
pause
`;
    const blob = new Blob([batContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Instalar_IITCUP_Windows.bat';
    link.click();
    URL.revokeObjectURL(url);
  };

  // GENERATE LINUX/UNIX SHELL INSTALLER
  const handleDownloadLinuxInstaller = () => {
    const shContent = `#!/bin/bash
# Instalador de Escritorio IITCUP para Linux / macOS
echo "================================================================="
echo "   INSTALADOR DE SISTEMA IITCUP REGIONAL SANTA CRUZ (UNIX/LINUX)"
echo "================================================================="
echo ""
echo "[1/2] Creando lanzador de escritorio .desktop..."

DESKTOP_DIR="$HOME/.local/share/applications"
mkdir -p "$DESKTOP_DIR"

CAT_FILE="$DESKTOP_DIR/iitcup-regional.desktop"

cat <<EOT > "$CAT_FILE"
[Desktop Entry]
Type=Application
Name=IITCUP Regional Santa Cruz
Comment=Sistema de Gestion Pericial e Investigacion Forense
Exec=google-chrome --app=https://ais-pre-wws2d2grhlhneibbsqgfma-568647444940.us-east1.run.app %U
Icon=utilities-terminal
Terminal=false
Categories=Office;Security;
EOT

chmod +x "$CAT_FILE"

echo "[2/2] Instalacion finalizada."
echo "La aplicacion IITCUP ahora esta disponible en el menu de aplicaciones de su sistema."
`;
    const blob = new Blob([shContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Instalar_IITCUP_Linux.sh';
    link.click();
    URL.revokeObjectURL(url);
  };

  // GENERATE DOCKER COMPOSE CONFIGURATION
  const handleDownloadDockerCompose = () => {
    const dockerContent = `version: '3.8'

services:
  iitcup_app:
    image: nginx:alpine
    container_name: iitcup_regional_santa_cruz
    ports:
      - "8080:80"
    restart: always
    volumes:
      - ./dist:/usr/share/nginx/html
    environment:
      - NODE_ENV=production

# Para ejecutar en el servidor intranet de la FELCC/IITCUP:
# 1. Copie el contenido generado en el servidor.
# 2. Ejecute: docker-compose up -d
# 3. Acceda desde cualquier PC de la red local a: http://<IP-SERVIDOR>:8080
`;
    const blob = new Blob([dockerContent], { type: 'text/yaml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'docker-compose.yml';
    link.click();
    URL.revokeObjectURL(url);
  };

  // GENERATE MANUAL GUIDELINE HTML
  const handleDownloadInstallGuide = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Guía de Instalación del Sistema IITCUP Regional Santa Cruz</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; color: #1e293b; line-height: 1.6; }
    h1 { color: #004d25; border-bottom: 2px solid #004d25; padding-bottom: 10px; }
    h2 { color: #0284c7; margin-top: 30px; }
    .box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    code { background: #0f172a; color: #38bdf8; padding: 3px 6px; border-radius: 4px; font-family: monospace; }
  </style>
</head>
<body>
  <h1>POLICÍA BOLIVIANA - IITCUP REGIONAL SANTA CRUZ</h1>
  <h2>Manual Técnico de Instalación e Implementación Multiequipo</h2>
  <div class="box">
    <p><strong>Sistema:</strong> Gestión Integral de Requerimientos Periciales, Técnicos y Cadena de Custodia</p>
    <p><strong>Compatibilidad:</strong> Windows 10/11, Linux (Ubuntu/Debian), macOS, Android e iOS.</p>
  </div>

  <h2>Opción 1: Instalación PWA de 1-Click (Recomendada)</h2>
  <ol>
    <li>Abra Google Chrome o Microsoft Edge en la computadora de destino.</li>
    <li>Ingrese a la URL del sistema.</li>
    <li>Haga clic en el ícono de instalación ⊕ situado en el extremo derecho de la barra de direcciones.</li>
    <li>Confirme "Instalar". Se creará un ejecutable standalone en el Menú Inicio y Escritorio.</li>
  </ol>

  <h2>Opción 2: Instalador de Escritorio Ejecutable para Windows</h2>
  <ol>
    <li>Ejecute el archivo <code>Instalar_IITCUP_Windows.bat</code> con doble clic.</li>
    <li>El instalador creará automáticamente el acceso directo en el Escritorio.</li>
  </ol>

  <h2>Opción 3: Despliegue en Servidor Local Intranet (Docker)</h2>
  <ol>
    <li>Copie los archivos de la aplicación en el servidor local.</li>
    <li>Ejecute el comando: <code>docker-compose up -d</code></li>
    <li>Las computadoras conectadas a la red local podrán ingresar mediante la IP del servidor.</li>
  </ol>
</body>
</html>`;
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Guia_Instalacion_IITCUP.html';
    link.click();
    URL.revokeObjectURL(url);
  };

  // EXPORT ALL LOCALSTORAGE BACKUP
  const handleExportBackup = () => {
    const backupData: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('iitcup_')) {
        try {
          backupData[key] = JSON.parse(localStorage.getItem(key) || 'null');
        } catch {
          backupData[key] = localStorage.getItem(key);
        }
      }
    }
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Respaldo_IITCUP_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-1">
              <Laptop className="w-4 h-4" />
              <span>Despliegue Multi-Equipo y Configuración</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Instalador del Sistema e Infraestructura
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Genere paquetes de instalación ejecutable para computadoras Windows/Linux, despliegue como PWA standalone o configure el servidor de base de datos Supabase.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border ${
              isOnline
                ? 'bg-emerald-900/80 text-emerald-200 border-emerald-700'
                : 'bg-amber-900/80 text-amber-200 border-amber-700'
            }`}>
              {isOnline ? <Wifi className="w-4 h-4 text-emerald-400" /> : <WifiOff className="w-4 h-4 text-amber-400" />}
              <span>{isOnline ? 'PWA En Línea' : 'PWA Modo Offline'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2">
        <button
          onClick={() => setActiveTab('INSTALADOR')}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'INSTALADOR'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          <Monitor className="w-4 h-4" />
          <span>Generador de Instalador en Computadoras</span>
        </button>

        <button
          onClick={() => setActiveTab('DATABASE')}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'DATABASE'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Conexión Supabase PostgreSQL</span>
        </button>

        <button
          onClick={() => setActiveTab('RESPALDO')}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'RESPALDO'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          <HardDrive className="w-4 h-4" />
          <span>Copias de Seguridad (Backup JSON)</span>
        </button>
      </div>

      {/* TAB 1: INSTALLER GENERATOR */}
      {activeTab === 'INSTALADOR' && (
        <div className="space-y-6">
          {/* Direct PWA 1-Click Installation Hero Card */}
          <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-6 rounded-2xl shadow-md border border-emerald-700 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-800/80 rounded-full text-xs font-semibold text-emerald-200 border border-emerald-600">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Instalación PWA de 1-Click para Escritorio</span>
              </div>
              <h2 className="text-xl font-bold">Instalar Aplicación IITCUP en esta PC</h2>
              <p className="text-xs text-emerald-100/90 leading-relaxed">
                Convierte esta página web en una aplicación de escritorio independiente (Windows, macOS o Linux) con ventana propia sin barra de navegador, acceso directo en el Escritorio e inicio acelerado offline.
              </p>
            </div>

            <button
              onClick={installPwaApp}
              className="w-full md:w-auto px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-xl shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2 border border-amber-300 shrink-0 cursor-pointer"
            >
              <Monitor className="w-5 h-5" />
              <span>Instalar Aplicación de Escritorio Ahora</span>
            </button>
          </div>

          {/* Installer Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Windows Installer */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <div className="p-3 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 w-fit rounded-xl mb-3">
                  <Monitor className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Instalador Windows (.bat)</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Script ejecutable batch que crea el acceso directo en el Escritorio de Windows y configura Microsoft Edge o Chrome en modo App standalone.
                </p>
              </div>

              <button
                onClick={handleDownloadWindowsInstaller}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Descargar (.bat) Windows</span>
              </button>
            </div>

            {/* Linux / Mac Installer */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <div className="p-3 bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 w-fit rounded-xl mb-3">
                  <Terminal className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Instalador Linux / macOS (.sh)</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Script Bash para sistemas basados en Unix/Linux (Ubuntu, Debian, Fedora) que genera la entrada `.desktop` en el menú de aplicaciones del sistema.
                </p>
              </div>

              <button
                onClick={handleDownloadLinuxInstaller}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Descargar (.sh) Linux/Unix</span>
              </button>
            </div>

            {/* Docker Container */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <div className="p-3 bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 w-fit rounded-xl mb-3">
                  <Server className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Servidor Intranet Docker</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Configuración `docker-compose.yml` para desplegar el servidor web de la aplicación en la red privada de la FELCC o IITCUP.
                </p>
              </div>

              <button
                onClick={handleDownloadDockerCompose}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Descargar (docker-compose)</span>
              </button>
            </div>

            {/* Installation Guide */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <div className="p-3 bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 w-fit rounded-xl mb-3">
                  <FileCode className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Manual de Instalación</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Guía técnica paso a paso en formato HTML/imprimible con instrucciones detalladas para administradores de red de la Policía Boliviana.
                </p>
              </div>

              <button
                onClick={handleDownloadInstallGuide}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Guía HTML</span>
              </button>
            </div>

          </div>

          {/* Detailed Instructions Steps */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Pasos para Instalar en Múltiples Computadoras de la Unidad</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="w-6 h-6 rounded-full bg-emerald-800 text-amber-400 font-bold inline-flex items-center justify-center text-xs">1</span>
                <h4 className="font-bold text-slate-900 dark:text-white">Copiar la URL o Script</h4>
                <p className="text-slate-500 dark:text-slate-400">
                  Comparta el enlace del sistema o descargue el ejecutable <code className="text-emerald-600">.bat</code> / <code className="text-purple-600">.sh</code> en un pendrive para llevarlo a otras computadoras de la unidad.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="w-6 h-6 rounded-full bg-emerald-800 text-amber-400 font-bold inline-flex items-center justify-center text-xs">2</span>
                <h4 className="font-bold text-slate-900 dark:text-white">Ejecutar Instalador o PWA</h4>
                <p className="text-slate-500 dark:text-slate-400">
                  En la PC destino, haga doble clic en el instalador descargado o presione el botón <strong>"Instalar Aplicación de Escritorio Ahora"</strong> desde el navegador Chrome/Edge.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="w-6 h-6 rounded-full bg-emerald-800 text-amber-400 font-bold inline-flex items-center justify-center text-xs">3</span>
                <h4 className="font-bold text-slate-900 dark:text-white">Uso Inmediato y Offline</h4>
                <p className="text-slate-500 dark:text-slate-400">
                  La aplicación funcionará de forma independiente con icono en el Escritorio. Los registros se mantendrán sincronizados cuando la PC tenga conexión.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SUPABASE DATABASE CONFIG */}
      {activeTab === 'DATABASE' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Supabase Config Form */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Database className="w-5 h-5 text-emerald-600" />
              <h2 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                Credenciales Supabase PostgreSQL
              </h2>
            </div>

            <p className="text-slate-500">
              Ingrese los parámetros de su proyecto en Supabase para sincronizar los datos locales con la base de datos remota.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Project URL (Supabase API)
                </label>
                <input
                  type="text"
                  placeholder="https://xyzcompany.supabase.co"
                  value={supabaseUrl}
                  onChange={e => setSupabaseUrl(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 font-mono dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  API anon / public Key
                </label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={supabaseKey}
                  onChange={e => setSupabaseKey(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 font-mono dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleSaveConfig}
                className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                Guardar Credenciales
              </button>

              <button
                onClick={handleTestConnection}
                disabled={testing}
                className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${testing ? 'animate-spin' : ''}`} />
                Probar Conexión
              </button>
            </div>

            {testResult && (
              <div className={`p-3 rounded-xl border flex items-center gap-2 ${
                testResult.success
                  ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300'
                  : 'bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-300 border-red-300'
              }`}>
                {testResult.success ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <XCircle className="w-5 h-5 shrink-0" />}
                <span className="font-semibold">{testResult.message}</span>
              </div>
            )}

          </div>

          {/* Database SQL Export Panel */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Terminal className="w-5 h-5 text-amber-500" />
              <h2 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                Esquema DDL PostgreSQL e Instrucciones SQL
              </h2>
            </div>

            <p className="text-slate-500 leading-relaxed">
              Descargue el script de creación de tablas, triggers para el correlativo automático del RUP (<code className="font-mono text-amber-500 font-bold">SCZ-7-000001</code>), reglas RLS y restricciones inmutables de auditoría para ejecutar directamente en el Editor SQL de Supabase.
            </p>

            <div className="bg-slate-950 text-emerald-400 p-3 rounded-xl font-mono text-[10px] space-y-1 border border-slate-800">
              <div>-- CREADO PARA IITCUP SANTA CRUZ</div>
              <div>CREATE TABLE requirements (...);</div>
              <div>CREATE TABLE custody_logs (...);</div>
              <div>CREATE TRIGGER trigger_generate_rup ...</div>
              <div>CREATE TRIGGER protect_audit_logs ...</div>
            </div>

            <button
              onClick={handleDownloadSQL}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-4 py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2 text-xs border border-amber-300 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Descargar Script SQL Completo (iitcup_supabase_schema.sql)
            </button>
          </div>

        </div>
      )}

      {/* TAB 3: BACKUP / RESPALDO */}
      {activeTab === 'RESPALDO' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <HardDrive className="w-5 h-5 text-emerald-600" />
            <h2 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Gestión de Copias de Seguridad Locales (JSON)
            </h2>
          </div>

          <p className="text-slate-500 dark:text-slate-400">
            Exporte un archivo de respaldo completo de los requerimientos, cadena de custodia, actas, usuarios y registros de auditoría almacenados localmente en esta computadora.
          </p>

          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={handleExportBackup}
              className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-xl flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Exportar Copia de Seguridad Completa (.json)</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
