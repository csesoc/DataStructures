#ifndef TREE
#define TREE
#include <stdbool.h> 

// Struct definition
struct treeNode {
    int value;
    struct treeNode *left;
    struct treeNode *right;
};
typedef struct treeNode TreeNode;

// Tutorial functions
int printHeightDiff(TreeNode *root);
int isHeightBalanced(TreeNode *root);

// Main operations
TreeNode *newNode(int value);                             // COMMANDS:
TreeNode *insert(TreeNode *root, int value);              // insert
void printInOrder(TreeNode *root);                        // inorder
void printPreOrder(TreeNode *root);                       // preorder
void printPostOrder(TreeNode *root);                      // postorder
void printLevelOrder(TreeNode *root);                     // levelorder
void printGivenLevel(TreeNode *root, int level);          // level
bool existsInTree(TreeNode *root, int targetValue);       // exists
int getNumNodes(TreeNode *root);                          // count
int getTreeHeight(TreeNode *root);                        // height
int getNodeDepth(TreeNode *root, int targetValue);        // depth
TreeNode *leftRotate(TreeNode *root, int targetValue);    // left
TreeNode *rightRotate(TreeNode *root, int targetValue);   // right
TreeNode *delete(TreeNode *root, int targetValue);        // delete
TreeNode *getMinNode(TreeNode *root);                     //
void freeTree(TreeNode *root);                            // clear

// Helper functions
static int max(int a, int b);

#endif
