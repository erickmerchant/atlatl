const assert = require('assert')

function plugin (config) {
  assert.ok(config.context.args.length === 1, 'Exactly one arg required')
  assert.ok(typeof config.context.parened === 'undefined', 'Parened not allowed')

  config.template.extending = config.context.args[0]

  config.template.dependencies.push(config.load(config.context.args[0]))

  return ''
}

module.exports = plugin
