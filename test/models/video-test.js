const {assert} = require('chai');
const Video = require('../../models/video');
const {mongoose, databaseUrl, options} = require('../../database');

async function connectDatabase() {
  await mongoose.connect(databaseUrl, options);
  await mongoose.connection.db.dropDatabase();
}

async function disconnectDatabase() {
  await mongoose.disconnect();
}

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
});

module.exports = {
  connectDatabase,
  disconnectDatabase,
}
