function plugin (context, template, nested, load) {
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

plugin.minArgs = 2

plugin.maxArgs = 3

plugin.hasParened = false

plugin.requiresParened = false

module.exports = plugin
