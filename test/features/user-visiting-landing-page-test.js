const {assert} = require('chai');

describe('User visiting landing page', () => {
  describe('with no existing videos', () => {
    it('shows no videos', () => {
      browser.url('/');

      assert.equal(browser.getText('#videos-container'), '');
    });
  });
  describe('with an existing video', () => {
    it('shows it in the list', () => {
      const title = 'Cats';
      const description = 'Everyone like Cats';

      browser.url('/videos/create');
      browser.setValue('#title-input', title);
      browser.setValue('#description-input', description);
      browser.click('#submit-button');
      browser.url('/');

      assert.equal(browser.getText('#videos-container'), title);
      //assert.equal(browser.getAttribute('iframe', 'src'), url);
    });
  });

  it('can navigate to create page', () => {
    browser.url('/');
    browser.click('a[href="/videos/create"]');
    //console.log(browser.getText('body'));
    assert.include(browser.getText('body'), 'Save a video');
  });
});
