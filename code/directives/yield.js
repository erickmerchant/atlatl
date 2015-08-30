module.exports = function (context, shared) {
  shared.methods.set(context.args[0], `${ context.args[0] }() {
    return []
  }`)

  return 'output = output.concat(this.' + context.args[0] + '(content))'
}
