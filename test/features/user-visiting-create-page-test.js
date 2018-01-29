const {assert} = require('chai');

describe('User visiting new videos page', () => {
  it('can save a video', () => {
    const videoToAdd = {
      title: 'Cats',
      description: 'Everyone like Cats',
    };

    browser.url('/videos/create.html');
    browser.setValue('#title-input', videoToAdd.title);
    browser.setValue('#description-input', videoToAdd.description);
    browser.click('#submit-button');

    const bodyText = browser.getText('body');
    assert.include(bodyText, videoToAdd.title);
    assert.include(bodyText, videoToAdd.description);
  });
});
