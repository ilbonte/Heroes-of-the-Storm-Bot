const heroes = require('../heroes.json')

function Keyboard(msgId) {
  this.msgId = msgId
}

Keyboard.prototype.generateBuildsKeyboard = function () {
  return this.generateKeyboard("Choose hero",heroes.map(hero => ['/' + hero.name, '/' + hero.name + ' info']))
}

Keyboard.prototype.generateCountersKeyboard = function () {
  return this.generateKeyboard("Choose hero",heroes.map(hero => ['/' + hero.name + ' counters']), this.msgId)
}

Keyboard.prototype.generateHeroList = function (text,counters) {
  return this.generateKeyboard(text,heroes.filter(hero => counters.indexOf(hero.name) < 0).map(hero => ['/ct ' + counters.toString().replace(/,/g, " ") + " " + hero.name]))
}

Keyboard.prototype.generateKeyboard = function (text,keyboard) {
  return {
    text: text,
    reply_to_message_id: this.msgId,
    reply_markup: JSON.stringify({
      keyboard: keyboard,
      force_reply: true,
      selective: true
    })
  }
}

module.exports = Keyboard