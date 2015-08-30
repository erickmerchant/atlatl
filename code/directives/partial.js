function plugin (context, shared) {
  var parameters = 'content'

  if (context.args.length > 1) {
    parameters += ', ' + context.args.slice(1).join(', ')
  }

  shared.methods.set(context.args[0], `${ context.args[0] }(${ parameters }) {
    var output = []
    ${ context.compiled }
    return output
  }`)
}

plugin.isBlock = true

module.exports = plugin
