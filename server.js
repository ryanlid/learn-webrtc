const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const PORT = 3000;
console.log('Server started on port ' + PORT);

app.use(express.static(__dirname + '/public'))
app.get('/', (req, res) => {
  res.render('index.ejs')
})

// app.io.route('ready', function (req) {
//   req.io.join(req.data)
//   app.io.room(req.data).broadcast('announce', {
//     message: 'New client in the ' + req.data + 'room'
//   })
// })

io.on('connection', (socket) => {
  // console.log(socket)
  socket.on('ready', (data) => {
    // console.log('24', data)
    socket.join(data.chat_room)
    socket.join(data.signal_room)
    socket.broadcast.emit('announce', {
      message: 'new client in the ' + data.chat_room + ' room',
      // user_type: data.user_type,
      // user_name: data.user_name,
      // user_data: data.user_data,
      // command: command,
    })
  })
  socket.on('send', (data) => {
    // req.io.join(req.data)
    console.log(37, data)
    io.sockets.emit('message', {
      message: data.message,
      author: data.author
    })
  })
  socket.on('signal', (data) => {
    // console.log('signal11111111', data)
    // send to everyone in room,except self
    // io.sockets.in(data.room).emit('signaling_message', {
    socket.broadcast.to(data.room).emit('signaling_message', {
      type: data.type,
      message: data.message
    })
  })

})

server.listen(PORT)
