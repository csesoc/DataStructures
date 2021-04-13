#ifndef HASHTABLE
#define HASHTABLE

// Key and item definitions:
struct HashNode {
    char *zid;
    char *name;
};
typedef struct HashNode *Item;
typedef char *Key;

// Hash table struct definition
struct HashTableRep {
    // Array of HashNode pointers
    Item *items;    
    int numItems;
    int numSlots;
};
typedef struct HashTableRep *HashTable; 

// ===== Hash Table Operations =====

/**
 * INSERT: insert <key> value
 * Inserts a new item into the hashtable 
 */
void insertIntoHashTable(HashTable hashTable, Item newItem);

/**
 * SHOW: show
 * Prints the contents of the hash table's array
 */
void printHashTable(HashTable hashTable);

/**
 * GET: get <key>
 * Given the key, map the key to an index into the hash table and fetch
 * the entry that is associated with the key
 */
Item get(HashTable hashTable, Key key);

/**
 * DELETE: delete <key>
 * Deletes the entry associated with the given key from the hash table
 */
void deleteFromHashTable(HashTable hashTable, Key key);

/**
 * CLEAR: clear
 * Deallocates memory associated with the hash table
 */
void dropHashTable(HashTable hashTable);

// ===== Hash Table Helpers =====

/**
 * Mallocates and initialises a new empty hash table
 */
HashTable newHashTable(int size);

/**
 * HASH: hash <key>
 * Hash function that maps a given key string to an index into the hash table.
 * Output of the hash function depends on the size of the hash table
 */
int hash(Key key, int size);

// ===== Key and Item Operations =====

/**
 * Given the item, return its key identifier
 */
Key getKey(Item item);

/**
 * Initialise a new hash table entry 
 */
Item newItem(char *zid, char *name);

/**
 * Equals operator hook function
 */
bool equals(Key firstKey, Key secondKey);

/**
 * Displays the contents of the item
 */
void showItem(Item item);

/**
 * Given the item, frees its associated memory
 */
void freeItem(Item item);

#endif