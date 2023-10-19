const express = require("express")
const userRoute = express()
const session = require('express-session')
const  config = require('../config/config')
const userAuth = require('../middleware/userAuth')

userRoute.use(
    session({
      secret: config.sessionSecret,
      resave: false,
      saveUninitialized: true,
    })
  );

const userController = require("../controller/userController")

userRoute.set("view engine", "ejs");
userRoute.set("views", "./views/users");


userRoute.use(express.json());
userRoute.use(express.urlencoded({ extended: true }));

userRoute.get("/login",userController.loadlogin)
userRoute.get("/register",userController.loadResgister)
userRoute.post('/register',userController.insertUser);
userRoute.get('/userOtp',userController.loadOtp);
userRoute.post('/userOtp',userController.verifyOtp);

userRoute.get('/resend-otp',userController.resendOtp)
userRoute.get("/",userController.loadHome)
userRoute.post("/login",userController.verifyLogin);
userRoute.get('/forgot-password',userController.loadForgotPassword)
userRoute.post('/forgot-password',userController.ForgotPassword)
userRoute.get('/reset-password',userController.resetLoad)
userRoute.post('/reset-password',userController.resetPassword)
userRoute.get("/logout",userController.userLogout)

userRoute.get('/shop',userController.loadShop)
userRoute.get("/productDetails",userController.loadProductDetails)





module.exports = userRoute