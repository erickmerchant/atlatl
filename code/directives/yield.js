const assert = require('assert')

function plugin (context, template, nested) {
  assert.ok(context.args.length === 1, 'Exactly one arg required')
  assert.ok(typeof context.parened === 'undefined', 'Parened not allowed')

  var method = context.args[0]

  template.methods.set(method, method + '() { return "" }')

  return '${safe(this.' + method + '(content))}'
}

module.exports = plugin
