const mongoose = require('mongoose');
const dotenv = require('dotenv');
const socketIO = require("socket.io")

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message ,err.stack);
  process.exit(1);
});

if(process.env.NODE_ENV == "production"){
    dotenv.config({path : ".env.production"})
}else{
    dotenv.config({path: '.env'})
}
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

const io = socketIO(server)

io.on("connection" ,(socket) => {
    console.log("Client Connected!")
    socket.emit("crypto" ,"crypto WebSite")

    socket.on("disconnect" ,() => {
        console.log("client Disconnect!")
    })
})

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});