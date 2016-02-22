const assert = require('assert')

function plugin (context, template, nested) {
  assert.ok(context.args.length === 1, 'Exactly one arg required')
  assert.ok(context.parened, 'Parened is required')

  var collection = context.args[0]
  var parened = context.parened

  return 'if (Array.isArray(' + collection + ') && ' + collection + '.length) { output = output.concat(' + collection + '.map(function(' + parened + ') { var output = []\n  ' +
  nested() + '\n  ' +
  'return output.join(\'\\n\') }, this)) }'
}

module.exports = plugin
