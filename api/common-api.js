var url = require('./url');

module.exports = {
  getAll: function (Model) {
    return function (req, res) {
      Model.find(function (err, items) {
        if (err) {
          res.send(err);
        }

        res.json({
          count: items.length,
          results: items.map((item) => ({
            [Model.nameField]: item[Model.nameField],
            url: item.url
          }))
        });
      });
    }
  },
  postAll: function (Model, identifier, filename) {
    return function (req, res) {
      Model.remove({}, function (err) {
        if (err) {
          res.send(err);
        }
      });
      var items = require(`../data/${filename}`).map(item => {
        item.url = url.create(Model.slug, item[identifier]);
        return item;
      });
      Model.insertMany(items, function (err) {
        if (err) {
          res.send(err);
        }
        res.sendStatus(200);
      });
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
        if (item) {
          res.json(item);
        } else {
          res.sendStatus(404);
        }
      });
    }
  },
  post: function (Model, identifier) {
    return function (req, res) {
      req.body.url = req.body.url || url.create(Model.slug, req.body[identifier]);
      Model.create(req.body, function (err, item) {
        if (err) {
          res.send(err);
        }
        res.json(item);
      })
    }
  },
  put: function (Model, field, paramName) {
    return function(req, res) {
      Model.findOneAndUpdate({ [field]: req.params[paramName] }, req.body, { new: true }, function(err, item) {
        if (err) {
          res.send(err);
        }
        if (item) {
          res.json(item);
        } else {
          res.sendStatus(404);
        }
      });
    }
  },
  delete: function (Model, field, paramName) {
    return function (req, res) {
      Model.remove({ [field]: req.params[paramName] }, function (err, item) {
        if (err) {
          res.send(err);
        }
        if (item) {
          res.sendStatus(200);
        } else {
          res.sendStatus(404);
        }
      });
    }
  }
};
