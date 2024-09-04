const { ObjectId } = require("mongodb");
const { db } = require("../config/mongodb");

class Follow {
  static col() {
    return db.collection("follows");
  }

  static async findAll() {
    try {
      const result = await this.col().find().toArray();

      return result;
    } catch (error) {
      console.log(error);
    }
  }

  static async findOne(filter) {
    try {
      const result = await this.col().findOne(filter);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  static async create(newFollow) {
    try {
      newFollow.createdAt = newFollow.updatedAt = new Date().toISOString();
      const result = await this.col().insertOne(newFollow);

      return {
        ...newFollow,
        _id: result.insertedId,
      };
    } catch (error) {
      console.log(error);
    }
  }

  static async deleteFollow(followingId, followerId) {
    try {
      await this.col().deleteMany({
        followingId,
        followerId,
      });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = Follow;
