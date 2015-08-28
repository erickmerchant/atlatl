function plugin (context, args, compiled, load) {
  context.methods.set(args[0], `${ args[0] }(${ args.slice(1).join(', ') }) {
    var output = []
    ${ compiled }
    return safe(output.join('\\n'))
  }`)
}

plugin.isBlock = true

module.exports = plugin
