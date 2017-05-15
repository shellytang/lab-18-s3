'use strict';

const debug = require('debug')('cfgram:gallery-controller');
const Promise = require('bluebird');
const createError = require('http-errors');
const Gallery = require('../model/gallery');

module.exports = exports = {};

exports.createGallery = function(user) {
  debug('#createGallery');
  return new Gallery(user).save()
  .then(gallery => gallery)
  .catch(() => Promise.reject(createError(400, 'Invalid body')));
};

exports.fetchGallery = function(id, userId) {
  debug('#fetchGallery');
  return Gallery.findById(id)
  .then(gallery => {
    if (gallery.userId.toString() !== userId.toString()) {
      return Promise.reject(createError(401, 'Invalid user'));
    }
    return Promise.resolve(gallery);
  })
  .catch(() => Promise.reject(createError(404, 'Gallery not found')));
};

exports.updateGallery = function(id, galleryBody, userId) {
  debug('#updateGallery');
  if (!galleryBody.name || !galleryBody.desc) return Promise.reject(createError(400, 'Invalid body'));

  return Gallery.findByIdAndUpdate(id, galleryBody, {new: true})
  .then(gallery => {
    if (gallery.userId.toString() !== userId.toString()) {
      return Promise.reject(createError(401, 'Invalid user'));
    }
    return Promise.resolve(gallery);
  })
  .catch(() => Promise.reject(createError(404, 'Gallery not found')));

};

exports.deleteGallery = function(id) {
  debug('#deleteGallery');
  return Gallery.findByIdAndRemove(id)
  .then(gallery => Promise.resolve(gallery))
  .catch(err => Promise.reject(createError(404, 'Not found')));
};
