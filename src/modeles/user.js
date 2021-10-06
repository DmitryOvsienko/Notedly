const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema( //модель схемы для пользователей
  {
    username: {
      type: String, //имя строка
      required: true, // поле обязательно для заполнения
      index: { unique: true } // поле уникальное
    },
    email: {
      type: String,
      required: true,
      index: { unique: true }
    },
    password: {
      type: String,
      require: true
    },
    avatar: {
      type: String
    }
  },
  {
    timestamps: true //присваиваем поля createdAt and updatedAt с типом Date
  }
)

const User = mongoose.model('User', UserSchema)
module.exports = User