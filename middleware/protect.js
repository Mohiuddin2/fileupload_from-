const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const {users} = require('../auth')

let role;

// @desc Proting with jwt Token
// @route POST /movie
// @access Private
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(" ")[1];
  }
  //  Make sure token exists
  if (!token) {
    return res.send("Token is not Found or Invalid Token");
  }
  try {
    // Verify token

    const verifytoken = jwt.verify(token, process.env.JWT_SECRET)
    role = verifytoken.role;
    req.user = users.find((u)=> verifytoken.role === u.username)
    next();
  } catch (err) {
    res.status(404).send(err.message);
  }
});

// Exporting role to use the role externally.
exports.userRole = () => {
  return role;
};