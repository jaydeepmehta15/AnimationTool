var React = require('react')
var ReactTestRenderer = require('react-test-renderer')
var merge = require('lodash.merge')
var ValidProps = require('./ValidProps')
var EventsDict = require('./EventsDict')
var reactToMana = require('haiku-bytecode/src/reactToMana')
var initializeTreeAttributes = require('./../../helpers/initializeTreeAttributes')

function applyInputs (haikuPlayer, props) {
  for (var key in props) {
    var value = props[key]
    haikuPlayer[key] = value
  }
}

function applyProps (haikuPlayer, props) {
  if (!haikuPlayer) return null
  if (!props) return null
  applyInputs(haikuPlayer, props)
}

function createContext (reactInstance, creationClass, reactProps) {
  var fullProps = merge({}, reactProps, {
    ref: reactInstance.refs.container,
    vanities: {
      'controlFlow.insert': function _controlFlowInsertReactVanity (element, insertable, context, component, implementation) {
        var renderer = ReactTestRenderer.create(insertable)
        var json = renderer.toJSON()
        var mana = reactToMana(json)
        initializeTreeAttributes(mana, element)
        implementation(element, mana, context, component)
      },
      'controlFlow.placeholder': function _controlFlowPlaceholderReactVanity (element, surrogate, context, component, implementation) {
        var renderer = ReactTestRenderer.create(surrogate)
        var json = renderer.toJSON()
        var mana = reactToMana(json)
        initializeTreeAttributes(mana, element)
        implementation(element, mana, context, component)
      }
    }
  })
  reactInstance.haikuPlayer = creationClass(reactInstance.refs.container, fullProps)
  reactInstance.haikuPlayer.hear(function (name, payload) {
    if (reactInstance.props && reactInstance.props.events && reactInstance.props.events[name]) {
      reactInstance.props.events[name](payload)
    }
  })
}

function adapt (creationClass) {
  var reactClass = React.createClass({
    displayName: 'HaikuCreation',

    getInitialState: function () {
      // In case someone ones to do this.refs.whatever.haiku...
      this.haiku = creationClass
      return {}
    },

    componentWillReceiveProps: function (nextProps) {
      if (this.props.controller) {
        this.props.controller.emit('react:componentWillReceiveProps', this, nextProps)
      }
      applyProps(this.haikuPlayer, nextProps)
    },

    componentWillMount: function () {
      if (this.props.controller) {
        this.props.controller.emit('react:componentWillMount', this)
      }
      if (this.props.onComponentWillMount) {
        this.props.onComponentWillMount(this)
      }
    },

    componentWillUnmount: function () {
      if (this.props.controller) {
        this.props.controller.emit('react:componentWillUnmount', this)
      }
      if (this.props.onComponentWillUnmount) {
        this.props.onComponentWillUnmount(this)
      }
    },

    componentDidMount: function () {
      createContext(this, creationClass, this.props)
      if (this.props.controller) {
        this.props.controller.emit('react:componentDidMount', this, this.refs.container)
      }
      if (this.props.onComponentDidMount) {
        this.props.onComponentDidMount(this, this.refs.container)
      }
      applyProps(this.haikuPlayer, this.props)
    },

    render: function () {
      var passthroughProps = {}
      for (var key in this.props) {
        var propEntry = this.props[key]
        if (ValidProps[key]) {
          if (EventsDict[key]) {
            passthroughProps[key] = createEventPropWrapper(this, propEntry)
          } else {
            passthroughProps[key] = propEntry
          }
        }
      }

      return React.createElement(this.props.tagName || 'div', merge({
        ref: 'container',
        style: {
          position: 'relative',
          margin: 0,
          padding: 0,
          border: 0,
          width: '100%',
          height: '100%'
        }
      }, passthroughProps))
    }
  })

  function createEventPropWrapper (reactInstance, eventListener) {
    return function _eventPropWrapper (proxy, event) {
      return eventListener.call(this, proxy, event, creationClass.component.instance)
    }.bind(reactInstance)
  }

  reactClass.haiku = creationClass // Aliases

  reactClass.propTypes = {
    tagName: React.PropTypes.string
  }

  for (var propName in ValidProps) {
    var propType = ValidProps[propName]
    reactClass.propTypes[propName] = React.PropTypes[propType]
  }

  return reactClass
}

module.exports = adapt
