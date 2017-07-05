var async = require('async')
var lodash = require('lodash')
var cp = require('child_process')
var fse = require('fs-extra')
var path = require('path')
var argv = require('yargs').argv
var log = require('./helpers/log')
var allPackages = require('./helpers/allPackages')()
var groups = lodash.keyBy(allPackages, 'name')

var plumbingPackage = groups['haiku-plumbing']

var blankProject = path.join(plumbingPackage.abspath, 'test/fixtures/projects/blank-project/')

// By default every time we run this file we'll clean the 'blank' project to actually make it blank.
if (!argv.noClean) {
  fse.removeSync(blankProject)
  fse.mkdirpSync(blankProject)
  fse.outputFileSync(path.join(blankProject, '.keep'), '')
}

process.env.NODE_ENV = 'development'

var instructionSets = {
  default: [
    ['haiku-plumbing', ['npm', 'run', 'watch'], null, 20000],
    ['haiku-plumbing', ['node', './HaikuHelper.js'], { HAIKU_SKIP_AUTOUPDATE: 1 }, 5000]
  ],

  blank: [
    ['haiku-plumbing', ['npm', 'run', 'watch'], null, 20000],
    ['haiku-plumbing', ['node', './HaikuHelper.js', '--folder=' + blankProject], { HAIKU_SKIP_AUTOUPDATE: 1 }, 5000]
  ],

  zack: [
    ['haiku-plumbing', ['npm', 'run', 'watch'], null, 10000],
    ['haiku-plumbing', ['npm', 'run', 'zack'], null, 5000],
    // ['haiku-timeline', ['npm', 'run', 'zack']], // You can run this piecemeal *instead of creator*
    // ['haiku-glass', ['npm', 'run', 'zack']], // You can run this piecemeal *instead of creator*
    ['haiku-creator', ['npm', 'run', 'zack']],
    ['haiku-cli', ['npm', 'run', 'develop']],
    ['haiku-sdk-client', ['npm', 'run', 'develop']],
    ['haiku-sdk-inkstone', ['npm', 'run', 'develop']]
  ]
}

if (!argv.mode) argv.mode = 'default'

log.log('starting in ' + argv.mode + ' mode')

var instructions = instructionSets[argv.mode]

log.log(JSON.stringify(instructions))

if (!instructions) {
  throw new Error('No instructions found for mode ' + argv.mode)
}

var cancelled = false
var children = []

async.eachSeries(instructions, function (instruction, next) {
  if (cancelled) return next()

  var pack = groups[instruction[0]]
  var exec = instruction[1]
  var env = instruction[2] || {}
  var wait = instruction[3] || 5000
  var ignoreClose = instruction[4]

  var cmd = exec[0]

  var args = exec.slice(1)

  log.log('running ' + cmd + ' ' + JSON.stringify(args) + ' in ' + pack.abspath)
  var child = cp.spawn(cmd, args, { cwd: pack.abspath, env: lodash.assign(process.env, env), stdio: 'inherit' })
  children.push(child)
  child.on('close', function (code) {
    if (!ignoreClose) {
      cancelled = true
      log.log(cmd + ' closed, exiting all!')
      children.forEach((child) => {
        child.kill()
      })
      process.exit(0)
    } else {
      log.log(cmd + ' closed')
    }
  })

  return setTimeout(next, wait)
})

process.on('exit', exit)
process.on('SIGINT', exit)
process.on('uncaughtException', exit)

function exit () {
  log.log('exiting; telling children to interrupt')
  children.forEach(function (child) {
    child.kill('SIGINT')
  })
}
