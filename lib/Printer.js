function Printer(hero) {
  this.hero = hero
}

Printer.prototype.buildsAsText = function () {
  if (this.hero.builds.length === 0) {
    return "No builds found"
  }

  var result = "";
  this.hero.builds.forEach((buildObj) => {
    result += printedBuildFrom(buildObj)
  })

  return result;
}
Printer.prototype.buildWithDescription = function () {
  if (this.hero.builds.length === 0) {
    return "No builds found"
  }

  var result = "";
  this.hero.builds.forEach((buildObj) => {
    result += printedBuildFrom(buildObj)
    result += buildObj.description
    result += "\n-----------\n"
  })

  return result;
}
Printer.prototype.countersAsText = function () {
  if (this.hero.counters.length === 0) {
    return "No builds found"
  }

  return "Counters: \n" + this.hero.counters.toString().replace(/,/g,"\n")
}

function printedBuildFrom(buildObj) {
  var build = buildObj.build
  return `${buildObj["name"]}
1 | ${build["1"]}
4 | ${build["4"]}
7 | ${build["7"]}
10| ${build["10"]}
13| ${build["13"]}
16| ${build["16"]}
20| ${build["20"]}

`
}

module.exports = Printer