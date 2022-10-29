import { strokeWidth } from '../../common/constants';

export const whitespace = 10;
export const topOffset = 60;
export const boxWidth = 50;
export const textCy = 360;
export const leftOffset = 20;

export const defaultColour = '#000000';
export const sortedColour = '#39AF8E';
export const checkingColour = '#FFBC53';
export const comparingColor = '#FFBC53';
export const selectedColor = '#33cccc';

export const CANVAS = '#canvas';

export const shapeAttributes = {
  'stroke-width': strokeWidth,
  stroke: 'black',
  fill: 'black',
  opacity: 0,
};

export const textAttributes = {
  x: boxWidth / 2,
  y: topOffset,
  'dominant-baseline': 'middle',
  'text-anchor': 'middle',
  'stroke-width': 0,
  'font-family': 'CodeText',
  opacity: 0,
};
