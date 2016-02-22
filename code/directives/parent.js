const assert = require('assert')

function plugin (context) {
  assert.ok(context.args.length < 2, 'Zero or one args allowed')

  var method = ''
  var parened = 'content'

  if (context.parened) {
    parened += ', ' + context.parened
  }

  if (context.args.length) {
    method = '.' + context.args[0]
  }

  return '${safe(super' + method + '(' + parened + '))}'
}

module.exports = plugin
