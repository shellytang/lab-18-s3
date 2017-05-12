'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const User = require('../model/user');

mongoose.Promise = Promise;

require('../server');

const url = `http://localhost:${process.env.PORT}`;

console.log('URL: ', url);

const exampleUser = {
  username: 'shelly',
  password: 'password123',
  email: 'shelly@gmail.com',
};

describe('Auth Routes', function() {

  describe('POST /api/signup', function() {
    after( done => {
      User.remove({})
      .then( () => done())
      .catch(done);
    });
    describe('a request with a valid body', function() {
      it('should return a token', done => {
        request.post(`${url}/api/signup`)
        .send(exampleUser)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.text).to.be.a('string');
          done();
        });
      });
    });
    describe('a request with an invalid body', function() {
      it('should return a 400 error', done => {
        request.post(`${url}/api/signup`)
        .send('nothing')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
    describe('a request to an unregistered route', function() {
      it('should return a 404 error', done => {
        request.post(`${url}/api/signmeup`)
        .send()
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });

  describe('GET api/signin', function() {
    describe('a request with a valid username and passoword', function() {
      before(done => {
        let user = new User(exampleUser);
        user.generatePasswordHash(exampleUser.password)
        .then(user => user.save())
        .then(user => {
          this.tempUser = user;
          done();
        })
        .catch(done);
      });

      after(done => {
        User.remove({})
        .then(() => done())
        .catch(done);
      });

      it('should return a token', done => {
        request.get(`${url}/api/signin`)
        .auth('shelly', 'password123')
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          done();
        });
      });
    });

    describe('a request with an invalid username and password', function() {
      before( done => {
        let user = new User(exampleUser);
        user.generatePasswordHash(exampleUser.password)
        .then(user => user.save())
        .then(user => {
          this.tempUser = user;
          done();
        })
        .catch(done);
      });

      after(done => {
        User.remove({})
        .then(() => done())
        .catch(done);
      });
      it('should return a 401 error', done => {
        request.get(`${url}/api/signin`)
        .auth('milo', 'notpassword')
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  });
});
