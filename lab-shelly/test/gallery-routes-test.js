'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const User = require('../model/user');
const Gallery = require('../model/gallery');

mongoose.Promise = Promise;
require('../server');
const url = `http://localhost:${process.env.PORT}`;

const exampleUser = {
  username: 'shelly',
  password: 'password123',
  email: 'shelly@gmail.com',
};
const exampleGallery = {
  name: 'test gallery',
  desc: 'test description',
};

describe('Gallery Routes', function() {
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
  afterEach(done => {
    Promise.all([
      User.remove({}),
      Gallery.remove({}),
    ])
    .then(() => done())
    .catch(() => done());
  });

  describe('POST /api/gallery', () => {
    describe('a request with valid body', () => {
      it('should return a gallery', done => {
        request.post(`${url}/api/gallery`)
        .send(exampleGallery)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          let date = new Date(res.body.created).toString();
          expect(res.body.name).to.equal(exampleGallery.name);
          expect(res.body.desc).to.equal(exampleGallery.desc);
          expect(res.body.userId).to.equal(this.tempUser._id.toString());
          expect(date).to.not.equal('Invalid Date');
          expect(res.status).to.equal(200);
          done();
        });
      });
    });
    describe('a request with invalid token', () => {
      it('should return a 401 response with unauthorized request', done => {
        request.post(`${url}/api/gallery`)
        .send(exampleGallery)
        .set({Authorization: `Bad token`})
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
    describe('a request with invalid body', () => {
      it('should return a 400 response with invalid body', done => {
        request.post(`${url}/api/gallery`)
        .send({})
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
    describe('a request for unregistered route', () => {
      it('should return a 404 response', done => {
        request.post(`${url}/api/creategallery`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });

  describe('GET /api/gallery/:id', () => {
    beforeEach(done => {
      exampleGallery.userId = this.tempUser._id.toString();
      new Gallery(exampleGallery).save()
      .then(gallery => {
        this.tempGallery = gallery;
        done();
      })
      .catch(() => done());
    });
    afterEach(() => {
      delete exampleGallery.userId;
    });

    describe('a valid request body', () => {
      it('should return a gallery', done => {
        request.get(`${url}/api/gallery/${this.tempGallery._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          let date = new Date(res.body.created).toString();
          expect(res.body.name).to.equal(exampleGallery.name);
          expect(res.body.desc).to.equal(exampleGallery.desc);
          expect(res.body.userId).to.equal(this.tempUser._id.toString());
          expect(date).to.not.equal('Invalid Date');
          expect(res.status).to.equal(200);
          done();
        });
      });
    });

    describe('a request with unauthorized/no token', () => {
      it('should return a 401 error', done => {
        request.get(`${url}/api/gallery/${this.tempGallery._id}`)
        .set({Authorization: 'no token'})
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });

    describe('a request with invalid id', () => {
      it('should return a 404 error', done => {
        request.get(`${url}/api/gallery/badID`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });

  describe('PUT api/gallery/id', () => {
    let updatedGallery = {
      name: 'updated gallery',
      desc: 'updated description',
    };
    beforeEach(done => {
      exampleGallery.userId = this.tempUser._id.toString();
      new Gallery(exampleGallery).save()
      .then(gallery => {
        this.tempGallery = gallery;
        done();
      })
      .catch(() => done());
    });

    afterEach(() => {
      delete exampleGallery.userId;
    });

    describe('a request with valid body', () => {

      it('should return a gallery', done => {
        request.put(`${url}/api/gallery/${this.tempGallery._id}`)
        .send(updatedGallery)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          let date = new Date(res.body.created).toString();
          expect(res.body.name).to.equal(updatedGallery.name);
          expect(res.body.desc).to.equal(updatedGallery.desc);
          expect(res.body.userId).to.equal(this.tempUser._id.toString());
          expect(date).to.not.equal('Invalid Date');
          expect(res.status).to.equal(200);
          done();
        });
      });

      describe('a request with unauthorized/bad token', () => {
        it('should return a 401 error', done => {
          request.put(`${url}/api/gallery/${this.tempGallery._id}`)
          .send(updatedGallery)
          .set({Authorization: 'bad token'})
          .end((err, res) => {
            expect(res.status).to.equal(401);
            done();
          });
        });
      });

      describe('a request with invalid body', () => {
        it('should return with a 400 error', done => {
          request.put(`${url}/api/gallery/${this.tempGallery._id}`)
          .set({Authorization: `Bearer ${this.tempToken}`})
          .send('invalid body')
          .end((err, res) => {
            console.log('what was it?', res.body.name);
            expect(res.status).to.equal(400);
            done();
          });
        });
      });

      describe('a valid request with ID not found', () => {
        it('should return with a 404 error', done => {
          request.put(`${url}/api/gallery/invalidID`)
          .set({Authorization: `Bearer ${this.tempToken}`})
          .send(updatedGallery)
          .end((err, res) => {
            console.log('what was it?', res.body.name);
            expect(res.status).to.equal(404);
            done();
          });
        });
      });
    });
  });
});
