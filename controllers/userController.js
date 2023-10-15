const User = require("../models/user");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv").config();
const Doctor = require("../models/doctor");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const Appiontment = require("../models/appointments");

const addUser = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    switch (true) {
      case !name:
        return res.send({ message: "name is required.." });
      case !email:
        return res.send({ message: "email is required.." });
      case !password:
        return res.send({ message: "password is required.." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.send({
        success: false,
        message: "Already Register please login.",
      });
    }
    let userData = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    };
    const user = await User(userData).save();
    return res
      .status(201)
      .send({ success: true, message: "User Register Sucessfully", user });
  } catch (err) {
    res.status(500).send({ sucess: false, message: "Error is Registeration" });
  }
};

const UserLogin = async (req, res) => {
  try {
    if (req.body.email && req.body.password) {
      const user = await User.findOne({ email: req.body.email.toLowerCase() });
      if (!user) {
        return res.json({
          sucess: false,
          message: "Invalid Credentials..",
          statusCode: 400,
        });
      }
      const pass = await bcrypt.compare(req.body.password, user.password);
      if (pass) {
        let token = jwt.sign(
          { _id: user._id, email: user.email },
          process.env.secretKey,
          { expiresIn: process.env.expiresIn }
        );
        let data = {
          id: user.id,
          name: user.name,
          email: user.email,
        };
        res.status(200).send({
          success: true,
          message: "Login success",
          User: data,
          token: token,
        });
      } else {
        return res.json({
          success: false,
          message: "Invalid Email or Password..",
          statusCode: 400,
        });
      }
    } else {
      return res.json({
        success: false,
        message: "Invalid Email or Password..",
        statusCode: 400,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: "Error is Login" });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res
        .status(200)
        .send({ success: true, message: "User not found." });
    }
    return res
      .status(200)
      .send({ success: true, message: "User fetch Successfully.", data: user });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ success: false, message: err });
  }
};
const applyDoctor = async (req, res) => {
  try {
    let {
      firstName,
      lastName,
      email,
      phone,
      address,
      specialization,
      fees,
      experience,
    } = req.body;

    switch (true) {
      case !firstName:
        return res.send({ message: "firstName is required.." });
      case !lastName:
        return res.send({ message: "lastName is required.." });
      case !email:
        return res.send({ message: "email is required.." });
      case !phone:
        return res.send({ message: "phone is required.." });
      case !address:
        return res.send({ message: "address is required.." });
      case !specialization:
        return res.send({ message: "specialization is required.." });
      case !fees:
        return res.send({ message: "fees is required.." });
      case !experience:
        return res.send({ message: "experience is required.." });
    }
    const resp = await Doctor(req.body).save();
    const adminUser = await User.findOne({ isAdmin: true });
    const notification = adminUser.notification;
    notification.push({
      type: "apply-doctor-request",
      message: `${resp.firstName} ${resp.lastName} Has applied for a doctor account`,
      data: {
        doctorId: resp._id,
        name: resp.firstName + " " + resp.lastName,
        onClickPath: "/admin/doctors",
      },
    });
    await User.findByIdAndUpdate(
      adminUser._id,
      { notification },
      { new: true }
    );
    return res
      .status(200)
      .send({ success: true, message: "Doctor Account Applied Successfully." });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ success: false, message: err });
  }
};

const getAllNotification = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId }).select(
      "-password"
    );
    const seennotification = user.seennotification;
    const notification = user.notification;
    seennotification.push(...notification);
    user.notification = [];
    user.seennotification = notification;
    const updatedUser = await user.save();
    return res.status(200).send({
      success: true,
      message: "all notification marked as read",
      data: updatedUser,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, message: "Error in Notification", err });
  }
};

const deleteAllNotification = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId }).select(
      "-password"
    );
    user.notification = [];
    user.seennotification = [];
    const updateUser = await user.save();
    return res.status(200).send({
      success: true,
      message: "all notifications has deleted",
      data: updateUser,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Unable to delete all Notifications",
      err,
    });
  }
};

const allDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.find({ status: "approved" });
    return res.status(200).send({
      success: true,
      message: "all doctor list feth successfully",
      data: doctor,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Unable to get doctor list",
      err,
    });
  }
};
const bookAppointment = async (req, res) => {
  try {
    req.body.status = "pending";
    req.body.date = moment(req.body.date, "DD-MM-YYYY")
    req.body.time = moment(req.body.time, "HH:mm")
    const newAppointment = new Appiontment(req.body);
    await newAppointment.save();
    const user = await User.findOne({ _id: req.body.doctorInfo.userId });
    user.notification.push({
      type: "New-Appiontment-Request",
      message: `A new Appiontment Request from ${req.body.userInfo.name}`,
      onClickPath: "/user/appiontment",
    });
    await user.save();
    return res.status(200).send({
      success: true,
      message: "Appiontment Book successfully",
      data: newAppointment
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Unable to book doctor appointment",
      err,
    });
  }
};
const bookAvliablity = async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YYYY")
    const fromTime = moment(req.body.time, "HH:mm").subtract(1, "hours")
    const toTime = moment(req.body.time, "HH:mm").add(1, "hours")
    const doctorId = req.body.doctorId;
    const appoientments = await Appiontment.find({
      doctorId,
      date,
      time: { $gte: fromTime, $lte: toTime },
    });
    if (appoientments.length > 0) {
      return res.status(200).send({
        success: false,
        message: "Appointments not avaliable at this time",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Appointments Available",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Unable to book Avliablity",
      err,
    });
  }
};

const appointmentList = async (req, res) => {
  try {
    const appiontment = await Appiontment.find().populate("userId");
    return res.status(200).send({
      success: true,
      message: "User Appiontment list fetch successfully",
      data: appiontment,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Unable to fetch Appointment List",
      err,
    });
  }
};


module.exports = {
  addUser,
  UserLogin,
  getUser,
  applyDoctor,
  getAllNotification,
  deleteAllNotification,
  allDoctor,
  bookAppointment,
  bookAvliablity,
  appointmentList
};
