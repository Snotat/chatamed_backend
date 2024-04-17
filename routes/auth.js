const {
  addMessage,
  getMessages,
  getRob,
  getmsg,
} = require("../controllers/messageController");
const {
  usersignUp,
  getAllUsers,
  profsignUp,
  usersignIn,
  verifyToken,
  profsignIn,
  getProf,
} = require("../controllers/userController");

const router = require("express").Router();

router.post("/usersignup", usersignUp);
router.post("/usersignin", usersignIn);
router.post("/profsignin", profsignIn);
router.post("/profsignup", profsignUp);
router.get("/allusers", getAllUsers);
router.post("/getprof", getProf);
router.post("/addmessage", addMessage);
router.post("/getmessages", getMessages);
router.post("/getmsg", getmsg);
module.exports = router;
