/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

import BasicUtils from "./BasicUtils"
import queryList from "./cssQueryList"
import flattenTree from "./manaFlattenTree"

const OBJECT = "object"

export default function queryTree(matches, node, query, options) {
  if (!node || typeof node !== OBJECT) return matches
  let list = BasicUtils.uniq(flattenTree([], node, options, 0, 0))
  queryList(matches, list, query, options)
  return matches
}
