//House Gardener+ Thais
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db, collection;

const url = "mongodb+srv://sebVivas:sleepTracker@cluster0-isfv7.mongodb.net/test?retryWrites=true&w=majority";
const dbName = "toDo";

app.listen(3000, () => {
    MongoClient.connect(url, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  //console.log(db)
  db.collection('data').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('todo.ejs', {tasksArray: result})
  })
})

app.post('/toDoList', (req, res) => {
  db.collection('data').save({
    task: req.body.task,
    completed: "#000000"
  }, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/update', (req, res) => {
  db.collection('data')
  .findOneAndUpdate({task: req.body.task}, {
    $set: {
      completed: "#FF0000"
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/removeCompleted', (req, res) => {
  db.collection('data').deleteMany({completed: req.body.completed}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})

app.delete('/removeAll', (req, res) => {
  db.collection('data').deleteMany({}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
