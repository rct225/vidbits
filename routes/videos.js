const router = require('express').Router();
const Video = require('../models/video');

router.get('/', async (req, res) => {
  const videos = await Video.find({});

  res.render('videos/index', {videos});
});

router.get('/videos/create', async (req, res) => {
  res.render('videos/create');
});

router.post('/videos', async (req, res) => {
  const {title, description} = req.body;
  const video = new Video({title, description});
  video.validateSync();

  if (video.errors) {
    res.status(400);
    //response.render('videos/create', {video});
    res.send('');
  } else {
    await video.save();
    res.status(201).render('videos/show', {video});
    //response.redirect(`/videos/${video._id}`);
  }
});

module.exports = router;
