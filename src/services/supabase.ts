import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_CONFIG_KEY = 'iitcup_supabase_cfg';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  enabled: boolean;
}

export const getSupabaseConfig = (): SupabaseConfig => {
  try {
    const raw = localStorage.getItem(SUPABASE_CONFIG_KEY);
    if (!raw) return { url: '', anonKey: '', enabled: false };
    return JSON.parse(raw);
  } catch {
    return { url: '', anonKey: '', enabled: false };
  }
};

export const saveSupabaseConfig = (cfg: SupabaseConfig) => {
  localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify(cfg));
};

let clientInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  const cfg = getSupabaseConfig();
  if (!cfg.enabled || !cfg.url || !cfg.anonKey) {
    return null;
  }
  if (!clientInstance) {
    clientInstance = createClient(cfg.url, cfg.anonKey);
  }
  return clientInstance;
};

export const testSupabaseConnection = async (url: string, key: string): Promise<{ success: boolean; message: string }> => {
  try {
    const tempClient = createClient(url, key);
    const { error } = await tempClient.from('regional_offices').select('id').limit(1);
    if (error && error.code !== 'PGRST116') {
      // PGRST116 means zero rows or table check, if table doesn't exist yet, connection itself works!
      if (error.message.includes('FetchError') || error.message.includes('Invalid API key') || error.message.includes('JWT')) {
        return { success: false, message: `Error de autenticación o URL: ${error.message}` };
      }
    }
    return { success: true, message: 'Conexión a Supabase exitosa y verificada.' };
  } catch (err: any) {
    return { success: false, message: `Error de conexión: ${err?.message || 'Verifique URL y Clave Anon'}` };
  }
};
