#include <stdio.h>
#include <stdlib.h>
#include <assert.h>
#include <stdbool.h>
#include "heap.h"
#include "queue/queue.h"
#include "../util/display/display.h"

// ===== Heap Operations =====

/**
 * INSERT: insert <d>
 * Given a heap, inserts a new item into that heap into the correct
 * position.
 */
void insertHeap(Heap heap, Item newItem, int heapType) {
    if (heap -> numItems >= heap -> numSlots) {
        printColoured("red", "The heap is full! Dropping %d\n", newItem);
    } else {
        heap -> numItems++;
        int nextPosition = heap -> numItems;
        heap -> items[nextPosition] = newItem;
        bubbleUp(heap -> items, heap -> numItems, heapType);
    }
}

/**
 * POP: pop
 * Given a heap, returns the root and reorganises the heap to preserve
 * its top-down ordering
 */
Item popHeap(Heap heap, int heapType) {
    if (heap -> numItems <= 0) {
        return EMPTY;
    } 
    
    Item root = heap -> items[1];
    if (heap -> numItems == 1) {
        heap -> items[1] = EMPTY;
    } else {
        // Index 1 always contains the root element (highest priority element)
        Item lastElement = heap -> items[heap -> numItems];
        heap -> items[heap -> numItems] = EMPTY;
        // Replacing the root with the right-most node at the last level of the heap tree
        heap -> items[1] = lastElement;
        // Bubble the new root down to the correct position to restore the top-down ordering of the heap
        bubbleDown(heap -> items, heap -> numItems, heapType);
    }
    heap -> numItems--;
    return root;
}

/**
 * POP: pop
 * Given a heap, returns the root and reorganises the heap to preserve
 * its top-down ordering
 */
void printHeap(Heap heap) {
    for (int i = 0; i <= heap -> numSlots; i++) {
        if (heap -> items[i] != EMPTY) {
            printColoured("green", "%3d. %-3d ", i, heap -> items[i]);
            if (i * 2 + 1 <= heap -> numSlots && 
                heap -> items[i * 2] != EMPTY && 
                heap -> items[i * 2 + 1] != EMPTY) {
                printColoured("blue", "(left child: %d, right child: %d)\n", heap -> items[i * 2], heap -> items[i * 2 + 1]);
            } else if (i * 2 <= heap -> numSlots && 
                       heap -> items[i * 2] != EMPTY) {
                printColoured("blue", "(left child: %d)\n", heap -> items[i * 2]);
            } else if (i * 2 + 1 <= heap -> numSlots && 
                       heap -> items[i * 2 + 1] != EMPTY) {
                printColoured("blue", "(right child: %d)\n", heap -> items[i * 2 + 1]);
            } else {
                printf("\n");
            }
        } else {
            if (i == 0) {
                printColoured("green", "%3d. ", i);
                printColoured("red", "X\n");
            }
            else printColoured("green", "%3d. __\n", i);
        }
    }
    printColoured("cyan", "Number of items: %d\n", heap -> numItems);
}

/**
 * CLEAR: clear
 * Frees the memory associated with the heap
 */
void dropHeap(Heap heap) {
    free(heap -> items);
    free(heap);
}

// Note: the 'popall' command has no implementation. It's just a repeated call to popHeap

// ===== Other Helper Functions =====

/**
 * Create a new heap with the specified number of slots
 */
Heap newHeap(int size) {
    Heap heap = malloc(sizeof(struct HeapRep));
    // mallocate (size + 1) array slots since we index into the items array 
    // from indices 1 to numItems, not 0 to numItems-1
    Item *items = malloc(sizeof(Item) * (size + 1));
    for (int i = 0; i <= size; i++) items[i] = EMPTY;
    heap -> items = items;
    heap -> numItems = 0;
    heap -> numSlots = size;
    return heap;
}

/**
 * Returns true/false depending on whether the heap is empty or not
 */
bool heapIsEmpty(Heap heap) {
    return (heap -> numItems <= 0);
}

// Bubble up and bubble down helper functions. These for restoring the
// heap to correct order after insertion and deletion respectively

/**
 * Given an array of items and a target index, moves the target index up
 * into the correct position in the array
 */
void bubbleUp(Item *items, int i, int heapType) {
    switch (heapType) {
        case MAX_HEAP:
            while (i > 1 && items[i / 2] < items[i]) {
                // Bubble the current node to take the place of their parent
                swapPositions(items, i, i / 2);
                i = i / 2;
            }
            break;
        case MIN_HEAP:
            while (i > 1 && items[i / 2] > items[i]) {
                swapPositions(items, i, i / 2);
                i = i / 2;
            }
            break;
        default:
            break;
    }
}

/**
 * Given an array of items and a target index, moves the target index down
 * into the correct position in the array
 */
void bubbleDown(Item *a, int N, int heapType) {
    int i = 1;
    switch (heapType) {
        case MAX_HEAP:
            while (i * 2 <= N) {
                int j = 2 * i;
                // Choose either the left or right child, depending on who has the larger value
                if (j < N && a[j + 1] != EMPTY && a[j] < a[j + 1]) j++;
                if (!(a[i] < a[j]) || a[j] == EMPTY) break;
                // Swap positions to proceed one level down the heap tree
                swapPositions(a, i, j);
                i = j;
            }
            break;
        case MIN_HEAP:
            while (i * 2 <= N) {
                int j = 2 * i;
                // Choose either the left or right child, depending on who has the smaller value
                if (j < N && a[j + 1] != EMPTY && a[j + 1] < a[j]) j++;
                if (!(a[i] > a[j]) || a[j] == EMPTY) break;
                // Swap positions to proceed one level down the heap tree
                swapPositions(a, i, j);
                i = j;
            }
            break;
        default:
            break;
    }
    
}

/**
 * Given an array of items, swaps the position of the element at index
 * a and the element at index b.
 */
static void swapPositions(Item *items, int a, int b) {
    Item tmp = items[a];
    items[a] = items[b];
    items[b] = tmp;
}
