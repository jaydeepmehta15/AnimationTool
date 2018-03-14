const { URL, URLSearchParams } = require('url')
const request = require('request')
const fse = require('haiku-fs-extra')
const path = require('path')
const {inkstone} = require('@haiku/sdk-inkstone')
const logger = require('../utils/LoggerInstance')
const randomAlphabetical = require('../utils/randomAlphabetical')

const API_BASE = 'https://wild-api.figma.com/v1/'
const FIGMA_URL = 'https://wild.figma.com/'
const FIGMA_CLIENT_ID = 'VoKSpy2DqppAK4D3b2tO8J'
const IS_FIGMA_FILE_RE = /\.figma$/
const IS_FIGMA_FOLDER_RE = /\.figma\.contents/
const VALID_TYPES = {
  SLICE: 'SLICE',
  GROUP: 'GROUP'
}
const FOLDERS = {
  [VALID_TYPES.SLICE]: 'slices/',
  [VALID_TYPES.GROUP]: 'groups/'
}

/**
 * @class Figma
 * @description
 *.  Collection of static class methods and constants related to Figma assets.
 */
class Figma {
  constructor ({ token, requestLib = request }) {
    this._token = token
    this._requestLib = requestLib
  }

  set token (token) {
    this._token = token
  }

  get token () {
    return this._token
  }

  /**
   * Imports SVGs from a Figma url in the given path
   * @param {Object} params
   * @param {string} params.url
   * @param {string} params.path
   * @returns {Promise}
   */
  importSVG ({url, path}) {
    const {id, name} = this.parseProjectURL(url)

    logger.info('[figma] about to import document with id ' + id)

    return this.fetchDocument(id)
      .then((document) => this.findInstantiableElements(document))
      .then((elements) => this.getSVGLinks(elements, id))
      .then((elements) => this.getSVGContents(elements))
      .then((elements) => this.writeSVGInDisk(elements, id, name, path))
  }

  /**
   * Fetch document info from the Figma API
   * @param {string} id
   * @returns {Promise}
   */
  fetchDocument (id) {
    const uri = API_BASE + 'files/' + id
    return this.request({ uri })
  }

  /**
   * Write an array of elements containing SVG info into disk
   * @param {Array} elements
   * @param {string} id
   * @param {string} name
   * @param {string} path
   * @returns {Promise}
   */
  writeSVGInDisk (elements, id, name, path) {
    logger.info('[figma] writing SVGs in disk')

    const abspath = `${path}/designs/${id}-${name}.figma`

    const assetBaseFolder = abspath + '.contents/'
    fse.emptyDirSync(assetBaseFolder)

    const sliceFolder = assetBaseFolder + 'slices/'
    fse.mkdirpSync(sliceFolder)

    const groupFolder = assetBaseFolder + 'groups/'
    fse.mkdirpSync(groupFolder)

    return Promise.all(
      elements.map((element) => {
        const path =
          assetBaseFolder + FOLDERS[element.type] + element.name + '.svg'
        return fse.writeFile(path, element.svg)
      })
    )
  }

  /**
   * Maps an array of elements with URLs pointing to SVG resources to elements
   * with actual SVG markup as a string property
   * @param {Array} elements
   */
  getSVGContents (elements) {
    logger.info('[figma] downloading SVGs from cloud')

    const requests = elements.map((element) => {
      return new Promise((resolve, reject) => {
        this.request({ uri: element.svgURL, auth: false }).then((svg) => {
          resolve(Object.assign(element, {svg}))
        })
        .catch(reject)
      })
    })

    return Promise.all(requests)
  }

  /**
   * Maps an array of elements into an array of elements with links to their
   * SVG representation in the cloud via the Figma API
   * @param {Array} elements
   * @param {string} id
   * @returns {Promise}
   */
  getSVGLinks (elements, id) {
    return new Promise((resolve, reject) => {
      const ids = elements.map((element) => element.id)
      const params = new URLSearchParams([['format', 'svg'], ['ids', ids]])
      const uri = API_BASE + 'images/' + id + '?' + params.toString()

      this.request({ uri })
        .then((SVGLinks) => {
          // TODO: links comes with an error param, we should check that
          const {images} = JSON.parse(SVGLinks)
          const elementsWithLinks = elements.map((element) => {
            return Object.assign(element, {svgURL: images[element.id]})
          })

          resolve(elementsWithLinks)
        })
        .catch(reject)
    })
  }

  findItems (arr) {
    const result = []

    for (let item of arr) {
      if (VALID_TYPES[item.type]) {
        result.push({ id: item.id, name: item.name, type: item.type })
      } else if (item.children) {
        result.push(...this.findItems(item.children))
      }
    }

    return result
  }

  findInstantiableElements (rawFile) {
    const file = JSON.parse(rawFile)
    return this.findItems(file.document.children)
  }

  request ({ uri, auth = true }) {
    const headers = auth ? { Authorization: 'Bearer ' + this.token } : {}

    return new Promise((resolve, reject) => {
      this._requestLib({ uri, headers }, (error, response, body) => {
        error || response.statusCode !== 200 ? reject(JSON.parse(body)) : resolve(body)
      })
    })
  }

  /**
   * Parse a Figma URL and return the name and the id of the file it references
   * @param {string} rawURL must be a string in the format 'protocol://host/id/name
   * @returns {Object} an object containing the id and the name in the URL
   */
  parseProjectURL (rawURL) {
    logger.info('[figma] parsing project URL: ' + rawURL)

    const url = new URL(rawURL)
    // eslint-disable-next-line
    const [_, __, id, name] = url.pathname.split('/')

    if (!id || !name) {
      throw new Error('Invalid URL')
    }

    return { id, name }
  }

  /**
   * Build a link to a Figma file based on the ID and the name
   * @param {string} fileID
   * @param {string} fileName
   * @returns {string}
   */
  static buildFigmaLink (fileID, fileName) {
    return `${FIGMA_URL}file/${fileID}/${fileName}`
  }

  /**
   * Build a OAuth link
   * @returns {string}
   */
  static buildAuthenticationLink () {
    const state = randomAlphabetical(15)
    const redirectURI = `haiku://oauth/figma&scope=file_read&state=${state}&response_type=code`
    const url = `${FIGMA_URL}oauth?client_id=${FIGMA_CLIENT_ID}&redirect_uri=${redirectURI}`
    return {url, state}
  }

  /**
   * Request inkstone for a Figma access token
   * @param {Object} params
   * @param {string} params.code
   * @param {string} params.state
   * @param {string} params.stateCheck
   */
  static getAccessToken ({code, state, stateCheck}) {
    return new Promise((resolve, reject) => {
      if (state !== stateCheck) {
        reject(new Error('Invalid state code'))
      }

      inkstone.integrations.getFigmaAccessToken(code, (error, response) => {
        error ? reject(error) : resolve(response)
      })
    })
  }

  /**
   * Checks if a path points to a Figma file
   * @param {string} path
   * @returns {boolean}
   */
  static isFigmaFile (path) {
    return path.match(IS_FIGMA_FILE_RE)
  }

  /**
   * Checks if a path points to a Figma folder
   * @param {string} path
   * @returns {boolean}
   */
  static isFigmaFolder (path) {
    return path.match(IS_FIGMA_FOLDER_RE)
  }

  /**
   * Tries to find an ID from a Figma path
   * @param {string} relpath
   * @returns {string}
   */
  static findIDFromPath (relpath) {
    const basename = path.basename(relpath)
    const match = basename.match(/(\w+)-/)
    return match && match[1]
  }
}

module.exports = Figma
