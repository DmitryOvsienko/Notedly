// index.js
// This is the main entry point of our application

const express = require('express')
const {ApolloServer, gql} = require('apollo-server-express')

const port = process.env.PORT || 4000 //запускаем сервер на порте указанном в .env файле или на порте 4000

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
    notes: () => notes,
    note: (parent, args) => {
      return notes.find(note => note.id === args.id)
    },
  },
  Mutation: {
    newNote: (parent, args) => {
      let noteValue = {
        id: String(notes.length + 1),
        content: args.content,
        author: 'Adam Scott'
      }
      notes.push(noteValue)
      return noteValue
    }
  }
}

const app = express()

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

/* запрос на изменение массива данных (мутирования)
mutation {
  newNote (content: "NEW MUTANT NOTE!!!!!!!!!") {
    content
    id
    author
  }
}
*/