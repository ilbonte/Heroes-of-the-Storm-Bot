const assert = require('assert')
const Command = require('../lib/Command')

test('Command', function () {

  test('can sanitize the command', function () {
    const command = new Command('  /xul@hots_helper_bot   info   ')

    var sanitizedCommand = command.getCommand();

    assert.equal('/xul info', sanitizedCommand)
  })

  test('can get hero name from the command', function () {
    const command = new Command('  /xul@hots_helper_bot   info   ')

    var heroName = command.getHero();

    assert.equal('xul', heroName)
  })

  test('can get optional args', function () {
    const command = new Command('  /xul@hots_helper_bot   info   ')

    var optionalArg = command.getOptionalArg();

    assert.equal('info', optionalArg)
  })
})