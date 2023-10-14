const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

// require("dotenv").config();

const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const otpSend = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: "farzinahammedabc@gmail.com",
        pass: "iirs drxr fais mmqq",
      },
    });
    console.log("hahah");
    // Email message
    const mailOptions = {
      from: "farzinahammedabc@gmail.com",
      to: email,
      subject: "OTP Verification",
      html: `
      <html>
        <head>
          <style>
            /* Add some basic styling to the email for a better user experience */
            body {
              font-family: Arial, sans-serif;
              text-align: center;
            }
            .otp-container {
              background-color: #f4f4f4;
              padding: 20px;
              border-radius: 10px;
              display: inline-block;
            }
          </style>
        </head>
        <body>
          <h1>OTP Verification</h1>
          <p>Your OTP is:</p>
          <div class="otp-container">
            <h2>${otp}</h2>
          </div>
        </body>
      </html>
    `,
    };
    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("error sending email", error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const loadOtp = async (req, res) => {
  try {
    res.redirect("/userOtp");
  } catch (error) {
    console.log(error.message);
  }
};

const verifyOtp = async (req, res) => {
  try {
    console.log("fbhjgdahfj");
    // setting otp date and time
    const otpCode = generateOTP();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10); // OTP expires in 10 minutes

    const userCheck = await User.findOne({ email: req.body.email });
    if (userCheck) {
      res.send("user already exist");
    } else {
      const spassword = await securePassword(req.body.password);
      req.session.Fname = req.body.Fname;
      req.session.Lname = req.body.Lname;
      req.session.mobile = req.body.mobile;
      req.session.email = req.body.email;

      if (
        req.body.Fname &&
        req.body.email &&
        req.body.Lname &&
        req.body.mobile
      ) {
        if (req.body.password === req.body.Cpassword) {
          req.session.password = spassword;
          req.session.otp = {
            code: otpCode,
            expiry: otpExpiry,
          };
          // Send OTP to the user's email
          otpSend(req.session.email, req.session.otp.code);
          console.log(req.session.otp.code);
          res.render("userOtp");
        } else {
          res.render("registration", { message: "Password doesn't match" });
        }
      } else {
        res.render("registration", { message: "Please enter all details" });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const insertUser = async (req, res) => {
  console.log("insert");

  try {
    if (req.session.otp && req.body.otp === req.session.otp.code) {
      console.log("enter");

      const user = await new User({
        firstName: req.session.Fname,
        lastName: req.session.Lname,
        email: req.session.email,
        mobile: req.session.mobile,
        password: req.session.password,
        isVerified: 1,
      });

      const result = await user.save();
      res.redirect("/login");
    } else {
      res.render("userOtp", { message: "invalid OTP" });
    }
  } catch (error) {
    console.log(error);
  }
};

const loadResgister = async (req, res) => {
  try {
    res.render("registration");
  } catch (error) {
    console.log(error.message);
  }
};

const loadlogin = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error.message);
  }
};



  const verifyLogin=async(req,res)=>{
    try {
      const email = req.body.email
      const password = req.body.password
      const userData = await User.findOne({ email: email })
      console.log("userdata " + userData);
      if (userData) {
          const passwordMatch = await bcrypt.compare(password, userData.password)
          if (passwordMatch) {
              console.log('password matched');
              res.redirect('/home')
          } else {
              console.log('password is not matched');
              res.render('login', { message: "password is incorrect" })
          }
      } else {
          console.log('email is not matched');
          res.render('login', { message: "incorrect your email address" })
      }

  } catch (error) {
      console.log(error.message);
  }
}

const loadHome = async (req, res) => {
  try {
    res.render("home");
  } catch (error) {
    console.log(error.message);
  }
};



module.exports = {
  loadlogin,
  loadResgister,
  insertUser,
  verifyOtp,
  loadHome,
  verifyOtp,
  loadOtp,
  verifyLogin
};
