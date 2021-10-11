const bcrypt = require('bcrypt') //библиотека для шифрования паролей
const jwt = require('jsonwebtoken') //токен для проверки авторизации пользователя
const mongoose = require('mongoose')
const {
  AuthenticationError,
  ForbiddenError
} = require('apollo-server-express')

const gravatar = require('../util/gravatar')

module.exports = {
  newNote: async (parent, args, {modeles, user}) => {
    if (!user) {
      throw new AuthenticationError('You must be signed in to create a note')
    }
    return await modeles.Note.create({
      content: args.content,
      author: mongoose.Types.ObjectId(user.id)
    })
  },
  deleteNote: async (parent, { id }, { modeles, user }) => {
    if (!user) {// Если не пользователь, выбрасываем ошибку авторизации
      throw new AuthenticationError('You must be signed in to delete a note')
    }

    const note = await modeles.Note.findById(id)// Находим заметку

    if (note && String(note.author) !== user.id) {// Если владелец заметки и текущий пользователь не совпадают, выбрасываем
      // запрет на действие
      throw new ForbiddenError('You dont have permissions to delete the note')
    }

    try{// Если все проверки проходят, удаляем заметку
      await note.remove()
      return true
    } catch (err) {
      return false
    }
  },
  updateNote: async (parent,  {content, id },  {modeles, user }) => {

    if (!user) {// Если не пользователь, выбрасываем ошибку авторизации
      throw new AuthenticationError('You must ne signed in to update a note')
    }

    const note = await modeles.Note.findById(id)// Находим заметку

    if (note && String(note.author) !== user.id) {// Если владелец заметки и текущий пользователь не совпадают, выбрасываем
      // запрет на действие
      throw new ForbiddenError('You dont have permissions to update the note')
    }
// Обновляем заметку в БД и возвращаем ее в обновленном виде
    return await modeles.Note.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          content
        }
      },
      {
        new: true
      }
    )
  },
  signUp: async (parent, { username, email, password }, { modeles }) => {
    email = email.trim().toLowerCase() //убираем пробелы и делаем нижний регистр
    const hashed = await bcrypt.hash(password, 10) //хэшируем пароль
    const avatar = gravatar(email) // моделируем аватар для пользователя
    try {
      const user = await modeles.User.create({
        username,
        email,
        avatar,
        password: hashed
      })

      return jwt.sign({ id: user._id }, process.env.JWT_SECRET) //создаем и возвращаем jsonwebtoken
    } catch (err) {
      throw new Error('Error creating account')
    }
  },
  signIn: async (parent, { username, email, password }, { modeles }) => {
    if (email) {
      email = email.trim().toLowerCase()
    }

    const user = await modeles.User.findOne({
      $or: [{ email }, { username }]
    })

    if (!user) {
      throw new AuthenticationError('Error signing in') //если юзер не найден выбрасываем ошибку
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      throw new AuthenticationError('Error signing in') // если пароли не совпали то выбрасываем ошибку
    }

    return jwt.sign({ id: user._id }, process.env.JWT_SECRET) //создаем и возвращаем вебтокен
  },
  toggleFavorite: async (parent, { id }, { modeles, user }) => {

    if (!user) {// Если контекст пользователя не передан, выбрасываем ошибку
      throw new AuthenticationError()
    }

    let noteCheck = await modeles.Note.findById(id)// Проверяем, отмечал ли пользователь заметку как избранную
    const hasUser = noteCheck.favoritedBy.indexOf(user.id)

    if (hasUser >= 0) {// Если пользователь есть в списке, удаляем его оттуда и уменьшаем значение
      // favoriteCount на 1
      return await modeles.Note.findByIdAndUpdate(
        id,
        {
          $pull: {
            favoritedBy: mongoose.Types.ObjectId(user.id)
          },
          $inc: {
            favoriteCount: -1
          }
        },
        {
          new: true// Устанавливаем new как true, чтобы вернуть обновленный документ
        }
      )
    } else {// Если пользователя в списке нет, добавляем его туда и увеличиваем
      // значение favoriteCount на 1
     
      return await modeles.Note.findByIdAndUpdate(
        id,
        {
          $push: {
            favoritedBy: mongoose.Types.ObjectId(user.id)
          },
          $inc: {
            favoriteCount: 1
          }
        },
        {
          new: true
        }
      )
    }
  }
}