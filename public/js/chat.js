//toDateString()


const socket = io();
socket.on('welcome', (msg) => {
  console.log(msg)
})

//Elements
const form = document.querySelector('.form-to-submit');
const input = document.getElementById('msg');
const button = document.getElementById('submit');
const template = document.getElementById('message-template');
const messages = document.getElementById('chat-body');

//querySelector, we use destructered sytanx to grab those fields
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
  console.log(document.documentElement.scrollTop)
  console.log(messages.scrollHeight)

    document.documentElement.scrollTop = messages.scrollHeight
    //console.log(messages.scrollTop)


}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  //disable form
  button.setAttribute('disabled', 'disabled');
    console.log(event.target);
  socket.emit('msg', document.getElementById('msg').value, () => {
    console.log('the messaged was received by the server')
    button.removeAttribute('disabled')
    //reenable form
  });
  input.value = '';
})

socket.on('msg', (msg) => {
  console.log(msg)
  const clone = template.content.cloneNode(true)
  clone.querySelector('#created-at').textContent = `Created At: ${msg.createdAt}`;
  clone.querySelector('#text-body').textContent = `${msg.text}`
  messages.appendChild(clone)
  autoscroll()

})

socket.on('locationMsg', data => {
  console.log(data)
  const clone = document.getElementById('location-template').content.cloneNode(true);
  clone.querySelector('a').setAttribute('href', data.text)
  clone.querySelector('#created-at').textContent = `Created At: ${data.createdAt}`;
  messages.appendChild(clone)
})
socket.on('roomData', ({users, room}) => {
  console.log(room)
  console.log(users)
  //create unordered list
  const ul = document.createElement('ul')
  ul.className = 'list-group-flush';
  users.forEach(user => {
    const li = document.createElement('li')
    li.className = 'list-group-item'
    li.textContent = user.username
    ul.appendChild(li)
  })
  //render template
  const template =  document.getElementById('user-list')
  const clone = template.content.cloneNode(true)
  clone.appendChild(ul)
  const userCol = document.getElementById('user-col')
  userCol.innerHTML = ''
  userCol.appendChild(clone)
})


document.getElementById('location').addEventListener('click', (event) => {
  event.preventDefault();
  if (!navigator.geolocation){
    return alert('Geolocation is not supported by browser')
  }
  document.querySelector('#location').setAttribute('disabled','disabled')

  navigator.geolocation.getCurrentPosition((position) =>{
    console.log(position);
    socket.emit('location', { lat: position.coords.latitude, lng: position.coords.longitude }, (shared) => {
      console.log(shared)
        document.querySelector('#location').removeAttribute('disabled');
    })
  })
})

socket.emit('join', { username, room }, (err)=>{
  if(err){
  const alert = document.createElement('div')
  alert.textContent = err;
  alert.className = 'alert alert-danger'
  alert.setAttribute('role', 'alert')
  document.querySelector('.card-body').prepend(alert)

    setTimeout( () => location.href = '/', 3000);
  }
})
