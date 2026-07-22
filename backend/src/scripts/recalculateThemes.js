const pool = require('../config/db');
const {
updateUserThemeStats
}=require('../services/themeScore.service');


const run = async()=>{


const users =
await pool.query(

`
SELECT id

FROM users

`

);



for(const user of users.rows){

await updateUserThemeStats(
user.id
);


}



console.log(
"Recalcul terminé"
);


process.exit();


};


run();