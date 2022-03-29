let users;

export default class UsersDAO {
  static async injectDB(conn) {
    if (users) {
      return;
    }

    try {
      users = await conn.db(process.env.BLOG_NS).collection("users");
    } catch (e) {
      console.error(`Unable to connect in usersDAO: ${e}`);
    }
  }

  static async getUser({ id }) {
    try {
      const response = await users.findOne({ _id: id });
      return response;
    } catch (e) {
      return { error: e.message };
    }
  }

  static async addUser({ id, userName }) {
    try {
      let number = await users.count({ _id: id });
      if (number != 0) {
        return { status: "already in" };
      }
      await users.insertOne({ _id: id, userName });
      return { status: "inserted" };
    } catch (e) {
      return { error: e.message };
    }
  }
}
