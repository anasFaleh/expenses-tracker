const express = require('express')
const morgan = require('morgan')
const returnJson = require('./res')
const routes = require('./routes')
const { errorHandler } = require('./middelwares')
const path = require('path')

// response formatter
global.returnJson = returnJson

const app = express()

app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'))
app.use(express.static(path.join(__dirname, "public"))); // يقدم ملفات HTML
app.use(express.json())

routes(app)

errorHandler(app)

module.exports = app
