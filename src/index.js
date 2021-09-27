// index.js
// This is the main entry point of our application
/**
 * для запуска mongosh запускаем cmd от имени админа пишем команду mongosh
 * запускаем mongod на диске С в папке MongoDB
 * запускаем скрипт в терминале npm run dev
 */

const express = require('express')
const {ApolloServer} = require('apollo-server-express')
require('dotenv').config()

/**импортируем локальные модули */
const db = require('./db') //вызов подключения к БД
const typeDefs = require('./schema')
const resolvers = require('./resolvers') //CRUD создавать считывать обновлять удалять общий шаблон с методами
const modeles = require('./modeles/index')

const port = process.env.PORT || 4000 //запускаем сервер на порте указанном в .env файле или на порте 4000
const DB_HOST = process.env.DB_HOST //Переменная хоста 

const app = express()

db.connect(DB_HOST)//Подключаем БД

//настройка Apollo Server
const server = new ApolloServer({ typeDefs, resolvers, context: () => {return {modeles}} })

//применяем промежуточное ПО Apollo GraphQl и указываем путь к /api
server.applyMiddleware({ app, path: '/api' })

app.get('/', (req,res) => res.send('hello web server!!!!!'))
app.listen({ port }, () => console.log(`GraphQl Server running at http://localhost:${port}${server.graphqlPath}`))

/* запрос через GraphQl для получения массива данных
query {
  notes {
    id
    content
    author
  }
}
*/

/** запрос для получения одной записили по айди
 * query {
  note(id: "6150cc94911fde3ad85dfe3b") {
    id
    content
    author
  }
}
 */

/* запрос на изменение массива данных (мутирования)
mutation {
  newNote (content: "NEW MUTANT NOTE!!!!!!!!!") {
    content
    id
    author
  }
}
*/