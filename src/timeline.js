var Constants = require('./constants')
var _getMaxTimeFromDescriptor = require('haiku-bytecode/src/getTimelineMaxTime')
var Emitter = require('./emitter')

var NUMBER = 'number'

function Timeline (time, descriptor, name, options) {
  Emitter.create(this)
  this.name = name
  this.control = null
  this.global = time || 0
  this.local = 0
  this.active = true
  this.isPlaying = true
  this.max = _getMaxTimeFromDescriptor(descriptor)
  this.loop = !!(options && options.loop)
}

Timeline.DEFAULT_NAME = Constants.DEFAULT_TIMELINE_NAME

Timeline.prototype.performUpdate = function performUpdate (time) {
  var previous = this.global
  var delta = time - previous
  this.global = time

  if (this.isTimeControlled()) {
    this.local = this.control
  } else {
    // If we are a looping timeline, reset to zero once we've gone past our max
    if (this.loop && this.local > this.max) {
      this.local = 0 + this.max - this.local
    }
    this.local += delta
  }

  if (this.isFinished()) {
    this.isPlaying = false
  }

  this.emit('update')

  return this
}

Timeline.prototype.resetMax = function resetMax (descriptor) {
  this.max = _getMaxTimeFromDescriptor(descriptor)
  return this
}

Timeline.prototype.getDomainTime = function getDomainTime () {
  var dt
  if (this.local > this.max) {
    dt = this.max
  } else {
    dt = this.local
  }
  return dt
}

Timeline.prototype.isTimeControlled = function isTimeControlled () {
  return typeof this.control === NUMBER
}

Timeline.prototype.isFinished = function () {
  if (this.loop) return false
  return ~~this.local > this.max
}

Timeline.prototype.controlTime = function (time) {
  this.control = parseInt(time || 0, 10)
  return this
}

Timeline.prototype.start = function start (time, descriptor) {
  this.local = 0
  this.active = true
  this.isPlaying = true
  this.global = time || 0
  this.max = _getMaxTimeFromDescriptor(descriptor)
  return this
}

Timeline.prototype.stop = function stop (time, descriptor) {
  this.active = false
  this.isPlaying = false
  this.max = _getMaxTimeFromDescriptor(descriptor)
  return this
}

Timeline.prototype.isActive = function isActive () {
  return !!this.active
}

module.exports = Timeline
