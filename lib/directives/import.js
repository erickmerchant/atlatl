const assert = require('assert')

function plugin (config) {
  assert.ok(config.context.args.length > 1 && config.context.args.length < 4, 'Two or three args allowed')
  assert.ok(typeof config.context.parened === 'undefined', 'Parened is not allowed')

  if (config.context.args.length === 2) {
    config.context.args[2] = config.context.args[0]
  }

  config.template.imports.set(config.context.args[0], {
    file: config.context.args[1],
    method: config.context.args[2]
  })

  config.template.dependencies.push(config.load(config.context.args[1]))

  return ''
}

module.exports = plugin
