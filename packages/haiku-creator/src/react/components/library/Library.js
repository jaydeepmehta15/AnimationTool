import React from 'react'
import Color from 'color'
import lodash from 'lodash'
import Radium from 'radium'
import { shell, ipcRenderer } from 'electron'
import { UserSettings } from 'haiku-sdk-creator/lib/bll/User'
import Palette from 'haiku-ui-common/lib/Palette'
import { didAskedForSketch } from 'haiku-serialization/src/utils/HaikuHomeDir'
import Asset from 'haiku-serialization/src/bll/Asset'
import Figma from "haiku-serialization/src/bll/Figma";
import sketchUtils from '../../../utils/sketchUtils'
import SketchDownloader from '../SketchDownloader'
import AssetList from './AssetList'
import Loader from './Loader'
import FileImporter from './FileImporter'


const STYLES = {
  scrollwrap: {
    overflowY: 'auto',
    height: '100%'
  },
  sectionHeader: {
    cursor: 'default',
    // height: 25, // See note in StateInspector
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    padding: '12px 14px 0',
    fontSize: 15,
    justifyContent: 'space-between'
  },
  assetsWrapper: {
    paddingTop: 6,
    paddingBottom: 6,
    position: 'relative',
    minHeight: '300px',
    overflow: 'hidden'
  },
  fileDropWrapper: {
    pointerEvents: 'none'
  },
  startText: {
    color: Palette.COAL,
    fontSize: 25,
    padding: 24,
    textAlign: 'center',
    fontStyle: 'italic'
  },
  primaryAssetText: {
    color: Palette.DARK_ROCK,
    fontSize: 16,
    padding: 24,
    textAlign: 'center'
  }
}

class Library extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      error: null,
      assets: [],
      previewImageTime: null,
      overDropTarget: false,
      isLoading: false,
      figma: null,
      sketchDownloader: {
        asset: null,
        isVisible: false,
        shouldAskForSketch: !didAskedForSketch()
      }
    }

    this.handleAssetInstantiation = this.handleAssetInstantiation.bind(this)
    this.handleAssetDeletion = this.handleAssetDeletion.bind(this)
    this.importFigmaAsset = this.importFigmaAsset.bind(this)

    // Debounced to avoid 'flicker' when multiple updates are received quickly
    this.handleAssetsChanged = lodash.debounce(this.handleAssetsChanged.bind(this), 250)

    this.broadcastListener = this.broadcastListener.bind(this)
    this.onAuthCallback = this.onAuthCallback.bind(this)
  }

  broadcastListener ({ name, assets, data }) {
    switch (name) {
      case 'assets-changed':
        return this.handleAssetsChanged(assets, {isLoading: false})
    }
  }

  handleAssetsChanged (assetsDictionary, otherStates) {
    const assets = Asset.ingestAssets(this.props.projectModel, assetsDictionary)
    const statesToSet = { assets }
    if (otherStates) lodash.assign(statesToSet, otherStates)
    this.setState(statesToSet)
  }

  componentDidMount () {
    this.setState({isLoading: true})

    this.reloadAssetList()

    this.props.websocket.on('broadcast', this.broadcastListener)
    ipcRenderer.on('open-url:oauth', this.onAuthCallback)

    sketchUtils.checkIfInstalled().then(isInstalled => {
      this.isSketchInstalled = isInstalled
    })

    this.props.user.getConfig(UserSettings.figmaToken).then((figmaToken) => {
      const figma = new Figma({token: figmaToken})
      this.setState({figma})
    })
  }

  componentWillUnmount () {
    this.props.websocket.removeListener('broadcast', this.broadcastListener)
    ipcRenderer.removeListener('open-url:oauth', this.onAuthCallback)
  }

  onAuthCallback (_, path) {
    console.log('asdfasdfasdfasd', path)
  }

  askForFigmaAuth () {
    const {secret, url} = Figma.buildAuthenticationLink()
    this.secret = secret
    shell.openExternal(url)
  }

  reloadAssetList () {
    return this.props.projectModel.listAssets((error, assets) => {
      if (error) return this.setState({ error })
      this.handleAssetsChanged(assets, {isLoading: false})
    })
  }

  importFigmaAsset (url, callback) {
    this.state.figma.importSVG(url)
      .then(callback)
      .catch((error) => {
        this.props.createNotice({
          type: 'danger',
          title: 'Error',
          message: 'We had problems importing your file: ' + error.err
        })

        if (error.status === 403) {
          this.askForFigmaAuth()
        }
      })
  }

  handleFileInstantiation (asset) {
    return this.props.projectModel.transmitInstantiateComponent(asset.getRelpath(), {}, (err) => {
      if (err) {
        return this.props.createNotice({ type: 'danger', title: err.name, message: err.message })
      }
    })
  }

  openSketchFile (asset) {
    shell.openItem(asset.getAbspath())
  }

  handleSketchInstantiation (asset) {
    if (this.isSketchInstalled) {
      this.openSketchFile(asset)
    } else {
      this.setState({sketchDownloader: {...this.state.sketchDownloader, isVisible: true, asset}})
    }
  }

  onSketchDownloadComplete () {
    this.isSketchInstalled = true
    this.openSketchFile(this.state.sketchDownloader.asset)
    this.setState({sketchDownloader: {...this.state.sketchDownloader, isVisible: false, asset: null}})
  }

  onSketchDialogDismiss (shouldAskForSketch) {
    this.setState({sketchDownloader: {...this.state.sketchDownloader, isVisible: false, shouldAskForSketch}})
  }

  handleComponentInstantiation (asset) {
    // Yes, your observation is correct - this doesn't actually instantiate!
    // It just toggles the active component!
    // TODO: Rename/refactor - and note that this naming issue spans several methods here.

    const scenename = this.props.projectModel.relpathToSceneName(asset.getRelpath())
    this.props.projectModel.setCurrentActiveComponent(scenename, { from: 'creator' }, () => {})
  }

  handleAssetInstantiation (asset) {
    switch (asset.kind) {
      case Asset.KINDS.SKETCH:
        this.handleSketchInstantiation(asset)
        break
      case Asset.KINDS.VECTOR:
        this.handleFileInstantiation(asset)
        break
      case Asset.KINDS.COMPONENT:
        this.handleComponentInstantiation(asset)
        break
      default:
        this.props.createNotice({
          type: 'warning',
          title: 'Oops!',
          message: 'Couldn\'t handle that file, please contact support.'
        })
    }
  }

  handleAssetDeletion (asset) {
    this.setState({isLoading: true})
    return this.props.projectModel.unlinkAsset(
      asset.getRelpath(),
      (error, assets) => {
        if (error) {
          return this.setState({error, isLoading: false})
        }

        this.handleAssetsChanged(assets, {isLoading: false})
      }
    )
  }

  handleFileDrop (files, event) {
    this.setState({isLoading: true})
    const filePaths = lodash.map(files, file => file.path)
    this.props.projectModel.bulkLinkAssets(
      filePaths,
      (error, assets) => {
        if (error) {
          return this.setState({error, isLoading: false})
        }

        this.handleAssetsChanged(assets, {isLoading: false})
      }
    )
  }

  render () {
    return (
      <div
        id='library-wrapper'
        style={{height: '100%'}}>
        <div
          id='library-scroll-wrap'
          style={STYLES.sectionHeader}>
          Library
          <FileImporter
            user={this.props.user}
            onImportFigmaAsset={this.importFigmaAsset}
            onAskForFigmaAuth={this.askForFigmaAuth}
            figma={this.state.figma}
            onFileDrop={(files, fileDropEvent) => {this.handleFileDrop(files, fileDropEvent)}}
          />
        </div>
        <div
          id='library-scroll-wrap'
          style={STYLES.scrollwrap}>
          <div style={STYLES.assetsWrapper}>
            {this.state.isLoading
              ? <Loader />
              : <AssetList
                projectModel={this.props.projectModel}
                onDragStart={this.props.onDragStart}
                onDragEnd={this.props.onDragEnd}
                instantiateAsset={this.handleAssetInstantiation}
                onRefreshFigmaAsset={this.importFigmaAsset}
                deleteAsset={this.handleAssetDeletion}
                indent={0}
                assets={this.state.assets} />}
          </div>
        </div>
        {
          this.state.sketchDownloader.isVisible &&
          this.state.sketchDownloader.shouldAskForSketch && (
            <SketchDownloader
              onDownloadComplete={this.onSketchDownloadComplete.bind(this)}
              onDismiss={this.onSketchDialogDismiss.bind(this)}
            />
          )
        }
      </div>
    )
  }
}

Library.propTypes = {
  projectModel: React.PropTypes.object.isRequired
}

export default Radium(Library)
