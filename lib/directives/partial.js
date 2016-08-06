const assert = require('assert')

function plugin (config) {
  assert.ok(config.context.args.length === 1, 'Exactly one arg required')

  var parened = config.variable
  var method = config.context.args[0]

  if (config.context.parened) {
    parened += ', ' + config.context.parened
  }

  config.template.methods.set(method, method + '(' + parened + ') { return ' + config.nested() + ' }')

  return ''
}

module.exports = plugin
