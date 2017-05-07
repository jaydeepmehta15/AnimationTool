var MENU_GLOBAL_ID = 'haiku-right-click-menu'
var WIDTH = 240
var HEIGHT = 12
var GRAD_START = '#ffffff'
var GRAD_END = '#fff0f6'

function setGradient (el, fr, to) {
  el.style.background = fr // Old browsers
  el.style.background = '-webkit-linear-gradient(top,' + fr + ',' + to + ')'
  el.style.background = '-o-linear-gradient(top,' + fr + ',' + to + ')'
  el.style.background = '-moz-linear-gradient(top,' + fr + ',' + to + ')'
  el.style.background = 'linear-gradient(to bottom, ' + fr + ', ' + to + ')'
}

function setBoxShadow (el, color) {
  el.style['-webkit-box-shadow'] = '0px 0px 4px 0px ' + color
  el.style['-moz-box-shadow'] = '0px 0px 4px 0px ' + color
  el.style['box-shadow'] = '0px 0px 4px 0px ' + color
}

function px (num) {
  return num + 'px'
}

function findOrCreateMenuElement (doc) {
  var menu = doc.getElementById(MENU_GLOBAL_ID)
  if (menu) return menu
  menu = doc.createElement('div')
  menu.setAttribute('id', MENU_GLOBAL_ID)
  menu.style.position = 'absolute'
  menu.style.zIndex = 2147483647
  setGradient(menu, GRAD_START, GRAD_END)
  setBoxShadow(menu, 'rgba(200,200,200,1)')
  menu.style.borderRadius = px(2)
  menu.style.display = 'none'
  menu.style.opacity = 0.9
  menu.style.overflow = 'hidden'
  menu.style.cursor = 'default'
  menu.style.fontFamily = 'Helvetica, Arial, sans-serif'
  menu.style.fontWeight = 'lighter'
  menu.style.fontSize = px(12)
  menu.style.color = 'black'
  menu.style.padding = '12px 12px'
  menu.style.margin = '0'
  menu.style.boxSizing = 'content-box'
  doc.body.appendChild(menu)
  return menu
}

module.exports = function createRightClickMenu (domElement, playerInstance) {
  var doc = domElement.ownerDocument
  var menu = findOrCreateMenuElement(doc)

  function revealMenu (mx, my) {
    menu.style.width = px(WIDTH)
    menu.style.height = px(HEIGHT)
    menu.style.top = px(my)
    menu.style.left = px(mx)
    menu.style.pointerEvents = 'auto'
    menu.style.display = 'block'
    menu.innerHTML = '' +
      '<p style="margin:0;padding:0;line-height:12px"><a style="color:black;text-decoration:none;" href="https://www.haiku.ai" target="_blank">About Haiku Player ' + playerInstance.VERSION + ' ...</a></p>'
  }

  function hideMenu () {
    menu.style.width = px(0)
    menu.style.height = px(0)
    menu.style.top = px(0)
    menu.style.left = px(0)
    menu.style.pointerEvents = 'none'
    menu.style.display = 'none'
  }

  domElement.addEventListener('contextmenu', function (contextmenuEvent) {
    contextmenuEvent.preventDefault()
    var mx = contextmenuEvent.clientX
    var my = contextmenuEvent.clientY
    revealMenu(mx, my)
  })

  doc.addEventListener('click', hideMenu)
}
