var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
const { setFlagsFromString } = require('v8');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

var Message = mongoose.model('Message',{
  name : String,
  message : String,
  room: String
});

var Room = mongoose.model('Room',{
  name:String
});

var dbUrl ='mongodb+srv://umg:umg12345@cluster0.tma9t.mongodb.net/simple-chat?retryWrites=true&w=majority';

app.get('/messages', (req, res) => {
  Message.find({},(err, messages)=> {
    res.send(messages);
  })
})

app.get('/rooms/:room', (req, res) => {
  var room1 = req.params.room;
  Message.find({room:room1},(err, rooms)=> {
    res.send(rooms);
  })
})

app.get('/rooms', (req, res) => {
  Room.find({},(err, rooms)=> {
    res.send(rooms);
  })
})

app.get('/messages/:user', (req, res) => {
  var user = req.params.user
  Message.find({name: user},(err, messages)=> {
    res.send(messages);
  })
})


app.post('/messages', async (req, res) => {
  try{
    var message = new Message(req.body);

    var savedMessage = await message.save()
      console.log('saved');
      io.emit('message', req.body);
      res.sendStatus(200);
  }
  catch (error){
    res.sendStatus(500);
    return console.log('error',error);
  }
  finally{
    console.log('Message Posted')
  }

})


io.on('connection', () =>{
  console.log('a user is connected')
})

mongoose.connect(dbUrl ,{useMongoClient : true} ,(err) => {
  console.log('mongodb connected',err);
})

var server = http.listen(3001, () => {
  console.log('server is running on port', server.address().port);
});