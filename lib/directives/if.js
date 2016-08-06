const assert = require('assert')

function plugin (config) {
  assert.ok(config.context.args.length === 0, 'Exactly zero args allowed')
  assert.ok(config.context.parened, 'Parened is required')

  var parened = config.context.parened

  return '${safe((' + parened + ') ? ' + config.nested() + ' : "")}'
}

module.exports = plugin
