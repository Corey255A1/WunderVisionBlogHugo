---
title: "WPF Dijkstra Demo Refactor - Algorithm"
date: "2023-12-17"
summary: "Refactoring the Algorithm portion of the original code base."
bundle: true
thumbnail: "dijkstra_thumb.jpg"
tags: ["WPF", "C#", "Algorithms"]
---
# Introduction
- [Initial Algorithm Refactor]({{<ref "/posts/2023-12-17-WPF_Dijkstra_Demo_Refactor">}})
- [GUI Refactor Part 1]({{<ref "/posts/2023-12-18-WPF_Dijkstra_Demo_Refactor">}})

[Github Source](https://github.com/Corey255A1/DijkstraCoffeeAndCode)

In 2018, I dumped all the code in the main project folder, mixed together the algorithm code with the visualization code, and got the prototype working. An interesting thing about software engineering is that the end functionality is all people see. And if it works, no one will complain or every think about the disarray behind the scenes. That becomes a dilemma for the engineers because its almost impossible to justify completely over-hauling the behind the scenes code, if the best case outcome is that to the end user nothing changes. For personal projects, I can do whatever I want :)

The idea is to split out the algorithm code from the visualization code. I wound up even taking the dijkstra algorithm and putting it in to its own project to be referenced as a DLL. This way I can create a simple Console based unit test to ensure that as I'm tearing apart and refactoring the algorithm code, that it still works.

The Node class has properties for Visualized and Highlighted, which are not part of the algorithm solving itself. I'm going to start by cutting out all the cruft and getting the core algorithm logic simplified. I'm going to make a new folder called Models to move these files in.

# Node.cs
There is a mix of fields and properties that are public which makes it hard to understand what it's all for. There is a Shortest Node field that isn't set in this file at all, and without digging around it's not clear where and when this is used. I wound up deleting most of this code and creating a DijkstraNode subclass to contain the Dijkstra specific properties.

## Original 2018 Node Class
Back then I combined visualization logic with core algorithm logic.
```C#
public enum NodeProperties { POINT, HIGHLIGHT, VIZUALIZED, VISITED, SHORTESTDISTANCE}
public delegate void NodeUpdatedEvent(Node obj, NodeProperties prop);
public class Node
{
    public NodeUpdatedEvent NodeUpdated;
    public Point point;
    public List<Edge> Edges = new List<Edge>();
    public void SetPoint(double x, double y)
    {
        point.X = x;
        point.Y = y;
        NodeUpdated?.Invoke(this, NodeProperties.POINT);
    }

    public Node Shortest = null;
    private int shortestDistance = int.MaxValue;
    private bool highlighted = false;
    private bool visualized = false;
    private bool visited = false;
    public bool Visualized
    {
        get
        {
            return visualized;
        }
        set
        {
            visualized = value;
            NodeUpdated?.Invoke(this, NodeProperties.VIZUALIZED);
        }
    }
```

## Cleaned up 2023 Node Class
Now I separated the core Node concept and also created a subclass DijkstraNode to contain data that is required to complete the algorithm.
```C#
public class Node
{
    private Vector2D _point;
    public Vector2D Point => _point;

    private List<Edge> _edges = new List<Edge>();
    public IEnumerable<Edge> Edges => _edges;
    public IEnumerable<Node> Nodes => _edges.ConvertAll((edge) => edge.GetOtherNode(this));

    public Node()
    {
        _point = new Vector2D(0, 0);
    }

    public Node(double x, double y)
    {
        _point = new Vector2D(x, y);
    }


public class DijkstraNode : Node, IComparable<DijkstraNode>
{
    private bool _visited;

    public bool Visited
    {
        get { return _visited; }
        set { _visited = value; }
    }

    private double _shortesRouteDistance = double.MaxValue;

    public double ShortestRouteDistance
    {
        get { return _shortesRouteDistance; }
        set { _shortesRouteDistance = value; }
    }

```

# Edge.cs
I'm going to do similar things.. Tear it down to the bones, and we will rebuild it better. An Edge's Nodes shouldn't be mutable after creation, all of those fields can become private.

In the constructor, I don't like that I'm adding a reference to the Edge directly to the Node's edge list. This should be encapsulated in a method call. 
## 2018 Edge Class
In consistent namings, Mixing of Visualization and business logic.
```C#
public delegate void EdgeUpdatedEvent(Edge obj);
public class Edge
{
    public Node N1;
    public Node N2;
    public Point Mid;

    private bool highlighted = false;
    public bool Highlighted
    {
        get
        {
            return highlighted;
        }
        set
        {
            highlighted = value;
            EdgeUpdated?.Invoke(this);
        }

    }

    public EdgeUpdatedEvent EdgeUpdated;
    public EdgeUpdatedEvent EdgeDeleted;
    public Edge(Node n1, Node n2)
    {
        N1 = n1;
        N1.Edges.Add(this);
        N1.NodeUpdated += NodeUpdatedCB;
        
        N2 = n2;
        N2.Edges.Add(this);
        N2.NodeUpdated += NodeUpdatedCB;
    }
```

## 2023 Edge Class
Simplified way down
```C#
public class Edge
{
    public Node Node1 { get; private set; }
    public Node Node2 { get; private set; }

    public Edge(Node node1, Node node2)
    {
        Node1 = node1;
        Node2 = node2;
    }

```

# DijkstraAlgo.cs
After cleaning up the Node and Edge and tweaking things, it's now time to resolve the errors related to that class and see what factoring. We have a couple of huge functions, a mix of visualizations and business logic, and definitely code duplication. 

Let's start with breaking apart the core solving algorithm and from there reimplement the step by step process. 

What I was doing previously: Check all the edges of the current node and then sort the whole list of nodes by visited and current shortest distance.
A different approach that I'm using instead now, is to throw the unvisited neighbors that we discover while traversing the graph into a HashSet. This ensures that we don't have duplicates in our next to visit list.  

After looking at all the edges and nodes for our current node, we find the current minimum route distance node from the hash. Then remove it from the hash, and use it for our next round of edge checking.  

I cleaned the loop further, by filtering our nodes to the Unvisited Nodes only rather than checking the node for not visited in the loop.
I add a property to the DijkstraNode to do the filtering behind the scenes of UnvisitedNodes.

The original code had two variations of the algorithm function. One to find the shortest path all in one go, and another to step through each node check to allow for a step by step visualization process. Because of the major refactor, I am able to share the logic between both variations, and it looks so much cleaner.

### Messy 2018 Code
The old code had to be duplicated between the Complete "FindShortestPath" and the "TakeStep" variations
```C#
public bool FindShortestPath(Node startNode, Node endNode)
{
    Nodes.ForEach(n => n.Reset());
    Node current = startNode;
    current.ShortestDistance = 0;

    while(current!=endNode && !current.Visited)
    {
        foreach(var edge in current.Edges)
        {
            Node neighbor = edge.GetEnd(current);
            if (neighbor.Visited == false)
            {
                int k = current.ShortestDistance + (int)edge.Distance;
                if (k < neighbor.ShortestDistance)
                {
                    neighbor.Shortest = current;
                    neighbor.ShortestDistance = k;
                }
            }
        }
        current.Visited = true;
        Nodes.Sort((n1, n2) =>
        {
            if(n1.Visited && !n2.Visited)
            {
                return 1;
            }
            else if(n2.Visited && !n1.Visited)
            {
                return -1;
            }
            else
            {
                return n1.ShortestDistance - n2.ShortestDistance;
            }
        });

        current = Nodes[0];
    }
    if(current.Shortest == null)
    {
        Console.WriteLine("No Connection To End");
        return false;
    }

    while(current != startNode)
    {
        Console.WriteLine(current.ShortestDistance);
        current.Highlight = true;
        current.GetEdge(current.Shortest).Highlighted = true;
        current = current.Shortest;
    }
    return true;
}
```
## 2023 Clean Code Algorithm
I managed to clean and consolidate the algorithm so much. This is so much cleaner to look at and understand what it is doing. Additionally the code is now shared between the full FindShortestPath and the TakeStep variations.
```C#
public static class Dijkstra
{
    public static List<Node> FindShortestPath(DijkstraNode startNode, DijkstraNode endNode)
    {
        DijkstraState dijkstraState = new DijkstraState(startNode, endNode);
        while (!dijkstraState.IsFinished)
        {
            while (dijkstraState.HasNodeNeighbors)
            {
                dijkstraState.CheckNextNeighbor();
            }
            dijkstraState.VisitNextNode();
        }
        return dijkstraState.GenerateShortestPathList();
    }

    public static DijkstraState TakeStep(DijkstraNode startNode, DijkstraNode endNode)
    {
        return TakeStep(new DijkstraState(startNode, endNode));
    }

    public static DijkstraState TakeStep(DijkstraState dijkstraState)
    {
        if (!dijkstraState.IsFinished)
        {
            if (dijkstraState.HasNodeNeighbors)
            {
                dijkstraState.CheckNextNeighbor();
                return dijkstraState;
            }
            dijkstraState.VisitNextNode();
            return dijkstraState;
        }
        return dijkstraState;
    }

}
```

# Conclusion
Because of the refactoring I can now test this using a console application to make sure the algorithm still works without the full UI.

```c#
var startNode = new DijkstraNode(0, 0);
var endNode = new DijkstraNode(4, 0);

var nodeList = new List<DijkstraNode>()
{
    startNode,
    new DijkstraNode(2, -1),
    new DijkstraNode(2, -3),
    new DijkstraNode(1, 1),
    new DijkstraNode(2, 1),
    endNode
};

var edgeList = new List<Edge>() {
    new Edge(startNode, nodeList[1]),
    new Edge(startNode, nodeList[2]),
    new Edge(startNode, nodeList[3]),
    new Edge(nodeList[3], nodeList[4]),
    new Edge(nodeList[1], nodeList[4]),
    new Edge(endNode, nodeList[1]),
    new Edge(endNode, nodeList[2]),
    new Edge(endNode, nodeList[4]),
};

foreach(var node in Dijkstra.FindShortestPath(startNode, endNode))
{
    Console.WriteLine($"{node.Point.X}, {node.Point.Y}");
}
```

Now that I have a complete overhaul of the Dijkstra algorithm class. I can focus on integrating it into the UI. That is going to be bit of a challenge. I'm sure that there will be more additions a long the way. 