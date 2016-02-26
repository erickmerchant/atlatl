;['call', 'each', 'extends', 'if', 'import', 'parent', 'partial', 'section', 'yield'].forEach(function (directive) {
  exports[directive] = require('./directives/' + directive + '.js')
})
