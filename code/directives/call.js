module.exports = function (context) {
  var parameters = 'content'

  if (context.args.length > 1) {
    parameters += ', ' + context.args.slice(1).join(', ')
  }

  return 'output = output.concat(this.' + context.args[0] + '(' + parameters + '))'
}
