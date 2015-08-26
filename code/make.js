'use strict'

const path = require('path')
const corePath = path.join(__dirname, 'core.js')

module.exports = function (lines, load, plugins, callback) {
  lines = lines.split('\n')

  var renderCode = []
  var context = {
    extending: '',
    dependencies: [],
    vars: [],
    sections: [],
    imports: [],
    partials: []
  }

  renderCode = compile(lines)

  Promise.all(context.dependencies).then(function () {

    if (!context.extending) {
      context.sections.push(`render(content) {
        var output = []

        ${ renderCode.join('\n') }

        return output.join('\\n')
      }`)
    }

    var code = []

    code.push('"use strict"')

    code.push('var escape = require("' + corePath + '").escape')
    code.push('var safe = require("' + corePath + '").safe')

    Object.keys(context.imports).forEach(function (k) {
      code.push('var ' + k + ' = require("./' + context.imports[k] + '.js").context.partials.' + k)
    })

    if (context.vars.length) {
      code.push('var ' + context.vars.join(', '))
    }

    if (context.extending) {
      code.push('var ParentSections = require("./' + context.extending + '.js").Sections')
    }

    code.push('class Sections' + (context.extending && ' extends ParentSections') + ' {')

    code = code.concat(context.sections)
    code.push('}')

    code = code.concat(Object.keys(context.partials).map(function (k) {
      return context.partials[k]
    }))

    code.push('function template(content) { return (new Sections()).render(content) }')

    code.push('template.Sections = Sections')

    code.push('template.partials = {}')

    Object.keys(context.partials).forEach(function (k) {
      code.push('template.partials.' + k + ' = ' + k)
    })

    code.push('module.exports = template')

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

        if (plugins[directive]) {
          if (plugins[directive].block) {
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

                  if (plugins[sub] && plugins[sub].block) {
                    level += 1
                  }
                }

                func.push(line)
              }
            }
          }

          code.push(plugins[directive](context, args, compile(func).join('\n'), load, parent))

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
