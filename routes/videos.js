const router = require('express').Router();
const Video = require('../models/video');

router.get('/videos', async (request, response) => {
  response.render('videos/index');
});

router.post('/videos', async (req, res) => {
  const {title, description} = req.body;
  video = await Video.create({title, description});
  res.status(201).render('videos/show', {video});
});

module.exports = router;
