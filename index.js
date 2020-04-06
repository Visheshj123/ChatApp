const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const messages = require('./src/utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./src/utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server) //mounts on top of http server

const port = process.env.PORT || 3000

app.use(express.static('public'))

io.on('connection',(socket) => {
  console.log('New connection')
  socket.on('msg', (msg,callback) => {
    const user = getUser(socket.id)
    io.to(user.room).emit('msg', messages.generateMessage(msg))
    callback()
  })
  socket.on('disconnect', () => {
    const user = removeUser(socket.id)
    console.log(user)
    if (user){
      io.to(user[0].room).emit('msg', messages.generateMessage(`${user[0].username} disconnected`))
      io.to(user[0].room).emit('roomData', { users: getUsersInRoom(user[0].room), room: user[0].room })
    //  console.log(user[0])

    }

  })
  socket.on('location', (locationData, callback) => {
    console.log(locationData)
    const user = getUser(socket.id)
    io.to(user.room).emit('locationMsg', messages.generateMessage(`https://google.com/maps?q=${locationData.lat},${locationData.lng}`))
    callback('location shared')
  })
  socket.on('join', (data, callback) => {
    const { error, user } = addUser({ id: socket.id, username: data.username, room: data.room  })
    if (error) {return callback(error)}
    socket.join(user.room)
    socket.emit('msg', messages.generateMessage('Welcome to the Chat!'))
    socket.broadcast.to(user.room).emit('msg', messages.generateMessage(`${user.username} has joined the chat`))
    io.to(user.room).emit('roomData', {
      users: getUsersInRoom(user.room),
      room: user.room
    })
  })
})



server.listen(port, () => {
  console.log('listening on port 3000')
})
