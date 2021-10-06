const bcrypt = require('bcrypt') //библиотека для шифрования паролей
const jwt = require('jsonwebtoken') //токен для проверки авторизации пользователя
const {
  AuthenticationError,
  ForbiddenError
} = require('apollo-server-express')

const gravatar = require('../util/gravatar')

module.exports = {
  newNote: async (parent, args, {modeles}) => {
    return await modeles.Note.create({
      content: args.content,
      author: 'Adam Sctott'
    })
  },
  deleteNote: async (parent, {id}, {modeles}) => {
    try{
      await modeles.Note.findOneAndRemove({_id: id})
      return true
    } catch (err) {
      return false
    }
  },
  updateNote: async (parent, {content, id}, {modeles}) => {
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
  }
}