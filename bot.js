var botBuilder = require('claudia-bot-builder')
var aws = require('aws-sdk')
  var s3 = new aws.S3({signatureVersion: 'v4'})

module.exports = botBuilder(function (request) {
  console.log("start reading")
  return new Promise((resolve, reject) => {
      s3.getObject({
        Bucket: "hots-builds",
        Key: "azmodan.json"
      }, callback(resolve, reject))
    })
},{
  platforms: ['telegram']
});

function callback(resolve, reject) {
    return function(err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(data.Body.toString('ascii'))
      }
    }
  }