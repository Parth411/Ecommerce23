const app = require("./app");


const dotenv = require("dotenv");
const connectDatabase = require("./config/database");

//Handling Uncaughted Exception
process.on("uncaughtException",(err)=>{
    console.log(`Error : ${err.message}`);
    console.log(`Shutting Down Server due Uncaughted Error`);
    process.exit(1);
});


//config
dotenv.config({path:"backend/config/config.env"});

//Connect to Database
connectDatabase(); 

const server = app.listen(process.env.PORT,()=>{
    console.log(`Server is running fine on http://localhost:${process.env.PORT}`)
})


//Unhandled Promise Rejection
process.on("unhandledRejection",err=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting Down Server due to unhandled Promise Rejection`);

    server.close(()=>{
        process.exit(1);
    })
})