let users = []

const addUser = ({ id, username, room }) => {
  //Clean the data
  username = username.trim().toLowerCase()
  room = room.trim().toLowerCase()

  if(!username || !room){
    return {
      error: 'username and room are required'
    }
  }
  //check for existing user
  const existingUser = users.find(user => user.username === username && user.room === room)
  if(existingUser) return {error: 'User already exists'}
  const user = { id, username, room }

  users.push(user)
  return { user }

}

const removeUser = (id) => {
  //return user whose id matches id
  const userToDelete = users.findIndex(user => user.id === id)
  if(userToDelete != -1) return users.splice(userToDelete, 1)
   //returns deleted user, changes users value

}

const getUser = (id) => {
  return users.find(user => user.id === id)
}

const getUsersInRoom = (room) => {
  room = room.trim().toLowerCase()
  return users.filter(user => user.room === room)
}



module.exports = { addUser, removeUser, getUser, getUsersInRoom }
