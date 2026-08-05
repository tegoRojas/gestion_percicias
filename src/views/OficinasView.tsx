import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Building2, Plus, CheckCircle2, X } from 'lucide-react';

export const OficinasView: React.FC = () => {
  const { offices, addOffice } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState('');
  const [numCode, setNumCode] = useState('7');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addOffice({
      code: code.toUpperCase(),
      numericCode: numCode,
      name,
      city,
      address
    });
    alert('Oficina regional creada exitosamente.');
    setShowModal(false);
    setCode('');
    setName('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Oficinas Regionales IITCUP
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gestión de sedes regionales del Departamento de Santa Cruz y sus respectivos correlativos
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-md text-xs flex items-center gap-2 border border-emerald-600 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Registrar Nueva Oficina
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {offices.map(o => (
          <div key={o.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-mono font-extrabold text-amber-500 bg-emerald-950 px-2 py-0.5 rounded text-xs">
                [{o.code}-{o.numericCode}]
              </span>
              {o.isDefault && <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">Sede Principal</span>}
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">{o.name}</h3>
            <p className="text-xs text-slate-500">{o.address}</p>
            <div className="text-[11px] text-emerald-600 font-semibold">{o.city}</div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-3">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md p-5 space-y-4 text-xs">
            <div className="flex justify-between border-b pb-2 font-bold text-base">
              <span>Nueva Oficina Regional</span>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div><label className="block font-bold">Código (ej. SCZ) *</label><input type="text" maxLength={3} value={code} onChange={e => setCode(e.target.value)} required className="w-full border rounded p-2 font-mono uppercase" /></div>
                <div><label className="block font-bold">Código Regional (7) *</label><input type="text" value={numCode} onChange={e => setNumCode(e.target.value)} required className="w-full border rounded p-2 font-mono" /></div>
              </div>
              <div><label className="block font-bold">Nombre Oficina *</label><input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full border rounded p-2" /></div>
              <div><label className="block font-bold">Ciudad / Municipio *</label><input type="text" value={city} onChange={e => setCity(e.target.value)} required className="w-full border rounded p-2" /></div>
              <div><label className="block font-bold">Dirección</label><input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full border rounded p-2" /></div>
              <div className="pt-2 flex justify-end gap-2"><button type="button" onClick={() => setShowModal(false)} className="px-3 py-1.5 bg-slate-200 rounded">Cancelar</button><button type="submit" className="px-4 py-1.5 bg-emerald-800 text-white font-bold rounded">Guardar</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
