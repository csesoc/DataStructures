import { Line, Marker } from '@svgdotjs/svg.js';
import { Node } from '../util/typedefs';
import { lineDiffY, canvasPadding } from '../util/settings';
import { getPointerStartEndCoordinates } from '../../common/helpers';
import AnimationProducer from '../../common/AnimationProducer';

export default class BSTAnimationProducer extends AnimationProducer {
  public halfHighlightNode(node: Node): void {
    this.addSequenceAnimation(
      node.nodeTarget.animate(500).attr({
        stroke: '#4beb9b',
      })
    );

    this.addSequenceAnimation(
      node.textTarget.animate(500).attr({
        fill: '#4beb9b',
      })
    );
  }

  public highlightLine(lineTarget: Line, arrowTarget: Marker): void {
    if (lineTarget != null) {
      this.addSequenceAnimation(
        lineTarget.animate(500).attr({
          stroke: '#4beb9b',
        })
      );

      this.addSequenceAnimation(
        arrowTarget.animate(500).attr({
          fill: '#4beb9b',
        })
      );
    }
  }

  public updateBST(root: Node): void {
    this.updateNodesRecursive(root);
    this.updateLinesRecursive(root);
  }

  public updateNodesRecursive(node: Node): void {
    if (node === null) {
      return;
    }

    this.updateNode(node, node.x, node.y);
    this.updateNodesRecursive(node.left);
    this.updateNodesRecursive(node.right);
  }

  public updateNode(node: Node, newX: number, newY: number): void {
    this.addSequenceAnimation(node.nodeTarget.animate(400).cx(newX).cy(newY));

    this.addSequenceAnimation(node.textTarget.animate(400).cx(newX).cy(newY));
  }

  public updateLinesRecursive(node: Node): void {
    if (node === null) {
      return;
    }

    this.updateNodeLines(node);
    this.updateLinesRecursive(node.left);
    this.updateLinesRecursive(node.right);
  }

  public updateNodeLines(node: Node): void {
    const lineDiffX = BSTAnimationProducer.getLineDiffX(node);

    this.addSequenceAnimation(
      node.leftLineTarget
        .animate(400)
        .plot(getPointerStartEndCoordinates(node.x, node.y, node.x - lineDiffX, node.y + lineDiffY))
    );

    this.addSequenceAnimation(
      node.rightLineTarget
        .animate(400)
        .plot(getPointerStartEndCoordinates(node.x, node.y, node.x + lineDiffX, node.y + lineDiffY))
    );
  }

  // returns the difference in x coordinates with the node
  // and it's two child nodes
  public static getLineDiffX(node: Node): number {
    const canvasWidth = document.getElementById('visualiser-container').offsetWidth;
    const depth: number = (node.y - canvasPadding) / 75;
    const baseDiff = canvasWidth / 4;

    return baseDiff / 2 ** depth;
  }

  public unhighlightBST(root: Node): void {
    this.unhighlightLinesRecursive(root);
    this.unhighlightNodesRecursive(root);
  }

  public unhighlightLinesRecursive(node: Node): void {
    if (node === null) {
      return;
    }

    this.unhighlightLine(node.leftLineTarget, node.leftArrowTarget);
    this.unhighlightLine(node.rightLineTarget, node.rightArrowTarget);
    this.unhighlightLinesRecursive(node.left);
    this.unhighlightLinesRecursive(node.right);
  }

  public unhighlightLine(lineTarget: Line, arrowTarget: Marker): void {
    if (lineTarget != null) {
      this.addSequenceAnimation(
        lineTarget.animate(500).attr({
          stroke: '#000000',
        })
      );

      this.addSequenceAnimation(
        arrowTarget.animate(500).attr({
          fill: '#000000',
        })
      );
    }
  }

  public unhighlightNodesRecursive(node: Node): void {
    if (node === null) {
      return;
    }

    this.unhighlightNode(node);
    this.unhighlightNodesRecursive(node.left);
    this.unhighlightNodesRecursive(node.right);
  }

  public updateAndUnhighlightBST(root: Node): void {
    this.updateNodesRecursive(root);
    this.updateLinesRecursive(root);
    this.unhighlightLinesRecursive(root);
    this.unhighlightNodesRecursive(root);
  }

  public unhighlightNode(node: Node): void {
    this.addSequenceAnimation(
      node.nodeTarget.animate(500).attr({
        fill: '#ffffff',
        stroke: '#000000',
      })
    );

    this.addSequenceAnimation(
      node.textTarget.animate(500).attr({
        fill: '#000000',
      })
    );
  }

  public movePointerToNewRootRightChild(oldRoot: Node, newRoot: Node): void {
    this.addSequenceAnimation(
      oldRoot.leftLineTarget
        .animate(400)
        .plot(getPointerStartEndCoordinates(oldRoot.x, oldRoot.y, newRoot.right.x, newRoot.right.y))
    );
  }

  public movePointerToNewRootLeftChild(oldRoot: Node, newRoot: Node): void {
    this.addSequenceAnimation(
      oldRoot.rightLineTarget
        .animate(400)
        .plot(getPointerStartEndCoordinates(oldRoot.x, oldRoot.y, newRoot.left.x, newRoot.left.y))
    );
  }

  public moveRightPointerToOldRoot(oldRoot: Node, newRoot: Node): void {
    this.addSequenceAnimation(
      newRoot.rightLineTarget
        .animate(400)
        .plot(getPointerStartEndCoordinates(newRoot.x, newRoot.y, oldRoot.x, oldRoot.y))
    );
  }

  public moveLeftPointerToOldRoot(oldRoot: Node, newRoot: Node): void {
    this.addSequenceAnimation(
      newRoot.leftLineTarget
        .animate(400)
        .plot(getPointerStartEndCoordinates(newRoot.x, newRoot.y, oldRoot.x, oldRoot.y))
    );
  }

  public hideLine(line: Line): void {
    this.addSequenceAnimation(
      line.animate(400).attr({
        opacity: 0,
      })
    );
  }

  public showLine(line: Line): void {
    this.addSequenceAnimation(
      line.animate(400).attr({
        opacity: 1,
      })
    );
  }

  public assignNewRootRightPointerToOldRoot(oldRoot: Node, newRoot: Node): void {
    this.addSequenceAnimation(
      newRoot.rightLineTarget
        .animate(1)
        .plot(getPointerStartEndCoordinates(newRoot.x, newRoot.y, oldRoot.x, oldRoot.y))
    );
    this.finishSequence(false);
    this.showLine(newRoot.rightLineTarget);
  }

  public assignNewRootLeftPointerToOldRoot(oldRoot: Node, newRoot: Node): void {
    this.addSequenceAnimation(
      newRoot.leftLineTarget
        .animate(1)
        .plot(getPointerStartEndCoordinates(newRoot.x, newRoot.y, oldRoot.x, oldRoot.y))
    );
    this.finishSequence(false);
    this.showLine(newRoot.leftLineTarget);
  }
}
