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
  afterEach(done => {
    console.log(exampleUser.username);
    Promise.all([
      User.remove({}),
      Gallery.remove({}),
    ])
    .then(() => done())
    .catch(() => done());
  });

  describe('POST: /api/gallery', () => {
    before(done => {
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
    describe('a properly formatted request', () => {
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
    describe('an improperly formatted request', () => {
      it('should return a 401 response with unauthorized request', done => {
        request.post(`${url}/api/gallery`)
        .send(exampleGallery)
        .set({Authorization: `Bad token`})
        .end(res => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });

    describe('GET /api/gallery/:id', () => {
      before(done => {
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
        .catch(()=>done());
      });

      describe('a properly formatted request', () => {
        before(done => {
          exampleGallery.userId = this.tempUser._id.toString();
          new Gallery({exampleGallery}).save();

        });

      });





      describe('an improperly formmated request', () => {

      });


    });



  });


  // describe('GET /api/gallery/:id', () => {
  //   before(done => {
  //     new User(exampleUser)
  //     .generatePasswordHash(exampleUser.password)
  //     .then(user => user.save())
  //     .then(user => {
  //       this.tempUser = user;
  //       return user.generateToken();
  //     })
  //     .then(token => {
  //       this.tempToken = token;
  //       done();
  //     })
  //     .catch(() => done);
  //   });
  //
  //   before(done => {
  //     exampleGallery.userId = this.tempUser.id.toString();
  //     new
  //   });
  //
  //
  //
  //
  // });

  //   before( done => {
  //     exampleGallery.userId = this.tempUser._id.toString();
  //     new Gallery(exampleGallery).save()
  //     .then( gallery => {
  //       this.tempGallery = gallery;
  //       done();
  //     })
  //     .catch(() => done());
  //   });
  //
  //   after( () => {
  //     delete exampleGallery.userId;
  //   });
  //
  //   it('should return a gallery', done => {
  //     request.get(`${url}/api/gallery/${this.tempGallery._id}`)
  //     .set({
  //       Authorization: `Bearer ${this.tempToken}`
  //     })
  //     .end((err, res) => {
  //       if (err) return done(err);
  //       let date = new Date(res.body.created).toString();
  //       expect(res.body.name).to.equal(exampleGallery.name);
  //       expect(res.body.desc).to.equal(exampleGallery.desc);
  //       expect(res.body.userId).to.equal(this.tempUser._id.toString())
  //       expect(date).to.not.equal('Invalid Date');
  //       done();
  //     });
  //   });
  // });
});
