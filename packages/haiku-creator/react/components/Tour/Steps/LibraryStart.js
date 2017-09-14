import React from 'react'
import Dialog from '../../Dialog'
import { DASH_STYLES } from '../../../styles/dashShared'

const STYLES = {
  btn: {
    ...DASH_STYLES.btn,
    padding: '10px 15px',
    margin: '0 10px 0 0',
    fontSize: 16
  },
  text: {
    fontSize: 16
  }
}

export default function ({ style, next }) {
  return (
    <Dialog style={style}>
      <h2>Library</h2>
      <div style={STYLES.text}>
        <p style={STYLES.text}>Let's focus on the library now.</p>
        <p>
          You can drag any element from here to the stage to instantiate it.
        </p>
        <p>
        But let's try demonstrating the conected design and animation
        workflows first. Note xyz element let's change its color in Sketch
        and watch it update here in Haiku automatically.
        Double click the Sketch Diamond to open Sketch.</p>
      </div>
      <button style={STYLES.btn} onClick={next}>Next</button>
    </Dialog>
  )
}
