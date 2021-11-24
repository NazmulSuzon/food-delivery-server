const express = require('express')
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o5jef.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
  try{
    await client.connect();
    console.log("db connected");

    const database = client.db('foodStore');
    const itemCollection = database.collection('items');

    const restaurentData = database.collection('restaurent');

    const userData = database.collection('userData');

    // Get items API
    app.get('/items', async(req, res) => {
      const cursor = itemCollection.find({});
      const items = await cursor.toArray();
      res.send(items);
    })
    
    // Get Restaurent API
    app.get('/restaurent', async(req, res) => {
      const cursor = restaurentData.find({});
      const restaurent = await cursor.toArray();
      res.send(restaurent);
    })
    
    // post data
    app.post('/userData', async(req,res) => {
      const userOrder = req.body;
      const result = await userData.insertOne(userOrder);
      console.log("hit post");
      res.json(result)
    })

    app.get('/userData', async(req, res) => {
      const cursor = userData.find({});
      const data = await cursor.toArray();
      res.send(data);
    })

    // Delete User Order
    app.delete('/userData/:id', async (req, res) => {
      const id = parseInt(req.params.id);
      const query = {id: id};
      console.log('okay',query)
      const result = await userData.deleteOne(query);
      res.send(result.deletedCount>0);
      console.log(result)
  })
  }
  finally{
    // await client.close()
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

