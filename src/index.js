// index.js
// This is the main entry point of our application

const express = require('express')
const {ApolloServer, gql} = require('apollo-server-express')
require('dotenv').config()

const modeles = require('./modeles/index')

const db = require('./db') //вызов подключения к БД

const port = process.env.PORT || 4000 //запускаем сервер на порте указанном в .env файле или на порте 4000
const DB_HOST = process.env.DB_HOST //Переменная хоста 

let notes = [
  {id: '1', content: 'This is a note', author: 'Adam Scott'},
  {id: '2', content: 'This is another note', author: 'Harlow Everly'},
  {id: '3', content: 'Oh hey look, another note!', author: 'Riley Harrison'},
]

//построение схемы с использованием языка схем GraphQl
const typeDefs = gql` 
  type Query {
    hello: String!
    notes: [Note!]!
    note(id: ID!): Note!
  }

  type Note {
    id: ID!
    content: String!
    author: String!
  }

  type Mutation {
    newNote(content: String!): Note!
  }
`

//функция разрешения для полей схемы
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    notes: async () => await modeles.Note.find(), //делаем запрос к базе для получения данных
    note: async (parent, args) =>  await modeles.Note.findById(args.id) //получения конкретных данных БД
  },
  Mutation: {
    newNote: async (parent, args) => {
      return await modeles.Note.create({
        content: args.content,
        author: 'Adam Sctorr'
      })
    },
  }
}

const app = express()

db.connect(DB_HOST)//Подключаем БД

//настройка Apollo Server
const server = new ApolloServer({ typeDefs, resolvers })

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