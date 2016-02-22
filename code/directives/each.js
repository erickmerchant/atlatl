const assert = require('assert')

function plugin (context, template, nested) {
  assert.ok(context.args.length === 1, 'Exactly one arg required')
  assert.ok(context.parened, 'Parened is required')

  var collection = context.args[0]
  var parened = context.parened

  return '${safe((Array.isArray(' + collection + ') && ' + collection + '.length) ? ' + collection + '.map(function(' + parened + ') { return ' + nested() + ' }, this) : "")}'
}

module.exports = plugin
