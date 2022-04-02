
// const User = require("../models/User");
// const crypto = require("crypto");
// const ErrorResponse = require("../utility/errorResponse");
// const asyncHandler = require("../utility/async");
// const sendEmail = require("../utility/sendgmail");
// const Speakeasy = require("speakeasy");
// const Application = require("../models/application.model");



// const register = ()=> (asyncHandler(async (req, res) => {
//       const { name, email, password } = req.body;
//       //Create User
  
//       const secret = Speakeasy.generateSecret({ length: 20 });
//       const otp = secret.base32;
//       const user = await User.create({
//         name,
//         email,
//         password,
//         otp,
//       });
//       console.log("speakeasy", user);
  
//       // const secretReturn = await User.findOne({otp})
//       // console.log(secretReturn.otp)
  
//       const token = Speakeasy.totp({
//         secret: user.otp,
//         encoding: "base32",
//       });
//       // console.log("Token from db", token);
  
//       // console.log("user iddddd", user._id);
  
//       const message = `Reset OTP ${token}, Please copy the and follow the url http://localhost:3000/verify_otp/${user._id}`;
//       // sendEmail
//       try {
//         await sendEmail({
//           email: user.email,
//           subject: "Registration OTP",
//           message,
//         });
//         const token = createToken(user._id);
//         console.log("Register Token", token);
//         res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
//         res.redirect("/application");
//         // return res.status(200).json({ success: true, data: "Email Sent" });
//       } catch (err) {
//         console.log(err);
//         user.resetPasswordToken = undefined;
//         user.resetPasswordExpire = undefined;
  
//         await user.save({ validatBeforeSave: false });
//         return next(new ErrorResponse("Email could not be sent", 500));
//       }
  
//       // sendTokenResponse(user, 200, res);
//     })
//   );
  

//   const verifyOtp =() => async (req, res) => {
//     const { id } = req.params;
//     const user = await User.findOne({ id });
//     const otpdb = user.otp;
//     res.render("verify_otp", { id, otpdb });
//   });
  
//   router.post("/verify_otp/:id", async (req, res) => {
//     console.log("hit verify ");
//     const { id } = req.body;
//     const user = await User.findOne({ id });
//     // const secret = user.otp;
//     // console.log("User otp", secret);
  
//     const otpToken = req.body.otp;
//     console.log("otpToken from body", otpToken);
  
//     const { base32: secret } = user.otp;
  
//     const varify = Speakeasy.totp.verify({
//       secret,
//       encoding: "base32",
//       token: req.body.token,
//       window: 6,
//     });
//     if (varify) {
//       res.send("verify_otp Successfull");
//     } else {
//       console.log("Fail", varify);
//       res.send("Verification fail");
//     }
//   });
  
//   router.get("/login", (req, res) => {
//     res.render("login");
//   });
  

//   const login = () => (asyncHandler(async (req, res, next) => {
//       console.log("it hits");
//       const { email, password } = req.body;
//       // Validate email & password
//       if (!email || !password) {
//         return next(new ErrorResponse("Please Input credentials", 400));
//       }
//       // Check for user
//       const user = await User.findOne({ email }).select("+password");
  
//       if (!user) {
//         return next(new ErrorResponse("Email or Password is not valid", 401));
//       }
//       // check for Password matches
//       const isMatch = await user.matchPassword(password);
//       if (!isMatch) {
//         return next(new ErrorResponse("Email or Password is not valid", 401));
//       }
//       // for check user and cookie
//       try {
//         const token = createToken(user._id);
//         res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
//         // res.status(200).json({ user: user._id });
//         console.log("Tokennnnn for cookie", token);
//         res.redirect("/application");
//       } catch (err) {
//         console.log(err);
//         // const errors = handleErrors(err);
//         // res.status(400).json({ errors });
//       }
//     })
//   );
//   router.get("/reset_password", (req, res) => {
//     res.render("reset_pass");
//   });
  
//   router.get(
//     "/reset_password/:resettoken",
//     asyncHandler(async (req, res) => {
//       const { resettoken } = req.params;
//       res.render("reset_password_page", { resettoken });
//     })
//   );
  
//   // Resetting Passwrd herer
//   router.put(
//     "/reset_password/:resettoken",
//     asyncHandler(async (req, res, next) => {
//       console.log("Console reset password token");
//       const resettoken = req.params.resettoken;
//       console.log("From Param", resettoken);
//       // const  resettoken  ="94f96454a8a1d8db6d5bf5b0895462fa86090fc0";
//       const resetPasswordToken = crypto
//         .createHash("sha256")
//         .update(req.params.resettoken)
//         .digest("hex");
  
//       console.log("resetPasswordToken", resetPasswordToken);
  
//       const user = await User.findOne({
//         resetPasswordToken,
//         resetPasswordExpire: { $gt: Date.now() },
//       });
//       console.log("User", user);
//       if (!user) {
//         return next(new ErrorResponse("Invalid Reset Token", 400));
//       }
//       // if user is found set new password
  
//       user.password = req.body.password;
//       console.log("Passower new", user.password);
//       user.resetPasswordToken = undefined;
//       user.resetPasswordExpire = undefined;
//       await user.save();
  
//       sendTokenResponse(user, 200, res);
//     })
//   );
//   // @desc Forgot Password sending email with reset token
//   // @route POST /localhost:5000/reset_password
//   // @access Public
//   // reset Password email
//   router.post(
//     "/reset-password",
//     asyncHandler(async (req, res, next) => {
//       const user = await User.findOne({ email: req.body.email });
//       if (!user) {
//         return next(new ErrorResponse("Email is not found in Database", 404));
//       }
//       // Generate resetToken
//       const resetToken = user.getResetPasswordToken();
//       await user.save({ validatBeforeSave: false });
//       // Create reset url
//       const resetUrl = `${req.protocol}://${req.get(
//         "host"
//       )}/reset_password/${resetToken}`;
  
//       const message = `Reset password request ${resetUrl}`;
//       // sendEmail
//       try {
//         await sendEmail({
//           email: user.email,
//           subject: "Password reset token",
//           message,
//         });
//         return res.status(200).json({ success: true, data: "Email Sent" });
//       } catch (err) {
//         console.log(err);
//         user.resetPasswordToken = undefined;
//         user.resetPasswordExpire = undefined;
  
//         await user.save({ validatBeforeSave: false });
//         return next(new ErrorResponse("Email could not be sent", 500));
//       }
  
//       res.status(200).json({
//         success: true,
//         data: user,
//       });
//     })
//   );
  
//   // Get token from User Model, create cookie and send
  
//   const sendTokenResponse = (user, statusCode, res) => {
//     // ⁡⁢⁣⁣create token⁡⁡
//     const token = user.getSignedJwtToken();
//     const options = {
//       expires: new Date(
//         Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
//       ),
//       httpOnly: true,
//     };
//     if (process.env.NODE_ENV === "production") {
//       options.secure = true;
//     }
//     res.status(statusCode).cookie("token", token, options).json({
//       success: true,
//       token,
//     });
//   };


//   module.exports = {register, verifyOtp, login}