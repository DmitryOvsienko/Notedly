module.exports = {
  notes: async (user, args, { modeles }) => await modeles.Note.find({ author: user._id }).sort({ _id: -1 }),// При запросе разрешается список заметок автора
  favorites: async (user, args, { modeles }) => await modeles.Note.find({ favoritedBy: user._id }).sort({ _id: -1 }),// При запросе разрешается список избранных заметок 
}