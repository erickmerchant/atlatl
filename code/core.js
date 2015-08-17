var safeVals = new Map()
var escapeHtml = require('escape-html')

module.exports = {
  safe (val) {
    var result = Symbol()

    safeVals.set(result, val)

    return result
  },
  escape (strings) {
    var values = [].slice.call(arguments, 1)
    var result = ''

    strings.forEach(function (val, key) {
      result += val

      if (values[key]) {
        if (typeof values[key] === 'symbol' && safeVals.has(values[key])) {
          result += safeVals.get(values[key])
        } else {
          result += escapeHtml(values[key])
        }
      }
    })

    return result
  }
}
