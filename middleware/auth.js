// const jwt = require("jsonwebtoken");
// const userModel = require("../models/users");

// exports.loginCheck = (req, res, next) => {
//   try {
//     let token = req.headers.token;
//     token = token.replace("Bearer ", "");
//     decode = jwt.verify(token, process.env.JWT_SECRET);
//     req.userDetails = decode;
//     next();
//   } catch (err) {
//     res.json({
//       error: "You must be logged in",
//     });
//   }
// };

// exports.isAuth = (req, res, next) => {
//   let { loggedInUserId } = req.body;
//   if (
//     !loggedInUserId ||
//     !req.userDetails._id ||
//     loggedInUserId != req.userDetails._id
//   ) {
//     res.status(403).json({ error: "You are not authenticate" });
//   }
//   next();
// };

// exports.isAdmin = async (req, res, next) => {
//   try {
//     let reqUser = await userModel.findById(req.body.loggedInUserId);
//     // If user role 0 that's mean not admin it's customer
//     if (reqUser.userRole === 0) {
//       res.status(403).json({ error: "Access denied" });
//     }
//     next();
//   } catch {
//     res.status(404);
//   }
// };

require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/users");


exports.authenticated = async (req, res, next) => {
  try {
    let token = "";
    token = token ? token : req?.headers?.authorization;
    token = token?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login first!",
      });
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (req.user === null) {
      return res.status(401).json({
        success: false,
        message: "session expired!",
      });
    }
    next();
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//for admin role
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.userRole)) {
      return res.status(401).json({
        success: false,
        message: ` ${req.user.userRole} is not allowed to access this resource`,
      });
    }
    next();
  };
};

