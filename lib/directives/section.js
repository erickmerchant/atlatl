const assert = require('assert')

function plugin (config) {
  assert.ok(config.context.args.length === 1, 'Exactly one arg required')
  assert.ok(typeof config.context.parened === 'undefined', 'Parened not allowed')

  var method = config.context.args[0]

  config.template.methods.set(method, method + '(' + config.variable + ') { return ' + config.nested() + ' }')

  return '${safe(this.' + method + '(' + config.variable + '))}'
}

module.exports = plugin
