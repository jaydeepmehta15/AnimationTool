var lodash = require('lodash')
var cp = require('child_process')
var argv = require('yargs').argv
var log = require('./helpers/log')
var allPackages = require('./helpers/allPackages')()

var DEP_TYPES = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies'
]

lodash.forEach(allPackages, function (pack) {
  // If one specific package has been mentioned, only upgrade it
  if (argv.package && argv.package !== pack.name) {
    return void (0)
  }

  var deps = []

  DEP_TYPES.forEach((type) => {
    if (pack.pkg && pack.pkg[type]) {
      lodash.forEach(pack.pkg[type], (val, key) => {
        var haiku = key.slice(0, 6)
        if (haiku === 'haiku-' || haiku === '@haiku') {
          deps.push(key)
        }
      })
    }
  })

  if (deps.length > 0) {
    log.log('yarn upgrade for ' + pack.name + ':')
    var cmd = `yarn upgrade ${deps.join(' ')} --latest --ignore-engines --non-interactive --mutex file:/tmp/.yarn-mutex --network-concurrency 1`
    log.log(cmd)
    cp.execSync(cmd, { cwd: pack.abspath, stdio: 'inherit' })
  }  
})
