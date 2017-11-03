'use strict';

var _jsxFileName = 'src/index.js';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _Websocket = require('haiku-serialization/src/ws/Websocket');

var _Websocket2 = _interopRequireDefault(_Websocket);

var _Timeline = require('./components/Timeline');

var _Timeline2 = _interopRequireDefault(_Timeline);

var _carbonite = require('haiku-serialization/src/utils/carbonite');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (process.env.HAIKU_RELEASE_ENVIRONMENT === 'production' || process.env.HAIKU_RELEASE_ENVIRONMENT === 'staging') {
  window.Raven.config('https://d045653ab5d44c808480fa6c3fa8e87c@sentry.io/226387', {
    environment: process.env.HAIKU_RELEASE_ENVIRONMENT || 'development',
    release: process.env.HAIKU_RELEASE_VERSION,
    dataCallback: _carbonite.sentryCallback
  }).install();
  window.Raven.context(function () {
    go();
  });
} else {
  go();
}

function _traceKitFormatErrorStack(error) {
  if (!error) return null;
  if (typeof error.stack !== 'string') return null;
  error.stack = error.stack.split('\n').map(function (line) {
    return line.split(/ at\s+\//).join(' at (/');
  }).join('\n');
  return error;
}

window.onerror = function (msg, url, line, col, error) {
  if (process.env.HAIKU_RELEASE_ENVIRONMENT === 'production' || process.env.HAIKU_RELEASE_ENVIRONMENT === 'staging') {
    _traceKitFormatErrorStack(error);
    window.Raven.captureException(error);
  }
};

function go() {
  // We are in a webview; use query string parameters for boot-up configuration
  var search = (window.location.search || '').split('?')[1] || '';
  var params = _qs2.default.parse(search, { plainObjects: true });
  var config = _lodash2.default.assign({}, params);
  if (!config.folder) throw new Error('A folder (the absolute path to the user project) is required');
  function _fixPlumbingUrl(url) {
    return url.replace(/^http/, 'ws');
  }

  var userconfig = require(_path2.default.join(config.folder, 'haiku.js'));

  var websocket = config.plumbing ? new _Websocket2.default(_fixPlumbingUrl(config.plumbing), config.folder, 'controllee', 'timeline') : { on: function on() {}, send: function send() {}, method: function method() {}, request: function request() {}, sendIfConnected: function sendIfConnected() {}, action: function action() {}

    // Add extra context to Sentry reports, this info is also used
    // by carbonite.
  };var folderHelper = config.folder.split('/').reverse();
  window.Raven.setExtraContext({
    organizationName: folderHelper[1],
    projectName: folderHelper[0],
    projectPath: config.folder
  });
  window.Raven.setUserContext({
    email: config.email
  });

  _reactDom2.default.render(_react2.default.createElement(_Timeline2.default, {
    envoy: config.envoy,
    userconfig: userconfig,
    websocket: websocket,
    folder: config.folder,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 66
    },
    __self: this
  }), document.getElementById('root'));
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJwcm9jZXNzIiwiZW52IiwiSEFJS1VfUkVMRUFTRV9FTlZJUk9OTUVOVCIsIndpbmRvdyIsIlJhdmVuIiwiY29uZmlnIiwiZW52aXJvbm1lbnQiLCJyZWxlYXNlIiwiSEFJS1VfUkVMRUFTRV9WRVJTSU9OIiwiZGF0YUNhbGxiYWNrIiwiaW5zdGFsbCIsImNvbnRleHQiLCJnbyIsIl90cmFjZUtpdEZvcm1hdEVycm9yU3RhY2siLCJlcnJvciIsInN0YWNrIiwic3BsaXQiLCJtYXAiLCJsaW5lIiwiam9pbiIsIm9uZXJyb3IiLCJtc2ciLCJ1cmwiLCJjb2wiLCJjYXB0dXJlRXhjZXB0aW9uIiwic2VhcmNoIiwibG9jYXRpb24iLCJwYXJhbXMiLCJwYXJzZSIsInBsYWluT2JqZWN0cyIsImFzc2lnbiIsImZvbGRlciIsIkVycm9yIiwiX2ZpeFBsdW1iaW5nVXJsIiwicmVwbGFjZSIsInVzZXJjb25maWciLCJyZXF1aXJlIiwid2Vic29ja2V0IiwicGx1bWJpbmciLCJvbiIsInNlbmQiLCJtZXRob2QiLCJyZXF1ZXN0Iiwic2VuZElmQ29ubmVjdGVkIiwiYWN0aW9uIiwiZm9sZGVySGVscGVyIiwicmV2ZXJzZSIsInNldEV4dHJhQ29udGV4dCIsIm9yZ2FuaXphdGlvbk5hbWUiLCJwcm9qZWN0TmFtZSIsInByb2plY3RQYXRoIiwic2V0VXNlckNvbnRleHQiLCJlbWFpbCIsInJlbmRlciIsImVudm95IiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQSxJQUFJQSxRQUFRQyxHQUFSLENBQVlDLHlCQUFaLEtBQTBDLFlBQTFDLElBQTBERixRQUFRQyxHQUFSLENBQVlDLHlCQUFaLEtBQTBDLFNBQXhHLEVBQW1IO0FBQ2pIQyxTQUFPQyxLQUFQLENBQWFDLE1B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YSxDQUFiLENBRmM7QUFHM0JLLGlCQUFhN0MsT0FBTzBCO0FBSE8sR0FBN0I7QUFLQTVCLFNBQU9DLEtBQVAsQ0FBYStDLGNBQWIsQ0FBNEI7QUFDMUJDLFdBQU8vQyxPQUFPK0M7QUFEWSxHQUE1Qjs7QUFJQSxxQkFBU0MsTUFBVCxDQUNFO0FBQ0UsV0FBT2hELE9BQU9pRCxLQURoQjtBQUVFLGdCQUFZbkIsVUFGZDtBQUdFLGVBQVdFLFNBSGI7QUFJRSxZQUFRaEMsT0FBTzBCLE1BSmpCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBREYsRUFPRXdCLFNBQVNDLGNBQVQsQ0FBd0IsTUFBeEIsQ0FQRjtBQVNEIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSdcbmltcG9ydCBsb2Rhc2ggZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBxcyBmcm9tICdxcydcbmltcG9ydCBXZWJzb2NrZXQgZnJvbSAnaGFpa3Utc2VyaWFsaXphdGlvbi9zcmMvd3MvV2Vic29ja2V0J1xuaW1wb3J0IFRpbWVsaW5lIGZyb20gJy4vY29tcG9uZW50cy9UaW1lbGluZSdcbmltcG9ydCB7c2VudHJ5Q2FsbGJhY2t9IGZyb20gJ2hhaWt1LXNlcmlhbGl6YXRpb24vc3JjL3V0aWxzL2NhcmJvbml0ZSdcblxuaWYgKHByb2Nlc3MuZW52LkhBSUtVX1JFTEVBU0VfRU5WSVJPTk1FTlQgPT09ICdwcm9kdWN0aW9uJyB8fCBwcm9jZXNzLmVudi5IQUlLVV9SRUxFQVNFX0VOVklST05NRU5UID09PSAnc3RhZ2luZycpIHtcbiAgd2luZG93LlJhdmVuLmNvbmZpZygnaHR0cHM6Ly9kMDQ1NjUzYWI1ZDQ0YzgwODQ4MGZhNmMzZmE4ZTg3Y0BzZW50cnkuaW8vMjI2Mzg3Jywge1xuICAgIGVudmlyb25tZW50OiBwcm9jZXNzLmVudi5IQUlLVV9SRUxFQVNFX0VOVklST05NRU5UIHx8ICdkZXZlbG9wbWVudCcsXG4gICAgcmVsZWFzZTogcHJvY2Vzcy5lbnYuSEFJS1VfUkVMRUFTRV9WRVJTSU9OLFxuICAgIGRhdGFDYWxsYmFjazogc2VudHJ5Q2FsbGJhY2tcbiAgfSkuaW5zdGFsbCgpXG4gIHdpbmRvdy5SYXZlbi5jb250ZXh0KGZ1bmN0aW9uICgpIHtcbiAgICBnbygpXG4gIH0pXG59IGVsc2Uge1xuICBnbygpXG59XG5cbmZ1bmN0aW9uIF90cmFjZUtpdEZvcm1hdEVycm9yU3RhY2sgKGVycm9yKSB7XG4gIGlmICghZXJyb3IpIHJldHVybiBudWxsXG4gIGlmICh0eXBlb2YgZXJyb3Iuc3RhY2sgIT09ICdzdHJpbmcnKSByZXR1cm4gbnVsbFxuICBlcnJvci5zdGFjayA9IGVycm9yLnN0YWNrLnNwbGl0KCdcXG4nKS5tYXAoKGxpbmUpID0+IHtcbiAgICByZXR1cm4gbGluZS5zcGxpdCgvIGF0XFxzK1xcLy8pLmpvaW4oJyBhdCAoLycpXG4gIH0pLmpvaW4oJ1xcbicpXG4gIHJldHVybiBlcnJvclxufVxuXG53aW5kb3cub25lcnJvciA9IGZ1bmN0aW9uIChtc2csIHVybCwgbGluZSwgY29sLCBlcnJvcikge1xuICBpZiAocHJvY2Vzcy5lbnYuSEFJS1VfUkVMRUFTRV9FTlZJUk9OTUVOVCA9PT0gJ3Byb2R1Y3Rpb24nIHx8IHByb2Nlc3MuZW52LkhBSUtVX1JFTEVBU0VfRU5WSVJPTk1FTlQgPT09ICdzdGFnaW5nJykge1xuICAgIF90cmFjZUtpdEZvcm1hdEVycm9yU3RhY2soZXJyb3IpXG4gICAgd2luZG93LlJhdmVuLmNhcHR1cmVFeGNlcHRpb24oZXJyb3IpXG4gIH1cbn1cblxuZnVuY3Rpb24gZ28gKCkge1xuICAvLyBXZSBhcmUgaW4gYSB3ZWJ2aWV3OyB1c2UgcXVlcnkgc3RyaW5nIHBhcmFtZXRlcnMgZm9yIGJvb3QtdXAgY29uZmlndXJhdGlvblxuICBjb25zdCBzZWFyY2ggPSAod2luZG93LmxvY2F0aW9uLnNlYXJjaCB8fCAnJykuc3BsaXQoJz8nKVsxXSB8fCAnJ1xuICBjb25zdCBwYXJhbXMgPSBxcy5wYXJzZShzZWFyY2gsIHsgcGxhaW5PYmplY3RzOiB0cnVlIH0pXG4gIGNvbnN0IGNvbmZpZyA9IGxvZGFzaC5hc3NpZ24oe30sIHBhcmFtcylcbiAgaWYgKCFjb25maWcuZm9sZGVyKSB0aHJvdyBuZXcgRXJyb3IoJ0EgZm9sZGVyICh0aGUgYWJzb2x1dGUgcGF0aCB0byB0aGUgdXNlciBwcm9qZWN0KSBpcyByZXF1aXJlZCcpXG4gIGZ1bmN0aW9uIF9maXhQbHVtYmluZ1VybCAodXJsKSB7IHJldHVybiB1cmwucmVwbGFjZSgvXmh0dHAvLCAnd3MnKSB9XG5cbiAgY29uc3QgdXNlcmNvbmZpZyA9IHJlcXVpcmUocGF0aC5qb2luKGNvbmZpZy5mb2xkZXIsICdoYWlrdS5qcycpKVxuXG4gIGNvbnN0IHdlYnNvY2tldCA9IChjb25maWcucGx1bWJpbmcpXG4gICAgPyBuZXcgV2Vic29ja2V0KF9maXhQbHVtYmluZ1VybChjb25maWcucGx1bWJpbmcpLCBjb25maWcuZm9sZGVyLCAnY29udHJvbGxlZScsICd0aW1lbGluZScpXG4gICAgOiB7IG9uOiAoKSA9PiB7fSwgc2VuZDogKCkgPT4ge30sIG1ldGhvZDogKCkgPT4ge30sIHJlcXVlc3Q6ICgpID0+IHt9LCBzZW5kSWZDb25uZWN0ZWQ6ICgpID0+IHt9LCBhY3Rpb246ICgpID0+IHt9IH1cblxuICAvLyBBZGQgZXh0cmEgY29udGV4dCB0byBTZW50cnkgcmVwb3J0cywgdGhpcyBpbmZvIGlzIGFsc28gdXNlZFxuICAvLyBieSBjYXJib25pdGUuXG4gIGNvbnN0IGZvbGRlckhlbHBlciA9IGNvbmZpZy5mb2xkZXIuc3BsaXQoJy8nKS5yZXZlcnNlKClcbiAgd2luZG93LlJhdmVuLnNldEV4dHJhQ29udGV4dCh7XG4gICAgb3JnYW5pemF0aW9uTmFtZTogZm9sZGVySGVscGVyWzFdLFxuICAgIHByb2plY3ROYW1lOiBmb2xkZXJIZWxwZXJbMF0sXG4gICAgcHJvamVjdFBhdGg6IGNvbmZpZy5mb2xkZXIsXG4gIH0pXG4gIHdpbmRvdy5SYXZlbi5zZXRVc2VyQ29udGV4dCh7XG4gICAgZW1haWw6IGNvbmZpZy5lbWFpbFxuICB9KVxuXG4gIFJlYWN0RE9NLnJlbmRlcihcbiAgICA8VGltZWxpbmVcbiAgICAgIGVudm95PXtjb25maWcuZW52b3l9XG4gICAgICB1c2VyY29uZmlnPXt1c2VyY29uZmlnfVxuICAgICAgd2Vic29ja2V0PXt3ZWJzb2NrZXR9XG4gICAgICBmb2xkZXI9e2NvbmZpZy5mb2xkZXJ9XG4gICAgICAvPixcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm9vdCcpXG4gIClcbn1cbiJdfQ==