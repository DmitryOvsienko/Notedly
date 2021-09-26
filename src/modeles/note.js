const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    require: true
  },
  author: {
    type: String,
    require: true
  },
},
{
  timestamps: true //присваиваем поля createdAt и updatedAt с типом данных
}) //определяем схему БД заметки
const Note = mongoose.model('Note', noteSchema) //определяем модель со схемой

module.exports = Note //Экспортируем модель
