// 'use strict';
//
// const chai = require('chai');
// const request = require('superagent');
// const mongoose = require('mongoose');
// const Promise = require('bluebird');
//
// const User = require('../model/user');
// const Gallery = require('../model/gallery');
// const Pic = require('../model/pic');
//
// const url = `http://localhost:${process.env.PORT}`;
//
// const exampleUser = {
//   username: 'shelly',
//   password: 'password123',
//   email: 'shelly@gmail.com',
// };
// const exampleGallery = {
//   name: 'milo gallery',
//   desc: 'cat',
// };
// const examplePic = {
//   name: 'milo',
//   desc: 'my cat',
// };

// mongoose.Promise = Promise;

// describe('Pic Routes', function() {
//   afterEach(done => {
//     Promise.all([
//       User.remove({}),
//       Gallery.remove({}),
//       Pic.remove({}),
//     ])
//     .then(() => done())
//     .catch(() => done());
//   });
//
//   describe('POST /api/gallery/:id/pic', () => {
//
//     before(done => {
//       new User(exampleUser)
//       .generatePasswordHash(exampleUser.password)
//       .then(user => user.save())
//       .then(user => {
//         this.tempUser = user;
//         return user.generateToken();
//       })
//       .then(token => {
//         this.tempToken = token;
//         done();
//       })
//       .catch(() => done());
//     });
//
//     before(done => {
//       exampleGallery.userId = this.tempUser._id.toString();
//       new Gallery(exampleGallery).save()
//       .then(gallery => {
//         this.tempGallery = gallery;
//         done();
//       })
//       .catch(() => done());
//     });
//
//     after(() => {
//       delete exampleGallery.userId;
//     });
//
//     it('should return a 200 response for a successful pic upload', done => {
//       request.post(`${url}/api/gallery/${this.tempGallery_.id}/pic`)
//       .send({examplePic}) //how to upload file?
//       .set({Authorization: `Bearer ${this.tempToken}`})
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         done();
//       });
//
//     });
//
//   });
// });
