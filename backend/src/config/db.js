// backend/src/config/db.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const registerUser = async ({ email, password, name }) => {
  const { data, error } = await supabase
    .from('users')
    .insert([{ email, password, name, role: 'user', is_verified: false }]);
  if (error) throw error;
  return data;
};

module.exports = supabase;
