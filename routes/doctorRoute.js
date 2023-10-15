const router = require("express").Router();
const { auth } = require("../middleware/auth");
const {
  getDoctor,
  updateProfile,
  getSingleDoc,
  doctorAppointment,
  updateAppointmentStatus
} = require("../controllers/doctorController");

router.post("/getDoctorById", auth, getDoctor);
router.post("/updateProfile", auth, updateProfile);

router.post("/getSingleDoc", auth, getSingleDoc);

router.get("/doctor-appointment", auth, doctorAppointment);


router.post("/update-appointment-status", auth, updateAppointmentStatus);

module.exports = router;
