'use strict'

const parse = require('./parse-arguments.js')

module.exports = function (lines, load, directives) {
  lines = lines.split('\n')

  return function traverse (template, parent) {
    var code = []

    while (lines.length) {
      if (lines[0].trim() === '@') {
        lines.shift()

        break
      } else if (lines[0].trim().startsWith('@')) {
        let line = lines.shift()
        let trimmed = line.trim()
        let context = parse(trimmed.substr(1))

        if (directives[context.directive]) {
          context.parent = parent

          code.push(directives[context.directive](context, template, function () {
            return traverse(template, context)
          }, load))
        } else {
          throw new Error('Directive ' + context.directive + ' not found')
        }
      } else {
        let literal = []

        do {
          let line = lines.shift()

          if (line.trim().substring(0, 2) === '\\@') {
            let index = line.indexOf('\\')

            line = line.substring(0, index) + line.substring(index + 1)
          }

          literal.push(line)
        } while (lines.length && !lines[0].trim().startsWith('@'))

        code.push('output.push(template`' + literal.join('\n').replace('`', '\\`') + '`)')
      }
    }

    return code.join('\n')
  }
}
