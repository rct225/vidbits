const router = require('express').Router();
const Video = require('../models/video');

router.get('/', async (req, res) => {
  const videos = await Video.find({});

  res.render('videos/index', {videos});
});

router.get('/videos/create', async (req, res) => {
  res.render('videos/create');
});

router.get('/videos/:id', async (req, res) => {
  const id = req.params.id;
  video = await Video.findOne({ _id: id });

  res.render('videos/show', {video});
});

router.get('/videos/:id/edit', async (req, res) => {
  const id = req.params.id;
  video = await Video.findOne({ _id: id });

  res.render('videos/edit', {video});
});

router.post('/videos', async (req, res) => {
  const {title, description, url} = req.body;
  const video = new Video({title, description, url});
  video.validateSync();

  if (video.errors) {
    //console.log(video.errors.title.message);
    res.status(400);
    res.render('videos/create', {video});
  } else {
    await video.save();
    //res.status(201).render('videos/show', {video});
    res.redirect(`/videos/${video._id}`);
  }
});

router.post('/videos/:id/updates', async (req, res) => {
  const id = req.params.id;
  const {title, description, url} = req.body;

  const video = await Video.findOne({ _id: id });
  video.title = title;
  video.description = description;
  video.url = url;
  video.validateSync();

  if (video.errors) {
    res.status(400);
    res.render('videos/edit', {video});
    //res.redirect(`/videos/${video._id}`);
  } else {
    await video.save();

    res.redirect(`/videos/${video._id}`);
  }

});

router.post('/videos/:id/deletions', async (req, res) => {
  const id = req.params.id;
  await Video.deleteOne({ _id: id });

  res.redirect('/');
});

module.exports = router;
