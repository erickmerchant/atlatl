function plugin (context, args, compiled, load) {
  context.sections.push(`${ args[0] }(content) {
    var output = []
    ${ compiled }
    return output
  }`)

  return 'output = output.concat(this.' + args[0] + '(content))'
}

plugin.block = true

module.exports = plugin
