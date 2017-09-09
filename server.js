var express = require('express');
var app = express();
var router = require('./router');
var mongoose   = require('mongoose');
var bodyParser = require('body-parser');
var url = require('./api/url');
var config = require(`./config/${process.env.NODE_ENV === 'production' ? 'production' : 'develop'}.json`);

mongoose.Promise = global.Promise;
mongoose.connect(config.mongoUrl, {
  user: process.env.MONGOLAB_USER,
  pass: process.env.MONGOLAB_PASSWORD,
}).then(() => {
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
  console.error(`Could not connect with Mongo database on ${config.mongoUrl}`);
});
