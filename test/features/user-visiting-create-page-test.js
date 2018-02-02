const {assert} = require('chai');
const {generateRandomUrl} = require('../generators.js');
const {buildAndSubmitForm} = require('../utilities')

describe('User visiting new videos page', () => {
  it('can save a video', () => {
    const videoToAdd = {
      title: 'Meow',
      description: 'Everyone like Cats',
      url: generateRandomUrl('example.com')
    };

    browser.url('/videos/create');
    buildAndSubmitForm(browser, videoToAdd);

    const bodyText = browser.getText('body');
    assert.include(bodyText, videoToAdd.title);
    assert.include(bodyText, videoToAdd.description);
    assert.equal(browser.getAttribute('iframe', 'src'), video.url);
  });
});
