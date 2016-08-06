const assert = require('assert')

function plugin (config) {
  assert.ok(config.context.args.length < 2, 'Zero or one args allowed')

  var method = ''
  var parened = config.variable

  if (config.context.parened) {
    parened += ', ' + config.context.parened
  }

  if (config.context.args.length) {
    method = '.' + config.context.args[0]
  }

  return '${safe(super' + method + '(' + parened + '))}'
}

module.exports = plugin
