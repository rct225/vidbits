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
  res.render('videos/create');
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

module.exports = router;
