import express from "express";
import LikesDAO from "./likesDAO.js";

const router = express.Router();

router.route("/").get(async (req, res, next) => {
  try {
    const postId = req.query.postId;
    const { score } = await LikesDAO.getScore({ postId });

    res.json({ postId, score });
  } catch (e) {
    res.json({ error: e });
  }
});

router.route("/").post(async (req, res, next) => {
  try {
    const postId = req.body.postId;
    const userId = req.body.userId;
    const vote = req.body.vote;

    const response = await LikesDAO.vote({ userId, postId, vote });

    res.json(response);
  } catch (e) {
    res.json({ error: e });
  }
});

export default router;
