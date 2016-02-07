function plugin (context, shared) {
  var method = context.args[0]

  shared.methods.set(method, `${method}(content) {
    var output = []
    ${context.compiled}
    return output
  }`)

  return 'output = output.concat(this.' + method + '(content))'
}

plugin.minArgs = 1

plugin.maxArgs = 1

plugin.hasParened = false

plugin.requiresParened = false

plugin.isBlock = true

module.exports = plugin
