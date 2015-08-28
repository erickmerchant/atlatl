'use strict'

const path = require('path')
const corePath = path.join(__dirname, 'core.js')

module.exports = function (lines, load, directives, callback) {
  lines = lines.split('\n')

  var renderCode = []
  var context = {
    dependencies: [],
    extending: '',
    imports: {},
    methods: new Map()
  }

  renderCode = compile(lines)

  Promise.all(context.dependencies).then(function () {

    if (!context.extending) {
      context.methods.set('render', `render (content) {
        var output = []

        ${ renderCode.join('\n') }

        return output.join('\\n')
      }`)
    }

    var code = []

    code.push('"use strict"')

    code.push('var escape = require("' + corePath + '").escape')
    code.push('var safe = require("' + corePath + '").safe')

    if (context.extending) {
      code.push('var ParentTemplate = require("./' + context.extending + '.js")')
    }

    code.push('class Template' + (context.extending && ' extends ParentTemplate') + ' {')

    var methods = context.methods.values()
    var method

    do {
      method = methods.next()

      if (!method.done) {
        code.push(method.value)
      }
    } while (!method.done)

    code.push('}')

    Object.keys(context.imports).forEach(function (method) {
      code.push('Template.prototype.' + method + ' = require("./' + context.imports[method] + '.js").prototype.' + method)
    })

    code.push('module.exports = Template')

    callback(null, code)

  }).catch(callback)

  function compile (lines, parent) {
    var code = []

    while (lines.length) {
      if (lines[0].trim().startsWith('@')) {
        let line = lines.shift()
        let trimmed = line.trim()
        let parts = trimmed.substr(1).split(/\s+/)
        let directive = parts[0]
        let args = parts.slice(1)
        let func = []
        let level

        if (directives[directive]) {
          if (directives[directive].isBlock) {
            level = 1
            while (level) {
              let line = lines.shift() || ''
              let trimmed = line.trim()

              if (trimmed === '@') {
                level -= 1
                if (level) {
                  func.push(line)
                }
              } else {
                if (trimmed.startsWith('@')) {
                  let sub = trimmed.substr(1).split(/\s+/)[0]

                  if (directives[sub] && directives[sub].isBlock) {
                    level += 1
                  }
                }

                func.push(line)
              }
            }
          }

          code.push(directives[directive](context, args, compile(func).join('\n'), load, parent))

        } else {
          throw new Error('Directive ' + directive + ' not found')
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
