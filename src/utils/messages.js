const moment = require('moment')
const generateMessage = (msg) => {
  return {
    text: msg,
    createdAt: moment().format("dddd, MMM, Do, YYYY, h:mm a")
  }
}

module.exports = {
  generateMessage
}
