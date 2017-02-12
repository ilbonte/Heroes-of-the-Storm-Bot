var botBuilder = require('claudia-bot-builder')
const hotsBot = require('./lib/hotsBot')

module.exports = botBuilder(hotsBot,{
  platforms: ['telegram']
});