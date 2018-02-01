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
      url: `http://example.com/${Math.random()}`
    });

    const response = await request(app).get('/');
    // console.log(response.text);
    const bodyText = parseTextFromHTML(response.text, 'body');
    const iFrame = queryHTML(response.text, 'iframe');
    assert.equal(iFrame.src, video.url);
    assert.include(bodyText, video.title);
  });
});

describe('GET /videos/:id', () => {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  it('renders the Video', async () => {
    const video = await Video.create({
      title: 'Cats',
      description: 'Everyone like Cats',
    });

    const response = await request(app).get(`/videos/${video._id}`);

    const pageText = parseTextFromHTML(response.text, 'body');
    const iFrame = queryHTML(response.text, 'iframe');
    assert.equal(iFrame.src, video.url);
    assert.include(pageText, video.title);
    assert.include(pageText, video.description);
  });
});

describe('POST /videos', () => {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  it('responds with a 302 status code', async () => {
    const title = 'Cats';
    const description = 'Everyone like Cats';

    const response = await request(app)
      .post('/videos')
      .type('form')
      .send({title, description});

    assert.equal(response.status, 302);
  });
  it('redirects to the new Video show page', async () => {
    const title = 'Cats';
    const description = 'Everyone like Cats';

    const response = await request(app)
      .post('/videos')
      .type('form')
      .send({title, description});

    assert.match(response.headers.location, /\/videos\/\w*$/);
  });
  it('saves a Video document', async () => {
    const title = 'Cats';
    const description = 'Everyone like Cats';
    const url = `http://example.com/${Math.random()}`;

    const response = await request(app)
      .post('/videos')
      .type('form')
      .send({title, description, url});

    const video = await Video.findOne({});
    assert.include(video, {title, description, url});
  });
  describe('when the title is missing', () => {
    it('does not save the Video', async () => {
      const title = '';
      const description = 'Everyone like Cats';

      const response = await request(app)
        .post('/videos')
        .type('form')
        .send({title, description})

      const videos = await Video.find({});
      assert.equal(videos.length, 0);
    });
    it('responds with a 400', async () => {
      const title = '';
      const description = 'Everyone like Cats';

      const response = await request(app)
        .post('/videos')
        .type('form')
        .send({title, description})

      assert.equal(response.status, 400);
    });
    it('renders the video form', async () => {
      const title = '';
      const description = 'Everyone like Cats';

      const response = await request(app)
        .post('/videos')
        .type('form')
        .send({title, description})

      const titleInput = queryHTML(response.text, '[name="title"]');
      assert.ok(titleInput, 'could not find `title` input');
    });
    it('renders the validation error message', async () => {
      const title = '';
      const description = 'Everyone like Cats';

      const response = await request(app)
        .post('/videos')
        .type('form')
        .send({title, description})

      //console.log(response.text);
      const bodyText = parseTextFromHTML(response.text, 'body');
      assert.include(bodyText, 'title is required');
    });
    it('preserves the other field values', async () => {
      const title = '';
      const description = 'Everyone like Cats';

      const response = await request(app)
        .post('/videos')
        .type('form')
        .send({title, description})

      const descriptionInput = queryHTML(response.text, '[name="description"]');
      //const urlInput = queryHTML(response.text, '[name="url"]');
      assert.equal(descriptionInput.value, description);
      //assert.equal(urlInput.value, url);
    });
  });
});
