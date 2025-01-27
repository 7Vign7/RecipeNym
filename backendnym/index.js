const express = require('express');
const sequelize = require('./config/db');

const app = express()
const PORT = 8080;

async function startApp(){
    try{
        await sequelize.authenticate();
        console.log("Database connected");

        app.listen(PORT, ()=>{
            console.log(`Server started on http://localhost:${PORT}`);
        })

    }
    catch(e) {
        console.error(e);
    }
}
startApp();