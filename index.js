const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const cors = require("cors");
const bodyParser = require("body-parser");
require('dotenv').config()
const app = express()
const port =process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectID;

app.use(cors());
app.use(bodyParser.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jsfnb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("Fusiondb").collection("products");
  const orderCollection = client.db("Fusiondb").collection("orders");

  app.get('/products',(req,res) => {
    productCollection.find()
    .toArray((err, items)=>{
      res.send(items);
    })

  })

  app.get('/product/:id',(req, res) => {
    productCollection.find({_id: ObjectId(req.params.id)})
    .toArray( (err, items) => {
      res.send(items[0]);
    })

  })

  app.get('/orders',(req,res) => {
    orderCollection.find({email: req.query.email})
    .toArray((err, items)=>{
      res.send(items);
    })

  })

  
  app.post('/addProduct', (req, res) =>{
    const newProduct = req.body;
    productCollection.insertOne(newProduct)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })


  app.post('/addOrder', (req, res) =>{
    const newProduct = req.body;
    orderCollection.insertOne(newProduct)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

  app.delete('/delete/:id', (req,res) =>{
    productCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
      res.send(result.deletedCount > 0)
    })
  })


  app.get('/', (req, res) => {
    res.send('Database Connected')
  })

  //client.close();
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})