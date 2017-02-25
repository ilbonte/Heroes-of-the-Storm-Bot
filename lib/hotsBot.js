var S3 = require('aws-sdk/clients/s3');
var s3 = new S3()
var Printer = require('./Printer.js')
var Command = require('./Command.js')
const heroes = require('../heroes.json')

module.exports = function (request) {
  var command = new Command(request.text)
  var msgToAnswer = request.originalRequest.message.message_id

  if (!command.isSlashCommand()) { // should not be required with privacy set
    return printHelp()
  }
  switch (command.getCommand()) {
    case "/start":
      return printWelcomeMessage()
      break;
    case "/help":
      // return JSON.stringify(request, null, 1)
      return printHelp()
      break;
    case "/test":
      return JSON.stringify(request, null, 1)
      break;
    case "/builds":  
      return generateKeyboardMessage(msgToAnswer,generateBuildsKeyboard())
      break;
    case "/counters":  
      return generateKeyboardMessage(msgToAnswer,generateCountersKeyboard())
      break;
    default:
      var optionalArg = command.getOptionalArg()
      var heroName = command.getHero();

      return getHeroFromDb(heroName).then(function (hero) {
        var printer = new Printer(hero)

        if (optionalArg === 'info') {
          return printer.buildWithDescription()
        }

        if (optionalArg === 'counters') {
          return printer.countersAsText()
        }

        return printer.buildsAsText()

      }).catch(function (err) {
        console.log(err);

        return "Hero not found\n\n" + JSON.stringify(request, null, 1)
      });
  }
}



function printHelp() {
  return "TODO - write help message"
}
function printWelcomeMessage() {
  return "TODO - write welcome message"
}

function getHeroFromDb(heroName) {
  var params = {
    Bucket: 'hots-builds',
    Key: heroName + '.json',
  }
  return s3.getObject(params).promise().then(function (data) {
    var buildText = data.Body.toString('ascii')
    return JSON.parse(buildText)
  })
}

function generateBuildsKeyboard () {
  return heroes.map(hero => ['/' + hero.name, '/' + hero.name + ' info'])
}

function generateCountersKeyboard() {
  return heroes.map(hero => ['/' + hero.name + ' counters'])
}

function generateKeyboardMessage(msgId, keyboard){

  return{
        text: "Choose hero",
        parse_mode: 'Markdown',
        reply_to_message_id:msgId,
        reply_markup: JSON.stringify({
          keyboard: keyboard,
          force_reply: true,
          selective: true
        })
      }

}