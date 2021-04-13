#ifndef TREE
#define TREE
#include <stdbool.h> 

// Struct definition
struct treeNode {
    int value;
    int height;
    struct treeNode *left;
    struct treeNode *right;
};
typedef struct treeNode TreeNode;

// Main operations:                                       // COMMANDS:
TreeNode *insertAVL(TreeNode *root, int value);           // insert <values>
TreeNode *leftRotate(TreeNode *root, int targetValue);    // left
TreeNode *rightRotate(TreeNode *root, int targetValue);   // right
int getTreeHeight(TreeNode *root);                        // height
TreeNode *deleteAVL(TreeNode *root, int targetValue);     // delete
void freeTree(TreeNode *root);                            // clear

// Note: command 'balance' and 'heights' just tweak existing commands
// in tree-print.c 

// Helper functions                    
TreeNode *newNode(int value);                             
void adjustHeight(TreeNode *root);
TreeNode *rebalanceAVL(TreeNode *root);
TreeNode *getMinNode(TreeNode *root); 
int max(int a, int b);
int getHeight(TreeNode *root);
int maxHeight(TreeNode *a, TreeNode *b);

#endif
