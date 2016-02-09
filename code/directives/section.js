function plugin (context, template, nested) {
  var method = context.args[0]

  template.methods.set(method, `${method}(content) {
    var output = []
    ${nested()}
    return output
  }`)

  return 'output = output.concat(this.' + method + '(content))'
}

plugin.minArgs = 1

plugin.maxArgs = 1

plugin.hasParened = false

plugin.requiresParened = false

module.exports = plugin
