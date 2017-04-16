var url = require('./url');

module.exports = {
  /**
   * @param res Object response
   * @param err Object error
   * @param item Object that is returned by Mongoose
   * @param successCb optional callback to set a different response than the item in JSON
   */
  catchWrapper: function (err, item, res, successCb) {
    if (err) {
      res.send(err);
    }
    if (item) {
      successCb ? successCb(res, item) : res.json(item);
    } else {
      res.sendStatus(404);
    }
  },
  projectionMapper: function (schemaKeys, excludeKeys, collectionKey) {
    return schemaKeys.concat('_id', '__v').reduce((acc, field) => {
      if (excludeKeys.indexOf(field) === -1) {
        acc[collectionKey + '.' + field] = false;
      }
      return acc;
    }, {});
  },
  getBasePrice(index) {
    return { coins: 300 * Math.pow(index, 2) - 150 * (index - 3), cubes: undefined, time: undefined };
  },
  getUpgradePrice(basePrice, level) {
    return {
      coins: basePrice.coins * Math.pow(2, level - 1),
      cubes: undefined, // TODO: determine formula,
      time: undefined // TODO: determine formula
    };
  },
  getAll: function (Model) {
    const commonApi = this;
    const successCb = function (res, items) {
      res.json({
        count: items.length,
        results: items.map((item) => ({
          [Model.nameField]: item[Model.nameField],
          url: item.url
        }))
      });
    };

    return function (req, res) {
      Model.find(function (err, items) {
        return commonApi.catchWrapper(err, items, res, successCb);
      });
    };
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
    return function (req, res) {
      projection = Object.assign({ '_id': false, '__v': false }, projection || {});
      Model.findOne(
        { [Model.identifierField]: req.params.id },
        projection,
        function (err, items) {
          return commonApi.catchWrapper(err, items, res);
        }
      );
    }
  },
  post: function (Model) {
    const commonApi = this;
    return function (req, res) {
      req.body.url = req.body.url || url.create(Model.slug, req.body[Model.identifierField]);
      Model.create(
        req.body,
        function (err, item) {
          return commonApi.catchWrapper(err, item, res);
        }
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
        function (err, item) {
          return commonApi.catchWrapper(err, item, res);
        }
      );
    }
  },
  delete: function (Model) {
    const commonApi = this;
    const successCb = function (res) { res.sendStatus(200); };
    return function (req, res) {
      Model.remove({ [Model.identifierField]: req.params.id }, function (err, item) {
        commonApi.catchWrapper(err, item, res, successCb);
      });
    }
  }
};
