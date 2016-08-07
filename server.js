var express = require('express');
var app = express();
var router = express.Router();

router.get('/', function (req, res) {
  return res.json({ message: 'Hello world!' });
});

app.use('/api', router);

var port = process.env.PORT || 1337;
app.listen(port);
console.log(`Running Walkr API on port ${port}`);
