import React from 'react';

/* -------------------------------------------------------------------------- */
/*                        Visualiser-Specific Canvases                        */
/* -------------------------------------------------------------------------- */

/**
 * The React component that renders the DOM elements that the visualiser
 * attaches itself to.
 */
const VisualiserCanvas: React.FC = () => (
    <div
      id="visualiser-container"
      style={{ position: 'relative', height: '100%', width: '100%', background: 'rgba(235, 235, 235)'}}
    >
      <svg id="visualiser-canvas" />
    </div>
  );

export default VisualiserCanvas;
