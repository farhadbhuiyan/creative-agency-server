const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.pjknv.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;


const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('service'));
app.use(fileUpload());

const port = 5000;
app.get('/', (req, res) => {
  res.send("Welcome from creative agency db")
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db("creativeAgency").collection("services");

  app.post('/addService', (req, res) => {
    const file = req.files.file;
    const title = req.body.title;
    const description = req.body.description;
    const newImg = file.data;
    const encImg = newImg.toString('base64');

    var image = {
      contentType: file.mimetype,
      size: file.size,
      img: Buffer.from(encImg, 'base64')
    };

    serviceCollection.insertOne({ title, description, image })
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })

  app.get('/services', (req, res) => {
    serviceCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  })
});
app.listen(process.env.PORT || port)

/*=========================================================================
  DUE TO MY EXAM I CAN NOT COMPLETE BACKEND AS PER AS PROJECT REQUIREMENTS
=========================================================================*/