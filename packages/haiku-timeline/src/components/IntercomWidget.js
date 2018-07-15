import * as React from 'react';
import Palette from 'haiku-ui-common/lib/Palette';
import * as Radium from 'radium';
import * as Intercom from 'react-intercom';

const STYLES = {
  btn: {
    position: 'absolute',
    right: 5,
    top: -12,
    height: '25px',
    padding: '4px 9px',
    fontSize: 11,
    letterSpacing: '1.3px',
    marginRight: '5px',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '3px',
    color: Palette.ROCK,
    transform: 'scale(1)',
    cursor: 'pointer',
    transition: 'transform 200ms ease, border-color 200ms ease',
    backgroundColor: Palette.FATHER_COAL,
    ':active': {
      transform: 'scale(.9)',
    },
    ':hover': {
      color: Palette.ROCK,
    },
  },
};

class IntercomWidget extends React.Component {
  render () {
    if (!this.props.user) {
      return <span />;
    }

   /* NOTE: currently "Username" is an email address for all users
    We'll need to update this code when we allow users to
    choose usernames */
    const user = {
      email: JSON.parse(this.props.user).Username,
    };

    return (
      <span id="launch-intercom"
        style={STYLES.btn}>
        <Intercom
          appID="xlfy6shk"
          hide_default_launcher={true}
          custom_launcher_selector="#launch-intercom"
          {...user} />
        <svg width="14px" height="12px" style={{marginRight: 6}} viewBox="0 0 14 12" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <g id="bubbles" fill="#F9FFFF" fillRule="nonzero">
            <path d="M13.6507,11.3333333 C13.6507,11.3333333 13.6507,11.3333333 13.65,11.3333333 C12.7113,11.3333333 11.7362,10.7626667 11.3771,10.5293333 C10.983,10.62 10.5714,10.6666667 10.15,10.6666667 C9.1441,10.6666667 8.1935,10.4026667 7.4746,9.92266667 C6.7172,9.418 6.3,8.73466667 6.3,8 C6.3,7.26533333 6.7172,6.582 7.4746,6.07733333 C8.1942,5.598 9.1441,5.33333333 10.15,5.33333333 C11.1559,5.33333333 12.1065,5.59733333 12.8254,6.07733333 C13.5828,6.582 14,7.26533333 14,8 C14,8.64266667 13.6773,9.25133333 13.0858,9.73133333 C13.1432,9.88533333 13.3231,10.216 13.8873,10.7546667 C13.9566,10.8153333 14,10.9026667 14,11 C14,11.184 13.8432,11.3333333 13.65,11.3333333 L13.6507,11.3333333 Z M11.4471,9.83466667 C11.5227,9.83466667 11.5969,9.858 11.6585,9.902 C11.6655,9.90666667 12.131,10.238 12.7106,10.4633333 C12.3298,9.93333333 12.3396,9.63133333 12.3739,9.50466667 C12.3942,9.432 12.439,9.368 12.502,9.32266667 C13.0165,8.95466667 13.2993,8.48533333 13.2993,8 C13.2993,7.48866667 12.9885,7 12.4236,6.62333333 C11.8209,6.22133333 11.0131,6 10.1493,6 C9.2855,6 8.4777,6.22133333 7.875,6.62333333 C7.3101,7 6.9993,7.48866667 6.9993,8 C6.9993,8.51133333 7.3101,9 7.875,9.37666667 C8.4777,9.77866667 9.2855,10 10.1493,10 C10.5658,10 10.9704,9.94866667 11.3519,9.84666667 C11.3827,9.83866667 11.4149,9.83466667 11.4464,9.83466667 L11.4471,9.83466667 Z" />
            <path d="M0.35,12 C0.1925,12 0.0546,11.9 0.0126,11.7553333 C-0.0294,11.6106667 0.035,11.4573333 0.1701,11.3806667 C1.3538,10.7046667 1.8445,9.72133333 2.0188,9.26133333 C0.7322,8.32333333 -5.00277987e-16,7.02533333 -5.00277987e-16,5.66666667 C-5.00277987e-16,4.98066667 0.1806,4.316 0.5376,3.69066667 C0.8778,3.09466667 1.3636,2.56066667 1.9803,2.10333333 C3.2312,1.17666667 4.8895,0.666 6.65,0.666 C8.2446,0.666 9.7867,1.09533333 10.9914,1.87533333 C12.2059,2.66133333 13.0011,3.74933333 13.2307,4.93866667 C13.2657,5.12 13.1397,5.29333333 12.95,5.32666667 C12.7603,5.36 12.5776,5.24 12.5426,5.05933333 C12.3473,4.04666667 11.6564,3.112 10.598,2.42666667 C9.5081,1.72133333 8.106,1.33266667 6.65,1.33266667 C3.3691,1.33266667 0.7,3.27666667 0.7,5.666 C0.7,6.876 1.4035,8.04066667 2.6292,8.86066667 C2.7496,8.94133333 2.8042,9.08466667 2.7664,9.22 C2.6845,9.51066667 2.4059,10.3086667 1.6604,11.0786667 C2.5718,10.7746667 3.5532,10.2473333 4.2777,9.77266667 C4.3638,9.716 4.4716,9.69933333 4.5724,9.72666667 C5.236,9.90733333 5.9353,9.99933333 6.65,9.99933333 C6.8432,9.99933333 7,10.1486667 7,10.3326667 C7,10.5166667 6.8432,10.666 6.65,10.666 C5.9269,10.666 5.2171,10.58 4.5388,10.4093333 C4.2385,10.6 3.6771,10.938 3.0065,11.256 C1.9649,11.7493333 1.0717,11.9993333 0.3507,11.9993333 L0.35,12 Z" />
          </g>
        </svg>
        SUPPORT
      </span>
    );
  }
}

export default Radium(IntercomWidget);

IntercomWidget.propTypes = {
  user: React.PropTypes.string,
};
