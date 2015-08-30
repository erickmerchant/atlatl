function plugin (context) {
  return `if(${ context.args.join(' ') }) {
  ${ context.compiled }
  }`
}

plugin.isBlock = true

module.exports = plugin
