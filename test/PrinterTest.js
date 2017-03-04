const assert = require('assert')
const Printer = require('../lib/Printer')

const HERO_WITH_TWO_BUILDS = require('./fixtures/azmodan.json')

test("Printer", function () {

  test("can print an hero's builds from builds array", function () {
    var printer = new Printer(HERO_WITH_TWO_BUILDS)
    var expected = `All Shall Burn Build
1 | 3
4 | 1
7 | 4
10| 1
13| 3
16| 2
20| 4

Taste For Blood Build
1 | 1
4 | 2
7 | 1
10| 2
13| 3
16| 2
20| 4

`;

    var result = printer.buildsAsText()

    assert.equal(expected, result)
  })

  test("can print an informative message if the build can't be found", function () {
    var HERO_WITH_NO_BUILDS = {builds:[]}
    var printer = new Printer(HERO_WITH_NO_BUILDS)

    var result = printer.buildsAsText()

    assert.equal("No builds found", result)
  })

  test("can print the counter list", function () {
    var printer = new Printer(HERO_WITH_TWO_BUILDS)

    var result = printer.countersAsText()

    assert.equal(`Counters: 
/diablo
/muradin
/the-butcher`, result)
  })
})
