const mongoose = require('mongoose')
const express = require('express')
const app = express()
const path = require('path')
const config = require('./config/config')
const session = require('express-session')
const dotenv = require('dotenv')
const chatDb = require('./models/chatModel')
const User = require('./models/userModel')

const PORT = process.env.PORT || 5000
const server = app.listen(PORT, function () {
  console.log('servernis running...')
})

const io = require('socket.io')(server)

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

dotenv.config()
mongoose.connect(process.env.MONGO_DB).then(()=>{
  console.log("database connected... ")
})

app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true
  })
)

app.use((req, res, next) => {
  res.locals.req = req
 
  next()
})

app.set('view engine', 'ejs')
app.set('views', './views/users')

app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(express.json())

const userRoute = require('./routes/userRoute')
app.use('/', userRoute)

const adminRoute = require('./routes/adminRoute')
app.use('/admin', adminRoute)

app.use('*', (req, res) => {
  res.render('404')
})
