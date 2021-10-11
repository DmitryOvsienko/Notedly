module.exports = {
  author: async (note, args, { modeles }) => await modeles.User.findById(note.author),// При запросе разрешается информация об авторе заметки
  favoritedBy: async (note, args,{ modeles }) => await modeles.User.find({ _id: { $in: note.favoritedBy }})// При запросе разрешается информация favoritedBy для заметки
}