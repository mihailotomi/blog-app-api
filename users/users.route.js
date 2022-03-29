import express from "express";
import UsersDAO from "./usersDAO.js";

const router = express.Router();

router.route("/").get(async (req, res, next) => {
  try {
    const response = await UsersDAO.getUser({ id: req.query.id });

    res.json(response);
  } catch (e) {
    res.json({ error: e });
  }
});

router.route("/").post(async (req, res, next) => {
  try {
    const response = await UsersDAO.addUser({
      id: req.body.id,
      userName: req.body.userName,
    });

    res.json(response);
  } catch (e) {
    res.json({ error: e });
  }
});

export default router;
