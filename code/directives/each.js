const assert = require('assert')

function plugin (config) {
  assert.ok(config.context.args.length === 1, 'Exactly one arg required')
  assert.ok(config.context.parened, 'Parened is required')

  var collection = config.context.args[0]
  var parened = config.context.parened

  return '${safe((Array.isArray(' + collection + ') && ' + collection + '.length) ? ' + collection + '.map(function(' + parened + ') { return ' + config.nested() + ' }, this) : "")}'
}

module.exports = plugin
