var Printer = require('./Printer.js')
var Command = require('./Command.js')
var Keyboard = require('./Keyboard.js')
var S3Adapter = require('./S3Adapter.js')
var CountersFinder = require('./CountersFinder.js')

var s3Adapter = new S3Adapter()

module.exports = function (request) {
  var command = new Command(request.text)
  var msgToAnswer = request.originalRequest.message.message_id
  var keyboardBuilder = new Keyboard(msgToAnswer);
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
      return keyboardBuilder.generateBuildsKeyboard()
      break;
    case "/counters":
      return keyboardBuilder.generateCountersKeyboard()
      break;
    case "/ct":

      var selectedHeroes = command.getHeroesInTeam()
      
      var countersFinder = new CountersFinder(selectedHeroes,keyboardBuilder)

      return s3Adapter.getDataFor(selectedHeroes)
            .then(countersFinder.find.bind(countersFinder))
            .catch((err) => { 'Error calculating best counters. Did you make a typo?'})
      
      break;
    default:
      var optionalArg = command.getOptionalArg()
      var heroName = command.getHero();

      return s3Adapter.getHeroFrom(heroName).then(function (hero) {
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
