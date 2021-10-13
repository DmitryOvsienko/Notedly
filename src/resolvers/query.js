const { LoneSchemaDefinition } = require("graphql/validation/rules/LoneSchemaDefinition");
const { models } = require("mongoose");

module.exports = {
    notes: async (parent, args, {modeles}) => await modeles.Note.find().limit(100), //делаем запрос к базе для получения данных
    note: async (parent, args, {modeles}) =>  await modeles.Note.findById(args.id), //получения конкретных данных БД
    user: async (parent, { username }, { modeles }) => await modeles.User.findOne({ username }),// Находим пользователя по имени
    users: async (parent, args, { modeles }) => await modeles.User.find({}),
    me: async (parent, args, { modeles, user }) => await modeles.User.findById(user.id),
    noteFeed: async (parent, { cursor }, { modeles }) => {
      
        const limit = 10// Жестко кодируем лимит в 10 элементов
        let hasNextPage = false// Устанавливаем значение false по умолчанию для hasNextPage
        let cursorQuery = {}// Если курсор передан не будет, то по умолчанию запрос будет пуст
        // В таком случае из БД будут извлечены последние заметки
        // Если курсор задан, запрос будет искать заметки со значением ObjectId 
        // меньше этого курсора
        if (cursor) {
            cursorQuery = { _id: { $lt: cursor } }
        }
        // Находим в БД limit + 1 заметок, сортируя их от старых к новым
        let notes = await modeles.Note.find(cursorQuery)
        .sort({ _id: -1 })
        .limit(limit + 1)

        // Если число найденных заметок превышает limit, устанавливаем 
        // hasNextPage как true и обрезаем заметки до лимита
        if (notes.length > limit) {
            hasNextPage = true
            notes = notes.slice(0, -1)
        }
        // Новым курсором будет ID Mongo-объекта последнего элемента массива списка
        const newCursor = notes[notes.length - 1]._id

        return {
            notes,
            cursor: newCursor,
            hasNextPage
        }
    }
} 