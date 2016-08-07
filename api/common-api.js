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
  postAll: function (Model, filename) {
    return function (req, res) {
      Model.remove({}, function (err) {
        if (err) {
          res.send(err);
        }
      });
      var items = require(`../data/${filename}`).map(item => {
        item.url = url.create(Model.slug, item[Model.identifierField]);
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
  get: function (Model) {
    return function(req, res) {
      Model.findOne({ [Model.identifierField]: req.params.id }, function(err, item) {
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
  post: function (Model) {
    return function (req, res) {
      req.body.url = req.body.url || url.create(Model.slug, req.body[Model.identifierField]);
      Model.create(req.body, function (err, item) {
        if (err) {
          res.send(err);
        }
        res.json(item);
      })
    }
  },
  put: function (Model) {
    return function(req, res) {
      Model.findOneAndUpdate({ [Model.identifierField]: req.params.id }, req.body, { new: true }, function(err, item) {
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
  delete: function (Model) {
    return function (req, res) {
      Model.remove({ [Model.identifierField]: req.params.id }, function (err, item) {
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
