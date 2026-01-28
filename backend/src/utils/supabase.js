const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  {
    db: {
      ssl: { rejectUnauthorized: false }, // nécessaire pour cloud
      port: 5432,
      family: 4 // <-- force IPv4
    }
  }
);

const uploadProfilePhoto = async (fileBuffer, fileName, mimeType) => {
  const { data, error } = await supabase.storage
    .from(process.env.SUPABASE_BUCKET)
    .upload(`profiles/${fileName}`, fileBuffer, { contentType: mimeType, upsert: true });

  if (error) throw error;

  const { publicUrl } = supabase.storage
    .from(process.env.SUPABASE_BUCKET)
    .getPublicUrl(`profiles/${fileName}`);

  return publicUrl;
};

module.exports = { supabase, uploadProfilePhoto };
