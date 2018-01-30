const {assert} = require('chai');
const Video = require('../../models/video');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');

describe('Video', () => {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  describe('#title', () => {
    it('is a String', () => {
      const titleAsInt = 1;

      const video = new Video({title: titleAsInt});

      assert.strictEqual(video.title, titleAsInt.toString());
    });
  });
  describe('#description', () => {
    it('is a String', () => {
      const descriptionAsInt = 1;

      const video = new Video({description: descriptionAsInt});

      assert.strictEqual(video.description, descriptionAsInt.toString());
    });
  });
});

module.exports = {
  connectDatabase,
  disconnectDatabase,
}
