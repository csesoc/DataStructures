#include <stdlib.h>
#include <stdio.h>
#include <assert.h>
#include <stdbool.h>
#include <string.h>
#include "graph.h"
#include "graph-algos.h"
#include "queue/Queue.h"
#include "stack/Stack.h"
#include "linked-list/List.h"
#include "../util/display/display.h"
#include "../util/utilities/processing.h"

#define MAX_VERTICES              50
#define MAX_SEGMENT_LENGTH        12
#define MAX_CONNECTION_STRING_LEN MAX_VERTICES * MAX_SEGMENT_LENGTH

#define max(a, b) (a > b) ? a : b


int validV(Graph g, Vertex v) {
   return g != NULL && v >= 0 && v < g -> nV;
}

Edge makeEdge(Graph g, Vertex v, Vertex w) {
   Edge e; 
   e.v = v; 
   e.w = w;
   return e;
}

bool edgeIsValid(Graph g, Edge e) {
   if (!(validV(g, e.v) && validV(g, e.w))) {
      printColoured("red", "Invalid edge: %d - %d\n", e.v, e.w);
      return false;
   }
   return true;
}

Graph newGraph(int nV) {
   assert(nV > 0);
   int **e = malloc(nV * sizeof(int *));
   assert(e != NULL);
   for (int i = 0; i < nV; i++) {
      e[i] = calloc(nV, sizeof(int));
      assert(e[i] != NULL);
   }
   Graph g = malloc(sizeof(GraphRep));
   assert(g != NULL);
   g -> nV = nV;  g -> nE = 0;  g -> edges = e;
   return g;
}

Graph newRandomGraph(int nV, int sparsityFactor) {
   Graph g = newGraph(nV);
   for (int v = 0; v < nV; v++) {
      for (int w = v + 1; w < nV; w++) {
         if (rand() % sparsityFactor == 0) insertE(g, makeEdge(g, v, w));
         if (rand() % sparsityFactor == 0) insertE(g, makeEdge(g, w, v));
      }
   }
   return g;
}

bool adjacent(Graph g, Vertex v, Vertex w) {
   if (validV(g, v) && validV(g, w)) {
      return (g -> edges[v][w] != 0);
   } else {

   }
}

void insertE(Graph g, Edge e) {
   assert(g != NULL);
   if (!edgeIsValid(g, e)) return;
   if (g -> edges[e.v][e.w]) {
      printColoured("red", "Edge already exists: %d - %d\n", e.v, e.w);
      return;
   }
   g -> edges[e.v][e.w] = 1;
   g -> nE++;
}

void removeE(Graph g, Edge e) {
   assert(g != NULL);
   if (!edgeIsValid(g, e)) return;
   if (!(g -> edges[e.v][e.w])) {
      printColoured("red", "Edge doesn't exist: %d - %d\n", e.v, e.w);
      return;
   }
   g -> edges[e.v][e.w] = 0;
   g -> nE--;
}

void dropGraph(Graph g) {
   assert(g != NULL);
   for (int i = 0; i < g -> nV; i++)
      free(g -> edges[i]);
   free(g -> edges);
   free(g);
}

void showGraph(Graph g, int option) {
   assert(g != NULL);
   int v, w;
   switch (option) {
      case ADJACENCY_LIST:
         printHeader("Adjacency List");
         printColoured("yellow", " Vertex   Connections\n");
         printHorizontalRule();
         for (v = 0; v < g -> nV; v++) {
            printf("    %3d %s", v, BOX_EDGE_CHAR_VERTICAL);
            char *connections = getConnectionsString(g, v);
            if (strlen(connections) + 8 >= getTermWidth()) {   // Note: the +8 comes from the width of the left column of vertices 
               printColoured("red", "Too many to print\n");
               continue;
            }
            printf("%s\n", connections);
            free(connections);
         }
         break;
      case ADJACENCY_MATRIX:
         printHeader("Adjacency Matrix");
         int cellSpacing = getCellSpacing(g -> nV, g -> edges);
         int horizontalBorderWidth = (cellSpacing + 1) * (g -> nV) + 1;
         if (horizontalBorderWidth + 3 >= getTermWidth()) {   // Note: the +3 comes from the left column of row numbers
            printColoured("red", "The matrix is too large to be printed here. Try resizing the window\n");
            return;
         }
         printf("\n     ");
         // Printing upper row of column numbers
         for (v = 0; v < g -> nV; v++) printColoured("yellow", "%-*d ", cellSpacing, v);
         printf("\n");
         // Printing upper matrix border
         printf("   %s", BOX_EDGE_CHAR_TOP_LEFT);
         for (v = 0; v < (cellSpacing + 1) * (g -> nV) + 1; v++) printf("%s", BOX_EDGE_CHAR_HORIZONTAL);
         printf("%s\n", BOX_EDGE_CHAR_TOP_RIGHT);
         for (v = 0; v < g -> nV; v++) {
            printColoured("yellow", "%-2d ", v);
            printf("%s ", BOX_EDGE_CHAR_VERTICAL);
            for (w = 0; w < g -> nV; w++) {
               if (adjacent(g, v, w)) printColoured("green", "%-*d ", cellSpacing, 1);
               else printColoured("purple", "%-*d ", cellSpacing, 0);
            }
            printf("%s\n", BOX_EDGE_CHAR_VERTICAL);
         }
         // Printing lower matrix border
         printf("   %s", BOX_EDGE_CHAR_BOTTOM_LEFT);
         for (v = 0; v < (cellSpacing + 1) * (g -> nV) + 1; v++) printf("%s", BOX_EDGE_CHAR_HORIZONTAL);
         printf("%s\n", BOX_EDGE_CHAR_BOTTOM_RIGHT);
         break;
   }
   printf("\nSummary: the graph has %d vertices and %d edges\n", g -> nV, g -> nE);
   printHorizontalRule();
}

int getCellSpacing(int numVertices, int **adjMatrix) {
   int cellSpacing = 0;
   for (int row = 0; row < numVertices; row++) {
      for (int col = 0; col < numVertices; col++) {
         cellSpacing = max(adjMatrix[row][col], cellSpacing);
      }
   }
   cellSpacing = max(getNumDigits(numVertices), cellSpacing);
   return cellSpacing;
}

char *getConnectionsString(Graph g, Vertex src) {
   char *connectionString = malloc(sizeof(char) * MAX_CONNECTION_STRING_LEN);
   bool firstConn = true;
   for (Vertex i = 0; i < g -> nV; i++) {
      if (adjacent(g, src, i)) {
         char segment[MAX_SEGMENT_LENGTH];
         if (firstConn) {
            sprintf(segment, "%d", i);
            strcat(connectionString, segment);
            firstConn = false;
         } else {
            sprintf(segment, " - %d", i);
            strcat(connectionString, segment);
         }
      }
   }
   return connectionString;
}
