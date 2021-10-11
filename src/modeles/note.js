const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    require: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true
  },
  favoriteCount: {
    type: Number,
    default: 0,
  },
  favoritedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
},
{
  timestamps: true //присваиваем поля createdAt и updatedAt с типом данных
}) //определяем схему БД заметки
const Note = mongoose.model('Note', noteSchema) //определяем модель со схемой

module.exports = Note //Экспортируем модель
