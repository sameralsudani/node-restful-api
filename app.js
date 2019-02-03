const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

mongoose.connect(
  'mongodb://samer:' +
    process.env.MONGO_ATLAS_PW +
    '@cluster0-shard-00-00-f3xqk.mongodb.net:27017,cluster0-shard-00-01-f3xqk.mongodb.net:27017,cluster0-shard-00-02-f3xqk.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true',

  {
    useNewUrlParser: true
  }
);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-allow-Methods', 'PUT,POST,PATCH,DELETE,GET');
    return res.status(200).json({});
  }
  next();
});

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
