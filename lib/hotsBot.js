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

      return findCounersFromHeroesSet(selectedHeroes).then(partialCounters => {
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
    var buildText = data.Body.toString('ascii')
    return JSON.parse(buildText)
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

function findCounersFromHeroesSet(heroSet) {

  function getHeroesFromDb(filenames) {
    return Promise.all(filenames.map(getHeroFromDb));
  }

  return getHeroesFromDb(heroSet).then(function (heroes) {
    var occurrences = {}
    for (var i = 0; i < heroes; i++) {
      var counters = hero.counters;

    }

    heroes.forEach(hero => {
      hero.counters.forEach(counter => {
        if (occurrences[counter]) {
          occurrences[counter] += 1
        } else {
          occurrences[counter] = 1
        }
      })
    })

    var res = ""
    for (hero in occurrences) {
      res += hero + ': ' + occurrences[hero] + '\n'
    }
    return res

  }, function (err) {
    // If any of the files fails to be read, err is the first error
    return 'error calculating counter team. maybe you did a typo?'
  });

  heroSet.forEach((hero) => {
    getHeroFromDb(hero)
  })
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