// backend/models/Show.js
const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
  title: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  // Можно добавить постер, описание и т.д.
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Show', showSchema);
