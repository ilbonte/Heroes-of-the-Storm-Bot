const readline = require('readline');
let assistant = require('./lib/hotsBot')

const request = requestWithCommand('/azmodan')
const botResponse = assistant(request)
Promise.resolve(botResponse).then(console.log)


function requestWithCommand(command) {
  return minimalCommand = {
    "text": command,
    "originalRequest": {
      "message": {
        "date": (+ new Date() / 1000).toFixed(0),
        "text": command,
        "entities": [
          {
            "type": "bot_command"
          }
        ]
      }
    },
    "type": "telegram"
  }
}
