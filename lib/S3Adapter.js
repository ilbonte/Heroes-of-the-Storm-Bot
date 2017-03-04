var S3 = require('aws-sdk/clients/s3');
var s3 = new S3()

function S3Adapter() {
}

S3Adapter.prototype.getHeroFrom = function(heroName) {
  var params = {
    Bucket: 'hots-builds',
    Key: heroName + '.json',
  }
  return s3.getObject(params).promise().then(function (data) {
    var heroDataAsText = data.Body.toString('ascii')
    var heroObject =  JSON.parse(heroDataAsText)
    heroObject.name = heroName
    return heroObject
  })
}

S3Adapter.prototype.getDataFor = function (heroes) {
  return Promise.all(heroes.map(this.getHeroFrom));
}


module.exports = S3Adapter