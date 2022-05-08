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
    const myitemCollection = client.db('warehouse-management-website-').collection('myitem')

    // get items
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
    });

    // Post
    app.post('/item', async(req, res)=>{
      const newItem = req.body;
      const result = await itemCollection.insertOne(newItem);
      res.send(result);
    });

    // UpdateQuantity item

    app.put('/item/:id', async(req, res)=>{
      const id = req.params.id;
      const updateQuantity = req.body;
      const filter = {_id: ObjectId(id)};
      const options = { upsert: true};
      const updateDocs = {
        $set: {
          quantity: updateQuantity.quantity
        }
      };

      const result = await itemCollection.updateOne(filter, updateDocs, options);
      res.send(result);
    })

    // Order Collection API

    app.get('/myitem', async(req, res) =>{
      const email = req.query.email;
      const query = {email: email};
      const cursor = myitemCollection.find(query);
      const items = await cursor.toArray();
      res.send(items);
    })
    
    app.post('/myitem', async(req, res) =>{
      const myitem = req.body;
      const result = await myitemCollection.insertOne(myitem);
      res.send(result);
    })

    // Delete
    app.delete('/item/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await itemCollection.deleteOne(query);
      res.send(result);

      app.delete('/myitem/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await myitemCollection.deleteOne(query);
        res.send(result);
      })
    });
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