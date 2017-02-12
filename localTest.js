const readline = require('readline');
let assistant = require('./lib/hotsBot')
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
      Promise.resolve(botResponse).then(console.log)
      break;
  }
  rl.prompt();
});


function requestWithCommand(command) {
  return minimalCommand = {
    "text": command,
    "originalRequest": {
      "message": {
        "date": (+ new Date()/1000).toFixed(0),
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
