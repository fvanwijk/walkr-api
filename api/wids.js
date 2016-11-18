var router = require('../router');
var WID = require('../models/wid').model;
var CommonApi = require('./common-api');
var url = require('./url');

module.exports = function (router) {
  router.route('/wids')
    .get(CommonApi.getAll(WID))
    .post(CommonApi.postAll(WID, 'wids.json'))
    .delete(CommonApi.deleteAll(WID));

  router.route('/wids/:id')
    .get(CommonApi.get(WID, { 'planets._id': false }))
    .post(CommonApi.post(WID))
    .put(CommonApi.put(WID))
    .delete(CommonApi.delete(WID));

  router.route('/wids/:id/planets/:planetid')
    .get(function (req, res) {
      const discoveryUrl = url.create('wids', req.params.id, 'planets', req.params.planetid);
      WID.findOne(
        { 'planets.url': discoveryUrl },
        function (err, item) {
          CommonApi.catchWrapper(err, item, res, function (res, item) {
            res.json(item.planets.find(discovery => { return discovery.url === discoveryUrl }));
          });
        }
      );
    })
};
