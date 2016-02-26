const assert = require('assert')

function plugin (context, template, nested, load) {
  assert.ok(context.args.length === 1, 'Exactly one arg required')
  assert.ok(typeof context.parened === 'undefined', 'Parened not allowed')

  template.extending = context.args[0]

  template.dependencies.push(load(context.args[0]))

  return ''
}

module.exports = plugin
