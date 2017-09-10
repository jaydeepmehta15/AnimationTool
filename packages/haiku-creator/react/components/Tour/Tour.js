import React from 'react'
import Welcome from './Steps/Welcome'
import OpenProject from './Steps/OpenProject'
import ScrubTicker from './Steps/ScrubTicker'
import PropertyChanger from './Steps/PropertyChanger'
import KeyframeCreator from './Steps/KeyframeCreator'
import AnimatorNotice from './Steps/AnimatorNotice'
import LibraryStart from './Steps/LibraryStart'
import Finish from './Steps/Finish'
import Tooltip from '../Tooltip'
import {
  didTakeTour,
  createTourFile
} from 'haiku-serialization/src/utils/HaikuHomeDir'

const components = {
  Welcome,
  OpenProject,
  ScrubTicker,
  PropertyChanger,
  KeyframeCreator,
  AnimatorNotice,
  LibraryStart,
  Finish
}

class Tour extends React.Component {
  constructor () {
    super()

    this.next = this.next.bind(this)
    this.showStep = this.showStep.bind(this)
    this.finish = this.finish.bind(this)

    this.state = {
      didTakeTour: didTakeTour(),
      step: null,
      component: null,
      coordinates: null
    }
  }

  componentDidMount () {
    this.props.envoy.get('tour').then((tourChannel) => {
      this.tourChannel = tourChannel
      this.tourChannel.on('tour:requestShowStep', this.showStep)
    })

    this.mnt = true
  }

  componentWillUnmount () {
    this.mnt = false
  }

  next () {
    this.tourChannel.next()
  }

  finish () {
    this.tourChannel.finish()

    this.setState({
      didTakeTour: true
    })

    createTourFile()
  }

  showStep (state) {
    // TODO: this is a bad practice, we should implement
    // a way to unbind events from a client in Envoy, then
    // remove this
    if (this.mnt) {
      this.setState(state)
    }
  }

  shouldRender () {
    return this.state.component && !this.state.didTakeTour
  }

  render () {
    if (!this.shouldRender()) {
      return null
    }

    const { display, coordinates, component } = this.state
    const Step = components[component]

    return (
      <Tooltip coordinates={coordinates} display={display}>
        <Step next={this.next} finish={this.finish} />
      </Tooltip>
    )
  }
}

export default Tour
