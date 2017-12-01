import Palette from '../components/Palette'
import Color from 'color'

export const DASH_STYLES = {
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
    color: Palette.ROCK,
  },
  btnNewProject: {
    borderRadius: '50%',
    backgroundColor: Palette.COAL,
    color: Palette.ROCK,
    width: 22,
    height: 22,
    marginTop: -1,
    ':hover': {
      backgroundColor: Palette.DARKER_GRAY
    }
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
    PaddingLeft: 50,
    PaddingRight: 50
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
    transition: 'box-shadow 277ms ease',
    ':hover': {
      boxShadow: '0 10px 40px 0 rgba(21,32,34,0.69)'
    }
  },
  thumb: {
    height: 190,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundColor: 'transparent',
    overflow: 'hidden',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    transform: 'translate3d(0,0,0)',
    transition: 'transform 140ms ease'
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
    height: '100%',
    width: '100%',
    height: 190,
    opacity: 0,
    color: Palette.SUNSTONE,
    backgroundColor: Color(Palette.FATHER_COAL).fade(.2),
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5
  },
  menuOption: {
    opacity: .84,
    display: 'block',
    transform: 'translateY(0px)',
    transition: 'opacity 120ms ease, transform 390ms cubic-bezier(.35,.44,0,1.3)',
    pointerEvents: 'auto',
    ':hover': {
      opacity: 1
    }
  },
  opt2: {
    transition: 'opacity 120ms 62ms ease, transform 390ms 62ms cubic-bezier(.35,.44,0,1.3)',
  },
  opt3: {
    transition: 'opacity 120ms 124ms ease, transform 390ms 124ms cubic-bezier(.35,.44,0,1.3)',
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
    transform: 'translateY(9px) translateX(-50%)',
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
    opacity: .84,
    transition: 'opacity 120ms ease',
    ':hover': {
      opacity: 1
    }
  },
  loadingWrap: {
    height: 'calc(100% - 113px)',
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
      listStyle: 'none',
      padding: '15px 15px 5px',
      margin: '0',
      backgroundColor: Palette.FATHER_COAL,
      minWidth: '150px',
      borderRadius: '3px'
    },
    item: {
      display: 'flex',
      textAlign: 'left',
      alignItems: 'center',
      marginBottom: '10px',
      color: Palette.ROCK
    },
    icon: {
      width: '16px',
      display: 'inline-block',
      textAlign: 'center'
    },
    text: {
      display: 'inline-block',
      marginLeft: '8px'
    }
  }
}
