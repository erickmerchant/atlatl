function plugin (context, shared) {
  var method = context.args[0]

  shared.methods.set(method, `${method}() {
    return []
  }`)

  return 'output = output.concat(this.' + method + '(content))'
}

plugin.minArgs = 1

plugin.maxArgs = 1

plugin.hasParened = false

plugin.requiresParened = false

module.exports = plugin
