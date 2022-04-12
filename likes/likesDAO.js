import { ObjectId } from "mongodb";

let likes;

export default class LikesDAO {
  static async injectDB(conn) {
    if (likes) {
      return;
    }

    try {
      likes = await conn.db(process.env.BLOG_NS).collection("post_likes");
    } catch (e) {
      console.error(`Unable to connect in LikesDAO: ${e}`);
    }
  }

  static async getScore({ postId }) {
    try {
      const postLikes = await likes.find({ postId, like: true });
      const postDislikes = await likes.find({ postId, like: false });
      const likesArray = await postLikes.toArray();
      const dislikesArray = await postDislikes.toArray();
      const numOfLikes = likesArray.length;
      const numOfDislikes = dislikesArray.length;
      console.log(numOfDislikes);
      const score = numOfLikes - numOfDislikes;

      return { score: score };
    } catch (e) {
      return { error: e };
    }
  }

  static async vote({ userId, postId, vote }) {
    try {
      const matches = await likes
        .find({ postId, userId, like: vote })
        .toArray();
      if (matches.length > 0) {
        return { message: "Already voted" };
      }

      const oppositeVotes = await likes
        .find({ postId, userId, like: !vote })
        .toArray();
      if (oppositeVotes.length > 0) {
        const response = likes.deleteMany({ postId, userId, like: !vote });
        return response;
      }

      return await likes.insertOne({ userId, postId, like: vote });
    } catch (e) {
      return { error: e };
    }
  }
}
