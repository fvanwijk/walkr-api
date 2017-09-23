var express = require('express');
var app = express();
var router = require('./router');
var mongoose   = require('mongoose');
var bodyParser = require('body-parser');
var url = require('./api/url');
var config = require(`./config/${process.env.NODE_ENV === 'production' ? 'production' : 'develop'}.json`);

mongoose.Promise = global.Promise;
const mongoUser = process.env.MONGOLAB_USER;
mongoose.connect(`mongodb://${mongoUser && mongoUser + ':' + process.env.MONGOLAB_PASSWORD}@${config.mongoUrl}/walkr`, {
  useMongoClient: true
}).then(() => {
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    if (req.method === 'OPTIONS') {
      res.status(200);
    }
    next();
  });

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use('/api', router);
  app.get('*', function(req, res){
    res.sendStatus(404);
  });
  app.listen(url.port);
  console.info(`Connecting with Mongo database on ${config.mongoUrl}`);
  console.info(`Running Walkr API on port ${url.port}`);
}, () => {
  console.error(`Could not connect with Mongo database on ${config.mongoUrl} (user: ${process.env.MONGOLAB_USER})`);
});
