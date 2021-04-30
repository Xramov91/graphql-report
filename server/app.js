const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('../schema/schema')
const mongoose = require('mongoose')

const app = express();
const PORT = 3005;

mongoose.connect('mongodb+srv://alex:1234@cluster0.9fc3u.mongodb.net/shop', {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
})

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))

const dbConnection = mongoose.connection;
dbConnection.on('error', err => console.log('Connection error: ' + err))
dbConnection.once('open', err => console.log('Connection to DB'))

app.listen(PORT, err => {
    err ? console.log(err) : console.log('server started')
})