const {assert} = require('chai');
const {generateRandomUrl} = require('../generators.js');

describe('User deleting video', () => {
  it('removes video from the list', async () => {
    const videoToAdd = {
      title: 'Meow',
      description: 'Everyone like Cats',
      url: generateRandomUrl('example.com')
    };

    browser.url('/videos/create');
    browser.setValue('#title-input', videoToAdd.title);
    browser.setValue('#description-input', videoToAdd.description);
    browser.setValue('#url-input', videoToAdd.url);
    browser.click('#submit-button');
    browser.click('#delete');

    const bodyText = browser.getText('body');
    assert.notInclude(bodyText, videoToAdd.title);

  });
});
