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
  getFollowedTopics,
  getEveryTopic,
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

// Get All Topics not followed
router.get("/", requireSignin, authMiddleware, getAllTopics);

// Get Followed Topics
router.get("/followed/", requireSignin, authMiddleware, getFollowedTopics);

//Get every Topic
router.get("/topics", getEveryTopic);

// Get a Single Topic
router.get("/:id", requireSignin, authMiddleware, getTopic);

module.exports = router;
