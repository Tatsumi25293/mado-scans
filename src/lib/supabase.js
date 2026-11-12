import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bbvlpkswzykbqllsnlkx.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseAnonKey !== 'YOUR_ANON_KEY_HERE');
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Storage helper to upload base64 or file directly to Supabase Storage bucket 'mado-media'
export const uploadImageToSupabase = async (base64OrFile, path) => {
  if (!supabase) return null;

  try {
    let fileBody = base64OrFile;

    // If it's a dataUrl (base64)
    if (typeof base64OrFile === 'string' && base64OrFile.startsWith('data:')) {
      const res = await fetch(base64OrFile);
      fileBody = await res.blob();
    }

    const fileExt = fileBody.type?.split('/')[1] || 'jpg';
    const filePath = `${path}-${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('mado-media')
      .upload(filePath, fileBody, {
        upsert: true,
        contentType: fileBody.type || 'image/jpeg'
      });

    if (error) {
      console.warn('Supabase storage upload error:', error);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from('mado-media')
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.warn('Error in uploadImageToSupabase:', err);
    return null;
  }
};
