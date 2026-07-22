const pool = require('../config/db');

const {
updateUserThemeStats
}=require('../services/themeScore.service');


const recalculate = async()=>{


try{


const users = await pool.query(
`
SELECT id
FROM users
`
);


for(const user of users.rows){


console.log(
"Recalcul utilisateur",
user.id
);


await updateUserThemeStats(
user.id
);


}


console.log(
"RECUL TERMINE"
);


process.exit();


}
catch(err){

console.error(err);

process.exit(1);

}


};


recalculate();