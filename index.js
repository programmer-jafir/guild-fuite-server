const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.Port || 5000;

// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zykkc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();
    const itemCollection = client.db('warehouse-management-website-').collection('item');

    app.get('/item', async (req, res) => {
      const qurey = {};
      const cursor = itemCollection.find(qurey);
      const items = await cursor.toArray();
      res.send(items);
    });
    app.get('/item/:id', async(req, res)=>{
      const id = req.params.id;
      const qurey = {_id: ObjectId(id)};
      const item = await itemCollection.findOne(qurey);
      res.send(item);
    })
  }
  finally {

  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello warehouse-management-website')
})

app.listen(port, () => {
  console.log(`warehouse-management-websit listening on port ${port}`)
})