const express = require("express");
const router = express.Router();

const { supabase } = require("../utils/supabase");


router.get("/", async (req, res) => {

  try {

    const { data, error } = await supabase
      .from("themes")
      .select("id,name")
      .order("name");


    if(error){

      console.error(error);

      return res.status(500).json({
        message:"Erreur récupération thèmes"
      });

    }


    res.json(data);


  } catch(error){

    console.error(error);

    res.status(500).json({
      message:"Erreur serveur"
    });

  }

});


module.exports = router;