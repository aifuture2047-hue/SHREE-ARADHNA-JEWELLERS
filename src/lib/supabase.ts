import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isPlaceholder = 
  !supabaseUrl || 
  supabaseUrl.includes('your-project-id') || 
  !supabaseAnonKey || 
  supabaseAnonKey.includes('your-key-here');

if (isPlaceholder) {
  console.warn('Supabase credentials are placeholders. Falling back to local storage.');
}

export const supabase = createClient(
  isPlaceholder ? 'https://placeholder-url.supabase.co' : supabaseUrl,
  isPlaceholder ? 'placeholder-key' : supabaseAnonKey
);

export const isSupabaseConfigured = !isPlaceholder;

export const getImageUrl = (path: string): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  if (isSupabaseConfigured) {
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `${supabaseUrl}/storage/v1/object/public/gallery/${cleanPath}`;
  }
  return path;
};

export const uploadImage = async (file: File | Blob, path: string): Promise<string> => {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured');
  }
  
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  const { error } = await supabase.storage
    .from('gallery')
    .upload(cleanPath, file, {
      cacheControl: '3600',
      upsert: true
    });
    
  if (error) {
    throw error;
  }
  
  return getImageUrl(cleanPath);
};

