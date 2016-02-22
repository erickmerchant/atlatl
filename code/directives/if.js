const assert = require('assert')

function plugin (context, template, nested) {
  assert.ok(context.args.length === 0, 'Exactly zero args allowed')
  assert.ok(context.parened, 'Parened is required')

  var parened = context.parened

  return 'if (' + parened + ') {\n  ' +
  nested() + '\n  ' +
  '}'
}

module.exports = plugin
