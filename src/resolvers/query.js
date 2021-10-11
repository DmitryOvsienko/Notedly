const { models } = require("mongoose");

module.exports = {
    notes: async (parent, args, {modeles}) => await modeles.Note.find(), //делаем запрос к базе для получения данных
    note: async (parent, args, {modeles}) =>  await modeles.Note.findById(args.id), //получения конкретных данных БД
    user: async (parent, { username }, { modeles }) => await modeles.User.findOne({ username }),// Находим пользователя по имени
    users: async (parent, args, { modeles }) => await modeles.User.find({}),
    me: async (parent, args, { modeles, user }) => await modeles.User.findById(user.id)
}