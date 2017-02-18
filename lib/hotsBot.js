var aws = require('aws-sdk')
var s3 = new aws.S3({ signatureVersion: 'v4' })
var BasicPrinter = require('./Printer.js')
module.exports = function (request) {
  var heroName = request.text
  var params = {
    Bucket: 'hots-builds',
    Key: heroName+'.json',
  };
  var getObjectPromise = s3.getObject(params).promise();
  return getObjectPromise.then(function (data) {
    var buildText = data.Body.toString('ascii')
    var printer = new BasicPrinter(JSON.parse(buildText))
    return printer.buildsAsText()

  }).catch(function (err) {
    console.log(err);
    
    return "hero not found"
  });
}
