const db = require('../models/db');
const fs = require('fs');
const config = require('../config/config');

const setupDataBase = async () => {
    let createDB = await runSetupQuery("./create_db.sql");
    if (createDB){
        let createUsers = await runSetupQuery("users_create.sql");
        if (createUsers){
            let insertAdmin = await runSetupQuery("insert_admin.sql");
            console.log("Setup database is completed!!");
            if (insertAdmin) {
                console.log("Sample data inserted");
                console.log("next step: npm run dev / npm start");
            }
            process.exit();
        }
    } else {
        console.log("Error while setup database.")
        process.exit();
    }
}

const runSetupQuery = (filename)=> {
    const data = fs.readFileSync(require('path').resolve(__dirname,filename), 'utf8').toString();
    return db.runQuery(data)
    .then(() => {
        console.log(`${filename} did it's work :)`);
        return true;
    })
    .catch(
        (err) => {
            console.log("didnt work " + err);
            return false;
        }
    )
}

db.connect(config.setupDb)
.then(()=>{
    setupDataBase();
})
.catch((err)=>{
    console.log(err)
    process.exit();
});