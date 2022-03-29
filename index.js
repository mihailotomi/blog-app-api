import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
import PostsDAO from "./posts/postsDAO.js";
import UsersDAO from "./users/usersDAO.js";

async function main() {
  dotenv.config();

  const client = new mongodb.MongoClient(process.env.BLOG_DB_URI, {
    useNewUrlParser: true,
  });
  const port = process.env.PORT || 3002;

  try {
    await client.connect();
    await PostsDAO.injectDB(client);
    await UsersDAO.injectDB(client);

    app.listen(port, () => {
      console.log("Server is up on port: " + port);
    });
  } catch (e) {
    console.error(e);
  }
}
main().catch(console.error);
