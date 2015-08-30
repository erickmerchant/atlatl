module.exports = function (context) {
  var parameters = 'content'

  if (context.parentArgs.length > 1) {
    parameters += ', ' + context.parentArgs.slice(1).join(', ')
  }

  return 'output = output.concat(super(' + parameters + '))'
}
