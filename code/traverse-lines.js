'use strict'

const parse = require('./parse-arguments.js')

module.exports = function (load, directives) {
  return function traverse (template, lines, parent) {
    var code = []

    while (lines.length) {
      if (lines[0].trim().startsWith('@')) {
        let line = lines.shift()
        let trimmed = line.trim()
        let context = parse(trimmed.substr(1))
        let nested = []
        let level
        let compiled

        if (directives[context.directive]) {
          if (directives[context.directive].isBlock) {
            level = 1
            while (level) {
              let line = lines.shift() || ''
              let trimmed = line.trim()

              if (trimmed === '@') {
                level -= 1
                if (level) {
                  nested.push(line)
                }
              } else {
                if (trimmed.startsWith('@')) {
                  let sub = parse(trimmed.substr(1)).directive

                  if (directives[sub] && directives[sub].isBlock) {
                    level += 1
                  }
                }

                nested.push(line)
              }
            }
          }

          compiled = traverse(template, nested, context).join('\n')

          if (context.args.length < directives[context.directive].minArgs) {
            throw new Error('Too few arguments given for @' + context.directive)
          }

          if (context.args.length > directives[context.directive].maxArgs) {
            throw new Error('Too many arguments given for @' + context.directive)
          }

          if (context.parened !== false && !directives[context.directive].hasParened) {
            throw new Error('Parened argument not allowed for @' + context.directive)
          }

          if (context.parened === false && directives[context.directive].requiresParened) {
            throw new Error('Parened argument missing for @' + context.directive)
          }

          context.parent = parent

          code.push(directives[context.directive](context, template, function () { return compiled }, load))
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

        code.push('output.push(escape`' + literal.join('\n').replace('`', '\\`') + '`)')
      }
    }

    return code
  }
}
