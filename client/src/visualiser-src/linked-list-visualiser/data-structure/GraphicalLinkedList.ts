import AnimationProducer from 'visualiser-src/common/AnimationProducer';
import { SVG, Path, Container } from '@svgdotjs/svg.js';
import { CURRENT, PREV } from '../util/constants';
import GraphicalLinkedListNode from './GraphicalLinkedListNode';
import LinkedListAppendAnimationProducer from '../animation-producer/LinkedListAppendAnimationProducer';
import LinkedListDeleteAnimationProducer from '../animation-producer/LinkedListDeleteAnimationProducer';
import LinkedListInsertAnimationProducer from '../animation-producer/LinkedListInsertAnimationProducer';
import LinkedListSearchAnimationProducer from '../animation-producer/LinkedListSearchAnimationProducer';
import LinkedListPrependAnimationProducer from '../animation-producer/LinkedListPrependAnimationProducer';

// An linked list data structure containing all linked list operations.
// Every operation producers a LinkedListAnimationProducer, which an AnimationController
// can then use to place SVG.Runners on a timeline to animate the operation.
export default class GraphicalLinkedList {
  public headPointer: Path;

  public head: GraphicalLinkedListNode = null;

  public length: number = 0;

  constructor() {
    this.headPointer = GraphicalLinkedListNode.newHeadPointer();
  }

  append(input: number): AnimationProducer {
    this.length += 1;
    const producer = new LinkedListAppendAnimationProducer();
    producer.renderAppendCode();
    // Create new node
    const newNode = GraphicalLinkedListNode.from(input);
    producer.doAnimationAndHighlight(1, producer.addNodeAtEnd, this.length, newNode);

    // Account for case when list is empty
    if (this.head === null) {
      this.head = newNode;
      producer.doAnimationAndHighlight(3, producer.initialiseHead, this.headPointer);
      return producer;
    }

    // Initialise curr
    let curr: GraphicalLinkedListNode = this.head;
    producer.doAnimationAndHighlight(6, producer.initialisePointer, CURRENT);

    // Traverse to last node
    while (curr.next !== null) {
      curr = curr.next;
      producer.doAnimationAndHighlight(8, producer.movePointerToNext, CURRENT);
    }

    // Link last node to new node
    curr.next = newNode;
    producer.doAnimationAndHighlight(11, producer.linkLastToNew, curr);

    producer.doAnimation(producer.resetPointers);
    return producer;
  }

  prepend(input: number): AnimationProducer {
    this.length += 1;
    const producer = new LinkedListPrependAnimationProducer();
    producer.renderPrependCode();
    const newHead: GraphicalLinkedListNode = GraphicalLinkedListNode.from(input);
    producer.doAnimationAndHighlight(1, producer.createNodeAt, 0, newHead, this.length);
    if (this.head === null) {
      this.head = newHead;
      producer.doAnimationAndHighlight(2, producer.initialiseHead, this.headPointer);
    } else {
      newHead.next = this.head;
      producer.doAnimationAndHighlight(2, producer.newHeadPointToOldHead, newHead);
      this.head = newHead;
      producer.doAnimationAndHighlight(3, producer.pointHeadToPrependedNode, this.headPointer);
      producer.doAnimation(producer.resetPositioning, this.headPointer, this.head);
    }
    return producer;
  }

  delete(index: number): AnimationProducer {
    // Check index in range
    const producer = new LinkedListDeleteAnimationProducer();
    if (index < 0 || index > this.length - 1) return producer;
    producer.renderDeleteCode();
    this.length -= 1;

    // Look for node to delete
    let curr = this.head;
    producer.doAnimationAndHighlight(1, producer.initialisePointer, CURRENT);
    let prev = null;
    for (let i = 0; i < index; i += 1) {
      prev = curr;
      if (prev === this.head) {
        producer.doAnimationAndHighlight(5, producer.initialisePointer, PREV);
      } else {
        producer.doAnimationAndHighlight(5, producer.movePointerToNext, PREV);
      }
      curr = curr.next;
      producer.doAnimationAndHighlight(6, producer.movePointerToNext, CURRENT);
    }

    if (prev === null) {
      this.head = this.head.next;
      if (this.head === null) {
        producer.doAnimationAndHighlight(11, producer.setHeadToNull, this.headPointer);
      } else {
        producer.doAnimationAndHighlight(11, producer.pointHeadToNext, this.headPointer);
      }
    } else {
      prev.next = curr.next;
      if (prev.next === null) {
        producer.doAnimationAndHighlight(13, producer.setNextToNull, prev);
      } else {
        producer.doAnimationAndHighlight(13, producer.morphNextPointerToArc, prev);
      }
    }
    producer.doAnimationAndHighlight(15, producer.deleteNode, curr);
    producer.doAnimation(producer.resetList, this.headPointer, this.head);
    return producer;
  }

  search(value: number): AnimationProducer {
    const producer = new LinkedListSearchAnimationProducer();
    producer.renderSearchCode();
    if (this.head === null) {
      return producer;
    }
    let curr = this.head;
    producer.doAnimationAndHighlight(1, producer.initialisePointer, CURRENT);
    while (curr !== null && curr.value !== value) {
      producer.doAnimationAndHighlight(2, producer.indicateNotFound, curr);
      curr = curr.next;
      if (curr !== null) {
        producer.doAnimationAndHighlight(3, producer.movePointerToNext, CURRENT);
      }
    }
    if (curr !== null) {
      producer.doAnimationAndHighlight(2, producer.indicateFound, curr);
    }
    producer.doAnimationAndHighlight(5, producer.resetColor, this.head);
    return producer;
  }

  insert(value: number, index: number): AnimationProducer {
    this.length += 1;
    const producer: LinkedListInsertAnimationProducer = new LinkedListInsertAnimationProducer();
    producer.renderInsertCode();

    const newNode: GraphicalLinkedListNode = GraphicalLinkedListNode.from(value);
    producer.doAnimationAndHighlight(1, producer.createNodeAt, index, newNode, this.length);
    if (index === 0 && this.head !== null) {
      newNode.next = this.head;
      producer.doAnimationAndHighlight(3, producer.newHeadPointToOldHead, newNode);
      producer.doAnimationAndHighlight(7, producer.pointHeadToPrependedNode, this.headPointer);
      producer.doAnimation(producer.resetList, this.headPointer, this.head);
    } else if (this.head === null) {
      producer.doAnimationAndHighlight(7, producer.initialiseHead, this.headPointer);
    }

    if (index === 0 || this.head === null) {
      this.head = newNode;
      return producer;
    }

    let curr = this.head;
    producer.doAnimationAndHighlight(12, producer.initialisePointer, CURRENT);
    for (let i = 0; i < index - 1 && curr.next !== null; i += 1) {
      curr = curr.next;
      producer.doAnimationAndHighlight(15, producer.movePointerToNext, CURRENT);
    }
    newNode.next = curr.next;
    curr.next = newNode;
    if (index < this.length - 1) {
      producer.doAnimationAndHighlight(18, producer.insertedNodePointToNext, newNode);
      producer.doAnimationAndHighlight(19, producer.pointToInsertedNode, curr);
      producer.doAnimation(producer.resetList, this.headPointer, this.head);
    } else {
      producer.doAnimationAndHighlight(19, producer.linkLastToNew, curr);
      producer.doAnimation(producer.resetPointers);
    }
    return producer;
  }
}
