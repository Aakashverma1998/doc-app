const User = require("../models/user");
const Doctor = require("../models/doctor");
const Appiontment = require("../models/appointments")

const getDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.body.userId });
    if (!doctor) {
      return res
        .status(200)
        .send({ success: true, message: "Doctor not found." });
    }
    return res.status(200).send({
      success: true,
      message: "Doctor data fetch Successfully.",
      data: doctor,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ success: false, message: err });
  }
};

const updateProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.body.userId },
      req.body,
      { new: true }
    );
    return res.status(200).send({
      success: true,
      message: "Doctor profile updated Successfully.",
      data: doctor,
    });
  } catch (err) {
    return res.status(500).send({ success: false, message: err });
  }
};

const getSingleDoc = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ _id: req.body.doctorId });
    return res.status(200).send({
      success: true,
      message: "Doctor profile fetch Successfully.",
      data: doctor,
    });
  } catch (err) {
    return res.status(500).send({ success: false, message: err });
  }
};

const doctorAppointment = async(req,res)=>{
  try{
    const appointment = await Appiontment.find({}).populate("userId");;
    return res.status(200).send({
      success: true,
      message: "Doctor Appointment fetch Successfully.",
      data: appointment,
    });

  }catch(err){
    return res.status(500).send({ success: false, message: err });

  }
}

const updateAppointmentStatus = async(req,res)=>{
  try{
    const {appiontmentId, status} = req.body
    const appiontment = await Appiontment.findByIdAndUpdate(appiontmentId,{status})
    const user = await User.findOne({ _id: appiontment.userId });
    user.notification.push({
      type: "Appointment-status-update",
      message: `Your appointment has been updated ${status}`,
      onClickPath: "/doctor-appiontment",
    });
    await user.save();
    return res.status(200).send({
      success: true,
      message: "Doctor Appointment update Successfully.",
      data: appiontment,
    });

  }catch(err){
    console.log(err);
    return res.status(500).send({ success: false, message: err });
  }
}

module.exports = {
  getDoctor,
  updateProfile,
  getSingleDoc,
  doctorAppointment,
  updateAppointmentStatus
};
