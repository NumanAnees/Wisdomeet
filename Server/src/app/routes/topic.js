const express = require("express");
const router = express.Router();
//impoort middlewares
const { requireSignin, authMiddleware } = require("../helpers/auth");
//import controllers
const {
  create,
  update,
  deleteTopic,
  followOrUnfollowTopic,
  getFollowCount,
  getAllTopics,
  getTopic,
} = require("../controllers/topic");
// import validator
const { topicValidator } = require("../validators/topic");
const { runValidation } = require("../validators");
//Routes
router.post(
  "/",
  requireSignin,
  authMiddleware,
  topicValidator,
  runValidation,
  create
);
router.put(
  "/:id",
  requireSignin,
  authMiddleware,
  topicValidator,
  runValidation,
  update
);
router.delete("/:id", requireSignin, authMiddleware, deleteTopic);
router.put("/:id/follow", requireSignin, authMiddleware, followOrUnfollowTopic);
router.get("/:id/followers", getFollowCount);
router.get("/", getAllTopics);
router.get("/:id", getTopic);

module.exports = router;
