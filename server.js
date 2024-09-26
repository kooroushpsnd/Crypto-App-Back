const mongoose = require('mongoose');
const dotenv = require('dotenv');
const socketIO = require("socket.io")
const Crypto = require("./models/cryptoModel")
const cors = require('cors')

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message ,err.stack);
  process.exit(1);
});

dotenv.config({path: '.env'})

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

const io = new socketIO.Server(server ,{
  cors: {
    origin: '*',
    methods: ["GET" ,"POST"]
  }
})

app.use(cors())

io.on("connection" ,(socket) => {
    const sendCryptoData = async () => {
      let crypto = await Crypto.find()
      if (crypto.length == 0) crypto = 'fail'

      socket.emit("cryptoData" , crypto)
    }
    sendCryptoData()
    setInterval(sendCryptoData ,53000)
})

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});