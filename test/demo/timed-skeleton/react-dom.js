var React = require('react'); // Installed as dependency of '@haiku/player'
var ReactDOM = require('react-dom'); // Installed as a dependency of '@haiku/player'
var TimedSkeletonComponent = require('./react.js');
if (TimedSkeletonComponent.default)
  TimedSkeletonComponent = TimedSkeletonComponent.default;
module.exports = function _react_dom_wrapper(element, props) {
  ReactDOM.render(React.createElement(TimedSkeletonComponent, props), element);
};
