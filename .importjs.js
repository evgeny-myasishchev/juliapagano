module.exports = {
  environments : [
    'node'
  ],
  declarationKeyword : 'const',
  importDevDependencies : true,
  maxLineLength : 150,
  aliases : {
    Promise : 'bluebird',
    request : 'superagent',
    _ : 'lodash',
    'jwt' : 'jsonwebtoken'
  }
}
