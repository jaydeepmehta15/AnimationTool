/* eslint-disable */
// Generated by CoffeeScript 1.7.1

let getNanoSeconds, hrtime, loadTime

let invoke

if (
  typeof performance !== "undefined" &&
  performance !== null &&
  performance.now
) {
  invoke = function() {
    return performance.now()
  }
} else if (
  typeof process !== "undefined" &&
  process !== null &&
  process.hrtime
) {
  invoke = function() {
    return (getNanoSeconds() - loadTime) / 1e6
  }
  hrtime = process.hrtime
  getNanoSeconds = function() {
    let hr
    hr = hrtime()
    return hr[0] * 1e9 + hr[1]
  }
  loadTime = getNanoSeconds()
} else if (Date.now) {
  invoke = function() {
    return Date.now() - loadTime
  }
  loadTime = Date.now()
} else {
  invoke = function() {
    return new Date().getTime() - loadTime
  }
  loadTime = new Date().getTime()
}

export default function now () {
  return invoke()
}
