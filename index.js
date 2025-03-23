require('dotenv').config()
const app = require('./app')
const connectDB = require('./config/DBConnect')
const colors = require('colors')


connectDB()

app.listen(process.env.PORT, () => console.log(`> Server is running on port ${process.env.PORT}`.green.bold))