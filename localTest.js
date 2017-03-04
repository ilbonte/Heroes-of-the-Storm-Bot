const readline = require('readline');
let assistant = require('./lib/hotsBot')
var events = require('events');
var myEmitter = new events.EventEmitter()
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> '
});

rl.prompt();

rl.on('line', (line) => {
  switch (line.trim()) {
    case 'q':
      process.exit(0);
      break;
    default:
      const request = requestWithCommand(line.trim())
      const botResponse = assistant(request)
      Promise.resolve(botResponse).then(console.log).then(()=> rl.write(null, {ctrl: true, name: 'u'})).catch(err => console.log(err))
      
      break;
  }


});

function requestWithCommand(command) {
  return minimalCommand = {
    "text": command,
    "originalRequest": {
      "message": {
        "date": (+ new Date() / 1000).toFixed(0),
        "text": command,
        "message_id": "1234",
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
