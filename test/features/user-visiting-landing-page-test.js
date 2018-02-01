const {assert} = require('chai');

const generateRandomUrl = (domain) => {
  return `http://${domain}/${Math.random()}`;
};

const buildAndSubmitForm = (browser, video) => {
  title = video.title;
  description = video.description;
  url = video.url;

  browser.setValue('[name=title]', title);
  browser.setValue('[name=description]', description);
  browser.setValue('[name=url]', url);
  browser.click('[type=submit]');
};


describe('User visiting landing page', () => {
  describe('with no existing videos', () => {
    it('shows no videos', () => {
      browser.url('/');

      assert.equal(browser.getText('#videos-container'), '');
    });
  });
  describe('with an existing video', () => {
    it('shows it in the list', () => {
      const title = 'Meow';
      const description = 'Everyone like Cats';
      const url = generateRandomUrl('example.com');

      browser.url('/videos/create');
      buildAndSubmitForm(browser, {title, description, url});
      browser.url('/');

      assert.equal(browser.getText('#videos-container'), title);
      assert.equal(browser.getAttribute('iframe', 'src'), url);
    });
    it('can navigate to a video', () => {
      const title = 'Meow';
      const description = 'Everyone like Cats';
      const url = generateRandomUrl('example.com');

      browser.url('/videos/create');
      buildAndSubmitForm(browser, {title, description, url});
      browser.url('/');
      browser.click('#videos-container a');

      assert.include(browser.getText('body'), description);
    });
  });

  it('can navigate to create page', () => {
    browser.url('/');
    browser.click('a[href="/videos/create"]');
    //console.log(browser.getText('body'));
    assert.include(browser.getText('body'), 'Save a video');
  });
});
