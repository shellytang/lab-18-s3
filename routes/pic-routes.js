'use strict';

const debug = require('debug')('cfgram:pic-routes');
const multer = require('multer');
const dataDir =  `${__dirname}/../data`;
const upload = multer({dest: dataDir});
const bearerAuth = require('../lib/bearer-auth-middleware');
const picController = require('../controller/pic-controller');

module.exports = function(router) {
  router.post('/gallery/:id/pic', bearerAuth, upload.single('image'), (req, res) => {
    debug('#POST /gallery/:id/pic');

    picController.createPic(req)
    .then(pic => res.json(pic))
    .catch(err => res.send(err));
  });

  router.delete('/gallery/:galleryId/pic/:picId', bearerAuth, (req, res) => {
    debug('#DELETE /gallery/:galleryId/pic/:picId');

    picController.deletePic(req.params.galleryId, req.params.picId)
    .then(err => res.status(204).send(err.message))
    .catch(err => res.status(err.status).send(err.message));

  });
  return router;
};
