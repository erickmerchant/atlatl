module.exports = function (context) {
  if (['if', 'each'].indexOf(context.parent) < 0) {
    return ''
  }

  return '} else {'
}
