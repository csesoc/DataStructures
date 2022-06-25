import { SVG } from '@svgdotjs/svg.js';
import { Documentation } from './typedefs';
import { CODE_CANVAS, VISUALISER_CANVAS } from './constants';

abstract class GraphicalDataStructure {
  public constructor() {
    SVG(VISUALISER_CANVAS).clear();
    SVG(CODE_CANVAS).clear();
  }

  public abstract get documentation(): Documentation;
}

export default GraphicalDataStructure;
