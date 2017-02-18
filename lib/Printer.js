function Printer(buildsArray) {
  this.buildsArray = buildsArray
}

Printer.prototype.buildsAsText = function () {
  if (this.buildsArray.length === 0) {
    return "No builds found"
  }

  var result = "";
  this.buildsArray.forEach((buildObj) => {
    var build = buildObj.build
    result += `${buildObj["name"]}
1 | ${build["1"]}
4 | ${build["4"]}
7 | ${build["7"]}
10| ${build["10"]}
13| ${build["13"]}
16| ${build["16"]}
20| ${build["20"]}

`
  })

  return result;
}

module.exports = Printer