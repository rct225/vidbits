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
  video = await Video.create({title, description});
  res.status(201).render('videos/show', {video});
});

module.exports = router;
