function plugin (context, template, load) {
  template.extending = context.args[0]

  template.dependencies.push(load(context.args[0]))

  return ''
}

plugin.minArgs = 1

plugin.maxArgs = 1

plugin.hasParened = false

plugin.requiresParened = false

module.exports = plugin
