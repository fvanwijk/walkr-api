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
            name: item.name,
            url: `http://localhost:1337/api/planets/${item.id}`
          }))
        });
      });
    }
  }
};
