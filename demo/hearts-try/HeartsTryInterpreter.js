var creation = require('./../../src/creation/dom')
module.exports = creation(require('./HeartsTryBytecode'), {
  autoplay: false,
  onHaikuComponentDidMount: function (instance) {
    instance.events.listen('#heartstry2-main', 'onmouseover', function (event) {
      instance.play()
    })
  }
})
