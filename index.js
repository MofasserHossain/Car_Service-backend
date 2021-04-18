const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// . MongoDB
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yedps.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get('/', (req, res) => {
  res.send('Listening to server');
});

client.connect((err) => {
  // .collections
  const serviceCollection = client.db('CarService').collection('services');
  const reviewsCollection = client.db('CarService').collection('reviews');
  const adminCollection = client.db('CarService').collection('admin');
  const ordersCollection = client.db('CarService').collection('orders');

  console.log('connection successful');
  // .add services
  app.post('/addService', (req, res) => {
    const services = req.body;
    // console.log(services);
    serviceCollection.insertOne(services).then((result) => {
      res.send(result.insertedCount > 1);
    });
  });
  // . read service data
  app.get('/services', (req, res) => {
    serviceCollection.find().toArray((err, services) => {
      res.send(services);
    });
  });

  //.add review
  app.post('/addReviews', (req, res) => {
    const reviews = req.body;
    // console.log(services);
    reviewsCollection.insertOne(reviews).then((result) => {
      res.send(result.insertedCount > 1);
    });
  });
  // . read service data
  app.get('/reviews', (req, res) => {
    reviewsCollection.find().toArray((err, reviews) => {
      res.send(reviews);
    });
  });
  // . delete service
  app.delete('/deleteService/:id', (req, res) => {
    serviceCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.send(result.deletedCount > 0);
      });
  });
  // . read specific data
  app.get('/service/:id', (req, res) => {
    serviceCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, item) => {
        res.send(item);
      });
  });
  // . add admin
  app.post('/addAdmin', (req, res) => {
    const addAdmin = req.body;
    adminCollection.insertOne(addAdmin).then((result) => {
      res.send(result.insertedCount > 1);
    });
  });

  // . add order
  app.post('/addOrder', (req, res) => {
    const addOrder = req.body;
    ordersCollection.insertOne(addOrder).then((result) => {
      res.send(result.insertedCount > 1);
    });
  });
  // .read all orders
  app.get('/orders-list', (req, res) => {
    ordersCollection.find().toArray((err, orders) => {
      res.send(orders);
    });
  });
  // . read orders by user
  app.get('/order', (req, res) => {
    const orderEmail = req.query.email;
    ordersCollection.find({ email: orderEmail }).toArray((err, order) => {
      res.send(order);
    });
  });
  // . update single data
  app.patch('/updateOrder/:id', (req, res) => {
    console.log(req.params.id, req.body.updateState);
    ordersCollection
      .updateOne(
        { _id: ObjectId(req.params.id) },
        {
          $set: {
            orderStatus: req.body.updateState,
          },
        }
      )
      .then((result) => {
        res.send(result.modifiedCount > 0);
        console.log('update successful', result);
      });
  });
  //. admin
  app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    adminCollection.find({ email: email }).toArray((err, admin) => {
      res.send(admin.length > 0);
    });
  });
});

app.listen(port, () => console.log('listening to port ' + port));
