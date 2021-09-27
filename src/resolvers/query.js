module.exports = {
    notes: async (parent, args, {modeles}) => await modeles.Note.find(), //делаем запрос к базе для получения данных
    note: async (parent, args, {modeles}) =>  await modeles.Note.findById(args.id) //получения конкретных данных БД
}