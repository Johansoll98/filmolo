console.log('ratingRoutes.js LOADED');
const express = require('express');
const router = express.Router();
const Rating = require('../models/rating');
const auth = require('../middleware/auth'); // Подключаем middleware для авторизации

// Получить рейтинг пользователя (по query-параметрам)
router.get('/', async (req, res) => {
  try {
    const { userId, mediaType } = req.query;
    const mediaId = parseInt(req.query.mediaId, 10);
    const rating = await Rating.findOne({ user: userId, mediaId, mediaType });
    res.json({ success: true, rating: rating ? rating.rating : 0 });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Сохранить рейтинг (только авторизованный пользователь)
router.post('/', auth, async (req, res) => {
  try {
    // Берём userId из req.user, установленного auth middleware
    const { mediaId, mediaType, rating } = req.body;
    const userId = req.user.id;
    const numMediaId = parseInt(mediaId, 10);

    let existingRating = await Rating.findOne({ user: userId, mediaId: numMediaId, mediaType });
    if (existingRating) {
      existingRating.rating = rating;
      await existingRating.save();
      return res.json({ success: true, rating: existingRating });
    } else {
      const newRating = new Rating({ user: userId, mediaId: numMediaId, mediaType, rating });
      await newRating.save();
      return res.json({ success: true, rating: newRating });
    }
  } catch (error) {
    console.error('Error saving rating:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Получить средний рейтинг
router.get('/average/:mediaType/:mediaId', async (req, res) => {
  try {
    const mediaType = req.params.mediaType;
    const mediaId = parseInt(req.params.mediaId, 10);
    const ratings = await Rating.find({ mediaType, mediaId });
    const average =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : 0;
    res.json({ success: true, average });
  } catch (error) {
    console.error('Error fetching average rating:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
