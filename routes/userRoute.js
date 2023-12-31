const express = require("express");
const userRoute = express();
const session = require("express-session");
const config = require("../config/config");
const userAuth = require("../middleware/userAuth");
const Count = require("../middleware/cartCount");


// userRoute.use(
//   session({
//     secret: config.sessionSecret,
//     resave: false,
//     saveUninitialized: true,
//   })
// );
userRoute.use(Count);

const userController = require("../controller/userController");
const cartController = require("../controller/cartController");
const orderController = require("../controller/orderController");
const couponController = require("../controller/couponController");
const chatController = require("../controller/chatController");
userRoute.set("view engine", "ejs");
userRoute.set("views", "./views/users");

userRoute.use(express.json());
userRoute.use(express.urlencoded({ extended: true }));

userRoute.get("/login", userAuth.isLogout, userController.loadlogin);
userRoute.get("/register", userAuth.isLogout, userController.loadResgister);
userRoute.post("/register", userAuth.isLogout, userController.insertUser);
userRoute.get("/userOtp", userAuth.isLogout, userController.loadOtp);
userRoute.post("/userOtp", userAuth.isLogout, userController.verifyOtp);

userRoute.get("/resend-otp", userAuth.isLogout, userController.resendOtp);
userRoute.get("/", userController.loadHome);
userRoute.post("/login", userController.verifyLogin);
userRoute.get("/forgot-password", userController.loadForgotPassword);
userRoute.post("/forgot-password", userController.ForgotPassword);
userRoute.get("/reset-password", userController.resetLoad);
userRoute.post("/reset-password", userController.resetPassword);
userRoute.get("/logout", userController.userLogout);
userRoute.get('/about',userAuth.isLogin,userController.loadAbout)
userRoute.get('/contact',userAuth.isLogin,userController.loadContact)
userRoute.post('/contact',userAuth.isLogin,userController.postContact)







userRoute.get("/shop", userAuth.isLogin, userController.loadShop);
userRoute.get("/productDetails",userAuth.isLogin,userController.loadProductDetails);

userRoute.get("/profile", userAuth.isLogin, userController.loadProfile);

userRoute.get("/cart", userAuth.isLogin, cartController.loadCart);
userRoute.post("/addTocart", userAuth.isLogin, cartController.addToCart);
userRoute.post("/cart-quantity", userAuth.isLogin, cartController.cartQuantity);
userRoute.post("/remove-product",userAuth.isLogin,cartController.removeProduct);

userRoute.post("/profile", userAuth.isLogin, userController.addAddress);

userRoute.get("/editAddress", userAuth.isLogin, userController.loadEditAddress);
userRoute.post("/editAddress",userAuth.isLogin,userController.updateUserAddress);
userRoute.post("/deleteAddress",userAuth.isLogin,userController.deleteUserAddress);
userRoute.post("/changepassword",userAuth.isLogin,userController.changePassword);

userRoute.get("/checkout", userAuth.isLogin, orderController.loadCheckOut);
userRoute.post("/placeOrder", userAuth.isLogin, orderController.placeOrder);
userRoute.get("/orderPlaced/:id", orderController.orderPlacedPageLoad);
userRoute.get("/orders", userAuth.isLogin, orderController.loadOrderPage);
userRoute.get("/orderDetails", userAuth.isLogin, orderController.orderDetails);
userRoute.post("/orderCancel", orderController.cancelOrder);
userRoute.post( "/productReturn",userAuth.isLogin,orderController.productReturn);
userRoute.post( "/verifyPayment",userAuth.isLogin,orderController.verifyPayment);
userRoute.get('/invoice',userAuth.isLogin,orderController.invoice);

userRoute.post( "/checkoutAddress", userAuth.isLogin, orderController.addCheckoutAddress);
userRoute.get("/editCheckoutAddress",userAuth.isLogin,orderController.loadCheckoutEditAddress);
userRoute.post("/editCheckoutAddress",userAuth.isLogin,orderController.editCheckoutAddress);

userRoute.get("/walletHistory",userAuth.isLogin,userController.getWalletHistory);
userRoute.post("/profile/addMoneyToWallet",userAuth.isLogin,userController.postAddMoneyToWallet );
userRoute.post("/verifyWalletpayment",userAuth.isLogin,userController.postVerifyWalletPayment);
userRoute.get("/wallet", userAuth.isLogin, userController.getWallet);


userRoute.get("/coupon",userAuth.isLogin,couponController.couponUserPageLoad)
userRoute.post("/couponApply",userAuth.isLogin, couponController.ApplyCoupon);
userRoute.post("/deleteCoupon",userAuth.isLogin, couponController.deleteAppliedCoupon);





userRoute.get("/chat",userAuth.isLogin, chatController.chatPageLoad)




// userRoute.get('/error-500',userController.error500)

// userRoute.get('*',userController.error404)




module.exports = userRoute;
