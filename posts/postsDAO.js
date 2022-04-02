import { ObjectId } from "mongodb";

let posts;

export default class PostsDAO {
  static async injectDB(conn) {
    if (posts) {
      return;
    }

    try {
      posts = await conn.db(process.env.BLOG_NS).collection("posts");
    } catch (e) {
      console.error(`Unable to connect in PostsDAO: ${e}`);
    }
  }

  static async getPosts({
    postsPerPage = 10,
    page = 0,
    filters = null,
    sortBy = "createdAt",
    sortOrder,
  } = {}) {
    let query;

    if (filters) {
      if ("title" in filters) {
        query = { $text: { $search: filters["title"] } };
      } else if ("type" in filters) {
        query = { type: { $eq: filters["type"] } };
      }
    }
    try {
      console.log(sortOrder);
      const cursor = await posts
        .find(query)
        .limit(postsPerPage)
        .skip(page * postsPerPage)
        .sort({ [sortBy]: sortOrder });

      const postList = await cursor.toArray();
      const postCount = await posts.countDocuments();

      return { postList, postCount };
    } catch (e) {
      console.error(e);
      return { postList: [], postCount: 0 };
    }
  }

  static async getPost(id) {
    try {
      const post = await posts.findOne({ _id: ObjectId(id) });
      return post;
    } catch (e) {
      console.error(e);
      return {};
    }
  }

  static async addPost({ title, content, userId, date }) {
    try {
      return await posts.insertOne({
        title,
        content,
        userId,
        createdAt: date,
      });
    } catch (e) {
      console.error(e);
      return { error: e };
    }
  }

  static async updatePost({ id, title, content }) {
    try {
      const updated = {};
      if (title) {
        updated.title = title;
      }
      if (content) {
        updated.content = content;
      }
      await posts.updateOne({ _id: ObjectId(id) }, { $set: updated });
      return await posts.findOne({ _id: ObjectId(id) });
    } catch (e) {
      console.error(e);
      return { error: e };
    }
  }

  static async deletePost({ id, userId }) {
    try {
      return await posts.deleteOne({ _id: ObjectId(id), userId });
    } catch (e) {}
  }
}
