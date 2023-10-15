const router = require("express").Router();
const { auth } = require("../middleware/auth");
const { getUsers, getAllDoctors,changeAccountStatus } = require("../controllers/adminController");

router.get("/getAllUsers", auth, getUsers);
router.get("/getAllDoctors", auth, getAllDoctors);

router.post("/changeAccountStatus", auth, changeAccountStatus);

module.exports = router;
