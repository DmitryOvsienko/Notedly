const mongoose = require('mongoose')

module.exports = {
  connect: DB_HOST => {
    mongoose.set('useNewUrlParser',true) //Обновленный парсер строки URL драйвера Mongo
    mongoose.set('useFindAndModify', false)
    mongoose.set('useCreateIndex',true)
    mongoose.set('useUnifiedTopology',true)//новый механизм обнаружения и мониторинга серверов
    mongoose.connect(DB_HOST)
    console.log('MongoDB connect!')
    mongoose.connection.on('error', err => {
      console.error(err)
      console.log('MongoDB connection error. Please make sure MongoDB is running.')
      process.exit()
    })
  },
  close: () => {
    mongoose.connection.close()
  }
}