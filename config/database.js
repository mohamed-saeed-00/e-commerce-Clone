const mongoose = require("mongoose")

const dbURL = process.env.DB_CONNECTION
const dbConnection =()=>{
    mongoose
    .connect(dbURL)
    .then((conn)=>{
        console.log(`database connected : ${conn.connection.host}`)   
    })
  
}

module.exports = dbConnection