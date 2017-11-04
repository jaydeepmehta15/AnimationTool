const lodash = require('lodash')
const getPropertyValueDescriptor = require('./helpers/getPropertyValueDescriptor')
const BaseModel = require('./BaseModel')
const Keyframe = require('./Keyframe')

const NAVIGATION_DIRECTIONS = {
  SAME: 0,
  NEXT: +1,
  PREV: -1
}

class Row extends BaseModel {
  constructor (props, opts) {
    super(props, opts)

    this._isSelected = false
    this._isFocused = false
    this._isExpanded = false
    this._isActive = false
    this._isHidden = false
    this._isHovered = false

    // Hacky check whether we've already auto-expanded this row
    this._wasInitiallyExpanded = false
  }

  getUniqueKey () {
    return `${this.element.getComponentId()}-${this.getType()}-${this.getClusterNameString()}-${this.getPropertyNameString()}`
  }

  select (metadata) {
    if (!this._isSelected || !Row._selected[this.getUniqueKey()]) {
      // Deselect all other rows; currently assume only one row selected at a time
      Row.all().forEach((row) => {
        if (row === this) return null
        row.deselect(metadata)
      })

      this._isSelected = true
      Row._selected[this.getUniqueKey()] = this
      this.emit('update', 'row-selected', metadata)

      // Roundabout! Note that elements, when selected, will select their corresponding row
      if (this.isHeading() && this.element && !this.element.isSelected()) {
        this.element.select(metadata)
      }
    }
    return this
  }

  deselect (metadata) {
    if (this._isSelected || Row._selected[this.getUniqueKey()]) {
      this._isSelected = false
      delete Row._selected[this.getUniqueKey()]
      this.emit('update', 'row-deselected', metadata)

      // Roundabout! Note that elements, when unselected, will unselect their corresponding row
      if (this.isHeading() && this.element && this.element.isSelected()) {
        this.element.unselect(metadata)
      }
    }
    return this
  }

  isSelected () {
    return this._isSelected
  }

  activate () {
    if (!this._isActive || !Row._active[this.getUniqueKey()]) {
      this._isActive = true
      Row._active[this.getUniqueKey()] = this
      this.emit('update', 'row-activated')
    }
    return this
  }

  deactivate () {
    if (this._isActive || Row._active[this.getUniqueKey()]) {
      this._isActive = false
      delete Row._active[this.getUniqueKey()]
      this.emit('update', 'row-deactivated')
    }
    return this
  }

  isActive () {
    return this._isActive
  }

  expand (metadata) {
    if (!this._isExpanded || !Row._expanded[this.getUniqueKey()]) {
      this._isExpanded = true
      Row._expanded[this.getUniqueKey()] = this
      this.emit('update', 'row-expanded', metadata)
    }

    // If we are expanded, we also need our parent to be expanded
    if (this.parent) {
      this.parent.expand(metadata)
    }

    return this
  }

  collapse (metadata) {
    if (this._isExpanded || Row._expanded[this.getUniqueKey()]) {
      this._isExpanded = false
      delete Row._expanded[this.getUniqueKey()]
      this.emit('update', 'row-collapsed', metadata)
    }
    return this
  }

  isCollapsed () {
    // Something that has no inner contents cannot be 'collapsed'
    if (this.isProperty()) {
      return false
    }
    return !this._isExpanded
  }

  isExpanded () {
    // Something that has no inner contents cannot be 'collapsed'
    if (this.isProperty()) {
      return true
    }
    return this._isExpanded
  }

  focus (metadata) {
    if (!this._isFocused || !Row._focused[this.getUniqueKey()]) {
      Row.all().forEach((row) => {
        if (row !== this) row.blur()
      })
      this._isFocused = true
      Row._focused[this.getUniqueKey()] = this
      this.emit('update', 'row-focused', metadata)
    }
    return this
  }

  blur (metadata) {
    if (this._isFocused || Row._focused[this.getUniqueKey()]) {
      this._isFocused = false
      delete Row._focused[this.getUniqueKey()]
      this.emit('update', 'row-blurred', metadata)
    }
    return this
  }

  isFocused () {
    return this._isFocused
  }

  hide () {
    if (!this._isHidden || !Row._hidden[this.getUniqueKey()]) {
      this._isHidden = true
      Row._hidden[this.getUniqueKey()] = this
      this.emit('update', 'row-hidden')
    }
    return this
  }

  show () {
    if (this._isHidden || Row._hidden[this.getUniqueKey()]) {
      this._isHidden = false
      delete Row._hidden[this.getUniqueKey()]
      this.emit('update', 'row-shown')
    }
    return this
  }

  isHidden () {
    return this._isHidden
  }

  hover () {
    if (!this._isHovered || !Row._hovered[this.getUniqueKey()]) {
      this._isHovered = true
      Row._hovered[this.getUniqueKey()] = this
      this.emit('update', 'row-hovered')
    }
    return this
  }

  unhover () {
    if (this._isHovered || Row._hovered[this.getUniqueKey()]) {
      this._isHovered = false
      delete Row._hovered[this.getUniqueKey()]
      this.emit('update', 'row-unhovered')
    }
    return this
  }

  expandAndSelect (metadata) {
    if (!this.isExpanded()) {
      this.expand(metadata)
    }
    if (!this.isSelected()) {
      this.select(metadata)
    }
    return this
  }

  collapseAndDeselect (metadata) {
    if (this.isExpanded()) {
      this.collapse(metadata)
    }
    if (this.isSelected()) {
      this.deselect(metadata)
    }
    return this
  }

  getBaselineValueAtMillisecond (ms) {
    const { baselineValue } = getPropertyValueDescriptor(this, {
      timelineTime: ms,
      timelineName: this.timeline.getName()
    })

    return baselineValue
  }

  createKeyframe (value, ms, metadata) {
    // If creating a keyframe on a cluster row, create one for all of the child rows
    if (this.isClusterHeading()) {
      return this.children.forEach((child) => child.createKeyframe(value, ms, metadata))
    }

    const siblings = this.getKeyframes()

    let indexToAssign = null
    let existingAtMs = null

    siblings.forEach((sibling) => {
      if (sibling.getMs() >= ms) {
        // We're going to insert the keyframe where it belongs in sequence according to ms
        if (indexToAssign === null) {
          indexToAssign = sibling.getIndex()
        }

        // For uids, the previous at this location needs to have its index reflect the shift,
        // but only if we are really inserting a new one and not replacing the existing one
        if (sibling.getMs() !== ms) {
          sibling.incrementIndex()
        } else {
          existingAtMs = sibling
        }
      }
    })

    // If no sibling had a greater ms, we are either the first (only) or last keyframe
    if (indexToAssign === null) {
      indexToAssign = siblings.length
    }

    let valueToAssign

    // If no value provided, we'll grab a value from existing keyframes here
    if (value === undefined) {
      // If we are replacing an existing keyframe, use the existing one's value
      if (existingAtMs) {
        valueToAssign = existingAtMs.getValue()
      } else {
        // Otherwise, grab the value from the previous keyframe known in the sequence
        valueToAssign = this.getBaselineValueAtMillisecond(ms)
      }
    } else {
      valueToAssign = value
    }

    // If value is undefined, create a keyframe with the default
    const created = Keyframe.upsert({
      ms: ms,
      uid: Keyframe.getInferredUid(this, indexToAssign),
      index: indexToAssign,
      value: valueToAssign,
      // curve: we don't include curve so the previous curve is used if we're replacing an existing keyframe
      row: this,
      element: this.element,
      timeline: this.timeline,
      component: this.component
    })

    // Update the bytecode directly via ActiveComponent, which updates Timeline UI
    this.component.createKeyframe(
      [this.element.getComponentId()],
      this.timeline.getName(),
      this.element.getNameString(),
      this.getPropertyNameString(),
      created.getMs(),
      created.getValue(),
      created.getCurve(),
      null, // end ms, not used?
      null, // end value, not used?
      metadata,
      () => {}
    )

    this.emit('update', 'keyframe-create')
    if (this.parent) this.parent.emit('update', 'keyframe-create')

    return created
  }

  deleteKeyframe (keyframe, metadata) {
    const siblings = this.getKeyframes()

    siblings.forEach((sibling) => {
      // Shift the indices of all those that come after this one
      if (sibling.getMs() > keyframe.getMs()) {
        sibling.decrementIndex()
      }
    })

    keyframe.destroy()

    this.component.deleteKeyframe(
      [this.element.getComponentId()],
      this.timeline.getName(),
      this.getPropertyNameString(),
      keyframe.getMs(),
      metadata,
      () => {}
    )

    this.emit('update', 'keyframe-delete')
    if (this.parent) this.parent.emit('update', 'keyframe-delete')

    return keyframe
  }

  getDescriptor () {
    return this.property
  }

  getKeyframes (criteria) {
    return this.component.getCurrentKeyframes(lodash.assign({ row: this }, criteria))
  }

  mapVisibleKeyframes (iteratee) {
    // Avoid extra computation by not returning keyframes from too deep in the tree
    if (this.depth > 3) {
      return []
    }

    // If we are a heading row (either a cluster or an element), we have no keyframes,
    // so we instead query our children for the list of keyframes within us
    if (this.isHeading() || this.isClusterHeading()) {
      return lodash.flatten(this.children.map((child) => child.mapVisibleKeyframes(iteratee)))
    }

    const keyframes = this.getKeyframes()
    const frameInfo = this.timeline.getFrameInfo()

    return keyframes.filter((keyframe) => {
      return (
        !keyframe.isDeleted() &&
        keyframe.isVisible(frameInfo.msA, frameInfo.msB)
      )
    }).map(iteratee)
  }

  isFirstRowOfPropertyCluster () {
    return this.cluster && this.property && this.subseq === 0
  }

  isClusterHeading () {
    return this.cluster && !this.property
  }

  isCluster () {
    return !!this.cluster
  }

  isProperty () {
    return !!this.property
  }

  isHeading () {
    return !this.property && !this.cluster
  }

  getType () {
    if (this.isClusterHeading()) return 'cluster-heading'
    if (this.isHeading()) return 'element-heading'
    if (this.isProperty()) return 'property'
    return 'unknown'
  }

  getAddress () {
    let id
    if (this.isHeading()) id = 'heading'
    else if (this.isClusterHeading()) id = 'cluster-heading'
    else id = this.getPropertyNameString()
    return `${this.element.getAddress()}/${id}`
  }

  getClusterNameString () {
    return this.cluster && this.cluster.name
  }

  getPropertyNameString () {
    return this.property && this.property.name
  }

  getClusterValues () {
    return this.children.map((row) => {
      return row.getPropertyValueDescriptor()
    })
  }

  getPropertyValueDescriptor () {
    return getPropertyValueDescriptor(this, { numFormat: '0,0[.]000' })
  }

  getPropertyId () {
    return `${this.element.getComponentId()}-${this.element.getNameString()}-${this.getPropertyNameString()}`
  }

  getInputPropertyId () {
    return `property-input-field-box-${this.getPropertyId()}`
  }

  // This is a dupe of getPropertyNameString, not sure which is preferred
  getPropertyName () {
    return this.property && this.property.name
  }

  isClusterActivated (item) {
    return false // TODO
  }

  isRootRow () {
    return !this.parent
  }

  isWithinCollapsedRow () {
    return this.parent && (this.parent.isCollapsed() || this.parent.isWithinCollapsedRow())
  }

  addChild (row) {
    let found = false
    for (let i = 0; i < this.children.length; i++) {
      let child = this.children[i]
      if (child === row || child.getPrimaryKey() === row.getPrimaryKey()) {
        found = true
        break
      }
    }
    if (!found) {
      this.children.push(row)
    }
    return this
  }

  representsStringNode () {
    return typeof this.element.node === 'string'
  }

  isPropertyOnLastComponent () {
    // const propertyOnLastComponent = item.siblings.length > 0 && item.index === item.siblings.length - 1
  }

  next () {
    return Row.find({ place: this.place + 1 })
  }

  prev () {
    return Row.find({ place: this.place - 1 })
  }

  dump () {
    let str = `${this.getType()}.${this.place}|${this.depth}.${this.seq}.${this.index}`
    if (this.isCluster()) str += `.${this.cluster.prefix}[]`
    if (this.isProperty()) str += `.${this.getPropertyName()}`
    if (this.isSelected()) str += ' {s}'
    if (this.isFocused()) str += ' {f}'
    if (this.isExpanded()) str += ' {e}'
    return str
  }
}

Row.DEFAULT_OPTIONS = {
  required: {
    timeline: true,
    element: true,
    component: true,
    depth: true,
    index: true,
    seq: true,
    place: true
  }
}

BaseModel.extend(Row)

Row._selected = {}
Row._focused = {}
Row._expanded = {}
Row._active = {}
Row._hidden = {}
Row._hovered = {}

Row.top = function top () {
  return Row.find({ parent: null })
}

Row.findByComponentId = function findByComponentId (componentId) {
  return Row.filter((row) => {
    return row.element.getComponentId() === componentId
  })[0]
}

Row.findPropertyRowsByParentComponentId = function findPropertyRowsByParentComponentId (componentId) {
  return Row.filter((row) => {
    return row.isProperty() && row.parent && row.parent.element.getComponentId() === componentId
  })
}

Row.getDisplayables = function getDisplayables () {
  return Row.filter((row) => {
    // Nothing after the third level of depth (elements, properties, etc)
    if (row.depth > 3) {
      return false
    }

    // No third-level elements
    if (row.depth === 2 && row.parent.isHeading()) {
      return false
    }

    // Don't display any rows that are hidden by their parent being collapsed
    if (row.isWithinCollapsedRow()) {
      return false
    }

    return true
  })
}

Row.cyclicalNav = function cyclicalNav (row, navDir) {
  let target

  if (navDir === undefined || navDir === null || navDir === NAVIGATION_DIRECTIONS.SAME) {
    target = row
  } else if (navDir === NAVIGATION_DIRECTIONS.NEXT) {
    target = row && row.next()
  } else if (navDir === NAVIGATION_DIRECTIONS.PREV) {
    target = row && row.prev()
  }

  // If we're at the end (or no focused), use the row at the very top
  if (!target) {
    target = Row.find({ place: 0 })
  }

  // Only allow navigating through rows that we can act upon in the timeline
  if (!target.isProperty()) {
    // Endless recursion without this check
    if (navDir !== undefined && navDir !== null && navDir !== NAVIGATION_DIRECTIONS.SAME) {
      return Row.cyclicalNav(target, navDir)
    }
  }

  return target
}

Row.focusSelectNext = function focusSelectNext (navDir, doFocus, metadata) {
  const selected = Row.getSelectedRow()
  const focused = Row.getFocusedRow()

  if (selected) {
    selected.blur(metadata)
    selected.deselect(metadata)
  }

  if (focused) {
    focused.blur(metadata)
    focused.deselect(metadata)
  }

  const previous = focused || selected

  const target = (previous)
    ? Row.cyclicalNav(previous, navDir)
    : Row.cyclicalNav(Row.find({ place: 0 }), navDir)

  target.expand(metadata)
  target.select(metadata)
  if (doFocus) target.focus(metadata)

  return target
}

Row.getSelectedRow = function getSelectedRow () {
  return Object.values(Row._selected)[0] // TODO: many?
}

Row.getFocusedRow = function getFocusedRow () {
  return Object.values(Row._focused)[0] // TODO: many?
}

/**
 * @function rmap
 * @description Recursively 'map' through all rows, their children, etc.
 */
Row.rmap = function _rmap (iteratee) {
  return rmap([Row.top()], iteratee)
}

Row.rsmap = function _rsmap (iteratee, indentation) {
  const tree = rsmap([Row.top()], iteratee)
  return tlines([], '', indentation || '    ', tree).join('\n')
}

function rmap (rows, iteratee) {
  return rows.map((row) => {
    const out = iteratee(row)
    if (!out) throw new Error('rmap iteratee must return an object')
    if (typeof out !== 'object') throw new Error('rmap iteratee must return an object')
    out.children = rmap(row.children, iteratee)
    return out
  })
}

function rsmap (rows, iteratee) {
  return rows.map((row) => {
    const out = iteratee(row)
    if (typeof out !== 'string') {
      throw new Error('rmap iteratee must return a string')
    }
    return {
      text: out,
      children: rsmap(row.children, iteratee)
    }
  })
}

function tlines (lines, indent, indentation, nodes) {
  nodes.forEach((node) => {
    lines.push(indent + node.text)
    tlines(lines, indent + indentation, indentation, node.children)
  })
  return lines
}

Row.dumpHierarchyInfo = function dumpHierarchyInfo () {
  return Row.rsmap((row) => {
    return row.dump()
  })
}

module.exports = Row