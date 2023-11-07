const express = require("express");
const router = express.Router();
//impoort middlewares
const {
  requireSignin,
  authMiddleware,
  adminMiddleware,
} = require("../helpers/auth");
//import controllers
const {
  create,
  update,
  deleteTopic,
  followOrUnfollowTopic,
  getFollowCount,
} = require("../controllers/topic");
// import validator
router.post("/", requireSignin, authMiddleware, create);
router.put("/:id", requireSignin, authMiddleware, update);
router.delete("/:id", requireSignin, authMiddleware, deleteTopic);
router.put("/:id/follow", requireSignin, authMiddleware, followOrUnfollowTopic);
router.get("/:id", getFollowCount);

module.exports = router;
