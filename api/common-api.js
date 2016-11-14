var url = require('./url');

module.exports = {
  catchWrapper: function (res, err, item) {
    if (err) {
      res.send(err);
    }
    if (item) {
      res.json(item);
    } else {
      res.sendStatus(404);
    }
  },
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
  get: function (Model, projection) {
    const commonApi = this;
    return function(req, res) {
      projection = Object.assign({ '_id': false }, projection || {});
      Model.findOne(
        { [Model.identifierField]: req.params.id },
        projection,
        commonApi.catchWrapper.bind(commonApi, res)
      );
    }
  },
  post: function (Model) {
    const commonApi = this;
    return function (req, res) {
      req.body.url = req.body.url || url.create(Model.slug, req.body[Model.identifierField]);
      Model.create(
        req.body,
        commonApi.catchWrapper.bind(commonApi, res)
      );
    }
  },
  put: function (Model) {
    const commonApi = this;
    return function(req, res) {
      Model.findOneAndUpdate(
        { [Model.identifierField]: req.params.id },
        req.body,
        { new: true },
        commonApi.catchWrapper.bind(commonApi, res)
      );
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
