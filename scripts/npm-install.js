var _ = require('lodash')
var cp = require('child_process')
var log = require('./helpers/log')
var allPackages = require('./helpers/allPackages')()

_.forEach(allPackages, function (pack) {
  log.log('npm install for ' + pack.name)
  cp.exec('npm install', { cwd: pack.abspath }, function (err, out) {
    if (err) {
      log.err(err)
    }
    log.log(out)

    // special snowflake...
    if (pack.name === 'haiku-plumbing') {
      log.log('updating git submodules for ' + pack.name)
      return cp.exec('git submodule update --init --recursive', { cwd: pack.abspath }, function (err, out) {
        if (err) {
          log.err(err)
        }
        log.log(out)
        log.log('compiling javascript for ' + pack.name)
        return cp.exec('npm run compile', { cwd: pack.abspath }, function (err, out) {
          if (err) {
            log.err(err)
          }
          log.log(out)
        })
      })
    }
  })
})
