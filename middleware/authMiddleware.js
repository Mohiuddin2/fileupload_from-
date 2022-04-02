const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, 'net ninja secret', (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/login');
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect('/login');
  }
};

// check current user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    console.log("Cehck usder", token)
  if (token) {
      jwt.verify(token, 'net ninja secret', async (err, decodedToken) => {
          if (err) {
              res.locals.user = null;
              next();
            } else {
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        });
    } else {
        // res.locals.user = null;
        console.log("else block")
        res.redirect('/login')
    
    // next();
  }
};


module.exports = { requireAuth, checkUser };