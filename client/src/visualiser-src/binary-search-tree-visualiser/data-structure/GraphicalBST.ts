import { SVG, Container } from '@svgdotjs/svg.js';
import BSTInsertAnimationProducer from '../animation-producer/BSTInsertAnimationProducer';
import BSTRotateAnimationProducer from '../animation-producer/BSTRotateAnimationProducer';
import BSTTraverseAnimationProducer from '../animation-producer/BSTTraverseAnimationProducer';
import { Node } from '../util/typedefs';
import { canvasPadding } from '../util/settings';

// used for the actual implementation of the bst
class BST {
  public root: Node = null;

  public draw: Container = SVG().addTo('#bst-canvas').size('100%', '100%');

  // inserts a node into the bst and produces an animation sequence
  // that is later handled by the animation controller
  public insert(input: number): BSTInsertAnimationProducer {
    const animationProducer: BSTInsertAnimationProducer = new BSTInsertAnimationProducer(this.draw);
    const node: Node = {
      nodeTarget: null,
      textTarget: null,
      leftLineTarget: null,
      rightLineTarget: null,
      left: null,
      right: null,
      value: input,
      x: 0,
      y: 0,
    };

    animationProducer.resetBST(this.root);

    if (this.root == null) {
      this.root = node;
      this.updateNodePositions();
      animationProducer.createNode(node);
    } else {
      let currentNode: Node = this.root;

      while (currentNode) {
        animationProducer.flashNode(currentNode);

        if (node.value < currentNode.value) {
          if (currentNode.left == null) {
            currentNode.left = node;
            this.updateNodePositions();
            animationProducer.createNodeLeft(node, currentNode);

            return animationProducer;
          }

          currentNode = currentNode.left;
        } else {
          if (currentNode.right == null) {
            currentNode.right = node;
            this.updateNodePositions();
            animationProducer.createNodeRight(node, currentNode);

            return animationProducer;
          }

          currentNode = currentNode.right;
        }
      }
    }
    return animationProducer;
  }

  // use this method after doing bst operations to update
  // x and y coordinates
  public updateNodePositions(): void {
    const canvasWidth = document.getElementById('bst-canvas').offsetWidth;

    const low: number = 0;
    const high: number = Number(canvasWidth);
    const mid: number = (low + high) / 2;
    this.updateNodePositionsRecursive(this.root, low, high, mid, canvasPadding);
  }

  public updateNodePositionsRecursive(
    node: Node,
    low: number,
    high: number,
    mid: number,
    y: number
  ): void {
    if (node === null) {
      return;
    }

    node.x = mid;
    node.y = y;

    this.updateNodePositionsRecursive(node.left, low, mid, (low + mid) / 2, y + 75);
    this.updateNodePositionsRecursive(node.right, mid, high, (mid + high) / 2, y + 75);
  }

  // returns a node corresponding to the input
  public getNode(input: number): Node {
    // handle edgecase where no nodes are present
    if (this.root === null) return null;

    return this.getNodeRecursive(input, this.root);
  }

  // TODO: remove this
  public getNodeRecursive(input: number, node: Node): Node {
    if (input === node.value) {
      return node;
    }
    if (input < node.value) {
      return this.getNodeRecursive(input, node.left);
    }
    return this.getNodeRecursive(input, node.right);
  }

  public rotateLeft(input: number): BSTRotateAnimationProducer {
    const animationProducer: BSTRotateAnimationProducer = new BSTRotateAnimationProducer(this.draw);
    const oldRoot: Node = this.getNode(input);

    if (oldRoot === null) return animationProducer;

    const newRoot: Node = oldRoot.right;

    if (newRoot === null) return animationProducer;

    animationProducer.resetBST(this.root);

    if (newRoot.left != null) {
      animationProducer.movePointerToNewRootLeftChild(oldRoot, newRoot);
      animationProducer.moveLeftPointerToOldRoot(oldRoot, newRoot);
    } else {
      BSTRotateAnimationProducer.assignNewRootLeftPointerToOldRootRightPointer(oldRoot, newRoot);
    }

    this.root = this.doRotateLeft(this.root, input);
    this.updateNodePositions();
    animationProducer.updateBST(this.root);

    return animationProducer;
  }

  public doRotateLeft(node: Node, input: number): Node {
    if (input === node.value) {
      const newRoot: Node = node.right;
      node.right = newRoot.left;
      newRoot.left = node;

      return newRoot;
    }
    if (input < node.value) {
      node.left = this.doRotateLeft(node.left, input);
    } else {
      node.right = this.doRotateLeft(node.right, input);
    }

    return node;
  }

  public rotateRight(input: number): BSTRotateAnimationProducer {
    const animationProducer: BSTRotateAnimationProducer = new BSTRotateAnimationProducer(this.draw);
    const oldRoot: Node = this.getNode(input);

    if (oldRoot === null) return animationProducer;

    const newRoot: Node = oldRoot.left;

    if (newRoot === null) return animationProducer;

    animationProducer.resetBST(this.root);

    if (newRoot.right != null) {
      animationProducer.movePointerToNewRootRightChild(oldRoot, newRoot);
      animationProducer.moveRightPointerToOldRoot(oldRoot, newRoot);
    } else {
      BSTRotateAnimationProducer.assignNewRootRightPointerToOldRootLeftPointer(oldRoot, newRoot);
    }

    this.root = this.doRotateRight(this.root, input);
    this.updateNodePositions();
    animationProducer.updateBST(this.root);

    return animationProducer;
  }

  public doRotateRight(node: Node, input: number): Node {
    if (input === node.value) {
      const newRoot: Node = node.left;
      node.left = newRoot.right;
      newRoot.right = node;

      return newRoot;
    }
    if (input < node.value) {
      node.left = this.doRotateRight(node.left, input);
    } else {
      node.right = this.doRotateRight(node.right, input);
    }

    return node;
  }

  public inorderTraversal(): BSTTraverseAnimationProducer {
    const animationProducer: BSTTraverseAnimationProducer = new BSTTraverseAnimationProducer(
      this.draw
    );
    animationProducer.resetBST(this.root);
    this.doInorderTraversal(this.root, animationProducer);

    return animationProducer;
  }

  public doInorderTraversal(node: Node, animationProducer: BSTTraverseAnimationProducer) {
    if (node === null) {
      return;
    }

    animationProducer.halfHighlightNode(node);
    animationProducer.highlightLine(node.leftLineTarget);
    this.doInorderTraversal(node.left, animationProducer);
    animationProducer.highlightNode(node);
    animationProducer.highlightLine(node.rightLineTarget);
    this.doInorderTraversal(node.right, animationProducer);
  }

  public preorderTraversal(): BSTTraverseAnimationProducer {
    const animationProducer: BSTTraverseAnimationProducer = new BSTTraverseAnimationProducer(
      this.draw
    );
    animationProducer.resetBST(this.root);
    this.doPreorderTraversal(this.root, animationProducer);

    return animationProducer;
  }

  public doPreorderTraversal(node: Node, animationProducer: BSTTraverseAnimationProducer) {
    if (node === null) {
      return;
    }

    animationProducer.highlightNode(node);
    animationProducer.highlightLine(node.leftLineTarget);
    this.doPreorderTraversal(node.left, animationProducer);
    animationProducer.highlightLine(node.rightLineTarget);
    this.doPreorderTraversal(node.right, animationProducer);
  }

  public postorderTraversal(): BSTTraverseAnimationProducer {
    const animationProducer: BSTTraverseAnimationProducer = new BSTTraverseAnimationProducer(
      this.draw
    );
    animationProducer.resetBST(this.root);
    this.doPostorderTraversal(this.root, animationProducer);

    return animationProducer;
  }

  public doPostorderTraversal(node: Node, animationProducer: BSTTraverseAnimationProducer) {
    if (node === null) {
      return;
    }

    animationProducer.halfHighlightNode(node);
    animationProducer.highlightLine(node.leftLineTarget);
    this.doPostorderTraversal(node.left, animationProducer);
    animationProducer.highlightLine(node.rightLineTarget);
    this.doPostorderTraversal(node.right, animationProducer);
    animationProducer.highlightNode(node);
  }
}

export default BST;
