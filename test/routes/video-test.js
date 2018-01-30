const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');
const app = require('../../app');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');
const Video = require('../../models/video');

const queryHTML = (htmlAsString, selector) => {
  return jsdom(htmlAsString).querySelector(selector);
};

const parseTextFromHTML = (htmlAsString, selector) => {
  const selectedElement = queryHTML(htmlAsString, selector);

  if (selectedElement !== null) {
    return selectedElement.textContent.trim();
  } else {
    throw new Error(`No element with selector ${selector} found in HTML string`);
  }
};

describe('GET /videos', () => {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  it('renders existing Videos', async () => {
    const video = await Video.create({
      title: 'Cats',
      description: 'Everyone like Cats',
    });

    const response = await request(app).get('/');
    console.log(response.text);
    const bodyText = parseTextFromHTML(response.text, 'body');
    //const iFrame = queryHTML(response.text, 'iframe');
    //assert.equal(iFrame.src, video.url);
    assert.include(bodyText, video.title);
  });
});

describe('POST /videos', () => {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  it('responds with a 201 status code', async () => {
    const title = 'Cats';
    const description = 'Everyone like Cats';

    const response = await request(app)
      .post('/videos')
      .type('form')
      .send({title, description});

    assert.equal(response.status, 201);
  });
  it('response includes saved video', async () => {
    const title = 'Cats';
    const description = 'Everyone like Cats';

    const response = await request(app)
      .post('/videos')
      .type('form')
      .send({title, description});

    assert.include(response.text, title);
    assert.include(response.text, description);
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
