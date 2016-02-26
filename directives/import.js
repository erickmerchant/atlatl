const assert = require('assert')

function plugin (context, template, nested, load) {
  assert.ok(context.args.length > 1 && context.args.length < 4, 'Two or three args allowed')
  assert.ok(typeof context.parened === 'undefined', 'Parened is not allowed')

  if (context.args.length === 2) {
    context.args[2] = context.args[0]
  }

  template.imports.set(context.args[0], {
    file: context.args[1],
    method: context.args[2]
  })

  template.dependencies.push(load(context.args[1]))

  return ''
}

module.exports = plugin
