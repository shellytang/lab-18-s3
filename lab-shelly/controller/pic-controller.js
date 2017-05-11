'use strict';

const fs = require('fs');
const del = require('del');
const path = require('path');
const AWS = require('aws-sdk');
const createError = require('http-errors');
const debug = require('debug')('cfgram:pic-controller');
const dataDir =  `${__dirname}/../data`;
const Pic = require('../model/pic');
const Gallery = require('../model/gallery');

AWS.config.setPromisesDependency(require('bluebird'));
const s3 = new AWS.S3();

function s3UploadProm(params) {
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      resolve(data);
    });
  });
}

module.exports = exports = {};

exports.createPic = function(req) {
  debug('#createPic');

  if(!req.file) return createError(400, 'Resource required');
  if(!req.file.path) return createError(500, 'File not saved');

  let ext = path.extname(req.file.originalname);

  let params = {
    ACL: 'public-read',
    Bucket: process.env.AWS_BUCKET,
    Key: `${req.file.filename}${ext}`,
    Body: fs.createReadStream(req.file.path),
  };

  return Gallery.findById(req.params.id)

  .then(() => s3UploadProm(params))
  .then(s3Data => {

    del([`${dataDir}/*`]);

    let picData = {
      name: req.body.name,
      desc: req.body.desc,
      userID: req.user._id,
      galleryID: req.params.id,
      imageURI: s3Data.Location,
      objectKey: s3Data.Key,
    };
    console.log('PIC DATA?? ', picData);
    return new Pic(picData).save();
  })
  .then(pic => pic)
  .catch(err => Promise.reject(err));
};

exports.deletePic = function(galleryId, picId) {
  debug('#deletePic');

  // if(!galleryId) return createError(400, 'Bad request');
  // if(!picId) return createError(400, 'Bad request');

  return Pic.findByIdAndRemove(picId)
  .then(pic => {

    console.log('whats the pic?', pic);

    let params = {
      Bucket: process.env.AWS_BUCKET,
      Key: pic.objectKey,
    };
    console.log('is the key still here?', pic.objectKey);
    console.log('the params: ', params);
    //
    return s3.deleteObject(params);
  })
  // .then(params => s3.deleteObject(params))
  .then(pic => Promise.resolve(pic))
  .catch(err => Promise.reject(createError(404, 'Not found')));
};
