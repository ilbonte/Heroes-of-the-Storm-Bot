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
  if (!command.isSlashCommand()) { // required for special messages like new mebers, new group image etc
      
    return 
  }
  switch (command.getSlashCommand()) {
    case "/start":
      return printHelp()
      break;
    case "/help":
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

        return "Command/Hero not found see /help for usage\n\n"
      });
  }
}

function printHelp() {
  return `For a more complete tutorial see https://github.com/ilbonte/Heroes-of-the-Storm-Bot
Use " /heroName " to display the builds in short. E.g: "/azmodan@hots_helper_bot" 
Use " /heroName info" to display the builds in detail with a description E.g: "/azmodan@hots_helper_bot info"
Use " /heroName counters" to display the counters for the given hero E.g: "/azmodan@hots_helper_bot counters"

If you think that typing is boring use /builds@hots_helper_bot to display a list of buttons for selecting the hero
Same for /counters@hots_helper_bot

Use "/ct@hots_helper_bot" to enter in an intractive mode that helps you choose the best team during a ranked hero select. To exit send any other command e.g. /builds@hots_helper_bot
`
}
