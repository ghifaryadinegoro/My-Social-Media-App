const { db, client } = require("./config/mongodb");

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const usersCol = db.collection("User");

    // Register (Add User)
    await usersCol.insertOne({
      name: "user1",
      username: "user1",
      email: "user1@gmail.com",
      password: "123456",
    });

    const allUsers = await usersCol.find().toArray();
    console.log(allUsers);
    

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
