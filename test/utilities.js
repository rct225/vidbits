const buildAndSubmitForm = (browser, video) => {
  title = video.title;
  description = video.description;
  url = video.url;

  browser.setValue('#title-input', title);
  browser.setValue('#description-input', description);
  browser.setValue('#url-input', url);
  //browser.click('#submit-button');
  browser.click('[type="submit"]');
};

module.exports = {
  buildAndSubmitForm,
}
