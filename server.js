import express from "express";
import cors from "cors";
import posts from "./posts/posts.route.js";
import users from "./users/users.route.js";
import likes from "./likes/likes.route.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use("/posts", posts);
app.use("/users", users);
app.use("/likes", likes);

export default app;
