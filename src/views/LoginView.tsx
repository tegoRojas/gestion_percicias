import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight, KeyRound } from 'lucide-react';
import { motion } from 'motion/react';

export const LoginView: React.FC = () => {
  const { login, users } = useApp();

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!usernameOrEmail.trim()) {
      setErrorMsg('Por favor ingrese su usuario o correo electrónico.');
      return;
    }

    if (!password) {
      setErrorMsg('Por favor ingrese su contraseña.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const result = login(usernameOrEmail, password);
      setIsLoading(false);

      if (!result.success) {
        setErrorMsg(result.message || 'Credenciales inválidas.');
      }
    }, 300);
  };

  const handleQuickLogin = (u: any) => {
    const defaultPass = u.password || (u.username === 'admin' ? 'admin123' : '123456');
    setUsernameOrEmail(u.username);
    setPassword(defaultPass);
    setErrorMsg('');
    login(u.username, defaultPass);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/60 via-slate-950 to-slate-950 relative overflow-hidden">
      
      {/* Background Subtle Grid & Lights */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Top Header Branding */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between z-10 py-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-emerald-950 shadow-lg font-extrabold border border-amber-300/40">
            <Shield className="w-6 h-6 fill-amber-500 text-emerald-950" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-white flex items-center gap-2">
              <span className="text-amber-400">IITCUP</span>
              <span className="text-xs bg-emerald-900/80 text-emerald-200 px-2 py-0.5 rounded border border-emerald-700 font-mono">SANTA CRUZ</span>
            </h1>
            <p className="text-[11px] text-slate-400">Policía Boliviana - Dirección Nacional de Fiscalización y Recaudaciones / IITCUP</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <KeyRound className="w-4 h-4 text-emerald-400" />
          <span>Acceso Seguro Restringido</span>
        </div>
      </div>

      {/* Main Login Form Box */}
      <div className="w-full max-w-md mx-auto my-auto z-10 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden"
        >
          {/* Top Gold Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 via-amber-500 to-emerald-600" />

          <div className="text-center mb-6">
            <div className="inline-flex p-3 rounded-2xl bg-emerald-950/80 border border-emerald-800/80 mb-3 text-amber-400 shadow-inner">
              <Shield className="w-8 h-8" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Iniciar Sesión</h2>
            <p className="text-xs text-slate-400 mt-1">Ingrese sus credenciales policiales o de usuario asignado</p>
          </div>

          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-950/80 border border-red-800/80 text-red-200 text-xs rounded-xl p-3 mb-5 flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Error de autenticación:</span>
                <span>{errorMsg}</span>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Usuario o Correo Electrónico</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={usernameOrEmail}
                  onChange={e => setUsernameOrEmail(e.target.value)}
                  placeholder="ej. admin o recepcion"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-10 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-800 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-emerald-950/50 border border-emerald-600/50 text-xs flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <span>Verificando credenciales...</span>
              ) : (
                <>
                  <span>Ingresar al Sistema</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Accesos Rápidos Demo</span>
              <span className="text-[10px] text-amber-400/80 font-mono">1-Clic para probar</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-left">
              {users.slice(0, 8).map(u => {
                const pass = u.password || (u.username === 'admin' ? 'admin123' : '123456');
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleQuickLogin(u)}
                    className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-amber-500/50 hover:bg-slate-800/80 transition-all text-left group"
                  >
                    <div className="font-bold text-xs text-slate-200 group-hover:text-amber-300 truncate">
                      {u.name.split(' ')[0]} {u.name.split(' ')[1] || ''}
                    </div>
                    <div className="text-[10px] text-emerald-400 font-mono font-semibold flex items-center justify-between">
                      <span>{u.role}</span>
                      <span className="text-[9px] text-slate-500 group-hover:text-slate-300">{u.username}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer Disclaimer */}
      <div className="w-full max-w-5xl mx-auto text-center z-10 py-2">
        <p className="text-[11px] text-slate-500">
          © 2026 Instituto de Investigaciones Técnico Científicas de la Universidad Policial (IITCUP). Todos los derechos reservados.
        </p>
      </div>

    </div>
  );
};
