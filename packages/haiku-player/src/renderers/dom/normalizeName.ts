/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

export default function normalizeName(tagName) {
  if (tagName[0] === tagName[0].toUpperCase()) tagName = tagName + "-component"
  return tagName
}
