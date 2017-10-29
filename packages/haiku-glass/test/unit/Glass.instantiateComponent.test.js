var test = require('tape')
var path = require('path')
var TestHelpers = require('./../TestHelpers')

test('Glass.instantiateComponent', function (t) {
  t.plan(5)
  TestHelpers.createApp(path.join(__dirname, '..', 'projects', 'simple'), function (glass, component, window, teardown) {
    t.equal(JSON.stringify(component.getSerializedBytecode()), '{"metadata":{"relpath":"code/main/code.js","uuid":"HAIKU_SHARE_UUID","version":"0.0.10","organization":"Haiku","project":"Primitives","branch":"master","name":"Primitives"},"options":{},"states":{},"eventHandlers":{},"timelines":{"Default":{"haiku:f203a65f49c0":{"style.WebkitTapHighlightColor":{"0":{"value":"rgba(0,0,0,0)"}},"style.position":{"0":{"value":"relative"}},"style.overflowX":{"0":{"value":"hidden"}},"style.overflowY":{"0":{"value":"hidden"}},"sizeAbsolute.x":{"0":{"value":550}},"sizeAbsolute.y":{"0":{"value":400}},"sizeMode.x":{"0":{"value":1}},"sizeMode.y":{"0":{"value":1}},"sizeMode.z":{"0":{"value":1}}}}},"template":{"elementName":"div","attributes":{"haiku-title":"Primitives","haiku-id":"f203a65f49c0","style":{"webkitTapHighlightColor":"rgba(0,0,0,0)","position":"relative","overflowX":"hidden","overflowY":"hidden"}},"children":[]}}', 'base bytecode ok')
    t.equal(window.document.getElementById('hot-component-mount').innerHTML, '<div haiku-title="Primitives" haiku-id="f203a65f49c0" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); position: relative; overflow-x: visible; overflow-y: visible; display: block; visibility: visible; opacity: 1; width: 550px; height: 400px;"></div>', 'base html ok')
    component.callMethod('instantiateComponent', ['designs/TED.sketch.contents/artboards/TED.svg', {}, {}], () => {
      t.equal(JSON.stringify(component.getSerializedBytecode()), '{"metadata":{"relpath":"code/main/code.js","uuid":"HAIKU_SHARE_UUID","version":"0.0.10","organization":"Haiku","project":"Primitives","branch":"master","name":"Primitives"},"options":{},"states":{},"eventHandlers":{},"timelines":{"Default":{"haiku:f203a65f49c0":{"style.WebkitTapHighlightColor":{"0":{"value":"rgba(0,0,0,0)"}},"style.position":{"0":{"value":"relative"}},"style.overflowX":{"0":{"value":"hidden"}},"style.overflowY":{"0":{"value":"hidden"}},"sizeAbsolute.x":{"0":{"value":550}},"sizeAbsolute.y":{"0":{"value":400}},"sizeMode.x":{"0":{"value":1}},"sizeMode.y":{"0":{"value":1}},"sizeMode.z":{"0":{"value":1}}},"haiku:2ed103f984d5":{"viewBox":{"0":{"value":"0 0 92 47"}},"style.position":{"0":{"value":"absolute"}},"style.margin":{"0":{"value":"0"}},"style.padding":{"0":{"value":"0"}},"style.border":{"0":{"value":"0"}},"sizeAbsolute.x":{"0":{"value":92}},"sizeMode.x":{"0":{"value":1}},"sizeAbsolute.y":{"0":{"value":47}},"sizeMode.y":{"0":{"value":1}},"style.zIndex":{"0":{"value":1}}},"haiku:47a12a832685":{"stroke":{"0":{"value":"none"}},"stroke-width":{"0":{"value":"1"}},"fill":{"0":{"value":"none"}},"fill-rule":{"0":{"value":"evenodd"}}},"haiku:c61a4d5f7893":{"fill":{"0":{"value":"#695E5D"}},"fill-rule":{"0":{"value":"nonzero"}}},"haiku:1dfbcc09fa87":{"d":{"0":{"value":"M13,18.203 L13,12 L34.012,12 L34.012,18.203 L27.25,18.203 L27.25,36.3 L19.761,36.3 L19.761,18.203 L13,18.203 Z M35.175,12 L55.605,12 L55.605,18.203 L42.664,18.203 L42.664,21.195 L55.605,21.195 L55.605,27.032 L42.664,27.032 L42.664,30.097 L55.605,30.097 L55.605,36.3 L35.175,36.3 L35.175,12 L35.175,12 Z M56.841,12 L69.128,12 C77.199,12 80.034,17.984 80.034,24.114 C80.034,31.557 76.108,36.3 67.674,36.3 L56.841,36.3 L56.841,12 L56.841,12 Z M64.33,30.097 L67.238,30.097 C71.891,30.097 72.546,26.303 72.546,24.041 C72.546,22.508 72.037,18.276 66.656,18.276 L64.257,18.276 L64.33,30.097 L64.33,30.097 Z"}}}}},"template":{"elementName":"div","attributes":{"haiku-title":"Primitives","haiku-id":"f203a65f49c0","style":{"webkitTapHighlightColor":"rgba(0,0,0,0)","position":"relative","overflowX":"hidden","overflowY":"hidden"}},"children":[{"elementName":"svg","attributes":{"version":"1.1","xmlns":"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink","source":"designs/TED.sketch.contents/artboards/TED.svg","haiku-title":"TED","haiku-id":"2ed103f984d5","style":{"position":"absolute","margin":"0","padding":"0","border":"0","zIndex":1},"viewBox":"0 0 92 47"},"children":[{"elementName":"title","attributes":{"haiku-id":"118afdf1fba9","style":{}},"children":["TED"]},{"elementName":"desc","attributes":{"haiku-id":"0552e3a87caa","style":{}},"children":["Created with sketchtool."]},{"elementName":"defs","attributes":{"haiku-id":"b2469996e4a9","style":{}},"children":[]},{"elementName":"g","attributes":{"id":"Page-1","haiku-id":"47a12a832685","style":{},"stroke":"none","stroke-width":"1","fill":"none","fill-rule":"evenodd"},"children":[{"elementName":"g","attributes":{"id":"TED","haiku-id":"c61a4d5f7893","style":{},"fill":"rgb(105, 94, 93)","fill-rule":"nonzero"},"children":[{"elementName":"path","attributes":{"haiku-id":"1dfbcc09fa87","style":{},"d":"M13,18.203V12H34.012V18.203H27.25V36.3H19.761V18.203ZM35.175,12H55.605V18.203H42.664V21.195H55.605V27.032H42.664V30.097H55.605V36.3H35.175V12ZM56.841,12H69.128C77.199,12,80.034,17.984,80.034,24.114C80.034,31.557,76.108,36.3,67.674,36.3H56.841V12ZM64.33,30.097H67.238C71.891,30.097,72.546,26.303,72.546,24.041C72.546,22.508,72.037,18.276,66.656,18.276H64.257L64.33,30.097Z"},"children":[]}]}]}]}]}}', 'instantiated bytecode ok')
      t.equal(window.document.getElementById('hot-component-mount').innerHTML, '<div haiku-title="Primitives" haiku-id="f203a65f49c0" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); position: relative; overflow-x: visible; overflow-y: visible; display: block; visibility: visible; opacity: 1; width: 550px; height: 400px;"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" source="designs/TED.sketch.contents/artboards/TED.svg" haiku-title="TED" haiku-id="2ed103f984d5" style="position: absolute; margin: 0px; padding: 0px; border: 0px; z-index: 1; display: block; visibility: visible; opacity: 1; width: 92px; height: 47px;" viewBox="0 0 92 47"><title haiku-id="118afdf1fba9">TED</title><desc haiku-id="0552e3a87caa">Created with sketchtool.</desc><defs haiku-id="b2469996e4a9"></defs><g id="Page-1" haiku-id="47a12a832685" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" style="display: block; visibility: visible; opacity: 1; width: 92px; height: 47px;" width="92px" height="47px"><g id="TED" haiku-id="c61a4d5f7893" fill="rgb(105, 94, 93)" fill-rule="nonzero" style="display: block; visibility: visible; opacity: 1; width: 92px; height: 47px;" width="92px" height="47px"><path haiku-id="1dfbcc09fa87" d="M13,18.203V12H34.012V18.203H27.25V36.3H19.761V18.203ZM35.175,12H55.605V18.203H42.664V21.195H55.605V27.032H42.664V30.097H55.605V36.3H35.175V12ZM56.841,12H69.128C77.199,12,80.034,17.984,80.034,24.114C80.034,31.557,76.108,36.3,67.674,36.3H56.841V12ZM64.33,30.097H67.238C71.891,30.097,72.546,26.303,72.546,24.041C72.546,22.508,72.037,18.276,66.656,18.276H64.257L64.33,30.097Z" style="display: block; visibility: visible; opacity: 1; width: 92px; height: 47px;" width="92px" height="47px"></path></g></g></svg></div>', 'updated html ok')
      setTimeout(() => {
        t.equal(component.queryElements({ _isSelected: true }).length, 1, 'component selected')
        teardown()
      }, 100)
    })
  })
})
