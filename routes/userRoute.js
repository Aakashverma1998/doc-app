const router = require("express").Router();
const {
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
} = require("../controllers/userController");
const { auth } = require("../middleware/auth");
router.post("/addUser", addUser);

router.post("/userLogin", UserLogin);

router.post("/getUser", auth, getUser);

router.post("/apply-doctor", auth, applyDoctor);

router.post("/get-all-notifications", auth, getAllNotification);

router.post("/delete-all-notifications", auth, deleteAllNotification);

router.post("/getAllDoctor", auth, allDoctor);

router.post("/book-appointments", auth, bookAppointment);

router.post("/book-avliablity", auth, bookAvliablity);

router.get("/user-appointments-list", auth, appointmentList);

module.exports = router;
