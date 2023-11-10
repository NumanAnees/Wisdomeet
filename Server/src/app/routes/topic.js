const express = require("express");
const router = express.Router();

const { requireSignin, authMiddleware } = require("../helpers/auth");

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

const { topicValidator } = require("../validators/topic");
const { runValidation } = require("../validators");

router.post("/", requireSignin, authMiddleware, topicValidator, runValidation, create);

router.put("/:id", requireSignin, authMiddleware, topicValidator, runValidation, update);

router.delete("/:id", requireSignin, authMiddleware, deleteTopic);
router.put("/:id/follow", requireSignin, authMiddleware, followOrUnfollowTopic);
router.get("/:id/followers", getFollowCount);
router.get("/", requireSignin, authMiddleware, getAllTopics);
router.get("/followed/", requireSignin, authMiddleware, getFollowedTopics);
router.get("/topics", getEveryTopic);
router.get("/:id", requireSignin, authMiddleware, getTopic);

module.exports = router;
