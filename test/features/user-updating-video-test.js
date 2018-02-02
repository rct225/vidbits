const {assert} = require('chai');
const {generateRandomUrl} = require('../generators.js');

describe('User updating video', () => {
  it('changes the values', () => {
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
    browser.click('#edit');

    const newTitle = 'Kittens';
    browser.setValue('#title-input', newTitle);
    browser.click('#submit-button');

    const bodyText = browser.getText('body');
    assert.include(bodyText, newTitle);
  });
  it('does not create an additional video', () => {
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
    browser.click('#edit');

    const newTitle = 'Kittens';
    browser.setValue('#title-input', newTitle);
    browser.click('#submit-button');

    browser.url('/');

    const bodyText = browser.getText('body');
    assert.notInclude(bodyText, videoToAdd.title);
  });
});
