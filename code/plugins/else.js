module.exports = function (context, args, compiled, load, parent) {
  if (['if', 'each'].indexOf(parent) > -1) {
    return ''
  }

  return '} else {'
}
