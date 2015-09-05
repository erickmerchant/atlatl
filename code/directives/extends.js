function plugin (context, shared, load) {
  shared.extending = context.args[0]

  shared.dependencies.push(load(context.args[0]))

  return ''
}

plugin.minArgs = 1

plugin.maxArgs = 1

plugin.hasParened = false

plugin.requiresParened = false

module.exports = plugin
