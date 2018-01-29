const {assert} = require('chai');

describe('User visiting landing page', () => {
  describe('with no existing videos', () => {
    it('shows no videos', () => {
      browser.url('/');

      assert.equal(browser.getText('#videos-container'), '');
    });
  });

  it('can navigate to create page', () => {
    browser.url('/');
    browser.click('a[href="/videos/create.html"]');
    console.log(browser.getText('body'));
    assert.include(browser.getText('body'), 'Save a video');
  });
});
