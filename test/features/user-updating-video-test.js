const {assert} = require('chai');

describe('User updating video', () => {
  it('changes the values', () => {
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
    browser.click('#edit');

    const newTitle = 'Kittens';
    browser.setValue('#title-input', newTitle);

    const bodyText = browser.getText('body');
    assert.include(bodyText, videoToAdd.title);
  });
});
