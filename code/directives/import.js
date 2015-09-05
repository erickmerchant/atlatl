function plugin (context, shared, load) {
  if (context.args.length === 2) {
    context.args[2] = context.args[0]
  }

  shared.imports.set(context.args[0], {
    file: context.args[1],
    method: context.args[2]
  })

  shared.dependencies.push(load(context.args[1]))

  return ''
}

plugin.minArgs = 2

plugin.maxArgs = 3

plugin.hasParened = false

plugin.requiresParened = false

module.exports = plugin
