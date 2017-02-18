var aws = require('aws-sdk')
var s3 = new aws.S3({ signatureVersion: 'v4' })
var BasicPrinter = require('./Printer.js')
module.exports = function (request) {
  var command = request.text
  if (command[0] === "/") {
    if(command === "/help"){
      return printHelp()
    }

    var heroName=command.substr(1).toLowerCase()
    var params = {
      Bucket: 'hots-builds',
      Key: heroName + '.json',
    };
    var getObjectPromise = s3.getObject(params).promise();
    return getObjectPromise.then(function (data) {
      var buildText = data.Body.toString('ascii')
      var printer = new BasicPrinter(JSON.parse(buildText))
      return printer.buildsAsText()

    }).catch(function (err) {
      return "Hero not found"
    });
  }else{
    return printHelp()
  }
}

function printHelp(){
  return "TODO - not implemented yet"
}
