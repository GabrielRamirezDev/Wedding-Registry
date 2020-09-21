//server side javascript
//client makes a request to server the server will talk to the database and the server decides what to so server is the "middle person"
// rest API is handling creating reading updating and deleting
//when loading a page its reading (get request)
//4 key request a server can understand post get put delete rest api is a server that can listen to crude request
// server needs talk to the data base and get all the messages from the db then plugs into html then respond with an html file

//require includes modules that exist in separate files

// reads, executes, and returns express module
const express = require('express')
const app = express()
const bodyParser = require('body-parser') //Middleware that extracts body portion of an incoming request stream and exposes it on req. body
const MongoClient = require('mongodb').MongoClient

var db, collection;

// const url = "mongodb+srv://demo:demo@cluster0-q2ojb.mongodb.net/test?retryWrites=true";
const url = "mongodb+srv://dbUser:weddingRegistry@cluster0.k2lnv.mongodb.net/Cluster0?"// mongodb db url
//database name as variable
const dbName = "demo";

app.listen(3000, () => {//defines what localhost will be
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

//set is an update operator
app.set('view engine', 'ejs')
//.use configures middleware
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public')) //allows the public folder to use img and css files (static assets)

//root --looks at the database, finds every message object, puts it into an array and renders it in index.ejs
app.get('/', (req, res) => {
  db.collection('messages').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {messages: result})
  })
})

//looks goes to the data base(db.collection), inserts a new message(insertOne()) and refreshes the page(res.redirect())
app.post('/messages', (req, res) => {
  db.collection('messages').insertOne({name: req.body.name, msg: req.body.msg, email: req.body.email, gift: req.body.gift}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

//goes into the database,finds the message using the name and message, updates the thumbsUp counter +1 and sends the result
// app.put('/thumbUp', (req, res) => {
//   db.collection('messages')
//   .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
//     $set: {
//       thumbUp:req.body.thumbUp + 1
//     }
//   }, {
//     sort: {_id: -1},
//     upsert: true
//   }, (err, result) => {
//     if (err) return res.send(err)
//     res.send(result)
//   })
// })

//goes into the database,finds the message using the name and message, updates the thumbsUp counter -1 and sends the resultapp.put('/thumbDown', (req, res) => {
// app.put('/thumbDown', (req, res) => {
//   db.collection('messages')
//   .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
//     $set: {
//       thumbUp:req.body.thumbUp - 1
//     }
//   }, {
//     sort: {_id: -1},
//     upsert: true
//   }, (err, result) => {
//     if (err) return res.send(err)
//     res.send(result)
//   })
// })

//goes to the database, finds the message using the name and message(findOneAndDelete), deletes the message
app.delete('/messages', (req, res) => {
  db.collection('messages').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
