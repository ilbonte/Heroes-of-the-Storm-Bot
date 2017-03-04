var S3 = require('aws-sdk/clients/s3');
var s3 = new S3()
var Printer = require('./Printer.js')
var Command = require('./Command.js')
const heroes = require('../heroes.json')

module.exports = function (request) {
  var command = new Command(request.text)
  var msgToAnswer = request.originalRequest.message.message_id

  if (!command.isSlashCommand()) { // required for change image/new member
    return printHelp()
  }
  switch (command.getSlashCommand()) {
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
      return generateKeyboardMessage(msgToAnswer, generateBuildsKeyboard())
      break;
    case "/counters":
      return generateKeyboardMessage(msgToAnswer, generateCountersKeyboard())
      break;
    case "/ct":
      var command = command.getCommand()
      var commandLine = command.split('\n')[0]
      var selectedHeroes = commandLine.split(/\s/).filter(command => { return command[0] !== '/' && command.length > 0 })

      return findCounersFor(selectedHeroes).then(partialCounters => {
        var text = ""

        if (selectedHeroes.length === 0) {
          text = "Choose hero"
        } else {
          text = selectedHeroes.toString().replace(/,/g, " ") + '\n' + partialCounters
        }


        return {
          text: text,
          reply_to_message_id: msgToAnswer,
          reply_markup: JSON.stringify({
            keyboard: generateHeroList(selectedHeroes),
            force_reply: true,
            selective: true
          })
        }
      }).catch((err) => { return 'error with ct' })
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
    var heroDataAsText = data.Body.toString('ascii')
    return JSON.parse(heroDataAsText)
  })
}

function generateBuildsKeyboard() {
  return heroes.map(hero => ['/' + hero.name, '/' + hero.name + ' info'])
}

function generateCountersKeyboard() {
  return heroes.map(hero => ['/' + hero.name + ' counters'])
}

function generateHeroList(counters) {
  return heroes.filter(hero => counters.indexOf(hero.name) < 0).map(hero => ['/ct ' + counters.toString().replace(/,/g, " ") + " " + hero.name])
}

function getDataFromDbFor(heroes) {
  return Promise.all(heroes.map(getHeroFromDb));
}

function findCounterOccurrences(heroes) {
  var occurrences = {}

  heroes.forEach(hero => {
    hero.counters.forEach(counter => {
      if (occurrences[counter]) {
        occurrences[counter] += 1
      } else {
        occurrences[counter] = 1
      }
    })
  })

  var sortedOccurrences = [];
  for (var hero in occurrences)
    sortedOccurrences.push([hero, occurrences[hero]])

  sortedOccurrences.sort(function (a, b) {
    return b[1] - a [1]
  })
  return sortedOccurrences
}

function getBestCounterAsText(occurrences) {
  var text = ''
  occurrences.forEach((occourrencePair)=>{
    var hero = occourrencePair[0]
    var occurrence= occourrencePair[1]
    text += `/${hero} counters ${occurrence} ${occurrence == 1 ? 'hero' : 'heroes'}\n`
  })

  return text
}

function findCounersFor(selectedHeroes) {
  return getDataFromDbFor(selectedHeroes)
    .then(findCounterOccurrences)
    .then(getBestCounterAsText)
    .catch(() => 'Error calculating best counters. Did you make a typo?')
}

function generateKeyboardMessage(msgId, keyboard) {
  return {
    text: "Choose hero",
    parse_mode: 'Markdown',
    reply_to_message_id: msgId,
    reply_markup: JSON.stringify({
      keyboard: keyboard,
      force_reply: true,
      selective: true
    })
  }

}