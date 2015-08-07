'use strict'

module.exports = function (loader) {
  return function (name, extensions, callback) {
    makeFunction(name, extensions, function (err, code) {
      if (err) {
        callback(err)
      } else {
        code = `'use strict'
          const escapeHTML = require('atlatl/code/escape.js')
          const safeVals = new Map()
          module.exports = ` + code

        callback(null, code)
      }
    })
  }

  function makeFunction (name, extensions, callback) {
    extensions.sections = extensions.sections || []

    loader(name, function (err, template) {
      var lines = template.split(/\s*(@.*)\n/g)
      var precode = [`function (content) {
          var output = []
      `]
      var code = []
      var inherits = false
      var embeds = []
      var sections = []
      var partials = extensions.partials || []
      var vars = extensions.vars || []
      var ends = []

      if (err) {
        callback(err)
      } else {
        code = code.concat(compile(lines))

        Promise.all(embeds).then(function (embeds) {
          extensions.sections.push(sections)

          if (!inherits) {
            let sectionsLength = extensions.sections.length

            code.unshift('var sections = new Sections()')

            extensions.sections.forEach(function (sections, k) {
              var sectionCode = []

              sectionCode.push('class Sections' + (k ? k : '') + (k + 1 !== sectionsLength ? ' extends Sections' + (k + 1 ? k + 1 : '') : '') + ' {')

              sectionCode = sectionCode.concat(sections)

              sectionCode.push('}')

              code = [].concat(sectionCode, code)
            })

            if (embeds.length) {
              embeds.forEach(function (embed) {
                code.unshift(embed)
              })

              code.unshift('var embeds = {}')
            }

            if (vars.length) {
              code.unshift('var ' + vars.join(', '))
            }

            code.unshift(precode)

            code.push(`function safe(val) {
              var result = Symbol()

              safeVals.set(result, val)

              return result
            }

            function escape (strings) {
              var values = [].slice.call(arguments, 1)
              var result = ''

              strings.forEach(function (val, key) {
                result += val

                if (values[key]) {
                  if (typeof values[key] == 'symbol' && safeVals.has(values[key])) {
                    result += safeVals.get(values[key])
                  } else {
                    result += escapeHTML(values[key])
                  }
                }
              })

              return result
            }`)

            code = code.concat(Object.keys(partials).map(function (k) {
              return partials[k]
            }))

            code.push("return output.join('\\n')")

            code.push('}')

            callback(null, code.join('\n'))
          } else {
            makeFunction(inherits, {
              name: name,
              sections: extensions.sections,
              partials: partials,
              vars: vars
            }, callback)
          }
        }).catch(callback)
      }

      function compile (lines) {
        var code = []

        while (lines.length) {
          let line = lines.shift()
          let trimmed = line.trim()
          let parts = trimmed.substr(1).split(/\s+/)
          let directive = parts[0]
          let args = parts.slice(1)
          let arg0 = args[0]
          let func = []
          let level

          if (trimmed.startsWith('@')) {
            if (trimmed === '@') {
              code.push(ends.shift())
            } else {
              if (['section', 'partial'].indexOf(directive) > -1) {
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
                    if (trimmed.startsWith('@') && ['if', 'each', 'section', 'partial'].indexOf(trimmed.substr(1).split(/\s+/)[0]) > -1) {
                      level += 1
                    }

                    func.push(line)
                  }
                }
              }

              switch (directive) {
                case 'extends':
                  inherits = arg0
                  break

                case 'embed':
                  code.push('output.push(embeds["' + arg0 + '"]())')
                  embeds.push(new Promise(function (resolve, reject) {
                    makeFunction(arg0, {}, function (err, result) {
                      if (err) {
                        reject(err)
                      } else {
                        result = 'embeds["' + arg0 + '"] = ' + result

                        resolve(result)
                      }
                    }, true)
                  }))
                  break

                case 'set':
                  code.push(arg0 + ' = ' + args.slice(1).join(' '))
                  vars.push(arg0)
                  break

                case 'yield':
                  code.push('output = output.concat(sections.' + arg0 + '())')
                  break

                case 'parent':
                  code.push('output = output.concat(super())')
                  break

                case 'section':
                  code.push('output = output.concat(sections.' + arg0 + '())')
                  sections.push(`${ arg0 }() {
                    var output = []
                    ${ compile(func).join('\n') }
                    return output
                  }`)
                  break

                case 'partial':
                  if (!partials[arg0]) {
                    partials[arg0] = `function ${ arg0 }(${ args.slice(1).join(', ') }) {
                      var output = []
                      ${ compile(func).join('\n') }
                      return safe(output.join('\\n'))
                    }`
                  }
                  break

                case 'each':
                  code.push('if (Array.isArray(' + arg0 + ')) { output = output.concat(' + arg0 + '.map(function(' + args.slice(1).join(', ') + ') { var output = [] ')
                  ends.unshift("return output.join('\\n') })) }")
                  break

                case 'if':
                  code.push('if(' + args.join(' ') + ') {')
                  ends.unshift('}')
                  break

                case 'elseif':
                  if (ends.length) {
                    code.push(ends.shift())
                  } else {
                    code.push('if (false) {')
                  }
                  code.push('else if(' + args.join(' ') + ') {')
                  ends.unshift('}')
                  break

                case 'else':
                  if (ends.length) {
                    code.push(ends.shift())
                  } else {
                    code.push('if (false) {')
                  }
                  code.push('else {')
                  ends.unshift('}')
                  break
              }
            }
          } else if (line.trim().length) {
            code.push('output.push(escape`' + line.replace('`', '\\`') + '`)')
          }
        }

        return code
      }
    })
  }
}
