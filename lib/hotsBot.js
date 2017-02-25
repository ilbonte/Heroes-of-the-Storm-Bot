var S3 = require('aws-sdk/clients/s3');
var s3 = new S3()
var Printer = require('./Printer.js')
const botBuilder = require('claudia-bot-builder');
const telegramTemplate = botBuilder.telegramTemplate;
const heroes = require('../heroes.json')

module.exports = function (request) {
  var command = sanitizeCommand(request.text)

  if (command[0] !== "/") { // should not be required with privacy set
    return printHelp()
  }
  switch (command) {
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
      return new telegramTemplate.Text(`Choose the hero`)
        .addReplyKeyboard(generateReplayKeyboard(heroes))
        .get();
      break;  
    default:
      var optionalArg = extractOptionalArg(command)
      var heroName = extractHeroName(command)

      return getHeroFromDb(heroName).then(function (hero) {
        var printer = new Printer(hero)

        if (optionalArg === "info") {
          return printer.buildWithDescription()
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

function sanitizeCommand(text) {
  return text.trim().replace('@hots_helper_bot', '')
}

function extractOptionalArg(command) {
  return command.split(" ")[1]
}

function extractHeroName(command) {
  return command.substr(1).split(' ')[0].toLowerCase()
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

function generateReplayKeyboard(heroes, optionalArg) { 
  return heroes.map(hero => ['/' + hero.name, '/' + hero.name + ' info'])
}