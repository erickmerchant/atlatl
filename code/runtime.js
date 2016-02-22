var map = new Map()
var escape = require('escape-html')

function template (strings) {
  var result = ''
  var vals = new Array(arguments.length)
  var i, j

  for (i = 1, j = 0; i < vals.length; ++i, ++j) {
    vals[j] = arguments[i]
  }

  vals = values(vals)

  strings.forEach(function (val, key) {
    result += val

    if (vals[key]) {
      result += vals[key]
    }
  })

  return result
}

function safe (val) {
  var result = Symbol()

  map.set(result, val)

  return result
}

function values (vals) {
  return vals.map(function (val) {
    if (typeof val === 'symbol' && map.has(val)) {
      val = map.get(val)

      if (Array.isArray(val)) {
          val = val.join('\n')
      }

      return val
    }

    return escape(val)
  })
}

template.safe = safe

template.values = values

module.exports = template
