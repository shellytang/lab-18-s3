'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const User = require('../model/user');
const Gallery = require('../model/gallery');
const Pic = require('../model/pic');

const url = `http://localhost:${process.env.PORT}`;
const exampleUser = {
  username: 'shelly',
  password: 'password123',
  email: 'shelly@gmail.com',
};
const exampleGallery = {
  name: 'milo gallery',
  desc: 'cat',
};
mongoose.Promise = Promise;
describe('Pic Routes', function() {
  beforeEach(done => {
    new User(exampleUser)
    .generatePasswordHash(exampleUser.password)
    .then(user => user.save())
    .then(user => {
      this.tempUser = user;
      return user.generateToken();
    })
    .then(token => {
      this.tempToken = token;
      done();
    })
    .catch(() => done());
  });

  beforeEach(done => {
    exampleGallery.userId = this.tempUser._id.toString();
    new Gallery(exampleGallery).save()
    .then(gallery => {
      this.tempGallery = gallery;
      done();
    })
    .catch(() => done());
  });
  afterEach(done => {
    delete exampleGallery.userId;
    done();
  });
  afterEach(done => {
    Promise.all([
      User.remove({}),
      Gallery.remove({}),
      Pic.remove({}),
    ])
    .then(() => done())
    .catch(() => done());
  });

  describe('POST /api/gallery/:id/pic', () => {
    describe('a valid request body', () => {
      it('should return a pic and 200 response', done => {
        request.post(`${url}/api/gallery/${this.tempGallery._id}/pic`)
        .field('name', 'milo')
        .field('desc', 'my cat')
        .attach('image', `${__dirname}/test-assests/milo.jpg`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          let date = new Date(res.body.created).toString();
          expect(res.body.name).to.equal('milo');
          expect(res.body.desc).to.equal('my cat');
          expect(res.body.userId).to.equal(exampleGallery.userID);
          expect(res.body.galleryID).to.equal(`${this.tempGallery._id}`);
          expect(date).to.not.equal('Invalid Date');
          expect(res.body.imageURI).to.not.equal(null);
          expect(res.body.objectKey).to.not.equal(null);
          expect(res.status).to.equal(200);
          done();
        });
      });
    });
  });
});
