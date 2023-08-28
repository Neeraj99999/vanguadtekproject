
 
 var mysql = require('promise-mysql');
 
 const initConnection = async() => {
     try {
         var config = {
             host: "localhost",
             user: "root",
             password: "admin",
             database: "db",
             port: '3306'
         };
         const connection = await mysql.createConnection(config)
         console.log("Mysql connection created")
         return connection;
     } catch (error) {
         console.log("Mysql connection failed")
         return false;
     }
 }
 
 const closeConnection = (connection) => {
     try {
         connection.destroy();
         connection = {};
         console.log("connection closed");
     } catch (error) {
         console.log("connection not closed");
     }
 
 }
 
 async function selectFunction(connection,sqlQuery) {
     try {
         let resp = await connection.query(sqlQuery);
         return resp;
     } catch (error) {
         console.log(error);
         return false;
     }
 }
 
 async function insertFunction(connection,sqlQuery,parameter) {
         let resp = await connection.query(sqlQuery,[parameter]);
         return resp;
}

module.exports = {
    initConnection,
    closeConnection,
    selectFunction,
    insertFunction
}