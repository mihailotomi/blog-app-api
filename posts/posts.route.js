import express from "express";
import PostsDAO from "./postsDAO.js";

const router = express.Router();

router.route("/").get(async (req, res, next) => {
  const postsPerPage = req.query.postsPerPage
    ? parseInt(req.query.postsPerPage)
    : 10;

  const page = req.query.page ? parseInt(req.query.page) : 0;
  const sortBy = req.query.sortBy ? req.query.sortBy : "createdAt";
  const sortOrder = req.query.sortOrder ? req.query.sortOrder : -1;
  console.log(req.query);

  let filters = {};
  if (req.query.type) {
    filters.type = req.query.type;
  } else if (req.query.title) {
    filters.title = req.query.title;
  }

  const { postList, postCount } = await PostsDAO.getPosts({
    postsPerPage,
    page,
    filters,
    sortBy,
    sortOrder,
  });

  let response = {
    posts: postList,
    number_of_posts: postCount,
  };

  res.json(response);
});

router.route("/post").get(async (req, res, next) => {
  const post = await PostsDAO.getPost(req.query.id);
  res.json(post);
});

router.route("/").post(async (req, res, next) => {
  try {
    const title = req.body.title;
    const content = req.body.content;
    const userId = req.body.userId;
    const date = new Date();

    const response = await PostsDAO.addPost({
      title,
      content,
      userId,
      date,
    });

    res.json({ _id: response.insertedId, title, content, userId, date });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.route("/").patch(async (req, res, next) => {
  try {
    let response = await PostsDAO.updatePost({
      id: req.body.id,
      title: req.body.title,
      content: req.body.content,
    });

    res.json(response);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.route("/").delete(async (req, res, next) => {
  try {
    const id = req.body.id;
    const userId = req.body.userId;

    let response = await PostsDAO.deletePost({ id, userId });

    var { error } = response;
    if (error) {
      res.status.json({ error });
    }
    if (response.modifiedCount === 0) {
      throw new Error(
        "unable to update review. User may not be original poster"
      );
    }
    res.json({ _id, status: "success" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
