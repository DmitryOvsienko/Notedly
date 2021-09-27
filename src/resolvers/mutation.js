module.exports = {
  newNote: async (parent, args, {modeles}) => {
    return await modeles.Note.create({
      content: args.content,
      author: 'Adam Sctorr'
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
  }
}