/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var isBlankString = require('./isBlankString')
var removeElement = require('./removeElement')
var _cloneVirtualElement = require('./cloneVirtualElement')

function renderTree (
  domElement,
  virtualElement,
  virtualChildren,
  locator,
  component,
  isPatchOperation,
  doSkipChildren
) {
  component._addElementToHashTable(domElement, virtualElement)

  if (!domElement.haiku) domElement.haiku = {}

  // 'locator', and 'virtual' are more for debugging convenience than anything else.
  // E.g. I might want to inspect the dom node, grab the haiku source data, etc.
  domElement.haiku.locator = locator
  domElement.haiku.virtual = virtualElement
  domElement.haiku.element = _cloneVirtualElement(virtualElement) // Must clone so we get a correct picture of differences in attributes between runs, e.g. for detecting attribute removals
  if (!component.config.options.cache[domElement.haiku.locator]) {
    component.config.options.cache[domElement.haiku.locator] = {}
  }

  if (!Array.isArray(virtualChildren)) {
    return domElement
  }

  // For so-called 'horizon' elements, we assume that we've ceded control to another renderer,
  // so the most we want to do is update the attributes and layout properties, but leave the rest alone
  if (component._isHorizonElement(virtualElement)) {
    return domElement
  }

  // During patch renders we don't want to drill down and update children as
  // we're just going to end up doing a lot of unnecessary DOM writes
  if (doSkipChildren) {
    return domElement
  }

  while (virtualChildren.length > 0 && isBlankString(virtualChildren[0])) {
    virtualChildren.shift()
  }

  var max = virtualChildren.length
  if (max < domElement.childNodes.length) max = domElement.childNodes.length

  for (var i = 0; i < max; i++) {
    var virtualChild = virtualChildren[i]
    var domChild = domElement.childNodes[i]
    var sublocator = locator + '.' + i

    if (!virtualChild && !domChild) {
      continue
    } else if (!virtualChild && domChild) {
      removeElement(domChild)
    } else if (virtualChild) {
      if (!domChild) {
        var insertedElement = appendChild(
          null,
          virtualChild,
          domElement,
          virtualElement,
          sublocator,
          component
        )

        component._addElementToHashTable(insertedElement, virtualChild)
      } else {
        var oldId = domChild.getAttribute && domChild.getAttribute('id')
        var newId = virtualChild.attributes && virtualChild.attributes.id

        if (oldId && newId && oldId !== newId) {
          // If we now have an element that has a different id, we need to trigger a full re-render
          // of itself and all of its children, because url(#...) references will retain pointers to
          // old elements and this is the only way to clear the DOM to get a correct render
          replaceElement(
            domChild,
            virtualChild,
            domElement,
            virtualElement,
            locator,
            component
          )
          continue
        }

        updateElement(
          domChild,
          virtualChild,
          domElement,
          virtualElement,
          sublocator,
          component,
          isPatchOperation
        )
      }
    }
  }

  return domElement
}

module.exports = renderTree

var appendChild = require('./appendChild')
var updateElement = require('./updateElement')
var replaceElement = require('./replaceElement')
