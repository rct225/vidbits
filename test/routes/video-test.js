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
      title: 'Meow',
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
      title: 'Meow',
      description: 'Everyone like Cats',
      url: `http://example.com/${Math.random()}`,
    });

    const response = await request(app).get(`/videos/${video._id}`);

    // console.log(response.text);
    const pageText = parseTextFromHTML(response.text, 'body');
    const iFrame = queryHTML(response.text, 'iframe');
    assert.equal(iFrame.src, video.url);
    assert.include(pageText, video.title);
    assert.include(pageText, video.description);
  });
});

describe('GET /videos/:id/edit', () => {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  it('renders a form for the Video', async () => {
    const video = await Video.create({
      title: 'Meow',
      description: 'Everyone like Cats',
      url: `http://example.com/${Math.random()}`,
    });

    const response = await request(app).get(`/videos/${video._id}/edit`);
    const titleInput = queryHTML(response.text, '#title-input');
    const descriptionInput = queryHTML(response.text, '#description-input');
    const urlInput = queryHTML(response.text, '#url-input');
    assert.equal(titleInput.value, video.title);
    assert.equal(descriptionInput.value, video.description);
    assert.equal(urlInput.value, video.url);
  });
});

describe('POST /videos', () => {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  it('responds with a 302 status code', async () => {
    const title = 'Meow';
    const description = 'Everyone like Cats';
    const url = `http://example.com/${Math.random()}`;

    const response = await request(app)
      .post('/videos')
      .type('form')
      .send({title, description, url});

    assert.equal(response.status, 302);
  });
  it('redirects to the new Video show page', async () => {
    const title = 'Meow';
    const description = 'Everyone like Cats';
    const url = `http://example.com/${Math.random()}`;

    const response = await request(app)
      .post('/videos')
      .type('form')
      .send({title, description, url});

    assert.match(response.headers.location, /\/videos\/\w*$/);
  });
  it('saves a Video document', async () => {
    const title = 'Meow';
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
      const url = `http://example.com/${Math.random()}`;

      const response = await request(app)
        .post('/videos')
        .type('form')
        .send({title, description, url})

      const videos = await Video.find({});
      assert.equal(videos.length, 0);
    });
    it('responds with a 400', async () => {
      const title = '';
      const description = 'Everyone like Cats';
      const url = `http://example.com/${Math.random()}`;

      const response = await request(app)
        .post('/videos')
        .type('form')
        .send({title, description, url})

      assert.equal(response.status, 400);
    });
    it('renders the video form', async () => {
      const title = '';
      const description = 'Everyone like Cats';
      const url = `http://example.com/${Math.random()}`;

      const response = await request(app)
        .post('/videos')
        .type('form')
        .send({title, description, url})

      const titleInput = queryHTML(response.text, '[name="title"]');
      assert.ok(titleInput, 'could not find `title` input');
    });
    it('renders the validation error message', async () => {
      const title = '';
      const description = 'Everyone like Cats';
      const url = `http://example.com/${Math.random()}`;

      const response = await request(app)
        .post('/videos')
        .type('form')
        .send({title, description, url})

      //console.log(response.text);
      const bodyText = parseTextFromHTML(response.text, 'body');
      assert.include(bodyText, 'title is required');
    });
    it('preserves the other field values', async () => {
      const title = '';
      const description = 'Everyone like Cats';
      const url = `http://example.com/${Math.random()}`;

      const response = await request(app)
        .post('/videos')
        .type('form')
        .send({title, description, url})

      const descriptionInput = queryHTML(response.text, '[name="description"]');
      const urlInput = queryHTML(response.text, '[name="url"]');
      assert.equal(descriptionInput.value, description);
      assert.equal(urlInput.value, url);
    });
  });
  describe('when the URL is missing', () => {
    it('renders the validation error message', async () => {
      const title = 'Meow';
      const url = '';

      const response = await request(app)
        .post('/videos')
        .type('form')
        .send({title, url})

      //console.log(response.text);
      const pageText = parseTextFromHTML(response.text, 'body');
      assert.include(pageText, 'a URL is required');

    });
  });
});

describe('POST /videos/:id/updates', () => {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  it('updates the record', async () => {
    const video = await Video.create({
      title: 'Meow',
      description: 'Everyone like Cats',
      url: `http://example.com/${Math.random()}`,
    });

    const title = 'New Title';
    const description = 'New description';
    const url = `http://new.example.com/${Math.random()}`;

    await request(app)
      .post(`/videos/${video._id}/updates`)
      .type('form')
      .send({title, description, url});
    //console.log(response.text);
    const updatedVideo = await Video.findOne({ _id: video._id });
    //console.log(updatedVideo);
    assert.include(updatedVideo, {title, description, url});
  });
  it('redirects to the show page', async () => {
    const video = await Video.create({
      title: 'Meow',
      description: 'Everyone like Cats',
      url: `http://example.com/${Math.random()}`,
    });

    const title = 'New Title';
    const description = 'New description';
    const url = `http://new.example.com/${Math.random()}`;

    const response = await request(app)
      .post(`/videos/${video._id}/updates`)
      .type('form')
      .send({title, description, url});

    //console.log(response);
    assert.equal(response.status, 302);
    assert.equal(response.headers.location, `/videos/${video._id}`);
  });
  describe('when the record is invalid', () => {
    it('does not save the record', async () => {
      const video = await Video.create({
        title: 'Meow',
        description: 'Everyone like Cats',
        url: `http://example.com/${Math.random()}`,
      });

      const title = '';
      const description = 'New description';
      const url = `http://new.example.com/${Math.random()}`;

      await request(app)
        .post(`/videos/${video._id}/updates`)
        .type('form')
        .send({title, description, url});

      const checkVideo = await Video.findOne({ _id: video._id});
      assert.equal(checkVideo.title, video.title);
      assert.equal(checkVideo.url, video.url);
    });
    it('responds with a 400 status', async () => {
      const video = await Video.create({
         title: 'Meow',
         description: 'Everyone like Cats',
         url: `http://example.com/${Math.random()}`,
      });

      const title = '';
      const description = 'New description';
      const url = `http://new.example.com/${Math.random()}`;

      const response = await request(app)
        .post(`/videos/${video._id}/updates`)
        .type('form')
        .send({title, description, url});

      assert.equal(response.status, 400);
    });
    it('renders the Edit form', async () => {
      const video = await Video.create({
         title: 'Meow',
         description: 'Everyone like Cats',
         url: `http://example.com/${Math.random()}`,
      });

      const title = '';

      const response = await request(app)
        .post(`/videos/${video._id}/updates`)
        .type('form')
        .send({title: title, url: video.url});

      const urlInput = queryHTML(response.text, '#url-input');
      assert.equal(urlInput.value, video.url);
    });
  });
});

describe('POST /videos/:id/deletions', () => {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  it('removes the record', async () => {
    const video = await Video.create({
      title: 'Meow',
      description: 'Everyone like Cats',
      url: `http://example.com/${Math.random()}`,
    });

    await request(app)
      .post(`/videos/${video._id}/deletions`)
      .type('form')
      .send();
    //console.log(response.text);
    const removedVideo = await Video.findOne({ _id: video._id });
    assert.equal(removedVideo.length, 0)
  });
});
