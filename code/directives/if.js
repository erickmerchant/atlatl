const assert = require('assert')

function plugin (context, template, nested) {
  assert.ok(context.args.length === 0, 'Exactly zero args allowed')
  assert.ok(context.parened, 'Parened is required')

  var parened = context.parened

  return '${safe((' + parened + ') ? ' + nested() + ' : "")}'
}

module.exports = plugin
