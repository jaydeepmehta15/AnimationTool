import * as React from 'react';
import Palette from './../../Palette';

export default ({color = Palette['SUNSTONE']}) => (
  <svg width="28" height="28" viewBox="0 0 20 20">
    <path d="M7.5 15h-1c-0.827 0-1.5-0.673-1.5-1.5v-6c0-0.827 0.673-1.5 1.5-1.5h1c0.827 0 1.5 0.673 1.5 1.5v6c0 0.827-0.673 1.5-1.5 1.5zM6.5 7c-0.276 0-0.5 0.224-0.5 0.5v6c0 0.276 0.224 0.5 0.5 0.5h1c0.276 0 0.5-0.224 0.5-0.5v-6c0-0.276-0.224-0.5-0.5-0.5h-1z" fill={color} />
    <path d="M12.5 15h-1c-0.827 0-1.5-0.673-1.5-1.5v-6c0-0.827 0.673-1.5 1.5-1.5h1c0.827 0 1.5 0.673 1.5 1.5v6c0 0.827-0.673 1.5-1.5 1.5zM11.5 7c-0.276 0-0.5 0.224-0.5 0.5v6c0 0.276 0.224 0.5 0.5 0.5h1c0.276 0 0.5-0.224 0.5-0.5v-6c0-0.276-0.224-0.5-0.5-0.5h-1z" fill={color} />
  </svg>
);