var aws = require('aws-sdk')
var s3 = new aws.S3({ signatureVersion: 'v4' })

module.exports = function (request) {
  console.log(request.text)
  var heroName = request.text
  var params = {
    Bucket: 'hots-builds',
    Key: heroName+'.json',
  };
  var getObjectPromise = s3.getObject(params).promise();
  return getObjectPromise.then(function (data) {
    return data.Body.toString('ascii')
  }).catch(function (err) {
    return "hero not found"
  });
}
