const User = require("../models/user");
const Doctor = require("../models/doctor");

const getUsers = async (req, res) => {
  try {
    const user = await User.find({}).select("-password");
    if (!user) {
      return res
        .status(200)
        .send({ success: true, message: "User not found." });
    }
    return res.status(200).send({
      success: true,
      message: "all User fetch Successfully.",
      data: user,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ success: false, message: err });
  }
};

const getAllDoctors = async (req, res) => {
  try {
    const doctor = await Doctor.find({}).select("-password");
    if (!doctor) {
      return res
        .status(200)
        .send({ success: true, message: "User not found." });
    }
    return res.status(200).send({
      success: true,
      message: "all Doctors fetch Successfully.",
      data: doctor,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ success: false, message: err });
  }
};

const changeAccountStatus = async (req, res) => {
  try {
    const { doctorId, status } = req.body;
    const doctor = await Doctor.findByIdAndUpdate(
      doctorId,
      { status },
      { new: true }
    );
    const user = await User.findById(doctor.userId);
    const notification = user.notification;
    notification.push({
      type: "doctor-account-request-updated",
      message: `Your Doctor Account Request Has ${status}`,
      onClickPath: "/notification",
    });
    user.isDoctor = status === "approved" ? true : false;
    await user.save();
    return res.status(200).send({
      success: true,
      message: "Account Status Updated Successfully.",
      data: doctor,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ success: false, message: err });
  }
};

module.exports = {
  getUsers,
  getAllDoctors,
  changeAccountStatus,
};
