const url = require('./url');

const filter = { '_id': false, '__v': false };

module.exports = {
  /**
   * @param res Object response
   * @param err Object error
   * @param item Object that is returned by Mongoose
   * @param successCb optional callback to set a different response than the item in JSON
   * @deprecated use next()
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
  getAll: function (Model) {
    const commonApi = this;
    const successCb = function (res, items) {
      res.json({
        count: items.length,
        results: items.map((item) => ({
          [Model.nameField]: item[Model.nameField],
          url: url.addHostToUrl(item.url)
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
    return function (req, res, next) {
      Model.findOne(
        { [Model.identifierField]: req.params.id },
        { ...filter, ...projection }
      ).exec()
        .then(item => {
          if (item === null) {
            next({ status: 404 });
          } else {
            res.json(Model.resultMapper ? Model.resultMapper(item) : item);
          }
        })
        .catch(next);
    }
  },
  // Create new doc if not exists and return the new doc
  // If the doc already exists, return 409
  post: function (Model) {
    return function (req, res, next) {
      const select = { [Model.identifierField]: req.params.id };
      Model.findOne(select)
        .then(item => {
          if (item === null) {
            new Model({ ...req.body, ...select, url: req.originalUrl })
              .save() // Does return all fields
              .then(() => {
                return Model.findOne(select, filter)
                  .then(savedItem => {
                    res.json(Model.resultMapper ? Model.resultMapper(savedItem) : savedItem);
                  });
              })
              .catch(next);
          } else {
            next({ status: 409, message: 'Item with same ID already exists' })
          }
        })
        .catch(next);

    }
  },
  // Update doc if exists and return the updated doc
  // If the doc does not exist, return 404
  put: function (Model) {
    return function(req, res, next) {
      Model.findOneAndUpdate(
        { [Model.identifierField]: req.params.id },
        req.body,
        { new: true, fields: filter }
      ).exec()
        .then(item => {
          if (item === null) {
            next({ status: 404 })
          } else {
            res.json(Model.resultMapper ? Model.resultMapper(item) : item)
          }
        })
        .catch(next);
    }
  },
  // Delete doc if exists and return the deleted doc
  // If the doc does not exist, return 404
  delete: function (Model) {
    return function (req, res, next) {
      Model.findOneAndRemove(
        { [Model.identifierField]: req.params.id }
      ).exec()
        .then(item => {
          if (item === null) {
            next({ status: 404 })
          } else {
            // Remove fields because projection is not possible
            item = item.toObject();
            item._id = undefined;
            item.__v = undefined;
            res.json(Model.resultMapper ? Model.resultMapper(item) : item);
          }
        })
        .catch(next);
    }
  }
};
