'use strict'

const assign = require('lodash.assign')
const parse = require('./parse-arguments')

module.exports = function (lines, settings) {
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
        var config = assign({}, settings)

        config.context = context
        config.template = template
        config.nested = function () {
          return 'template`' + traverse(template, context) + '`'
        }

        if (settings.directives[context.directive]) {
          config.context.parent = parent

          code.push(settings.directives[context.directive](config))
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

        code.push(literal.join('\n').replace('`', '\\`'))
      }
    }

    return code.join('\n')
  }
}
