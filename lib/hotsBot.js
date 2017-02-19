var S3 = require('aws-sdk/clients/s3');
var s3 = new S3()

var BasicPrinter = require('./Printer.js')


module.exports = function (request) {
  var command = request.text.trim().replace('@hots_helper_bot','')

  if (command[0] === "/") {
    if (command === "/help") {
      return printHelp()
    }

    if (command === "/start") {
      return printWelcomeMessage()
    }

    var optionalArg = command.split(" ")[1]
    var heroName = command.substr(1).split(" ")[0].toLowerCase()


    var params = {
      Bucket: 'hots-builds',
      Key: heroName + '.json',
    };
    var getObjectPromise = s3.getObject(params).promise();
    return getObjectPromise.then(function (data) {
      var buildText = data.Body.toString('ascii')

      var printer = new BasicPrinter(JSON.parse(buildText))

      if (optionalArg === "info") {
        return printer.buildWithDescription()
      }

      return printer.buildsAsText()

    }).catch(function (err) {
      console.log(err);
      
      return "Hero not found"
    });
  } else {
    return printHelp()
  }
}

function printHelp() {
  return "TODO - write help message"
}
function printWelcomeMessage() {
  return "TODO - write welcome message"
}
