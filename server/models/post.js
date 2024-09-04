const { ObjectId } = require("mongodb");
const { db } = require("../config/mongodb");

class Post {
  static col() {
    return db.collection("posts");
  }

  static async findAll() {
    try {
      const pipeline = [];

      pipeline.push({
        $lookup: {
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "author",
        },
      });

      pipeline.push({
        $unwind: {
          path: "$author",
        },
      });

      pipeline.push({
        $sort: {
          createdAt: -1,
        },
      });

      const result = await this.col().aggregate(pipeline).toArray();

      return result;
    } catch (error) {
      console.log(error);
    }
  }

  static async findByPk(id) {
    try {
      const pipeline = []

      pipeline.push({
        $match: {
          _id: new ObjectId(id),
        },
      });

      pipeline.push({
        $lookup: {
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "author",
        },
      });

      pipeline.push({
        $unwind: {
          path: "$author",
        },
      });

      const result = await this.col().aggregate(pipeline).toArray();
      console.log(result, '<<<<< resModel');
      
      // const result = await this.col().findOne({ _id: new ObjectId(id) });
      return result[0];
    } catch (error) {
      console.log(error);
    }
  }

  static async create(newPost) {
    try {
      const result = await this.col().insertOne(newPost);
      return {
        ...newPost,
        _id: result.insertedId,
      };
    } catch (error) {
      console.log(error);
    }
  }

  static async push(postId, path, value) {
    value.createdAt = value.updatedAt = new Date().toISOString();

    const result = await this.col().updateOne(
      { _id: new ObjectId(postId) },
      {
        $push: { [path]: value },
      }
    );
    return result;
  }
}

module.exports = Post;
