const {assert} = require('chai');
const request = require('supertest');
const app = require('../../app');
//const {connectDatabase, disconnectDatabase} = require('../database-utilities');
const {mongoose, databaseUrl, options} = require('../../database');
const Video = require('../../models/video');

describe('POST /videos', () => {
  beforeEach(async () => {
    await mongoose.connect(databaseUrl, options);
    await mongoose.connection.db.dropDatabase();
  });

  afterEach(async () => {
     await mongoose.disconnect();
  });

  it('responds with a 201 status code', async () => {
    const title = 'Cats';
    const description = 'Everyone like Cats';

    const response = await request(app)
      .post('/videos')
      .type('form')
      .send({title, description});

    assert.equal(response.status, 201);
  });

  it('saves a Video document', async () => {
    const title = 'Cats';
    const description = 'Everyone like Cats';

    const response = await request(app)
      .post('/videos')
      .type('form')
      .send({title, description});

    const video = await Video.findOne({});
    assert.include(video, {title, description});
  });
});
