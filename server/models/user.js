const { ObjectId } = require("mongodb");
const { db } = require("../config/mongodb");
const { hashPassword } = require("../helpers/bcrypt");

class User {
  static col() {
    return db.collection("users");
  }

  static async findAll() {
    try {
      const result = await this.col().find().toArray();

      return result;
    } catch (error) {
      console.log(error);
    }
  }

  static async findByPk(id) {
    try {
      const result = await this.col().findOne({ _id: new ObjectId(id) });
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

  static async create(newUser) {
    try {
      newUser.password = hashPassword(newUser.password);
      const result = await this.col().insertOne(newUser);

      delete newUser.password;

      return {
        ...newUser,
        _id: result.insertedId,
      };
    } catch (error) {
      console.log(error);
    }
  }

  static async search(keyword) {
    try {

      const result = await this.col()
        .find({
          $or: [
            {
              name: { $regex: keyword, $options: "i" },
            },
            {
              username: { $regex: keyword, $options: "i" },
            },
          ],
        })
        .toArray();

      return result;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = User;
