function Command(rawText) {
  this.rawText = rawText
  this.command = rawText.replace(/\s+/g, ' ').replace('@hots_helper_bot', '').trim()
}

Command.prototype.getCommand = function () {
  return this.command
}
Command.prototype.getSlashCommand = function () {
  return this.command.split(/\s/)[0]
}

Command.prototype.isSlashCommand = function () {
  return this.command[0] === '/'
}

Command.prototype.getHero = function () {
  return this.command.substr(1).split(' ')[0].toLowerCase()
}

Command.prototype.getOptionalArg = function () {
  return this.command.split(" ")[1]
}

Command.prototype.getOptionalArgs = function () {
  return extractOptionalArgsFrom(this.command)
}

Command.prototype.getHeroesInTeam = function () {
  var command = this.getCommand()
  var commandLine = command.split('\n')[0]
  return extractOptionalArgsFrom(commandLine)
}

module.exports = Command


function extractOptionalArgsFrom(command){
  return command.split(/\s/).filter(command => { return command[0] !== '/' && command.length > 0 })
}