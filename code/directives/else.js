module.exports = function (context, args, compiled, load, parent) {
  if (['if', 'each'].indexOf(parent) < 0) {
    return ''
  }

  return '} else {'
}
