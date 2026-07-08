// backend/src/utils/supabase.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();


const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);



const uploadProfilePhoto = async (
  fileBuffer,
  fileName,
  mimeType,
  userId
) => {

  const filePath = `${userId}-${Date.now()}.jpg`;


  console.log("SUPABASE UPLOAD START");
  console.log("Bucket :", process.env.SUPABASE_BUCKET);
  console.log("Path :", filePath);



  const { error } = await supabase
    .storage
    .from(process.env.SUPABASE_BUCKET)
    .upload(
      filePath,
      fileBuffer,
      {
        contentType: mimeType,
        upsert: true
      }
    );


  if(error){

    console.error(
      "SUPABASE UPLOAD ERROR",
      error
    );

    throw error;

  }



  const { data } = supabase
    .storage
    .from(process.env.SUPABASE_BUCKET)
    .getPublicUrl(filePath);



  console.log(
    "PUBLIC URL:",
    data.publicUrl
  );


  return data.publicUrl;

};



module.exports={
  supabase,
  uploadProfilePhoto
};