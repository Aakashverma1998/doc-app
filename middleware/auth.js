const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: " Token required..!" });
    }
    const decode = jwt.verify(token, process.env.secretKey);
    const user = await User.findOne({ _id: decode._id });
    if (!user) {
      return res.status(200).json({ success: false, message: "Auth Faild..!" });
    }
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    return res
      .status(403)
      .json({ success: false, message: "Please authenticate..!" });
  }
};

const admin = async (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: " Token required..!" });
    }
    const decode = jwt.verify(token, process.env.secretKey);
    const admin = await Admin.findOne({ _id: decode._id });
    if (!admin) {
      return res.status(200).json({ success: false, message: "Auth Faild..!" });
    }
    req.admin = admin;
    next();
  } catch (err) {
    console.log(err);
    return res
      .status(403)
      .json({ success: false, message: "Please authenticate..!" });
  }
};

module.exports = {
  auth,
};
