var botBuilder = require('claudia-bot-builder')

module.exports = botBuilder(function (request) {
  return 'Thanks for sending ' + request.text  + 
      '. Your message is very important to us, but '
},{
  platforms: ['telegram']
});