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
const cartController = require("../controller/cartController")
const orderController =require("../controller/orderController")

userRoute.set("view engine", "ejs");
userRoute.set("views", "./views/users");


userRoute.use(express.json());
userRoute.use(express.urlencoded({ extended: true }));

userRoute.get("/login",userAuth.isLogout,userController.loadlogin)
userRoute.get("/register",userAuth.isLogout,userController.loadResgister)
userRoute.post('/register',userAuth.isLogout,userController.insertUser);
userRoute.get('/userOtp',userAuth.isLogout,userController.loadOtp);
userRoute.post('/userOtp',userAuth.isLogout,userController.verifyOtp);

userRoute.get('/resend-otp',userAuth.isLogout,userController.resendOtp)
userRoute.get("/",userController.loadHome)
userRoute.post("/login",userController.verifyLogin);
userRoute.get('/forgot-password',userController.loadForgotPassword)
userRoute.post('/forgot-password',userController.ForgotPassword)
userRoute.get('/reset-password',userController.resetLoad)
userRoute.post('/reset-password',userController.resetPassword)
userRoute.get("/logout",userController.userLogout)

userRoute.get('/shop',userAuth.isLogin,userController.loadShop)
userRoute.get("/productDetails",userAuth.isLogin,userController.loadProductDetails)

userRoute.get('/profile',userAuth.isLogin,userController.loadProfile)


userRoute.get('/cart',userAuth.isLogin,cartController.loadCart)
userRoute.post('/addTocart',userAuth.isLogin,cartController.addToCart)
userRoute.post('/cart-quantity',userAuth.isLogin,cartController.cartQuantity)
userRoute.post('/remove-product',userAuth.isLogin,cartController.removeProduct)


userRoute.get('/address',userAuth.isLogin,userController.loadAddress)
userRoute.post('/address',userAuth.isLogin,userController.addAddress)

userRoute.get('/editAddress',userAuth.isLogin,userController.loadEditAddress)
userRoute.post('/editAddress',userAuth.isLogin,userController.updateUserAddress)
userRoute.post('/deleteAddress',userAuth.isLogin,userController.deleteUserAddress)


userRoute.get('/checkout',userAuth.isLogin,orderController.loadCheckOut)
userRoute.post('/checkout',userAuth.isLogin,orderController.useThisAddress)
userRoute.post('/checkout/paymentselection',userAuth.isLogin,orderController.selectPayment)





module.exports = userRoute