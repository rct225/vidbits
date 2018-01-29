const {assert} = require('chai');
const request = require('supertest');
const app = require('../../app');

describe('POST /videos', () => {

  it('responds with a 201 status code', async () => {
    const title = 'Cats';
    const description = 'Everyone like Cats';

    const response = await request(app)
      .post('/videos')
      .type('form')
      .send({title, description})

    assert.equal(response.status, 201);
  })
});
