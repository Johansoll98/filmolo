console.log('reviewRoutes.js LOADED');
const express = require('express');
const router = express.Router();
const Review = require('../models/review');
const auth = require('../middleware/auth'); // Подключаем middleware для авторизации

// Создать отзыв (только авторизованный пользователь)
router.post('/', auth, async (req, res) => {
  console.log('Request body in /api/reviews POST:', req.body);
  try {
    const { showId, text } = req.body;
    const userId = req.user.id;
    if (!userId || !showId || !text) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const newReview = new Review({ userId, showId, text });
    await newReview.save();

    res.status(201).json({ message: 'Review created', review: newReview });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Получить все отзывы или отзывы по конкретному showId
router.get('/', async (req, res) => {
  try {
    const { showId } = req.query;
    const filter = showId ? { showId } : {};
    const reviews = await Review.find(filter)
      .populate('userId')
      .sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
