'use strict';

const debug = require('debug')('cfgram:gallery-routes');
const galleryController = require('../controller/gallery-controller');
const bearerAuth = require('../lib/bearer-auth-middleware');

module.exports = function(router) {

  router.post('/gallery', bearerAuth, (req, res) => {
    debug('#POST /api/gallery');

    req.body.userId = req.user._id;

    galleryController.createGallery(req.body)
    .then(gallery => res.json(gallery))
    .catch(err => res.status(err.status).send(err.message));
  });

  router.get('/gallery/:id', bearerAuth, (req, res) => {
    debug('#GET /api/gallery/:id');
    galleryController.fetchGallery(req.params.id, req.user._id)
    .then(gallery => res.json(gallery))
    .catch(err => res.status(err.status).send(err.message));
  });

  router.put('/gallery/:id', bearerAuth, (req, res) => {
    debug('#PUT /api/gallery/:id');

    galleryController.updateGallery(req.params.id, req.body, req.user._id)
    .then(gallery => res.json(gallery))
    .catch(err => res.status(err.status).send(err.message));
  });

  router.delete('/gallery/:id', bearerAuth, (req, res) => {
    debug('#DELETE /api/gallery/:id');

    galleryController.deleteGallery(req.params.id, req.user._id)
    .then(err => res.status(204).send(err.message))
    .catch(err => res.status(err.status).send(err.message));
  });

  return (router);
};
