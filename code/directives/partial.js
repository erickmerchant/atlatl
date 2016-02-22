const assert = require('assert')

function plugin (context, template, nested) {
  assert.ok(context.args.length === 1, 'Exactly one arg required')

  var parened = 'content'
  var method = context.args[0]

  if (context.parened) {
    parened += ', ' + context.parened
  }

  template.methods.set(method, method + '(' + parened + ') { return ' + nested() + ' }')

  return ''
}

module.exports = plugin
