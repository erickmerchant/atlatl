function plugin (context, shared) {
  shared.methods.set(context.args[0], `${ context.args[0] }(content) {
    var output = []
    ${ context.compiled }
    return output
  }`)

  return 'output = output.concat(this.' + context.args[0] + '(content))'
}

plugin.isBlock = true

module.exports = plugin
