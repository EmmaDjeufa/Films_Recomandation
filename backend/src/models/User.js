// backend/src/models/User.js
const supabase = require('../config/db'); // ton client Supabase

const User = {
  create: async ({ email, password_hash, name }) => {
    const { data, error } = await supabase
      .from('users')
      .insert([{ email, password_hash, name, role: 'user', is_verified: false }])
      .select(); // retourne les colonnes insérées
    if (error) throw error;
    return data[0];
  },

  findByEmail: async (email) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email);
    if (error) throw error;
    return data[0];
  },

  findById: async (id) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id);
    if (error) throw error;
    return data[0];
  },

  verifyEmail: async (id) => {
    const { data, error } = await supabase
      .from('users')
      .update({ is_verified: true })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  updateProfile: async (id, { name, photo_url, password_hash }) => {
    const updates = {};
    if (name) updates.name = name;
    if (photo_url) updates.photo_url = photo_url;
    if (password_hash) updates.password_hash = password_hash;

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  getAll: async () => {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, photo_url, role');
    if (error) throw error;
    return data;
  }
};

module.exports = User;
