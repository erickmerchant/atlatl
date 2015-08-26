function plugin (context, args, compiled, load) {
  if (!context.partials[args[0]]) {
    context.partials[args[0]] = `function ${ args[0] }(${ args.slice(1).join(', ') }) {
      var output = []
      ${ compiled }
      return safe(output.join('\\n'))
    }`
  }
}

plugin.block = true

module.exports = plugin
