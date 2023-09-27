from collections import deque

class Graph:
    def __init__(self, num_vertices):
        self.num_vertices = num_vertices
        self.adj_matrix = [[0] * num_vertices for _ in range(num_vertices)]

    def addEdge(self, i, j):
        self.adj_matrix[i][j] = 1
        self.adj_matrix[j][i] = 1

    def getOutDegree(self, vertex):
        out_degree = 0
        for j in range(self.num_vertices):
            if self.adj_matrix[vertex][j] == 1:
                out_degree += 1
        return out_degree

    def getInDegree(self, vertex):
        in_degree = 0
        for i in range(self.num_vertices):
            if self.adj_matrix[i][vertex] == 1:
                in_degree += 1
        return in_degree
    
    def getDegree(self, vertex):
        degree = 0
        for i in range(self.num_vertices):
            if self.adj_matrix[vertex][i] == 1:
                degree += 1
            if self.adj_matrix[i][vertex] == 1:
                degree += 1
        return degree
    
    def bfs(self, start_vertex):
        visited = [False] * (self.num_vertices + 1)
        queue = deque([start_vertex])
        visited[start_vertex] = True

        while queue:
            vertex = queue.popleft()
            print(vertex, end=" ")

            for j in range(self.num_vertices + 1):
                if self.adj_matrix[vertex][j] == 1 and not visited[j]:
                    queue.append(j)
                    visited[j] = True