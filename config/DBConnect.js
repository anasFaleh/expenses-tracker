const mongoose = require('mongoose')
const colors = require('colors');

const connectDB = () => {
mongoose.connect(process.env.URI, { useNewUrlParser : true, useUnifiedTopology : true})
.then((res)=>console.log('> Connected...'.bgCyan))
.catch(err=>console.log(`> Error while connecting to mongoDB : ${err.message}`.underline.red ))
}

module.exports = connectDB