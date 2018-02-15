import Palette from 'haiku-ui-common/lib/Palette'
import Color from 'color'

export const DASH_STYLES = {
  upcase: {
    textTransform: 'uppercase'
  },
  dashWrap: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: Palette.GRAY
  },
  frame: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 36,
    padding: '6px 25px',
    zIndex: 1,
    backgroundColor: Palette.COAL,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    color: Palette.ROCK
  },
  bannerNotice: {
    marginRight: 14,
    border: '1px solid' + Palette.BLUE,
    borderRadius: 3,
    padding: '0 8px',
    fontStyle: 'italic',
    color: Palette.LIGHT_BLUE
  },
  tooltip: {
    backgroundColor: Palette.LIGHT_PINK,
    color: Palette.ROCK,
    position: 'absolute',
    right: '-132px',
    padding: '7px 16px',
    fontSize: 13,
    borderRadius: 4
  },
  arrowLeft: {
    width: 0,
    height: 0,
    position: 'absolute',
    left: -10,
    borderTop: '10px solid transparent',
    borderBottom: '10px solid transparent',
    borderRight: '10px solid ' + Palette.LIGHT_PINK
  },
  projectsWrapper: {
    position: 'absolute',
    overflow: 'auto',
    display: 'flex',
    justifyContent: 'space-around',
    alignContent: 'flex-start',
    flexWrap: 'wrap',
    marginTop: 36,
    width: '100%',
    height: '100%',
    paddingLeft: 50,
    paddingRight: 50,
    transition: 'filter 140ms'
  },
  dontAtMe: {
    visibility: 'hidden',
    height: 0
  },
  card: {
    position: 'relative',
    flex: '1 1 240px',
    minWidth: 200,
    height: 220,
    marginLeft: 25,
    marginRight: 25,
    marginTop: 50,
    cursor: 'pointer',
    overflow: 'hidden',
    WebkitUserSelect: 'none',
    filter: 'blur(0px)',
    backgroundColor: Palette.COAL,
    backgroundImage: `linear-gradient(45deg, ${Palette.FATHER_COAL} 25%, transparent 25%, transparent 75%, ${Palette.FATHER_COAL} 75%, ${Palette.FATHER_COAL}), linear-gradient(45deg, ${Palette.FATHER_COAL} 25%, transparent 25%, transparent 75%, ${Palette.FATHER_COAL} 75%, ${Palette.FATHER_COAL})`,
    backgroundSize: '10px 10px',
    backgroundPosition: '0 0, 5px 5px',
    boxShadow: '0 10px 40px 0 rgba(21,32,34,0.39)',
    borderRadius: 5,
    transform: 'scale(1)',
    transition: 'all 200ms ease',
    ':hover': {
      boxShadow: '0 10px 40px 0 rgba(21,32,34,0.69)'
    }
  },
  deleted: {
    transform: 'scale(.00001)',
    flex: '.00001',
    minWidth: '0',
    marginLeft: 0,
    marginRight: 0
  },
  thumb: {
    height: 190,
    overflow: 'hidden',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    transform: 'translate3d(0,0,0)',
    transition: 'transform 140ms ease',
    margin: 0,
    width: '100%'
  },
  blurred: {
    filter: 'blur(13px)',
    transform: 'translate3d(0,0,0)'
  },
  scrim: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    top: 0,
    left: 0,
    width: '100%',
    height: 190,
    opacity: 0,
    color: Palette.SUNSTONE,
    backgroundColor: Color(Palette.FATHER_COAL).fade(0.4),
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5
  },
  menuOption: {
    opacity: 0.84,
    display: 'block',
    transform: 'translateY(0px)',
    transition: 'opacity 120ms ease, transform 390ms cubic-bezier(.35,.44,0,1.3)',
    pointerEvents: 'auto',
    ':hover': {
      opacity: 1
    }
  },
  opt2: {
    transition: 'opacity 120ms 62ms ease, transform 390ms 62ms cubic-bezier(.35,.44,0,1.3)'
  },
  opt3: {
    transition: 'opacity 120ms 124ms ease, transform 390ms 124ms cubic-bezier(.35,.44,0,1.3)'
  },
  gone: {
    opacity: 0,
    pointerEvents: 'none',
    transform: 'translateY(20px)'
  },
  single: {
    position: 'absolute',
    top: 83,
    left: '50%',
    transform: 'translateY(0px) translateX(-50%)'
  },
  gone2: {
    transform: 'translateY(15px) translateX(-50%)',
    transition: 'none'
  },
  titleStrip: {
    height: 30,
    backgroundColor: Palette.COAL,
    color: Palette.SUNSTONE,
    fontWeight: 500,
    fontSize: 13,
    paddingLeft: 13,
    paddingRight: 8,
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5
  },
  title: {
    marginRight: 'auto'
  },
  titleOptions: {
    paddingLeft: 5,
    paddingRight: 5,
    opacity: 0.84,
    transition: 'opacity 120ms ease',
    ':hover': {
      opacity: 1
    }
  },
  loadingWrap: {
    height: 'calc(100% - 36px)',
    marginTop: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  activeTitle: {
    opacity: 1
  },
  fieldDialogue: {
    width: 364,
    minHeight: 100,
    position: 'absolute',
    bottom: 'calc(-100% - 21px)',
    left: 'calc(50% - 177px)',
    boxShadow: '0 15px 24px 0 rgba(0,0,0,0.21)',
    borderRadius: 4,
    backgroundColor: Palette.COAL,
    padding: '17px 26px',
    fontSize: 16,
    transform: 'translateY(-25px)',
    opacity: 0,
    pointerEvents: 'none',
    transition: 'all 300ms cubic-bezier(0.51, 0.55, 0.17, 1.55)'
  },
  fieldDialogueActive: {
    opacity: 1,
    transform: 'translateY(0)',
    pointerEvents: 'auto'
  },
  arrowTop: {
    width: 0,
    height: 0,
    position: 'absolute',
    top: -10,
    left: '50%',
    transform: 'translateX(-50%)',
    borderLeft: '10px solid transparent',
    borderRight: '10px solid transparent',
    borderBottom: '10px solid ' + Palette.COAL
  },
  emptyState: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: 490,
    fontSize: 40,
    color: Color(Palette.FATHER_COAL).darken(0.2),
    textAlign: 'center'
  },
  noSelect: {
    WebkitUserSelect: 'none',
    cursor: 'default'
  },
  popover: {
    container: {
      position: 'absolute',
      listStyle: 'none',
      padding: '15px 18px 5px',
      margin: '0',
      backgroundColor: Palette.FATHER_COAL,
      minWidth: '150px',
      borderRadius: '3px',
      right: -26,
      top: 26,
      boxShadow: '0 5px 20px 0 rgba(21,32,34,0.59)'
    },
    item: {
      display: 'flex',
      textAlign: 'left',
      justifyContent: 'left',
      marginBottom: '10px',
      color: Palette.ROCK
    },
    icon: {
      width: '16px',
      display: 'inline-block',
      textAlign: 'center',
      marginRight: 8,
      marginTop: 1
    },
    text: {
      display: 'inline-block',
      WebkitUserSelect: 'none'
    },
    pointer: {
      cursor: 'pointer',
      color: Palette.SUNSTONE
    },
    mini: {
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: 11,
      marginTop: 14,
      marginBottom: 5
    }
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 100,
    width: '100%',
    height: '100%'
  },
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    zIndex: 100,
    width: 600,
    minHeight: 231,
    borderRadius: 8,
    padding: '30px 40px 20px',
    backgroundColor: Palette.COAL,
    transform: 'translate(-50%, -50%)',
    boxShadow: '0 12px 60px 0 rgba(21,32,34,0.9)'
  },
  modalTitle: {
    color: Palette.SUNSTONE,
    fontSize: 16,
    marginBottom: 12
  },
  inputTitle: {
    color: Palette.ROCK,
    fontSize: 12,
    marginBottom: 4
  },
  newProjectInput: {
    backgroundColor: Color(Palette.COAL).darken(0.3),
    width: '100%',
    height: 53,
    color: Palette.SUNSTONE,
    padding: 20,
    borderRadius: 5,
    fontSize: 15,
    marginBottom: 42
  },
  newProjectError: {
    display: 'block',
    float: 'left',
    marginTop: 4
  },
  projToDelete: {
    color: Palette.LIGHT_BLUE,
    fontStyle: 'italic'
  },
  link: {
    color: Palette.LIGHTEST_PINK,
    textDecoration: 'underline',
    cursor: 'pointer',
    display: 'inline-block'
  }
}
