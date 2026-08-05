import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, UserRole } from '../types';
import { Users, Plus, UserCheck, Shield, CheckCircle2, X } from 'lucide-react';

export const UsuariosView: React.FC = () => {
  const { users, offices, sections, addUser, updateUser } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('PERITO');
  const [officeId, setOfficeId] = useState(offices[0]?.id || 'off-1');
  const [sectionId, setSectionId] = useState(sections[0]?.id || 'sec-1');
  const [phone, setPhone] = useState('');
  const [badgeNumber, setBadgeNumber] = useState('');

  const handleOpenAdd = () => {
    setEditingUser(null);
    setName('');
    setUsername('');
    setEmail('');
    setRole('PERITO');
    setPhone('');
    setBadgeNumber('');
    setShowModal(true);
  };

  const handleOpenEdit = (u: User) => {
    setEditingUser(u);
    setName(u.name);
    setUsername(u.username);
    setEmail(u.email);
    setRole(u.role);
    setOfficeId(u.officeId);
    if (u.sectionId) setSectionId(u.sectionId);
    setPhone(u.phone);
    setBadgeNumber(u.badgeNumber || '');
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const off = offices.find(o => o.id === officeId) || offices[0];
    const sec = sections.find(s => s.id === sectionId) || sections[0];

    if (editingUser) {
      updateUser({
        ...editingUser,
        name,
        username,
        email,
        role,
        officeId: off.id,
        officeName: off.name,
        sectionId: sec.id,
        sectionName: sec.name,
        phone,
        badgeNumber
      });
      alert('Usuario actualizado correctamente.');
    } else {
      addUser({
        name,
        username,
        email,
        role,
        officeId: off.id,
        officeName: off.name,
        sectionId: sec.id,
        sectionName: sec.name,
        phone,
        badgeNumber,
        active: true
      });
      alert('Usuario creado correctamente.');
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Gestión de Usuarios y Roles
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Administración del personal policial, asignación de roles y permisos del sistema
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-md text-xs flex items-center gap-2 cursor-pointer border border-emerald-600"
        >
          <Plus className="w-4 h-4" />
          Registrar Nuevo Usuario
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3">Nombre y Apellidos</th>
                <th className="p-3">Usuario / Email</th>
                <th className="p-3">Rol</th>
                <th className="p-3">N° Chapa</th>
                <th className="p-3">Oficina Regional</th>
                <th className="p-3">Sección</th>
                <th className="p-3">Estado</th>
                <th className="p-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-3 font-bold text-slate-900 dark:text-slate-100">{u.name}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">
                    <div className="font-mono">{u.username}</div>
                    <div className="text-[10px] text-slate-400">{u.email}</div>
                  </td>
                  <td className="p-3">
                    <span className="bg-emerald-950 text-amber-300 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-800">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold text-amber-600">{u.badgeNumber || 'N/A'}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{u.officeName}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{u.sectionName || 'N/A'}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.active ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                      {u.active ? 'ACTIVO' : 'INACTIVO'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleOpenEdit(u)}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold text-[11px]"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="font-bold text-base text-slate-900 dark:text-slate-100">
                {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block font-bold mb-1">Nombre Completo y Grado *</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-slate-50 dark:bg-slate-800 border rounded p-2" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Usuario Login *</label>
                  <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className="w-full bg-slate-50 dark:bg-slate-800 border rounded p-2" />
                </div>
                <div>
                  <label className="block font-bold mb-1">Rol de Sistema *</label>
                  <select value={role} onChange={e => setRole(e.target.value as any)} className="w-full bg-slate-50 dark:bg-slate-800 border rounded p-2 font-bold">
                    <option value="ADMIN">ADMINISTRADOR</option>
                    <option value="RECEPCION">RECEPCIÓN</option>
                    <option value="SALA_EVIDENCIAS">SALA DE EVIDENCIAS</option>
                    <option value="ENCARGADO_SERVICIOS">ENCARGADO SERVICIOS</option>
                    <option value="PERITO">PERITO FORENSE</option>
                    <option value="TECNICO">TÉCNICO FORENSE</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Email *</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-slate-50 dark:bg-slate-800 border rounded p-2" />
                </div>
                <div>
                  <label className="block font-bold mb-1">N° Chapa / Credencial</label>
                  <input type="text" value={badgeNumber} onChange={e => setBadgeNumber(e.target.value)} placeholder="Ej. PER-105" className="w-full bg-slate-50 dark:bg-slate-800 border rounded p-2" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Oficina Regional</label>
                  <select value={officeId} onChange={e => setOfficeId(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border rounded p-2">
                    {offices.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Sección Forense</label>
                  <select value={sectionId} onChange={e => setSectionId(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border rounded p-2">
                    {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-200 dark:bg-slate-800 rounded font-semibold">Cancelar</button>
                <button type="submit" className="px-5 py-2 bg-emerald-800 text-white font-bold rounded flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
