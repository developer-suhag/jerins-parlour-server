const express = require("express");
const { MongoClient, CURSOR_FLAGS } = require("mongodb");
const app = express();
const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qow90.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  await client.connect();

  const database = client.db("jerins_parlour");
  const appointmentCollection = database.collection("appointments");
  const userCollection = database.collection("users");
  try {
    // save user
    app.put("/users", async (req, res) => {
      console.log("hitting put");
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.json(result);
    });
  } finally {
    //   await client.close()
  }
}

run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Doctors portals server is running");
});

app.listen(port, () => {
  console.log(`listening at ${port}`);
});
