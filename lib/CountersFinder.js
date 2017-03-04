function CountersFinder(selectedHeroes, keyboardBuilder) {
  this.selectedHeroes = selectedHeroes
  this.keyboardBuilder = keyboardBuilder
}

CountersFinder.prototype.find = function (heroes) {
  var occurrences = {}
  console.log(heroes);

  heroes.forEach(hero => {
    hero.counters.forEach(counter => {
      if (occurrences[counter]) {
        occurrences[counter] += ' - ' + '/' + hero.name
      } else {
        occurrences[counter] = '/' + hero.name
      }
    })
  })

  var text = printCounters(getBestCounterAsText(occurrences), this.selectedHeroes)
  return this.keyboardBuilder.generateHeroList(text, this.selectedHeroes)
}

function getBestCounterAsText(occurrences) {
  var text = ""
  for (hero in occurrences) {
    text += `/${hero} counters: ${occurrences[hero]}` + '\n'
  }
  return text
}


function printCounters(partialCounters, selectedHeroes) {
  var text = ""

  if (selectedHeroes.length === 0) {
    text = "Choose hero"
  } else {
    text = selectedHeroes.toString().replace(/,/g, " ") + '\n' + partialCounters
  }

  return text
}

module.exports = CountersFinder