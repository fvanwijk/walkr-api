module.exports = {
  getAll: function (Model) {
    return function (req, res) {
      Model.find(function (err, items) {
        if (err) {
          res.send(err);
        }

        res.json(items);
      });
    }
  }
};
