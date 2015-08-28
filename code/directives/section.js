function plugin (context, args, compiled, load) {
  context.methods.set(args[0], `${ args[0] }(content) {
    var output = []
    ${ compiled }
    return output
  }`)

  return 'output = output.concat(this.' + args[0] + '(content))'
}

plugin.isBlock = true

module.exports = plugin
