import React from 'react'
import Welcome from './Steps/Welcome'
import OpenProject from './Steps/OpenProject'
import ScrubTicker from './Steps/ScrubTicker'
import PropertyChanger from './Steps/PropertyChanger'
import KeyframeCreator from './Steps/KeyframeCreator'
import TweenCreator from './Steps/TweenCreator'
import AnimatorNotice from './Steps/AnimatorNotice'
import LibraryStart from './Steps/LibraryStart'
import Finish from './Steps/Finish'
import Tooltip from '../Tooltip'

const components = {
  Welcome,
  OpenProject,
  ScrubTicker,
  PropertyChanger,
  KeyframeCreator,
  TweenCreator,
  AnimatorNotice,
  LibraryStart,
  Finish
}

class Tour extends React.Component {
  constructor () {
    super()

    this.state = {
      component: null,
      coordinates: null
    }
  }

  componentDidMount () {
    this.props.envoy.get('tour').then((tourChannel) => {
      this.tourChannel = tourChannel
      this.tourChannel.on('tour:requestShowStep', this.showStep)
      this.tourChannel.on('tour:requestFinish', this.hide)

      if (this.props.startTourOnMount) {
        this.tourChannel.start()
      }
    })

    this.mnt = true
  }

  componentWillUnmount () {
    this.mnt = false
  }

  next = () => {
    this.tourChannel.next()
  }

  finish = (createFile) => {
    this.tourChannel.finish(createFile)
  }

  hide = () => {
    if (this.mnt) {
      this.setState({ component: null })
    }
  }

  showStep = (state) => {
    // TODO: this is a bad practice, we should implement
    // a way to unbind events from a client in Envoy, then
    // remove this
    if (this.mnt) {
      this.setState(state)
    }
  }

  render () {
    if (!this.state.component) {
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
