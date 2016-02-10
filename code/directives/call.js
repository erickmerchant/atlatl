const assert = require('assert')

function plugin (context) {
  assert.ok(context.args.length === 1, 'Exactly one arg required')

  var parened = 'content'
  var method = context.args[0]

  if (context.parened) {
    parened += ', ' + context.parened
  }

  return 'output = output.concat(this.' + method + '(' + parened + '))'
}

module.exports = plugin
