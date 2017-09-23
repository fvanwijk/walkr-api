const url = require('./url');

const filter = { '_id': false, '__v': false };

module.exports = {
  projectionMapper: function (schemaKeys, excludeKeys, collectionKey) {
    return schemaKeys.concat('_id', '__v').reduce((acc, field) => {
      if (excludeKeys.indexOf(field) === -1) {
        acc[collectionKey + '.' + field] = false;
      }
      return acc;
    }, {});
  },
  // Get collection
  getAll: function (Model) {
    return function (req, res, next) {
      Model.find().exec()
        .then(items => {
          res.json({
            count: items.length,
            results: items.map((item) => ({
              [Model.nameField]: item[Model.nameField],
              url: url.addHostToUrl(item.url)
            }))
          });
        })
        .catch(next);
    };
  },
  // Add collection to existing collection
  postAll: function (Model, filename) {
    return function (req, res, next) {
      // Temporary post items from file instead if there is no body
      const items = req.body || require(`../data/${filename}`).map(item => {
        return ({
          ...item, url: url.create(Model.slug, item[Model.identifierField])
        });
      });

      Model.insertMany(items)
        .then(() => {
          res.sendStatus(204);
        })
        .catch(next);
    };
  },
  // Replace collection with new collection
  putAll: function (Model, filename) {
    return (req, res, next) => {
      Model.remove({}).exec()
        .then(() => {
          this.postAll(Model, filename)(req, res, next);
        });
    }
  },
  // Delete collection
  // If collection does not exist, return 404
  deleteAll: function (Model) {
    return function (req, res, next) {
      Model.remove({}).exec()
        .then((summary) => {
          if (!summary.result.n) {
            next({ status: 404 });
          } else {
            res.sendStatus(204);
          }
        })
        .catch(next);
    };
  },
  // Get an item with ID from collection
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
