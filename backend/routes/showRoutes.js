// backend/routes/showRoutes.js
console.log('showRoutes.js LOADED');

const express = require('express');
const router = express.Router();
const Show = require('../models/show');

// Создать (POST) шоу
router.post('/', async (req, res) => {
  try {
    const { title, year, genre } = req.body;
    if (!title || !year || !genre) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const newShow = new Show({ title, year, genre });
    await newShow.save();

    res.status(201).json({ message: 'Show created', show: newShow });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Получить все шоу (GET)
router.get('/', async (req, res) => {
  try {
    const shows = await Show.find();
    res.json(shows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ... при желании добавь GET по ID, UPDATE, DELETE и т.д.

module.exports = router;
