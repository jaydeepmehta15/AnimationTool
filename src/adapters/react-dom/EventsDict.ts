/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

const EventsDict = {}

let eventsList = [
  "onAbort",
  "onAnimationEnd",
  "onAnimationIteration",
  "onAnimationStart",
  "onBlur",
  "onCanPlay",
  "onCanPlayThrough",
  "onChange",
  "onClick",
  "onCompositionEnd",
  "onCompositionStart",
  "onCompositionUpdate",
  "onContextMenu",
  "onCopy",
  "onCut",
  "onDoubleClick",
  "onDrag",
  "onDragEnd",
  "onDragEnter",
  "onDragExit",
  "onDragLeave",
  "onDragOver",
  "onDragStart",
  "onDrop",
  "onDurationChange",
  "onEmptied",
  "onEncrypted",
  "onEnded",
  "onError",
  "onFocus",
  "onInput",
  "onKeyDown",
  "onKeyPress",
  "onKeyUp",
  "onLoad",
  "onLoadedData",
  "onLoadedMetadata",
  "onLoadStart",
  "onMouseDown",
  "onMouseEnter",
  "onMouseLeave",
  "onMouseMove",
  "onMouseOut",
  "onMouseOver",
  "onMouseUp",
  "onPaste",
  "onPause",
  "onPlay",
  "onPlaying",
  "onProgress",
  "onRateChange",
  "onScroll",
  "onSeeked",
  "onSeeking",
  "onSelect",
  "onStalled",
  "onSubmit",
  "onSuspend",
  "onTimeUpdate",
  "onTouchCancel",
  "onTouchEnd",
  "onTouchMove",
  "onTouchStart",
  "onTransitionEnd",
  "onVolumeChange",
  "onWaiting",
  "onWheel",
]

for (let i = 0; i < eventsList.length; i++) {
  let name = eventsList[i]
  EventsDict[name] = "func"
  EventsDict[name + "Capture"] = "func"
}

export default EventsDict
