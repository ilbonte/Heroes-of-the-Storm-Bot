function Command(rawText) {
  this.rawText = rawText
  this.command = rawText.replace(/\s+/g,' ').replace('@hots_helper_bot', '').trim()
}

Command.prototype.getCommand = function () {
  return this.command
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

module.exports = Command
