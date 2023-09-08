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

//----------------------------Routes-------------------------------------

// Create a Topic
router.post(
  "/",
  requireSignin,
  authMiddleware,
  topicValidator,
  runValidation,
  create
);

// Update a Topic
router.put(
  "/:id",
  requireSignin,
  authMiddleware,
  topicValidator,
  runValidation,
  update
);

// Delete a Topic
router.delete("/:id", requireSignin, authMiddleware, deleteTopic);

// Follow/Unfollow a Topic
router.put("/:id/follow", requireSignin, authMiddleware, followOrUnfollowTopic);

// Get Followers Count for a Topic
router.get("/:id/followers", getFollowCount);

// Get All Topics
router.get("/", getAllTopics);

// Get a Single Topic
router.get("/:id", getTopic);
module.exports = router;
