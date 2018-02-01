const {assert} = require('chai');

describe('User visiting new videos page', () => {
  it('can save a video', () => {
    const videoToAdd = {
      title: 'Cats',
      description: 'Everyone like Cats',
      url: `http://example.com/${Math.random()}`
    };

    browser.url('/videos/create');
    browser.setValue('#title-input', videoToAdd.title);
    browser.setValue('#description-input', videoToAdd.description);
    browser.setValue('#url-input', videoToAdd.url);
    browser.click('#submit-button');

    const bodyText = browser.getText('body');
    assert.include(bodyText, videoToAdd.title);
    assert.include(bodyText, videoToAdd.description);
    assert.equal(browser.getAttribute('iframe', 'src'), video.url);
  });
});
