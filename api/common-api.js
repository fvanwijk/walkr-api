var url = require('./url');

module.exports = {
  getAll: function (Model, slug, identifier) {
    return function (req, res) {
      Model.find(function (err, items) {
        if (err) {
          res.send(err);
        }

        res.json({
          count: items.length,
          results: items.map((item) => ({
            name: item.name,
            url: `${url.host}:${url.port}/api/${slug}/${item[identifier]}`
          }))
        });
      });
    }
  },
  postAll: function (Model, filename) {
    return function (req, res) {
      Model.remove({}, function (err) {
        if (err) {
          res.send(err);
        }
      });
      var items = require(`../data/${filename}`);
      items.forEach(item => {
        var model = new Model(item);
        model.save(function (err) {
          if (err) {
            res.send(err);
          }
        })
      });
      res.sendStatus(200);
    }
  },
  deleteAll: function (Model) {
    return function (req, res) {
      Model.remove({}, function (err) {
        if (err) {
          res.send(err);
        }
        res.sendStatus(200);
      });
    }
  },
  get: function (Model, field, paramName) {
    return function(req, res) {
      Model.findOne({ [field]: req.params[paramName] }, function(err, item) {
        if (err) {
          res.send(err);
        }
        res.json(item);
      });
    }
  }
};
