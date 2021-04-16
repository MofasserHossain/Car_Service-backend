const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yedps.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get('/', (req, res) => {
  res.send('Listening to server');
});

client.connect((err) => {
  const serviceCollection = client.db('CarService').collection('services');
  console.log('connection successful');
  app.post('/addService', (req, res) => {
    const services = req.body;
    console.log(services);
  });
});

app.listen(port, () => console.log('listening to port ' + port));
